ALTER TABLE public.notes
  ADD COLUMN archived_at TIMESTAMPTZ,
  ADD COLUMN deleted_at TIMESTAMPTZ;

CREATE INDEX idx_notes_archived_at ON public.notes(archived_at)
  WHERE archived_at IS NOT NULL;

CREATE INDEX idx_notes_deleted_at ON public.notes(deleted_at)
  WHERE deleted_at IS NOT NULL;
