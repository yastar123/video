'use client'

import React, { useEffect, useCallback } from "react"
import { Search, X, Play, Flame } from 'lucide-react'
import { useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

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
    <div className="relative w-full group" ref={dropdownRef}>
      {/* SEO-optimized search input with autocomplete */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" size={18} />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Cari bokep indonesia, jepang, china terbaru...'}
          autoComplete="off"
          name="q"
          id="search"
          className="w-full pl-11 pr-11 py-3.5 rounded-full border-2 border-border/50 bg-muted/30 hover:bg-muted/50 focus:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 text-base font-semibold shadow-lg hover:shadow-xl"
          aria-label="Cari video bokep indonesia jepang china terbaru gratis HD"
          role="searchbox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all p-1 hover:bg-muted rounded-full hover:scale-110"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* SEO-boosted search suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/50 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-80 overflow-y-auto">
          <ul className="py-2" role="listbox">
            {suggestions.map((suggestion, index) => (
              <li key={suggestion}>
                <button
                  onClick={() => suggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 px-6 py-3 hover:bg-primary/10 transition-all duration-200 text-left group"
                  role="option"
                  aria-selected={false}
                  id={`suggestion-${index}`}
                >
                  <Play className="text-primary h-5 w-5 flex-shrink-0" />
                  <span className="font-medium text-sm group-hover:text-primary transition-colors">
                    {suggestion}
                  </span>
                  <Flame className="ml-auto text-orange-500 text-xs flex-shrink-0" />
                </button>
              </li>
            ))}
          </ul>
          
          {/* Trending searches footer */}
          <div className="px-4 py-3 border-t border-border/50 bg-muted/30 rounded-b-2xl">
            <p className="text-xs text-muted-foreground font-medium mb-2">Trending Pencarian:</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.slice(0, 4).map(search => (
                <Link
                  key={search}
                  href={`/?search=${encodeURIComponent(search)}`}
                  className="text-xs bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1.5 rounded-full font-semibold transition-all hover:scale-105 whitespace-nowrap"
                >
                  {search}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden structured data for search action */}
      <Script 
        id="search-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://yoursite.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://yoursite.com/?search={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "name": "Nonton Bokep Indonesia Jepang China Terlengkap"
          })
        }}
      />
    </div>
  )
}