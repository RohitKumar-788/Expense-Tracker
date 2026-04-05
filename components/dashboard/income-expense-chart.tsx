'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { useTransactions, getMonthlyData } from '@/lib/hooks'
import { useSettingsStore } from '@/lib/store'
import { CURRENCIES } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

const chartConfig = {
  income: {
    label: 'Income',
    color: 'var(--chart-1)',
  },
  expense: {
    label: 'Expense',
    color: 'var(--chart-2)',
  },
}

export function IncomeExpenseChart() {
  const { transactions, isLoading } = useTransactions()
  const { currency } = useSettingsStore()
  const data = getMonthlyData(transactions)
  const currencySymbol = CURRENCIES[currency].symbol

  if (isLoading) {
    return <Skeleton className="h-[350px] rounded-xl" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${currencySymbol}${(value / 1000).toFixed(0)}k`}
                className="text-muted-foreground"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <span>
                        {name}: {currencySymbol}{Number(value).toLocaleString()}
                      </span>
                    )}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#incomeGradient)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="var(--chart-2)"
                strokeWidth={2}
                fill="url(#expenseGradient)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
