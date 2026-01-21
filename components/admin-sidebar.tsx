'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Film, Users, Megaphone, LogOut, Heart } from 'lucide-react'

export function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Videos', href: '/admin/videos', icon: Film },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Advertisements', href: '/admin/ads', icon: Megaphone },
    { label: 'Memberships', href: '/admin/membership', icon: Heart },
  ]

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">Management Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
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
  )
}
