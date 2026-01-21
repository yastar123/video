'use client'

import { useEffect, useState } from 'react'
import type { User } from '@/lib/db'
import { Check, X, Clock, Heart } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'

export default function MembershipManagementPage() {
  const [memberships, setMemberships] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchMemberships()
  }, [])

  const fetchMemberships = async () => {
    try {
      const response = await fetch('/api/membership/manage')
      const data = await response.json()
      setMemberships(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Fetch error:', error)
      setMemberships([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      const response = await fetch('/api/membership/manage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      })

      if (response.ok) {
        const updated = await response.json()
        setMemberships((prev) =>
          prev.map((m) => (m.id === updated.id ? updated : m))
        )
        setIsModalOpen(false)
        setEditingUser(null)
      }
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`/api/membership/manage?userId=${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMemberships((prev) => prev.filter((m) => m.id !== userId))
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleApprove = async (userId: string) => {
    try {
      const response = await fetch('/api/membership/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: 'approved' }),
      })

      if (response.ok) {
        const updated = await response.json()
        setMemberships((prev) =>
          prev.map((m) => (m.id === userId ? updated : m))
        )
      }
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const handleReject = async (userId: string) => {
    try {
      const response = await fetch('/api/membership/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: 'none' }),
      })

      if (response.ok) {
        setMemberships((prev) =>
          prev.filter((m) => m.id !== userId)
        )
      }
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  const filteredMemberships = memberships.filter((m) => {
    if (filter === 'pending') return m.membershipStatus === 'pending'
    if (filter === 'approved') return m.membershipStatus === 'approved'
    return true
  })

  return (
    <main className="flex-1">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Membership Management
            </h1>
            <p className="text-muted-foreground">
              Manage user VIP membership requests and approvals
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'approved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {tab === 'all' && 'All'}
              {tab === 'pending' && 'Pending'}
              {tab === 'approved' && 'Approved'}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMemberships.map((member) => (
                <tr key={member.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{member.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{member.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      member.membershipStatus === 'approved' ? 'bg-green-500/20 text-green-700' : 'bg-yellow-500/20 text-yellow-700'
                    }`}>
                      {member.membershipStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditingUser(member); setIsModalOpen(true); }}
                        className="p-1 hover:bg-muted rounded"
                      >Edit</button>
                      <button 
                        onClick={() => handleDeleteUser(member.id)}
                        className="p-1 hover:bg-destructive/20 text-destructive rounded"
                      >Delete</button>
                      {member.membershipStatus === 'pending' && (
                        <button onClick={() => handleApprove(member.id)} className="text-green-600 p-1">Approve</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal (Simple) */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input 
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                  className="w-full p-2 border border-border rounded bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select 
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})}
                  className="w-full p-2 border border-border rounded bg-background"
                >
                  <option value="user">User</option>
                  <option value="userVIP">VIP</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
