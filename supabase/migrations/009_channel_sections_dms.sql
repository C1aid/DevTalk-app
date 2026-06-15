-- Channel sections + direct messages

CREATE TABLE public.channel_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT channel_sections_name_length CHECK (char_length(name) BETWEEN 1 AND 50)
);

CREATE UNIQUE INDEX channel_sections_name_unique ON public.channel_sections (lower(trim(name)));

INSERT INTO public.channel_sections (name, sort_order) VALUES ('Channels', 0);

ALTER TABLE public.channels
  ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES public.channel_sections(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'channel',
  ADD COLUMN IF NOT EXISTS dm_key TEXT;

ALTER TABLE public.channels
  DROP CONSTRAINT IF EXISTS channels_kind_check;

ALTER TABLE public.channels
  ADD CONSTRAINT channels_kind_check CHECK (kind IN ('channel', 'dm'));

CREATE UNIQUE INDEX IF NOT EXISTS channels_dm_key_unique
  ON public.channels (dm_key)
  WHERE kind = 'dm' AND dm_key IS NOT NULL;

UPDATE public.channels c
SET section_id = s.id
FROM public.channel_sections s
WHERE s.name = 'Channels'
  AND c.kind = 'channel'
  AND c.section_id IS NULL;

ALTER TABLE public.channel_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "channel_sections_select"
  ON public.channel_sections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "channel_sections_insert"
  ON public.channel_sections FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "channel_sections_update"
  ON public.channel_sections FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "channel_sections_delete"
  ON public.channel_sections FOR DELETE
  TO authenticated
  USING (true);
