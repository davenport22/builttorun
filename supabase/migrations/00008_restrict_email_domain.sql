-- Add email domain validation for accilium.com only
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate email domain
  IF NEW.email NOT LIKE '%@accilium.com' THEN
    RAISE EXCEPTION 'Only @accilium.com email addresses are allowed to sign up';
  END IF;

  INSERT INTO public.profiles (id, email, name, office_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE
      WHEN NEW.raw_user_meta_data->>'office_id' IS NOT NULL
        AND NEW.raw_user_meta_data->>'office_id' != ''
      THEN (NEW.raw_user_meta_data->>'office_id')::UUID
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add constraint to profiles table
ALTER TABLE public.profiles
  ADD CONSTRAINT check_email_domain
  CHECK (email LIKE '%@accilium.com');
