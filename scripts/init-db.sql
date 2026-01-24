-- Create tables for video streaming app with PostgreSQL

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) UNIQUE,
  icon VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail VARCHAR(500),
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  duration INTEGER,
  views INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Banners table
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image VARCHAR(500),
  description TEXT,
  link VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image VARCHAR(500),
  link VARCHAR(500),
  position VARCHAR(50) DEFAULT 'top',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_views ON videos(views DESC);
CREATE INDEX IF NOT EXISTS idx_videos_rating ON videos(rating DESC);

-- Insert default categories
INSERT INTO categories (name, slug, icon) VALUES
  ('Action', 'action', '⚡'),
  ('Drama', 'drama', '🎭'),
  ('Comedy', 'comedy', '😂'),
  ('Sci-Fi', 'sci-fi', '🚀'),
  ('Horror', 'horror', '👻'),
  ('Documentary', 'documentary', '📚')
ON CONFLICT (name) DO UPDATE SET slug = EXCLUDED.slug, icon = EXCLUDED.icon;

-- Insert sample videos
INSERT INTO videos (title, description, thumbnail, category_id, duration, views, rating, url, created_at) VALUES
  ('Cyber Revolution', 'A thrilling action-packed adventure in a digital world', 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&h=300&fit=crop', 4, 7200, 150000, 4.8, 'https://example.com/video1.mp4', NOW() - INTERVAL '6 days'),
  ('Laugh Track Comedy Special', 'Stand-up comedy that will make you laugh out loud', 'https://images.unsplash.com/photo-1576169887891-e51faff4ff46?w=500&h=300&fit=crop', 3, 3600, 89000, 4.5, 'https://example.com/video2.mp4', NOW() - INTERVAL '11 days'),
  ('Ocean Mysteries Revealed', 'Discover the secrets hidden in the deepest oceans', 'https://images.unsplash.com/photo-1559027615-cdesdda35e8f?w=500&h=300&fit=crop', 6, 5400, 120000, 4.9, 'https://example.com/video3.mp4', NOW() - INTERVAL '9 days'),
  ('Last Night', 'A gripping drama about life and relationships', 'https://images.unsplash.com/photo-1533109752211-118fcf4c62db?w=500&h=300&fit=crop', 2, 8100, 200000, 4.7, 'https://example.com/video4.mp4', NOW() - INTERVAL '16 days'),
  ('Midnight Terror', 'A horror film that will keep you awake at night', 'https://images.unsplash.com/photo-1535575463063-4c99dfd5dcd0?w=500&h=300&fit=crop', 5, 6300, 95000, 4.3, 'https://example.com/video5.mp4', NOW() - INTERVAL '13 days'),
  ('Explosive Action', 'Non-stop action sequences and thrilling moments', 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&h=300&fit=crop', 1, 7200, 180000, 4.6, 'https://example.com/video6.mp4', NOW() - INTERVAL '18 days'),
  ('Future Worlds', 'Explore worlds beyond imagination', 'https://images.unsplash.com/photo-1555954594-9a3fb28daa7d?w=500&h=300&fit=crop', 4, 6900, 125000, 4.4, 'https://example.com/video7.mp4', NOW() - INTERVAL '20 days'),
  ('Wildlife Chronicles', 'Amazing footage of animals in their natural habitat', 'https://images.unsplash.com/photo-1498855926480-d98e83099315?w=500&h=300&fit=crop', 6, 4500, 110000, 4.8, 'https://example.com/video8.mp4', NOW() - INTERVAL '24 days'),
  ('Jungle Expedition', 'Discover hidden treasures deep in the jungle', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop', 6, 5000, 75000, 4.7, 'https://example.com/video9.mp4', NOW() - INTERVAL '2 days'),
  ('Laugh Out Loud 2', 'More hilarious comedy moments', 'https://images.unsplash.com/photo-1576169887891-e51faff4ff46?w=500&h=300&fit=crop', 3, 4200, 65000, 4.4, 'https://example.com/video10.mp4', NOW() - INTERVAL '1 day');

-- Insert sample banners
INSERT INTO banners (title, image, description, link) VALUES
  ('Premium Membership', 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=1200&h=300&fit=crop', 'Get unlimited access to all content', '/premium'),
  ('New Releases This Week', 'https://images.unsplash.com/photo-1574169208507-84007cde3e3b?w=1200&h=300&fit=crop', 'Watch the hottest new content', '/new');
