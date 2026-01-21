// Video utility functions

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m ${secs}s`
}

export function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toString()
}

export function getVideoId(id: string | number): string {
  return String(id)
}

export interface SortOption {
  value: string
  label: string
}

export const SORT_OPTIONS: SortOption[] = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'popular', label: 'Populer' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'mostViewed', label: 'Paling Banyak Ditonton' },
]
