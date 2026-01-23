'use client'

import { useEffect, useState } from 'react'
import type { Banner } from '@/lib/db'
import { Plus, Edit, Trash2, ImageIcon } from 'lucide-react'

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    description: '',
    link: ''
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners')
      const data = await res.json()
      setBanners(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch banners:', err)
      setBanners([])
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('type', 'banner')

    try {
      const res = await fetch('/api/uploads/file', {
        method: 'POST',
        body: uploadFormData
      })
      const data = await res.json()
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.objectPath }))
      }
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const method = editingBanner ? 'PUT' : 'POST'
      const res = await fetch('/api/banners', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBanner ? { ...formData, id: editingBanner.id } : formData)
      })
      if (res.ok) {
        fetchBanners()
        setShowForm(false)
        setEditingBanner(null)
        setFormData({ title: '', image: '', description: '', link: '' })
      }
    } catch (err) {
      console.error('Failed to save banner:', err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/banners?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setBanners(prev => prev.filter(b => b.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete banner:', err)
    }
    setDeleteConfirm(null)
  }

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Banners Management</h1>
            <p className="text-muted-foreground mt-2">Manage home page hero banners</p>
          </div>
          <button
            onClick={() => {
              setEditingBanner(null)
              setFormData({ title: '', image: '', description: '', link: '' })
              setShowForm(true)
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition flex items-center gap-2"
          >
            <Plus size={20} />
            Add Banner
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-muted border-t-primary rounded-full" />
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground">No banners found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-card border border-border rounded-lg overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-64 h-48 relative">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{banner.title}</h3>
                    <p className="text-muted-foreground mt-1 line-clamp-2">{banner.description}</p>
                    {banner.link && <p className="text-sm text-primary mt-2">{banner.link}</p>}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setEditingBanner(banner)
                        setFormData({
                          title: banner.title,
                          image: banner.image,
                          description: banner.description || '',
                          link: banner.link || ''
                        })
                        setShowForm(true)
                      }}
                      className="p-2 hover:bg-muted rounded transition text-blue-500"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(banner.id)}
                      className="p-2 hover:bg-destructive/10 rounded transition text-destructive"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full mb-2"
                />
                <input
                  type="text"
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  placeholder="Or image URL"
                  className="w-full px-4 py-2 border rounded-lg bg-background"
                />
                {formData.image && <img src={formData.image} className="mt-2 h-32 object-contain" alt="Preview" />}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Link URL</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg bg-background"
                />
              </div>
              <div className="flex gap-3 justify-end mt-8">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={handleSubmit} disabled={!formData.title || !formData.image || uploading} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">
                  {editingBanner ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Delete Banner?</h3>
            <p className="text-muted-foreground mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
