-- Add video views tracking table for analytics
CREATE TABLE IF NOT EXISTS video_views (
  id SERIAL PRIMARY KEY,
  video_id INTEGER REFERENCES videos(id) ON DELETE CASCADE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_video_views_video_id (video_id),
  INDEX idx_video_views_created_at (created_at)
);

-- Add unique constraint to prevent duplicate views from same IP within time window
CREATE UNIQUE INDEX IF NOT EXISTS idx_video_views_unique 
ON video_views (video_id, ip_address, DATE_TRUNC('hour', created_at));

-- Update existing videos to ensure views column has proper default
ALTER TABLE videos ALTER COLUMN views SET DEFAULT 0;

-- Add index for better performance on views sorting
CREATE INDEX IF NOT EXISTS idx_videos_views ON videos(views DESC);

-- Add trigger to update views when new view is inserted
CREATE OR REPLACE FUNCTION update_video_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE videos 
  SET views = views + 1 
  WHERE id = NEW.video_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (drop if exists first)
DROP TRIGGER IF EXISTS trigger_update_video_view_count ON video_views;
CREATE TRIGGER trigger_update_video_view_count
AFTER INSERT ON video_views
FOR EACH ROW
EXECUTE FUNCTION update_video_view_count();
