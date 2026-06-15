DROP POLICY IF EXISTS "channels_delete" ON public.channels;

CREATE POLICY "channels_delete"
  ON public.channels FOR DELETE
  USING (
    created_by = auth.uid()
    OR (
      kind = 'dm'
      AND public.is_channel_member(id, auth.uid())
    )
  );
