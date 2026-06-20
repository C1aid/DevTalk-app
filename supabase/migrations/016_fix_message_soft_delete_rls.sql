-- Soft delete sets deleted_at via UPDATE; default WITH CHECK mirrored USING
-- and rejected rows where deleted_at became non-null.

DROP POLICY IF EXISTS "messages_update" ON public.messages;

CREATE POLICY "messages_update" ON public.messages
  FOR UPDATE
  USING (
    deleted_at IS NULL
    AND (
      auth.uid() = user_id
      OR public.is_workspace_admin(
        (SELECT workspace_id FROM public.channels WHERE id = messages.channel_id),
        auth.uid()
      )
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    OR public.is_workspace_admin(
      (SELECT workspace_id FROM public.channels WHERE id = messages.channel_id),
      auth.uid()
    )
  );
