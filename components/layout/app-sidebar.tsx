'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard,
  Receipt,
  Settings,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface AppSidebarProps {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

export function AppSidebar({ collapsed = false, onCollapsedChange }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar',
        'hidden lg:flex'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex h-16 items-center border-b px-4',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-semibold"
            >
              ExpenseTracker
            </motion.span>
          )}
        </Link>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onCollapsedChange?.(!collapsed)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Collapse Button */}
      {collapsed && (
        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="icon"
            className="w-full"
            onClick={() => onCollapsedChange?.(!collapsed)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </motion.aside>
  )
}
