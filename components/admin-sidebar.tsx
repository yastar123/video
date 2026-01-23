'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Film, Users, Megaphone, LogOut, Heart, Image as ImageIcon, Tag, Menu, X } from 'lucide-react'

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Videos', href: '/admin/videos', icon: Film },
    { label: 'Categories', href: '/admin/categories', icon: Tag },
    { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Memberships', href: '/admin/membership', icon: Heart },
  ]

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-primary-foreground rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-card border-r border-border flex flex-col
        transition-transform duration-300 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary">Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Management Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-lg transition"
          >
            <LogOut size={20} />
            <span className="font-medium">Back to Site</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
