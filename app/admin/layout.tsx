'use client'

import React from "react"
import { AdminSidebar } from '@/components/admin-sidebar'
import { AdminAuthGuard } from '@/components/admin-auth-guard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthGuard>
      <div className="flex h-screen bg-background overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </AdminAuthGuard>
  )
}
