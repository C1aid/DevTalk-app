-- Soft-deleted messages may have empty content and no attachments.

ALTER TABLE public.messages
  DROP CONSTRAINT IF EXISTS messages_content_or_attachments;

ALTER TABLE public.messages
  ADD CONSTRAINT messages_content_or_attachments
  CHECK (
    deleted_at IS NOT NULL
    OR char_length(trim(content)) >= 1
    OR jsonb_array_length(attachments) > 0
  );
