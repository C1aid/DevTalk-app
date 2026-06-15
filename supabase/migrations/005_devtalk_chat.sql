-- DevTalk: chat schema (run after 004_add_pro_tier.sql)

UPDATE public.profiles SET subscription_tier = 'pro' WHERE subscription_tier = 'premium';

CREATE TYPE channel_visibility AS ENUM ('public', 'private');

CREATE TABLE public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  visibility channel_visibility NOT NULL DEFAULT 'public',
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT channels_name_length CHECK (char_length(name) BETWEEN 1 AND 80)
);

CREATE TABLE public.channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT messages_content_length CHECK (char_length(content) BETWEEN 1 AND 10000)
);

CREATE TABLE public.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

CREATE INDEX idx_channels_created_by ON public.channels(created_by);
CREATE INDEX idx_channel_members_user ON public.channel_members(user_id);
CREATE INDEX idx_channel_members_channel ON public.channel_members(channel_id);
CREATE INDEX idx_messages_channel ON public.messages(channel_id, created_at DESC);
CREATE INDEX idx_messages_parent ON public.messages(parent_message_id);
CREATE INDEX idx_messages_search ON public.messages USING gin(to_tsvector('english', content));
CREATE INDEX idx_reactions_message ON public.reactions(message_id);

CREATE TRIGGER channels_updated_at
  BEFORE UPDATE ON public.channels
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.is_pro(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = uid AND subscription_tier IN ('pro', 'premium')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_channel_member(ch_id UUID, uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.channel_members
    WHERE channel_id = ch_id AND user_id = uid
  );
$$;

CREATE OR REPLACE FUNCTION public.can_access_channel(ch_id UUID, uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.channels c
    WHERE c.id = ch_id
      AND (
        c.visibility = 'public'
        OR public.is_channel_member(c.id, uid)
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_channel()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.channel_members (channel_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_channel_created
  AFTER INSERT ON public.channels
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_channel();

ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "channels_select" ON public.channels FOR SELECT
  USING (
    visibility = 'public'
    OR public.is_channel_member(id, auth.uid())
  );

CREATE POLICY "channels_insert" ON public.channels FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "channels_update" ON public.channels FOR UPDATE
  USING (public.is_channel_member(id, auth.uid()));

CREATE POLICY "channel_members_select" ON public.channel_members FOR SELECT
  USING (public.can_access_channel(channel_id, auth.uid()));

CREATE POLICY "channel_members_insert" ON public.channel_members FOR INSERT
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
        WHERE c.id = channel_members.channel_id AND c.created_by = auth.uid()
      )
    )
  );

CREATE POLICY "messages_select" ON public.messages FOR SELECT
  USING (public.can_access_channel(channel_id, auth.uid()));

CREATE POLICY "messages_insert" ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND public.is_channel_member(channel_id, auth.uid())
  );

CREATE POLICY "messages_update" ON public.messages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "reactions_select" ON public.reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = reactions.message_id
        AND public.can_access_channel(m.channel_id, auth.uid())
    )
  );

CREATE POLICY "reactions_insert" ON public.reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reactions_delete" ON public.reactions FOR DELETE
  USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reactions;

CREATE OR REPLACE FUNCTION public.purge_free_user_old_messages()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.messages m
  USING public.profiles p
  WHERE m.user_id = p.id
    AND p.subscription_tier = 'free'
    AND m.created_at < NOW() - INTERVAL '90 days';
END;
$$;
