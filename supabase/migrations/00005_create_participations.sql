CREATE TABLE public.participations (
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'interested' CHECK (status IN ('interested', 'going', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (event_id, user_id)
);

ALTER TABLE public.participations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participations are viewable by authenticated users"
  ON public.participations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own participations"
  ON public.participations FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own participations"
  ON public.participations FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own participations"
  ON public.participations FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);
