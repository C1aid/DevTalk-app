ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

DO $$
BEGIN
  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_display_name_length
    CHECK (display_name IS NULL OR char_length(display_name) BETWEEN 1 AND 100);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DROP POLICY IF EXISTS "Authenticated users can view chat profile fields" ON public.profiles;

CREATE POLICY "Authenticated users can view chat profile fields"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);
