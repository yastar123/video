'use client'

import { useForceRefresh } from '@/components/force-refresh-link'

interface ForceRefreshPaginationProps {
  currentPage: number
  totalPages: number
  className?: string
}

export function ForceRefreshPagination({ currentPage, totalPages, className = "" }: ForceRefreshPaginationProps) {
  const { push } = useForceRefresh()

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href)
    if (page === 1) {
      url.searchParams.delete('page')
    } else {
      url.searchParams.set('page', page.toString())
    }
    push(url.toString())
  }

  if (totalPages <= 1) return null

  return (
    <div className={`flex justify-center items-center gap-2 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          currentPage === 1
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {getVisiblePages().map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-sm text-gray-500">...</span>
          ) : (
            <button
              onClick={() => handlePageChange(page as number)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                page === currentPage
                  ? 'bg-primary text-white'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {page}
            </button>
          )}
        </div>
      ))}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          currentPage === totalPages
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        Next
      </button>
    </div>
  )
}
