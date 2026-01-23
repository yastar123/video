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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchData()
  }, [currentPage])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [videosRes, categoriesRes] = await Promise.all([
        fetch(`/api/admin/videos?page=${currentPage}&limit=8`),
        fetch('/api/categories'),
      ])
      const videosData = await videosRes.json()
      const categoriesData = await categoriesRes.json()
      
      setVideos(videosData.videos || [])
      setTotalPages(videosData.pagination?.totalPages || 1)
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setVideos([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateVideo = async (formData: Partial<Video>) => {
    const response = await fetch('/api/admin/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (!response.ok) throw new Error('Failed to create video')
    await fetchData()
  }

  const handleUpdateVideo = async (formData: Partial<Video>) => {
    const response = await fetch('/api/admin/videos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (!response.ok) throw new Error('Failed to update video')
    await fetchData()
  }

  const handleDeleteVideo = async (id: string) => {
    const response = await fetch(`/api/admin/videos?id=${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('Failed to delete video')
    await fetchData()
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
              Belum ada video. Buat video pertama Anda.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Tambah Video
            </button>
          </div>
        ) : (
          <div className="bg-card rounded-lg overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Views</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
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
                            <p className="font-medium truncate">{video.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{video.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-muted rounded text-sm">{video.category}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye size={16} />
                          {formatViews(video.views || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingVideo(video)
                              setShowForm(true)
                            }}
                            className="p-2 hover:bg-muted rounded transition text-blue-500"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(video.id)}
                            className="p-2 hover:bg-destructive/20 rounded transition text-destructive"
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
                <div className="text-sm text-muted-foreground">
                  Halaman <span className="font-medium text-foreground">{currentPage}</span> dari <span className="font-medium text-foreground">{totalPages}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted disabled:opacity-50 transition-colors"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted disabled:opacity-50 transition-colors"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-card rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-bold mb-2">Hapus Video?</h3>
            <p className="text-muted-foreground mb-6">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteVideo(deleteConfirm)}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

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
