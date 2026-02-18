-- Update the profile trigger to look up office by name instead of UUID
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _office_id UUID;
BEGIN
  -- Look up office by name (passed from registration form)
  IF new.raw_user_meta_data->>'office_name' IS NOT NULL
     AND new.raw_user_meta_data->>'office_name' != '' THEN
    SELECT id INTO _office_id
    FROM public.offices
    WHERE name = new.raw_user_meta_data->>'office_name'
    LIMIT 1;
  -- Backwards compatible: also support office_id if passed as UUID
  ELSIF new.raw_user_meta_data->>'office_id' IS NOT NULL
        AND new.raw_user_meta_data->>'office_id' != '' THEN
    _office_id := (new.raw_user_meta_data->>'office_id')::UUID;
  END IF;

  INSERT INTO public.profiles (id, email, name, office_id)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    _office_id
  );
  RETURN new;
END;
$$;

-- Add office_id to events so races can be associated with an office/city
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS office_id UUID REFERENCES public.offices(id);

-- Create index for filtering events by office
CREATE INDEX IF NOT EXISTS idx_events_office_id ON public.events(office_id);

-- Allow anyone (including unauthenticated users) to read offices
-- This is needed for the registration form
CREATE POLICY "Anyone can view offices" ON public.offices FOR SELECT USING (true);
