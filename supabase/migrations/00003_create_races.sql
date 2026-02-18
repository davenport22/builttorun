CREATE TABLE public.races (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  race_name TEXT NOT NULL,
  distance_km NUMERIC(6,2) NOT NULL CHECK (distance_km > 0),
  time_seconds INTEGER NOT NULL CHECK (time_seconds > 0),
  date DATE NOT NULL,
  screenshot_url TEXT,
  verified BOOLEAN DEFAULT false NOT NULL,
  elevation_boost BOOLEAN DEFAULT false NOT NULL,
  scored_distance_km NUMERIC(6,2) GENERATED ALWAYS AS (
    CASE WHEN elevation_boost THEN distance_km * 1.10
         ELSE distance_km
    END
  ) STORED NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Races are viewable by authenticated users"
  ON public.races FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own races"
  ON public.races FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own races"
  ON public.races FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own races"
  ON public.races FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE INDEX idx_races_user_id ON public.races(user_id);
CREATE INDEX idx_races_date ON public.races(date DESC);
CREATE INDEX idx_races_created_at ON public.races(created_at DESC);
