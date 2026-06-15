-- Leave channels / DMs (remove own membership)

CREATE OR REPLACE FUNCTION public.is_dm_participant(ch_id UUID, uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.channels c
    WHERE c.id = ch_id
      AND c.kind = 'dm'
      AND c.dm_key IS NOT NULL
      AND (
        split_part(c.dm_key, '_', 1) = uid::text
        OR split_part(c.dm_key, '_', 2) = uid::text
      )
  );
$$;

DROP POLICY IF EXISTS "channel_members_insert" ON public.channel_members;

CREATE POLICY "channel_members_insert"
  ON public.channel_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.channel_members cm
      WHERE cm.channel_id = channel_members.channel_id
        AND cm.user_id = auth.uid()
        AND cm.role = 'owner'
    )
    OR (
      user_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM public.channels c
        WHERE c.id = channel_members.channel_id
          AND c.created_by = auth.uid()
      )
    )
    OR (
      user_id = auth.uid()
      AND public.is_dm_participant(channel_members.channel_id, auth.uid())
    )
  );

CREATE POLICY "channel_members_delete"
  ON public.channel_members FOR DELETE
  USING (user_id = auth.uid());
