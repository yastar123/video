'use client'

import { useEffect, useState } from 'react'
import type { Video, Category } from '@/lib/db'
import { VideoForm } from '@/components/video-form'
import { Plus, Edit, Trash2, Eye, Clock } from 'lucide-react'

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | undefined>()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videosRes, categoriesRes] = await Promise.all([
          fetch('/api/admin/videos'),
          fetch('/api/categories'),
        ])
        const videosData = await videosRes.json()
        const categoriesData = await categoriesRes.json()
        setVideos(Array.isArray(videosData) ? videosData : [])
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setVideos([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCreateVideo = async (formData: Partial<Video>) => {
    const response = await fetch('/api/admin/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (!response.ok) throw new Error('Failed to create video')

    const newVideo = await response.json()
    setVideos((prev) => [newVideo, ...prev])
  }

  const handleUpdateVideo = async (formData: Partial<Video>) => {
    const response = await fetch('/api/admin/videos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (!response.ok) throw new Error('Failed to update video')

    const updatedVideo = await response.json()
    setVideos((prev) =>
      prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v))
    )
  }

  const handleDeleteVideo = async (id: string) => {
    const response = await fetch(`/api/admin/videos?id=${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('Failed to delete video')

    setVideos((prev) => prev.filter((v) => v.id !== id))
    setDeleteConfirm(null)
  }

  const handleSubmit = async (formData: Partial<Video>) => {
    if (editingVideo) {
      await handleUpdateVideo(formData)
      setEditingVideo(undefined)
    } else {
      await handleCreateVideo(formData)
    }
    setShowForm(false)
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}`
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Videos</h1>
            <p className="text-muted-foreground mt-1">
              Manage and upload your video content
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-foreground text-background font-medium rounded-md hover:bg-foreground/90 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add Video
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-muted border-t-primary rounded-full" />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground mb-4">
              No videos yet. Create your first video.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add Video
            </button>
          </div>
        ) : (
          <div className="bg-card rounded-lg overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video, idx) => (
                    <tr
                      key={video.id}
                      className={`border-b border-border hover:bg-muted/50 transition ${
                        idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/20'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={video.thumbnail || '/placeholder.svg'}
                            alt={video.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {video.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {video.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-muted rounded text-sm">
                          {video.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          {formatDuration(video.duration)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye size={16} />
                          {formatViews(video.views)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {'⭐'} {video.rating.toFixed(1)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingVideo(video)
                              setShowForm(true)
                            }}
                            className="p-2 hover:bg-muted rounded transition text-blue-500"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(video.id)}
                            className="p-2 hover:bg-destructive/20 rounded transition text-destructive"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-card rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-bold mb-2">Delete Video?</h3>
            <p className="text-muted-foreground mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteVideo(deleteConfirm)}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Form Modal */}
      {showForm && (
        <VideoForm
          video={editingVideo}
          categories={categories}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false)
            setEditingVideo(undefined)
          }}
        />
      )}
    </div>
  )
}
