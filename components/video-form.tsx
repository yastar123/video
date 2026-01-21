'use client'

import React from "react"

import type { Video, Category } from '@/lib/db'
import { useState } from 'react'
import { X } from 'lucide-react'

interface VideoFormProps {
  video?: Video
  categories: Category[]
  onSubmit: (video: Partial<Video>) => Promise<void>
  onClose: () => void
}

export function VideoForm({
  video,
  categories,
  onSubmit,
  onClose,
}: VideoFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [useUrl, setUseUrl] = useState(!video?.url?.startsWith('blob:'))
  const [formData, setFormData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    thumbnail: video?.thumbnail || '',
    category: video?.category || '',
    url: video?.url || '',
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleThumbnailFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, thumbnail: URL.createObjectURL(file) }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const submitData = video
        ? { id: video.id, ...formData }
        : formData

      await onSubmit(submitData)
      onClose()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-bold">
            {video ? 'Edit Video' : 'Add New Video'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-2 rounded">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="Enter video title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background resize-none"
              placeholder="Enter video description"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Thumbnail
            </label>
            <div className="space-y-3">
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="Thumbnail URL (e.g., https://example.com/image.jpg)"
              />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-card text-muted-foreground">or upload image</span>
                </div>
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailFileSelect}
                  className="hidden"
                  id="thumbnail-file"
                />
                <label htmlFor="thumbnail-file" className="cursor-pointer">
                  <p className="text-sm font-medium">Click to upload thumbnail</p>
                </label>
              </div>
            </div>
            {formData.thumbnail && (
              <img
                src={formData.thumbnail}
                alt="Preview"
                className="mt-2 h-32 w-full object-cover rounded border border-border"
              />
            )}
          </div>

          {/* Video URL or File */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Video Source *
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUseUrl(true)}
                  className={`flex-1 py-2 text-sm font-medium border rounded-md transition-colors ${
                    useUrl 
                      ? 'bg-foreground text-background border-foreground' 
                      : 'bg-background text-foreground border-border hover:bg-muted'
                  }`}
                >
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setUseUrl(false)}
                  className={`flex-1 py-2 text-sm font-medium border rounded-md transition-colors ${
                    !useUrl 
                      ? 'bg-foreground text-background border-foreground' 
                      : 'bg-background text-foreground border-border hover:bg-muted'
                  }`}
                >
                  File
                </button>
              </div>

              {useUrl ? (
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground bg-background"
                  placeholder="https://example.com/video.mp4"
                />
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-foreground/50 transition-colors">
                  <input
                    type="file"
                    accept="video/*,.m3u8,.mpd"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setFormData(prev => ({ ...prev, url: URL.createObjectURL(file) }))
                      }
                    }}
                    className="hidden"
                    id="video-file"
                  />
                  <label htmlFor="video-file" className="cursor-pointer">
                    <p className="text-sm font-medium">Click to upload video</p>
                    <p className="text-xs text-muted-foreground mt-1">MP4, HLS (.m3u8), DASH (.mpd)</p>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
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
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : video ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
