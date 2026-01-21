# StreamFlix - Video Streaming Platform MVP

Aplikasi video streaming modern yang dibangun dengan **Next.js 16**, **TypeScript**, **Tailwind CSS**, dan **PostgreSQL**.

## 🎯 Fitur Utama

### User Interface
- ✅ **Hamburger Menu Mobile** - Responsive navigation untuk semua ukuran device
- ✅ **Search Bar** - Cari video berdasarkan judul dan deskripsi
- ✅ **Category Filter** - Filter video berdasarkan kategori (Action, Drama, Comedy, Sci-Fi, Horror, Documentary)
- ✅ **Sort Filter** - Urutkan video:
  - Terbaru (Newest)
  - Populer (Highest Rated)
  - Terlama (Oldest)
  - Paling Banyak Ditonton (Most Viewed)
- ✅ **Pagination** - Navigasi video dengan pagination system
- ✅ **Hero Banner** - Carousel iklan dengan auto-rotate
- ✅ **Video Grid** - Display video dengan thumbnail, rating, dan views

### Pages
- **Home (`/`)** - Landing page dengan video grid, search, filter, dan pagination
- **Categories (`/kategori`)** - Browse semua kategori dengan sorting dan pagination
- **Video Detail (`/video/[id]`)** - Detail video dengan video player placeholder dan random video recommendations
- **Admin Dashboard (`/admin`)** - Manajemen video (Create, Read, Update, Delete)

### Technical Features
- 🗄️ **PostgreSQL Database** - Persistent data storage
- 🔐 **JWT Authentication** - Ready for auth implementation
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **API Routes** - RESTful API endpoints
- 🎨 **Modern UI** - Built with Tailwind CSS & shadcn/ui
- 📊 **Real-time Data** - Server-side API with pagination support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm atau yarn

### Setup

1. **Clone repository & install dependencies:**
```bash
npm install
```

2. **Setup environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` dengan PostgreSQL credentials Anda:
```
DATABASE_URL="postgresql://user:password@localhost:5432/VIDEO"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="10485760"
```

3. **Initialize database:**
```bash
psql -U postgres -d VIDEO -f scripts/init-db.sql
```

4. **Run development server:**
```bash
npm run dev
```

Buka http://localhost:3000

## 📁 Project Structure

```
streamflix/
├── /app
│   ├── /api
│   │   ├── /videos - Video API endpoints
│   │   ├── /categories - Category API
│   │   ├── /banners - Banner API
│   │   └── /admin - Admin endpoints
│   ├── /admin - Admin dashboard page
│   ├── /kategori - Categories page
│   ├── /video/[id] - Video detail page
│   ├── layout.tsx - Root layout
│   ├── page.tsx - Home page
│   └── globals.css - Global styles
│
├── /components
│   ├── mobile-menu.tsx - Hamburger menu
│   ├── pagination.tsx - Pagination component
│   ├── sort-filter.tsx - Sort dropdown
│   ├── search-bar.tsx - Search input
│   ├── video-card.tsx - Video card
│   ├── hero-banner.tsx - Banner carousel
│   ├── video-form.tsx - Video form
│   └── random-videos.tsx - Random recommendations
│
├── /lib
│   ├── db.ts - Mock database dengan data
│   ├── postgres.ts - PostgreSQL connection
│   ├── utils.ts - Utility functions
│   └── utils-video.ts - Video utilities
│
├── /scripts
│   └── init-db.sql - Database migration
│
├── .env.example - Environment variables template
├── SETUP.md - Detailed setup guide
└── README.md - This file
```

## 🎬 API Endpoints

### Videos
- `GET /api/videos?search=text&category=Action&page=1&limit=8&sort=newest`
  - Query params: search, category, page, limit, sort

### Categories
- `GET /api/categories`

### Banners
- `GET /api/banners`

### Admin
- `POST /api/admin/videos` - Create video
- `PUT /api/admin/videos/[id]` - Update video
- `DELETE /api/admin/videos/[id]` - Delete video

## 🎨 UI Components

### Mobile Menu
Hamburger menu yang muncul otomatis di layar mobile (<768px) dengan navigasi ke Home, Categories, dan Admin.

### Pagination
Smart pagination dengan navigation buttons dan page numbers. Support untuk unlimited pages.

### Sort Filter
Dropdown filter dengan 4 opsi:
- Terbaru (sort by created_at DESC)
- Populer (sort by rating DESC)
- Terlama (sort by created_at ASC)
- Paling Banyak Ditonton (sort by views DESC)

### Video Card
Menampilkan:
- Thumbnail dengan overlay
- Judul video
- Rating (1-5 stars)
- Total views
- Durasi video
- Link ke detail page

## 📊 Database Schema

### Categories Table
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  icon VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Videos Table
```sql
CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail VARCHAR(500),
  category_id INTEGER REFERENCES categories(id),
  duration INTEGER,
  views INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Banners Table
```sql
CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image VARCHAR(500),
  description TEXT,
  link VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔄 Workflow

### Viewing Videos
1. User masuk ke home page
2. Lihat hero banner carousel
3. Browse video grid dengan thumbnail
4. Gunakan search bar untuk cari video
5. Filter by category atau sort order
6. Klik video untuk lihat detail page
7. Di detail page, lihat random recommendations

### Admin Management
1. Akses `/admin` dashboard
2. Lihat table semua video
3. Add new video dengan form
4. Edit existing video
5. Delete video dengan confirmation
6. Lihat preview thumbnail

## 🛠️ Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI Components
- **Database**: PostgreSQL
- **Authentication**: JWT (Ready to implement)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Fetch API

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| JWT_SECRET | Yes | Secret key untuk JWT signing |
| JWT_EXPIRES_IN | Yes | JWT expiration time (e.g., "7d") |
| UPLOAD_DIR | No | Directory untuk file uploads |
| MAX_FILE_SIZE | No | Max file size dalam bytes |
| ALLOWED_FILE_TYPES | No | Allowed MIME types |

## 🚀 Deployment

### Vercel Deployment
```bash
vercel deploy
```

Set environment variables di Vercel dashboard.

### Self-Hosted
1. Build aplikasi: `npm run build`
2. Start production server: `npm run start`
3. Setup PostgreSQL database
4. Configure environment variables

## 📄 License

MIT License - Feel free to use for personal or commercial projects.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📞 Support

Untuk bantuan setup atau troubleshooting, lihat file `SETUP.md`.

---

**Created with ❤️ using Next.js, React, and TypeScript**
