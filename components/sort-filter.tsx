'use client'

import { ArrowDownUp } from 'lucide-react'

interface SortFilterProps {
  currentSort: string
  onSortChange: (sort: string) => void
}

export function SortFilter({ currentSort, onSortChange }: SortFilterProps) {
  const sortOptions = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'popular', label: 'Populer' },
    { value: 'oldest', label: 'Terlama' },
    { value: 'mostViewed', label: 'Paling Banyak Ditonton' },
  ]

  return (
    <div className="flex items-center gap-2">
      <ArrowDownUp size={18} className="text-muted-foreground" />
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-4 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary transition"
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
