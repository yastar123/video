'use client'

import React, { useEffect, useCallback } from "react"
import { Search, X, Play, Flame } from 'lucide-react'
import { useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  initialValue?: string
}

export function SearchBar({ onSearch, placeholder, initialValue = '' }: SearchBarProps) {
  const [value, setValue] = useState(initialValue)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Popular Indonesian adult search queries for autocomplete SEO
  const popularSearches = [
    'bokep indonesia terbaru',
    'nonton bokep jepang hd',
    'video porno china',
    'cerita bokep indonesia',
    'bokep viral tiktok',
    'film semi jepang',
    'bokep barat gratis',
    'nonton bokep indo',
    'bokep jepang subtitle',
    'video dewasa terupdate'
  ]

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = useCallback((query: string) => {
    if (onSearch) {
      onSearch(query)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      if (query.trim()) {
        params.set('search', query.trim())
      } else {
        params.delete('search')
      }
      params.set('page', '1')
      router.push(`/?${params.toString()}`)
    }
    setShowSuggestions(false)
  }, [onSearch, router, searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    
    if (onSearch) {
      onSearch(newValue)
    }

    // Dynamic search suggestions based on input (SEO boost)
    if (newValue.length > 1) {
      const filtered = popularSearches.filter(search => 
        search.toLowerCase().includes(newValue.toLowerCase())
      ).slice(0, 6)
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(value)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleClear = () => {
    setValue('')
    setSuggestions([])
    setShowSuggestions(false)
    handleSearch('')
    inputRef.current?.focus()
  }

  const suggestionClick = (suggestion: string) => {
    setValue(suggestion)
    handleSearch(suggestion)
  }

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={dropdownRef}>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={16} />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Search...'}
          autoComplete="off"
          name="q"
          id="search"
          className="w-full pl-9 pr-9 py-2 rounded-md border border-border bg-background hover:border-foreground/30 focus:border-foreground outline-none transition-all text-sm font-medium"
          aria-label="Search videos"
          role="searchbox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          <ul className="py-1" role="listbox">
            {suggestions.map((suggestion, index) => (
              <li key={suggestion}>
                <button
                  onClick={() => suggestionClick(suggestion)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent transition-colors text-left group"
                  role="option"
                  aria-selected={false}
                  id={`suggestion-${index}`}
                >
                  <Search className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">
                    {suggestion}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}