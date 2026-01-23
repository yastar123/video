'use client'

import { useEffect, useState } from 'react'
import type { Category } from '@/lib/db'
import { Plus, Edit, Trash2, Tag } from 'lucide-react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    icon: ''
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const method = editingCategory ? 'PUT' : 'POST'
      const res = await fetch('/api/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory ? { ...formData, id: editingCategory.id } : formData)
      })
      if (res.ok) {
        fetchCategories()
        setShowForm(false)
        setEditingCategory(null)
        setFormData({ name: '', icon: '' })
      }
    } catch (err) {
      console.error('Failed to save category:', err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete category:', err)
    }
    setDeleteConfirm(null)
  }

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Categories Management</h1>
            <p className="text-muted-foreground mt-2">Manage video categories and genres</p>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null)
              setFormData({ name: '', icon: '' })
              setShowForm(true)
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition flex items-center gap-2"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-muted border-t-primary rounded-full" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground">No categories found.</p>
          </div>
        ) : (
          <div className="bg-card rounded-lg overflow-hidden border border-border">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Icon</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-border hover:bg-muted/50 transition">
                    <td className="px-6 py-4 text-2xl">{category.icon}</td>
                    <td className="px-6 py-4 font-medium">{category.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCategory(category)
                            setFormData({ name: category.name, icon: category.icon || '' })
                            setShowForm(true)
                          }}
                          className="p-2 hover:bg-muted rounded transition text-blue-500"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(category.id)}
                          className="p-2 hover:bg-destructive/10 rounded transition text-destructive"
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
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Icon (Emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={e => setFormData({...formData, icon: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg bg-background"
                  placeholder="e.g. 🎭"
                />
              </div>
              <div className="flex gap-3 justify-end mt-8">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={handleSubmit} disabled={!formData.name} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Delete Category?</h3>
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
