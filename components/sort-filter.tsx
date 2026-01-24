'use client'

import { ArrowDownUp } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface SortFilterProps {
  currentSort: string
  onSortChange?: (sort: string) => void
}

export function SortFilter({ currentSort, onSortChange }: SortFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const sortOptions = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'popular', label: 'Populer' },
    { value: 'oldest', label: 'Terlama' },
    { value: 'rating', label: 'Rating' },
  ]

  const handleChange = (value: string) => {
    if (onSortChange) {
      onSortChange(value)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.set('sort', value)
      router.push(`/?${params.toString()}`)
    }
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <ArrowDownUp size={16} className="text-muted-foreground hidden sm:block" />
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary transition min-w-[80px] sm:min-w-[120px]"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
