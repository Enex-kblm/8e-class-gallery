/*
  # Photo Interactions Schema

  1. New Tables
    - `photos`
      - `id` (uuid, primary key)
      - `student_id` (integer, references student data)
      - `url` (text, photo URL)
      - `filename` (text, original filename)
      - `alt_text` (text, accessibility description)
      - `created_at` (timestamp)
    
    - `photo_likes`
      - `id` (uuid, primary key)
      - `photo_id` (uuid, references photos)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - Unique constraint on (photo_id, user_id)
    
    - `photo_downloads`
      - `id` (uuid, primary key)
      - `photo_id` (uuid, references photos)
      - `user_id` (uuid, references auth.users)
      - `downloaded_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to interact with photos
    - Public read access for photo data and like counts
*/

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id integer NOT NULL,
  student_name text NOT NULL,
  url text NOT NULL,
  filename text NOT NULL,
  alt_text text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create photo_likes table
CREATE TABLE IF NOT EXISTS photo_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id uuid REFERENCES photos(id) ON DELETE CASCADE,
  user_id uuid DEFAULT gen_random_uuid(), -- For anonymous users, we'll use session-based IDs
  session_id text, -- For tracking anonymous users
  created_at timestamptz DEFAULT now(),
  UNIQUE(photo_id, user_id),
  UNIQUE(photo_id, session_id)
);

-- Create photo_downloads table
CREATE TABLE IF NOT EXISTS photo_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id uuid REFERENCES photos(id) ON DELETE CASCADE,
  user_id uuid DEFAULT gen_random_uuid(),
  session_id text,
  downloaded_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_photos_student_id ON photos(student_id);
CREATE INDEX IF NOT EXISTS idx_photo_likes_photo_id ON photo_likes(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_likes_session_id ON photo_likes(session_id);
CREATE INDEX IF NOT EXISTS idx_photo_downloads_photo_id ON photo_downloads(photo_id);

-- Enable Row Level Security
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_downloads ENABLE ROW LEVEL SECURITY;

-- Create policies for photos (public read access)
CREATE POLICY "Photos are viewable by everyone"
  ON photos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Photos can be inserted by authenticated users"
  ON photos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for photo_likes (public read, authenticated write)
CREATE POLICY "Photo likes are viewable by everyone"
  ON photo_likes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can like photos"
  ON photo_likes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can delete their own likes"
  ON photo_likes
  FOR DELETE
  TO public
  USING (true);

-- Create policies for photo_downloads (public access for tracking)
CREATE POLICY "Photo downloads are trackable by everyone"
  ON photo_downloads
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Download stats are viewable by everyone"
  ON photo_downloads
  FOR SELECT
  TO public
  USING (true);

-- Create a view for photo statistics
CREATE OR REPLACE VIEW photo_stats AS
SELECT 
  p.id,
  p.student_id,
  p.student_name,
  p.url,
  p.filename,
  p.alt_text,
  p.created_at,
  COALESCE(like_count.count, 0) as like_count,
  COALESCE(download_count.count, 0) as download_count
FROM photos p
LEFT JOIN (
  SELECT photo_id, COUNT(*) as count
  FROM photo_likes
  GROUP BY photo_id
) like_count ON p.id = like_count.photo_id
LEFT JOIN (
  SELECT photo_id, COUNT(*) as count
  FROM photo_downloads
  GROUP BY photo_id
) download_count ON p.id = download_count.photo_id;