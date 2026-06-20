-- Roles, channel posting permissions, presence, message soft-delete

ALTER TABLE public.workspace_members
  DROP CONSTRAINT IF EXISTS workspace_members_role_check;

ALTER TABLE public.workspace_members
  ADD CONSTRAINT workspace_members_role_check
  CHECK (role IN ('owner', 'admin', 'member'));

ALTER TABLE public.channels
  ADD COLUMN IF NOT EXISTS posting_permission TEXT NOT NULL DEFAULT 'all_members';

ALTER TABLE public.channels
  DROP CONSTRAINT IF EXISTS channels_posting_permission_check;

ALTER TABLE public.channels
  ADD CONSTRAINT channels_posting_permission_check
  CHECK (posting_permission IN ('all_members', 'admins_only'));

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS presence_status TEXT NOT NULL DEFAULT 'offline';

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_presence_status_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_presence_status_check
  CHECK (presence_status IN ('online', 'idle', 'dnd', 'offline'));

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.is_workspace_admin(ws_id UUID, uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN ws_id IS NULL THEN false
    ELSE EXISTS (
      SELECT 1
      FROM public.workspace_members wm
      WHERE wm.workspace_id = ws_id
        AND wm.user_id = uid
        AND wm.role IN ('owner', 'admin')
    )
  END;
$$;

CREATE OR REPLACE FUNCTION public.can_post_in_channel(ch_id UUID, uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN NOT public.is_channel_member(ch_id, uid) THEN false
    WHEN (SELECT kind FROM public.channels WHERE id = ch_id) = 'dm' THEN true
    WHEN COALESCE(
      (SELECT posting_permission FROM public.channels WHERE id = ch_id),
      'all_members'
    ) = 'all_members' THEN true
    ELSE (
      public.is_workspace_admin(
        (SELECT workspace_id FROM public.channels WHERE id = ch_id),
        uid
      )
      OR EXISTS (
        SELECT 1
        FROM public.channel_members cm
        WHERE cm.channel_id = ch_id
          AND cm.user_id = uid
          AND cm.role = 'owner'
      )
    )
  END;
$$;

DROP POLICY IF EXISTS "messages_insert" ON public.messages;

CREATE POLICY "messages_insert" ON public.messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND public.can_post_in_channel(channel_id, auth.uid())
  );

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
  );

DROP POLICY IF EXISTS "messages_delete" ON public.messages;

CREATE POLICY "messages_delete" ON public.messages
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR public.is_workspace_admin(
      (SELECT workspace_id FROM public.channels WHERE id = messages.channel_id),
      auth.uid()
    )
  );
