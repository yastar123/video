'use client'

import React from "react"

import type { Video, Category } from '@/lib/db'
import { useState } from 'react'
import { X, Upload, Loader2, Trash2 } from 'lucide-react'

interface VideoFormProps {
  video?: Video
  categories: Category[]
  onSubmit: (video: Partial<Video>) => Promise<void>
  onClose: () => void
}

async function uploadFile(file: File, type: 'video' | 'thumbnail'): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)
  
  const uploadRes = await fetch('/api/uploads/file', {
    method: 'POST',
    body: formData,
  })
  
  if (!uploadRes.ok) {
    const errorData = await uploadRes.json()
    throw new Error(errorData.error || 'Failed to upload file')
  }
  
  const data = await uploadRes.json()
  return data.objectPath
}

export function VideoForm({
  video,
  categories,
  onSubmit,
  onClose,
}: VideoFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [useUrl, setUseUrl] = useState(true)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [videoFileName, setVideoFileName] = useState('')
  const [formData, setFormData] = useState({
    title: video?.title || '',
    thumbnail: video?.thumbnail || '',
    category: video?.category || '',
    url: video?.url || '',
  })
  const [newCategory, setNewCategory] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)

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

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.trim() }),
      })
      if (!res.ok) throw new Error('Failed to create category')
      const category = await res.json()
      setFormData(prev => ({ ...prev, category: category.name }))
      setIsAddingCategory(false)
      setNewCategory('')
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category')
    } finally {
      setLoading(false)
    }
  }

  const handleThumbnailFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploadingThumbnail(true)
    setError('')
    
    try {
      const objectPath = await uploadFile(file, 'thumbnail')
      setFormData(prev => ({ ...prev, thumbnail: objectPath }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload thumbnail')
    } finally {
      setUploadingThumbnail(false)
    }
  }

  const handleVideoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploadingVideo(true)
    setError('')
    setVideoFileName(file.name)
    
    try {
      const objectPath = await uploadFile(file, 'video')
      setFormData(prev => ({ ...prev, url: objectPath }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload video')
      setVideoFileName('')
    } finally {
      setUploadingVideo(false)
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
        <div className="flex items-center justify-between p-6 border-b-2 border-border sticky top-0 bg-card">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-2 rounded">
              {error}
            </div>
          )}

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

          <div>
            <label className="block text-sm font-medium mb-1">
              Category *
            </label>
            <div className="flex gap-2">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsAddingCategory(!isAddingCategory)}
                className="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                {isAddingCategory ? 'Cancel' : 'New'}
              </button>
            </div>
            
            {isAddingCategory && (
              <div className="mt-2 flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="flex-1 px-3 py-1.5 border border-border rounded-md text-sm bg-background focus:ring-1 focus:ring-primary outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3 py-1.5 bg-foreground text-background rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Thumbnail
            </label>
            <div className="space-y-3">
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail.startsWith('/uploads') ? '' : formData.thumbnail}
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
                  disabled={uploadingThumbnail}
                />
                <label htmlFor="thumbnail-file" className="cursor-pointer flex items-center justify-center gap-2">
                  {uploadingThumbnail ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      <span className="text-sm font-medium">Click to upload thumbnail</span>
                    </>
                  )}
                </label>
              </div>
            </div>
            {formData.thumbnail && (
              <div className="mt-2 relative group">
                <p className="text-xs text-muted-foreground mb-1">
                  {formData.thumbnail.startsWith('/uploads') ? 'Uploaded file' : 'URL preview'}
                </p>
                <div className="relative">
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="h-32 w-full object-cover rounded border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    title="Remove thumbnail"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

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
                  Upload File
                </button>
              </div>

              {useUrl ? (
                <input
                  type="url"
                  name="url"
                  value={formData.url.startsWith('/uploads') ? '' : formData.url}
                  onChange={handleChange}
                  required={useUrl && !formData.url}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground bg-background"
                  placeholder="https://example.com/video.mp4"
                />
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-foreground/50 transition-colors">
                  <input
                    type="file"
                    accept="video/*,.m3u8,.mpd"
                    onChange={handleVideoFileSelect}
                    className="hidden"
                    id="video-file"
                    disabled={uploadingVideo}
                  />
                  <label htmlFor="video-file" className="cursor-pointer flex flex-col items-center gap-2">
                    {uploadingVideo ? (
                      <>
                        <Loader2 size={24} className="animate-spin" />
                        <p className="text-sm font-medium">Uploading video...</p>
                        <p className="text-xs text-muted-foreground">{videoFileName}</p>
                      </>
                    ) : formData.url.startsWith('/uploads') ? (
                      <>
                        <Upload size={24} className="text-green-500" />
                        <p className="text-sm font-medium text-green-500">Video uploaded successfully</p>
                        <p className="text-xs text-muted-foreground">Click to replace</p>
                      </>
                    ) : (
                      <>
                        <Upload size={24} />
                        <p className="text-sm font-medium">Click to upload video</p>
                        <p className="text-xs text-muted-foreground">MP4, HLS (.m3u8), DASH (.mpd)</p>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || uploadingVideo || uploadingThumbnail}
              className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingVideo || uploadingThumbnail || !formData.url}
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
