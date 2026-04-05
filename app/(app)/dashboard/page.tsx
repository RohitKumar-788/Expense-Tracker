'use client'

import { Wallet, TrendingUp, TrendingDown, Receipt } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { IncomeExpenseChart } from '@/components/dashboard/income-expense-chart'
import { CategoryChart } from '@/components/dashboard/category-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { useTransactions, getTransactionSummary } from '@/lib/hooks'
import { useSettingsStore } from '@/lib/store'
import { CURRENCIES } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your financial overview at a glance</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[350px] rounded-xl" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
      <Skeleton className="h-[300px] rounded-xl" />
    </div>
  )
}

export default function DashboardPage() {
  const { transactions, isLoading, error } = useTransactions()
  const { currency } = useSettingsStore()
  const summary = getTransactionSummary(transactions)
  const currencySymbol = CURRENCIES[currency].symbol

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <TrendingDown className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold">Failed to load dashboard</h3>
        <p className="text-sm text-muted-foreground">
          Make sure your backend server is running at the configured API URL.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your financial overview at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={summary.balance}
          prefix={currencySymbol}
          icon={<Wallet className="h-5 w-5" />}
          trend={summary.balance >= 0 ? 'up' : 'down'}
          delay={0}
        />
        <StatCard
          title="Total Income"
          value={summary.totalIncome}
          prefix={currencySymbol}
          icon={<TrendingUp className="h-5 w-5" />}
          trend="up"
          delay={0.1}
        />
        <StatCard
          title="Total Expenses"
          value={summary.totalExpense}
          prefix={currencySymbol}
          icon={<TrendingDown className="h-5 w-5" />}
          trend="down"
          delay={0.2}
        />
        <StatCard
          title="Transactions"
          value={summary.transactionCount}
          icon={<Receipt className="h-5 w-5" />}
          trend="neutral"
          delay={0.3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <IncomeExpenseChart />
        <CategoryChart />
      </div>

      <RecentTransactions />
    </div>
  )
}
