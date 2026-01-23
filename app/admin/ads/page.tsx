'use client'

import { useEffect, useState } from 'react'
import type { Advertisement } from '@/lib/db'
import { Plus, Edit, Trash2, Eye, MousePointer, DollarSign } from 'lucide-react'

export default function AdsPage() {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    position: 'top' as 'top' | 'sidebar' | 'bottom',
    image: '',
    link: ''
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchAds()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('type', 'ad')

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

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/ads')
      const data = await res.json()
      setAds(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch ads:', err)
      setAds([])
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const ad = ads.find(a => a.id === id)
    if (!ad) return

    try {
      const res = await fetch('/api/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ad, id, status: newStatus })
      })
      if (res.ok) {
        setAds((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: newStatus } : a
          )
        )
      }
    } catch (err) {
      console.error('Failed to toggle status:', err)
    }
  }

  const handleDeleteAd = async (id: string) => {
    try {
      const res = await fetch(`/api/ads?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAds((prev) => prev.filter((a) => a.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete ad:', err)
    }
    setDeleteConfirm(null)
  }

  const handleSubmit = async () => {
    try {
      if (editingAd) {
        const res = await fetch('/api/ads', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, id: editingAd.id, status: editingAd.status })
        })
        if (res.ok) {
          const updated = await res.json()
          setAds((prev) =>
            prev.map((ad) => (ad.id === updated.id ? { ...ad, ...updated } : ad))
          )
        }
      } else {
        const res = await fetch('/api/ads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (res.ok) {
          const newAd = await res.json()
          setAds((prev) => [{ ...newAd, impressions: 0, clicks: 0, revenue: 0 }, ...prev])
        }
      }
    } catch (err) {
      console.error('Failed to save ad:', err)
    }
    setShowForm(false)
    setEditingAd(null)
    setFormData({ title: '', position: 'top', image: '', link: '' })
  }

  const openEditForm = (ad: Advertisement) => {
    setEditingAd(ad)
    setFormData({
      title: ad.title,
      position: ad.position,
      image: ad.image || '',
      link: ad.link || ''
    })
    setShowForm(true)
  }

  const openNewForm = () => {
    setEditingAd(null)
    setFormData({ title: '', position: 'top', image: '', link: '' })
    setShowForm(true)
  }

  const totalImpressions = ads.reduce((sum, ad) => sum + (ad.impressions || 0), 0)
  const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0)
  const totalRevenue = ads.reduce((sum, ad) => sum + (Number(ad.revenue) || 0), 0)
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0'

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Advertisements Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage ads and monetization
            </p>
          </div>
          <button
            onClick={openNewForm}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            Add Ad
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Impressions
                </p>
                <p className="text-3xl font-bold">
                  {totalImpressions.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-600 rounded-lg">
                <Eye size={24} />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Clicks
                </p>
                <p className="text-3xl font-bold">
                  {totalClicks.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 text-green-600 rounded-lg">
                <MousePointer size={24} />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">CTR</p>
                <p className="text-3xl font-bold">{ctr}%</p>
              </div>
              <div className="p-3 bg-purple-500/10 text-purple-600 rounded-lg">
                <MousePointer size={24} />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-600 rounded-lg">
                <DollarSign size={24} />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-muted border-t-primary rounded-full" />
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground mb-4">No advertisements yet.</p>
            <button
              onClick={openNewForm}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add Ad
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
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Impressions
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map((ad, idx) => (
                    <tr
                      key={ad.id}
                      className={`border-b border-border hover:bg-muted/50 transition ${
                        idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/20'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {ad.image && (
                            <img
                              src={ad.image || "/placeholder.svg"}
                              alt={ad.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <p className="font-medium">{ad.title}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm capitalize">
                        {ad.position}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {(ad.impressions || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {(ad.clicks || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        ${(Number(ad.revenue) || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            ad.status === 'active'
                              ? 'bg-green-500/20 text-green-700'
                              : 'bg-red-500/20 text-red-700'
                          }`}
                        >
                          {ad.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(ad.id, ad.status)}
                            className="p-2 hover:bg-muted rounded transition text-blue-500 text-sm"
                          >
                            {ad.status === 'active' ? 'Pause' : 'Resume'}
                          </button>
                          <button
                            onClick={() => openEditForm(ad)}
                            className="p-2 hover:bg-muted rounded transition text-blue-500"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(ad.id)}
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
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-card rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-bold mb-2">Delete Advertisement?</h3>
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
                onClick={() => handleDeleteAd(deleteConfirm)}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-card rounded-lg p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">
              {editingAd ? 'Edit Ad' : 'Add New Ad'}
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Ad title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90 transition"
                  />
                  {uploading && <p className="text-sm text-muted-foreground animate-pulse">Uploading...</p>}
                  <input
                    type="text"
                    placeholder="Or enter image URL: https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formData.image && (
                    <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-border">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link URL</label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Position
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value as any})}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="top">Top Banner</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingAd(null)
                  setFormData({ title: '', position: 'top', image: '', link: '' })
                }}
                className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.title}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {editingAd ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
