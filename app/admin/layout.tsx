import React from "react"
import { AdminSidebar } from '@/components/admin-sidebar'

export const metadata = {
  title: 'Admin Dashboard - StreamFlix',
  description: 'Manage your video streaming platform',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
