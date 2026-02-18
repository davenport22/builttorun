CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  distance_km NUMERIC(6,2),
  website_url TEXT,
  is_suggested BOOLEAN DEFAULT false NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by authenticated users"
  ON public.events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = created_by);

CREATE INDEX idx_events_date ON public.events(date ASC);
