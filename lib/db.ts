// Mock Database - Video Streaming App
// Dalam production, ganti dengan koneksi PostgreSQL real

export interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  category: string
  duration: number // dalam detik
  views: number
  rating: number // 1-5
  url: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  icon: string
}

export interface Banner {
  id: string
  title: string
  image: string
  description: string
  link?: string
}

export interface User {
  id: string
  email: string
  username: string
  joinDate: string
  status: 'active' | 'inactive'
  role: 'user' | 'admin' | 'userVIP'
  googleId?: string
  image?: string
  membershipStatus?: 'none' | 'pending' | 'approved'
  membershipPaymentProof?: string
  membershipDate?: string
}

export interface Advertisement {
  id: string
  title: string
  image: string
  link: string
  category: string
  position: 'top' | 'sidebar' | 'bottom'
  impressions: number
  clicks: number
  revenue: number
  status: 'active' | 'inactive'
  createdAt: string
}

// Mock Categories
export const categories: Category[] = [
  { id: '1', name: 'Action', icon: '⚡' },
  { id: '2', name: 'Drama', icon: '🎭' },
  { id: '3', name: 'Comedy', icon: '😂' },
  { id: '4', name: 'Sci-Fi', icon: '🚀' },
  { id: '5', name: 'Horror', icon: '👻' },
  { id: '6', name: 'Documentary', icon: '📚' },
]

// Mock Videos
export const videos: Video[] = [
  {
    id: '1',
    title: 'Cyber Revolution',
    description: 'A thrilling action-packed adventure in a digital world',
    thumbnail: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&h=300&fit=crop',
    category: 'Sci-Fi',
    duration: 7200,
    views: 150000,
    rating: 4.8,
    url: 'https://example.com/video1.mp4',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    title: 'Laugh Track Comedy Special',
    description: 'Stand-up comedy that will make you laugh out loud',
    thumbnail: 'https://images.unsplash.com/photo-1576169887891-e51faff4ff46?w=500&h=300&fit=crop',
    category: 'Comedy',
    duration: 3600,
    views: 89000,
    rating: 4.5,
    url: 'https://example.com/video2.mp4',
    createdAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: '3',
    title: 'Ocean Mysteries Revealed',
    description: 'Discover the secrets hidden in the deepest oceans',
    thumbnail: 'https://images.unsplash.com/photo-1559027615-cdesdda35e8f?w=500&h=300&fit=crop',
    category: 'Documentary',
    duration: 5400,
    views: 120000,
    rating: 4.9,
    url: 'https://example.com/video3.mp4',
    createdAt: new Date('2024-01-12').toISOString(),
  },
  {
    id: '4',
    title: 'Last Night',
    description: 'A gripping drama about life and relationships',
    thumbnail: 'https://images.unsplash.com/photo-1533109752211-118fcf4c62db?w=500&h=300&fit=crop',
    category: 'Drama',
    duration: 8100,
    views: 200000,
    rating: 4.7,
    url: 'https://example.com/video4.mp4',
    createdAt: new Date('2024-01-05').toISOString(),
  },
  {
    id: '5',
    title: 'Midnight Terror',
    description: 'A horror film that will keep you awake at night',
    thumbnail: 'https://images.unsplash.com/photo-1535575463063-4c99dfd5dcd0?w=500&h=300&fit=crop',
    category: 'Horror',
    duration: 6300,
    views: 95000,
    rating: 4.3,
    url: 'https://example.com/video5.mp4',
    createdAt: new Date('2024-01-08').toISOString(),
  },
  {
    id: '6',
    title: 'Explosive Action',
    description: 'Non-stop action sequences and thrilling moments',
    thumbnail: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&h=300&fit=crop',
    category: 'Action',
    duration: 7200,
    views: 180000,
    rating: 4.6,
    url: 'https://example.com/video6.mp4',
    createdAt: new Date('2024-01-03').toISOString(),
  },
  {
    id: '7',
    title: 'Future Worlds',
    description: 'Explore worlds beyond imagination',
    thumbnail: 'https://images.unsplash.com/photo-1555954594-9a3fb28daa7d?w=500&h=300&fit=crop',
    category: 'Sci-Fi',
    duration: 6900,
    views: 125000,
    rating: 4.4,
    url: 'https://example.com/video7.mp4',
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '8',
    title: 'Wildlife Chronicles',
    description: 'Amazing footage of animals in their natural habitat',
    thumbnail: 'https://images.unsplash.com/photo-1498855926480-d98e83099315?w=500&h=300&fit=crop',
    category: 'Documentary',
    duration: 4500,
    views: 110000,
    rating: 4.8,
    url: 'https://example.com/video8.mp4',
    createdAt: new Date('2023-12-28').toISOString(),
  },
]

// Mock Banners
export const banners: Banner[] = [
  {
    id: '1',
    title: 'Premium Membership',
    image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=1200&h=300&fit=crop',
    description: 'Get unlimited access to all content',
    link: '/premium',
  },
  {
    id: '2',
    title: 'New Releases This Week',
    image: 'https://images.unsplash.com/photo-1574169208507-84007cde3e3b?w=1200&h=300&fit=crop',
    description: 'Watch the hottest new content',
    link: '/new',
  },
]

// Mock Users
export const users: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    username: 'johndoe',
    joinDate: new Date('2024-01-01').toISOString(),
    status: 'active',
    role: 'user',
    membershipStatus: 'none',
  },
  {
    id: '2',
    email: 'jane@example.com',
    username: 'janedoe',
    joinDate: new Date('2024-01-05').toISOString(),
    status: 'active',
    role: 'userVIP',
    membershipStatus: 'approved',
    membershipDate: new Date('2024-01-10').toISOString(),
  },
  {
    id: '3',
    email: 'admin@example.com',
    username: 'admin',
    joinDate: new Date('2023-12-15').toISOString(),
    status: 'active',
    role: 'admin',
    membershipStatus: 'none',
  },
  {
    id: '4',
    email: 'bob@example.com',
    username: 'bobsmith',
    joinDate: new Date('2024-01-10').toISOString(),
    status: 'inactive',
    role: 'user',
    membershipStatus: 'none',
  },
  {
    id: '5',
    email: 'alice@example.com',
    username: 'alicewhite',
    joinDate: new Date('2024-01-12').toISOString(),
    status: 'active',
    role: 'user',
    membershipStatus: 'pending',
  },
]

// Mock Advertisements
export const advertisements: Advertisement[] = [
  {
    id: '1',
    title: 'Premium Streaming Service',
    image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=600&h=400&fit=crop',
    link: 'https://example.com/premium',
    category: 'Entertainment',
    position: 'top',
    impressions: 15000,
    clicks: 450,
    revenue: 1350,
    status: 'active',
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '2',
    title: 'New Camera Equipment',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop',
    link: 'https://example.com/cameras',
    category: 'Electronics',
    position: 'sidebar',
    impressions: 8000,
    clicks: 320,
    revenue: 960,
    status: 'active',
    createdAt: new Date('2024-01-05').toISOString(),
  },
  {
    id: '3',
    title: 'Gaming Console Bundle',
    image: 'https://images.unsplash.com/photo-1486572788984-e8468676b688?w=600&h=400&fit=crop',
    link: 'https://example.com/gaming',
    category: 'Gaming',
    position: 'bottom',
    impressions: 12000,
    clicks: 380,
    revenue: 1140,
    status: 'active',
    createdAt: new Date('2024-01-08').toISOString(),
  },
  {
    id: '4',
    title: 'Streaming Software',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
    link: 'https://example.com/software',
    category: 'Software',
    position: 'top',
    impressions: 5000,
    clicks: 150,
    revenue: 450,
    status: 'inactive',
    createdAt: new Date('2024-01-10').toISOString(),
  },
]
