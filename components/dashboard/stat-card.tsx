'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface StatCardProps {
  title: string
  value: number
  prefix?: string
  suffix?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  delay?: number
  className?: string
}

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1000
    const steps = 60
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current += increment
      if (step >= steps) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <span className="tabular-nums">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  )
}

export function StatCard({ title, value, prefix = '', suffix = '', icon, trend, delay = 0, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className={cn(
                'text-2xl font-bold tracking-tight',
                trend === 'up' && 'text-accent',
                trend === 'down' && 'text-destructive'
              )}>
                <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
              </p>
            </div>
            <div className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              trend === 'up' && 'bg-accent/10 text-accent',
              trend === 'down' && 'bg-destructive/10 text-destructive',
              trend === 'neutral' && 'bg-muted text-muted-foreground',
              !trend && 'bg-muted text-muted-foreground'
            )}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
