'use client'

import { useEffect, useState } from 'react'
import type { User } from '@/lib/db'
import { Mail, UserCheck, UserX, Shield, User as UserIcon } from 'lucide-react'

export default function UsersPage() {
  const [usersList, setUsersList] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsersList(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err)
        setUsersList([])
        setLoading(false)
      })
  }, [])

  const filteredUsers = usersList.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggleStatus = async (id: string) => {
    const user = usersList.find(u => u.id === id)
    if (!user) return
    
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })
      
      if (res.ok) {
        setUsersList((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, status: newStatus } : u
          )
        )
      }
    } catch (err) {
      console.error('Failed to toggle status:', err)
      setUsersList((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, status: newStatus } : u
        )
      )
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setUsersList((prev) => prev.filter((u) => u.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete user:', err)
      setUsersList((prev) => prev.filter((u) => u.id !== id))
    }
    setDeleteConfirm(null)
  }

  const activeUsers = usersList.filter((u) => u.status === 'active').length
  const adminUsers = usersList.filter((u) => u.role === 'admin').length

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all users on your platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-3xl font-bold">{usersList.length}</p>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-600 rounded-lg">
                <UserIcon size={24} />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Active Users
                </p>
                <p className="text-3xl font-bold">{activeUsers}</p>
              </div>
              <div className="p-3 bg-green-500/10 text-green-600 rounded-lg">
                <UserCheck size={24} />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Admins</p>
                <p className="text-3xl font-bold">{adminUsers}</p>
              </div>
              <div className="p-3 bg-purple-500/10 text-purple-600 rounded-lg">
                <Shield size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by email or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-muted border-t-primary rounded-full" />
          </div>
        ) : (
          <div className="bg-card rounded-lg overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Join Date
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
                  {filteredUsers.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={`border-b border-border hover:bg-muted/50 transition ${
                        idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/20'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium">{user.username || 'Anonymous'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-muted-foreground" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            user.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-700'
                              : user.role === 'userVIP'
                              ? 'bg-yellow-500/20 text-yellow-700'
                              : 'bg-blue-500/20 text-blue-700'
                          }`}
                        >
                          {user.role === 'admin' ? 'Admin' : user.role === 'userVIP' ? 'VIP' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            user.status === 'active'
                              ? 'bg-green-500/20 text-green-700'
                              : 'bg-red-500/20 text-red-700'
                          }`}
                        >
                          {user.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className="p-2 hover:bg-muted rounded transition"
                            title="Toggle status"
                          >
                            {user.status === 'active' ? (
                              <UserCheck size={18} className="text-green-600" />
                            ) : (
                              <UserX size={18} className="text-red-600" />
                            )}
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => setDeleteConfirm(user.id)}
                              className="p-2 hover:bg-destructive/20 rounded transition text-destructive text-sm"
                            >
                              Delete
                            </button>
                          )}
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
            <h3 className="text-lg font-bold mb-2">Delete User?</h3>
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
                onClick={() => handleDeleteUser(deleteConfirm)}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
