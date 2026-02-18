CREATE TABLE public.offices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  color_theme TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.offices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Offices are viewable by authenticated users"
  ON public.offices FOR SELECT
  TO authenticated
  USING (true);
