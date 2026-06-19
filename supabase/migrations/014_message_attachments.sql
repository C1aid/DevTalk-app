-- Message file attachments + storage bucket

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS attachments JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.messages
  DROP CONSTRAINT IF EXISTS messages_content_length;

ALTER TABLE public.messages
  ADD CONSTRAINT messages_content_length
  CHECK (char_length(content) <= 10000);

ALTER TABLE public.messages
  DROP CONSTRAINT IF EXISTS messages_content_or_attachments;

ALTER TABLE public.messages
  ADD CONSTRAINT messages_content_or_attachments
  CHECK (char_length(trim(content)) >= 1 OR jsonb_array_length(attachments) > 0);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'attachments',
  'attachments',
  false,
  52428800,
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Channel members can read attachments" ON storage.objects;
DROP POLICY IF EXISTS "Channel members can upload attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own attachments" ON storage.objects;

CREATE POLICY "Channel members can read attachments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'attachments'
    AND public.can_access_channel(((storage.foldername(name))[1])::uuid, auth.uid())
  );

CREATE POLICY "Channel members can upload attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'attachments'
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND public.is_channel_member(((storage.foldername(name))[1])::uuid, auth.uid())
  );

CREATE POLICY "Users can delete own attachments"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'attachments'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );
