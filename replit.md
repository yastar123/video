# StreamFlix - Video Streaming Platform

## Overview

StreamFlix is a video streaming platform MVP built with Next.js 16, TypeScript, and Tailwind CSS. The application provides a Netflix-like experience with video browsing, categorization, search, filtering, and an admin dashboard for content management. Uses PostgreSQL database for data persistence.

## Recent Changes (January 2026)

- SEO improvements: Added canonical tag, JSON-LD schema markup, og:image, twitter:image, meta author/publisher
- Added H1 tag to homepage for accessibility and SEO
- Added favicon.ico
- Created user registration page and API endpoint (/auth/register)
- Changed HTML lang attribute to "id" (Indonesian)
- Implemented admin authentication guard - only admin users can access /admin pages
- Added admin user seeding (admin@streamflix.com / admin123) 
- Fixed user management with proper API endpoints for CRUD operations
- Fixed advertisement management with proper API endpoints
- Updated users table with additional fields for Google OAuth, membership status, and profile images
- Fixed membership management for VIP user approvals

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **State Management**: React useState/useEffect hooks with client-side data fetching

### Application Structure
- **App Router**: Uses Next.js App Router with file-based routing in `/app` directory
- **Component Organization**: Reusable components in `/components`, UI primitives in `/components/ui`
- **API Routes**: RESTful API endpoints (referenced but implementation files truncated)

### Key Pages
- `/` - Home page with video grid, search, filters, and pagination
- `/kategori` - Category browsing page
- `/video/[id]` - Video detail page with player placeholder
- `/admin/*` - Admin dashboard with sidebar navigation for videos, users, ads, and membership management
- `/profile` - User profile with membership features
- `/auth/login` - Login page
- `/auth/register` - Registration page

### Data Layer
- **Current State**: Mock data defined in `/lib/db.ts` with TypeScript interfaces
- **Database Ready**: PostgreSQL connection pool configured in `/lib/postgres.ts` using `pg` library
- **Data Types**: Video, Category, Banner, User, Advertisement interfaces defined

### Authentication
- **Session Management**: Client-side localStorage session storage in `/lib/session.ts`
- **Google OAuth**: Google Identity Services integration prepared in `/components/google-login-button.tsx`
- **User Roles**: Supports user, admin, and userVIP roles

### Design Patterns
- Client components marked with 'use client' directive for interactive features
- Server-side rendering available for static content
- Mobile-first responsive design with hamburger menu for mobile navigation
- Component composition using Radix UI primitives wrapped with Tailwind styling

## External Dependencies

### Core Framework
- Next.js 16.0.10 - React framework with App Router
- React 19 (via Next.js) - UI library
- TypeScript - Type safety

### Database
- PostgreSQL via `pg` package - Connection pool ready in `/lib/postgres.ts`
- Environment variable: `DATABASE_URL` for database connection string

### UI Libraries
- Tailwind CSS - Utility-first CSS framework
- Radix UI - Accessible component primitives (accordion, dialog, dropdown, tabs, etc.)
- shadcn/ui - Pre-built component library
- Lucide React - Icon library
- class-variance-authority - Component variant management
- embla-carousel-react - Carousel functionality

### Authentication
- Google Identity Services - OAuth integration (client-side script loaded dynamically)
- Environment variable: `NEXT_PUBLIC_GOOGLE_CLIENT_ID` for Google OAuth

### Analytics
- Vercel Analytics - Usage tracking

### Charts
- Recharts - Dashboard statistics visualization

### Form Handling
- react-hook-form with @hookform/resolvers - Form validation
- zod (via resolvers) - Schema validation

### Additional UI
- vaul - Drawer component
- sonner - Toast notifications
- react-day-picker - Calendar component
- input-otp - OTP input component
- cmdk - Command palette
- next-themes - Theme switching