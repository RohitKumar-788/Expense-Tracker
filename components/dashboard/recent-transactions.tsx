'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTransactions } from '@/lib/hooks'
import { useSettingsStore } from '@/lib/store'
import { CURRENCIES } from '@/lib/types'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

export function RecentTransactions() {
  const { transactions, isLoading } = useTransactions()
  const { currency } = useSettingsStore()
  const currencySymbol = CURRENCIES[currency].symbol
  
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  if (isLoading) {
    return <Skeleton className="h-[300px] rounded-xl" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">Recent Transactions</CardTitle>
          <Link
            href="/transactions"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      transaction.type === 'income' ? 'bg-accent/10' : 'bg-destructive/10'
                    )}>
                      {transaction.type === 'income' ? (
                        <ArrowDownLeft className="h-5 w-5 text-accent" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{transaction.description || transaction.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    'text-sm font-semibold tabular-nums',
                    transaction.type === 'income' ? 'text-accent' : 'text-destructive'
                  )}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {currencySymbol}{transaction.amount.toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
