'use client'

import { advertisements } from '@/lib/db'
import type { Advertisement } from '@/lib/db'
import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, MousePointer, DollarSign } from 'lucide-react'

export default function AdsPage() {
  const [ads, setAds] = useState<Advertisement[]>(advertisements)
  const [showForm, setShowForm] = useState(false)
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleToggleStatus = (id: string) => {
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === id
          ? { ...ad, status: ad.status === 'active' ? 'inactive' : 'active' }
          : ad
      )
    )
  }

  const handleDeleteAd = (id: string) => {
    setAds((prev) => prev.filter((a) => a.id !== id))
    setDeleteConfirm(null)
  }

  const handleSubmit = (formData: Partial<Advertisement>) => {
    if (editingAd) {
      setAds((prev) =>
        prev.map((ad) =>
          ad.id === editingAd.id ? { ...ad, ...formData } : ad
        )
      )
    } else {
      const newAd: Advertisement = {
        id: Date.now().toString(),
        title: formData.title || '',
        image: formData.image || '',
        link: formData.link || '',
        category: formData.category || '',
        position: formData.position || 'top',
        impressions: 0,
        clicks: 0,
        revenue: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
      }
      setAds((prev) => [newAd, ...prev])
    }
    setShowForm(false)
    setEditingAd(null)
  }

  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0)
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0)
  const totalRevenue = ads.reduce((sum, ad) => sum + ad.revenue, 0)
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
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            Add Ad
          </button>
        </div>

        {/* Performance Stats */}
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

        {/* Ads Table */}
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
                        <img
                          src={ad.image || "/placeholder.svg"}
                          alt={ad.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <p className="font-medium">{ad.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-muted rounded text-sm">
                        {ad.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm capitalize">
                      {ad.position}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {ad.impressions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {ad.clicks.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      ${ad.revenue.toLocaleString()}
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
                          onClick={() => handleToggleStatus(ad.id)}
                          className="p-2 hover:bg-muted rounded transition text-blue-500 text-sm"
                        >
                          {ad.status === 'active' ? 'Pause' : 'Resume'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingAd(ad)
                            setShowForm(true)
                          }}
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
      </div>

      {/* Delete Confirmation */}
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

      {/* Ad Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-card rounded-lg p-8 max-w-xl w-full max-h-96 overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">
              {editingAd ? 'Edit Ad' : 'Add New Ad'}
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Ad title"
                  defaultValue={editingAd?.title || ''}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="Ad category"
                  defaultValue={editingAd?.category || ''}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Position
                </label>
                <select
                  defaultValue={editingAd?.position || 'top'}
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
                }}
                className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const formData = {
                    title: 'Sample Ad',
                    category: 'Sample',
                    position: 'top' as const,
                  }
                  handleSubmit(formData)
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
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
