'use client'

import React, { useEffect } from "react"

import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  initialValue?: string
}

export function SearchBar({ onSearch, placeholder = 'Search videos...', initialValue = '' }: SearchBarProps) {
  const [value, setValue] = useState(initialValue)
  const router = useRouter()

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query)
    } else {
      const params = new URLSearchParams(window.location.search)
      if (query) params.set('search', query)
      else params.delete('search')
      params.set('page', '1')
      router.push(`/?${params.toString()}`)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    if (onSearch) onSearch(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(value)
    }
  }

  const handleClear = () => {
    setValue('')
    handleSearch('')
  }

  return (
    <div className="relative w-full group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" size={18} />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-11 pr-11 py-2.5 rounded-full border border-border bg-muted/30 hover:bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 text-sm font-medium"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-full"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
