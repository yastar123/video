'use client'

import { useState } from 'react'
import { X, Upload, Loader2, FileText, CheckCircle, XCircle } from 'lucide-react'
import type { Category } from '@/lib/db'

interface BulkImportFormProps {
  categories: Category[]
  onSuccess: () => void
  onClose: () => void
}

interface ImportResult {
  success: boolean
  title: string
  error?: string
}

export function BulkImportForm({ categories, onSuccess, onClose }: BulkImportFormProps) {
  const [csvData, setCsvData] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ImportResult[]>([])
  const [showResults, setShowResults] = useState(false)

  const parseCSV = (text: string): Array<{ title: string; thumbnail: string; url: string; category: string }> => {
    const lines = text.trim().split('\n')
    const videos: Array<{ title: string; thumbnail: string; url: string; category: string }> = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      if (i === 0 && line.toLowerCase().includes('title') && line.toLowerCase().includes('url')) {
        continue
      }
      
      const parts = line.split(',').map(p => p.trim())
      
      if (parts.length >= 4) {
        videos.push({
          title: parts[0],
          thumbnail: parts[1],
          url: parts[2],
          category: parts[3]
        })
      } else if (parts.length === 3) {
        videos.push({
          title: parts[0],
          thumbnail: parts[1],
          url: parts[2],
          category: categories[0]?.name || 'Action'
        })
      }
    }
    
    return videos
  }

  const handleImport = async () => {
    if (!csvData.trim()) return
    
    setLoading(true)
    setResults([])
    
    try {
      const videos = parseCSV(csvData)
      
      if (videos.length === 0) {
        setResults([{ success: false, title: 'Error', error: 'No valid video data found in CSV' }])
        setShowResults(true)
        setLoading(false)
        return
      }
      
      const importResults: ImportResult[] = []
      
      for (const video of videos) {
        try {
          const response = await fetch('/api/admin/videos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: video.title,
              thumbnail: video.thumbnail,
              url: video.url,
              category: video.category,
              description: ''
            }),
          })
          
          if (response.ok) {
            importResults.push({ success: true, title: video.title })
          } else {
            const errorData = await response.json()
            importResults.push({ success: false, title: video.title, error: errorData.error || 'Failed to import' })
          }
        } catch (err) {
          importResults.push({ success: false, title: video.title, error: 'Network error' })
        }
      }
      
      setResults(importResults)
      setShowResults(true)
      
      const successCount = importResults.filter(r => r.success).length
      if (successCount > 0) {
        onSuccess()
      }
    } catch (err) {
      setResults([{ success: false, title: 'Error', error: 'Failed to parse CSV data' }])
      setShowResults(true)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setCsvData(text)
    }
    reader.readAsText(file)
  }

  const successCount = results.filter(r => r.success).length
  const failCount = results.filter(r => !r.success).length

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b-2 border-border sticky top-0 bg-card">
          <div>
            <h2 className="text-xl font-bold">Bulk Import Videos</h2>
            <p className="text-sm text-muted-foreground mt-1">Import multiple videos from CSV data</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!showResults ? (
            <>
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <FileText size={18} />
                  CSV Format
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Paste data dengan format: <code className="bg-background px-1 py-0.5 rounded">title,image_url,video_url,category</code>
                </p>
                <p className="text-xs text-muted-foreground">
                  Contoh: <code className="bg-background px-1 py-0.5 rounded text-xs">Video Title,https://example.com/thumb.jpg,https://example.com/video.m3u8,Action</code>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload CSV File (Optional)
                </label>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Paste CSV Data
                </label>
                <textarea
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  placeholder={`title,image_url,video_url,category\nMy Video Title,https://example.com/thumb.jpg,https://example.com/video.m3u8,Action`}
                  rows={12}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background font-mono text-sm"
                />
              </div>

              <div className="bg-muted/30 rounded-lg p-3 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Available Categories:</strong> {categories.map(c => c.name).join(', ')}
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={loading || !csvData.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Import Videos
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle size={20} />
                  <span className="font-medium">{successCount} berhasil</span>
                </div>
                {failCount > 0 && (
                  <div className="flex items-center gap-2 text-destructive">
                    <XCircle size={20} />
                    <span className="font-medium">{failCount} gagal</span>
                  </div>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      result.success 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-destructive/10 border-destructive/30'
                    }`}
                  >
                    {result.success ? (
                      <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle size={18} className="text-destructive flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{result.title}</p>
                      {result.error && (
                        <p className="text-xs text-destructive">{result.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  onClick={() => {
                    setShowResults(false)
                    setCsvData('')
                    setResults([])
                  }}
                  className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition"
                >
                  Import More
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
                >
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
