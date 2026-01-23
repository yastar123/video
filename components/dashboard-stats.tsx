'use client'

import { videos, users, advertisements } from '@/lib/db'
import type { Category } from '@/lib/db'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Film, Users, TrendingUp, DollarSign } from 'lucide-react'

export function DashboardStats({ categories }: { categories: Category[] }) {
  // Calculate statistics
  const totalVideos = videos.length
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === 'active').length
  const totalRevenue = advertisements.reduce((sum, ad) => sum + ad.revenue, 0)

  // Videos per category
  const videosPerCategory = categories.map((cat) => ({
    name: cat.name,
    count: videos.filter((v) => v.category === cat.name).length,
  }))

  // Ad performance data
  const adPerformance = advertisements
    .filter((ad) => ad.status === 'active')
    .map((ad) => ({
      name: ad.title.substring(0, 10),
      impressions: ad.impressions,
      clicks: ad.clicks,
    }))

  // Colors for pie chart
  const COLORS = [
    '#3b82f6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
  ]

  const statCards = [
    {
      title: 'Total Videos',
      value: totalVideos,
      icon: Film,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: Users,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-purple-500/10 text-purple-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Videos Per Category */}
        <Card>
          <CardHeader>
            <CardTitle>Videos Per Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={videosPerCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={videosPerCategory}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {videosPerCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ad Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Active Ad Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={adPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                }}
              />
              <Legend />
              <Bar dataKey="impressions" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="clicks" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
