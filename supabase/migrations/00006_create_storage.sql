-- Create storage bucket for race screenshots
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'race-screenshots',
  'race-screenshots',
  false,
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Users can upload to their own folder
CREATE POLICY "Users can upload own screenshots"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'race-screenshots'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- Authenticated users can view screenshots
CREATE POLICY "Authenticated users can view screenshots"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'race-screenshots');

-- Users can delete their own screenshots
CREATE POLICY "Users can delete own screenshots"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'race-screenshots'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );
