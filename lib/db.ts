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
  created_at: string
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

// Data dummy telah dihapus. Pastikan environment variable DATABASE_URL sudah terkonfigurasi.
export const categories: Category[] = []
export const videos: Video[] = []
export const banners: Banner[] = []
export const users: User[] = []
export const advertisements: Advertisement[] = []
