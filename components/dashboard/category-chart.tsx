'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Cell, Pie, PieChart } from 'recharts'
import { useTransactions, getExpensesByCategory } from '@/lib/hooks'
import { useSettingsStore } from '@/lib/store'
import { CURRENCIES } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--muted-foreground)',
]

export function CategoryChart() {
  const { transactions, isLoading } = useTransactions()
  const { currency } = useSettingsStore()
  const data = getExpensesByCategory(transactions)
  const currencySymbol = CURRENCIES[currency].symbol
  const total = data.reduce((sum, item) => sum + item.amount, 0)

  const chartConfig = data.reduce((acc, item, index) => {
    acc[item.category] = {
      label: item.category,
      color: COLORS[index % COLORS.length],
    }
    return acc
  }, {} as Record<string, { label: string; color: string }>)

  if (isLoading) {
    return <Skeleton className="h-[350px] rounded-xl" />
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              No expense data available
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="amount"
                nameKey="category"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="stroke-background"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <span>
                        {name}: {currencySymbol}{Number(value).toLocaleString()} ({((Number(value) / total) * 100).toFixed(1)}%)
                      </span>
                    )}
                  />
                }
              />
            </PieChart>
          </ChartContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {data.slice(0, 6).map((item, index) => (
              <div key={item.category} className="flex items-center gap-2 text-sm">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="truncate text-muted-foreground">{item.category}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
