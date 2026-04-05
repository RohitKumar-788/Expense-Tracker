'use client'

import { useState } from 'react'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { AppHeader } from '@/components/layout/app-header'
import { cn } from '@/lib/utils'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <AppHeader sidebarCollapsed={sidebarCollapsed} />
      <main
        className={cn(
          'min-h-screen pt-16 transition-all duration-200',
          'lg:pl-60',
          sidebarCollapsed && 'lg:pl-[72px]'
        )}
      >
        <div className="container mx-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
