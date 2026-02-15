// Database Interfaces - Video Streaming App
// Data fetched from PostgreSQL database

export interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  category_id?: number
  category?: string
  category_ids?: number[]
  categories?: string[]
  duration: number
  views: number
  rating: number
  url: string
  created_at: string
}

export interface Category {
  id: number
  name: string
  icon: string
  slug?: string
}

export interface Banner {
  id: number
  title: string
  image: string
  description: string
  link?: string
}

export interface User {
  id: number
  email: string
  username: string
  created_at: string
  role: string
}

export interface Advertisement {
  id: number
  title: string
  image: string
  link: string
  position: string
  status: string
  created_at: string
}

// These are kept for type compatibility but will be empty as data comes from DB
export const categories: Category[] = []
export const videos: Video[] = []
export const banners: Banner[] = []
export const users: User[] = []
export const advertisements: Advertisement[] = []
