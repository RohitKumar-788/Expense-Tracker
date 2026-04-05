'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useSettingsStore } from '@/lib/store'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/types'
import { Filter, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function TransactionsFilters() {
  const { filters, setFilters, clearFilters } = useSettingsStore()
  
  const allCategories = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])]
  
  const hasFilters = filters.type || filters.category || filters.startDate || filters.endDate
  const filterCount = [filters.type, filters.category, filters.startDate || filters.endDate].filter(Boolean).length

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2"
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {filterCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {filterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-auto p-1 text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={filters.type || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value === 'all' ? undefined : value as 'income' | 'expense' })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={filters.category || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value === 'all' ? undefined : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {allCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value || undefined })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value || undefined })
                  }
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {hasFilters && (
        <div className="flex flex-wrap gap-1">
          {filters.type && (
            <Badge variant="secondary" className="gap-1">
              {filters.type}
              <button
                onClick={() => setFilters({ ...filters, type: undefined })}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              {filters.category}
              <button
                onClick={() => setFilters({ ...filters, category: undefined })}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {(filters.startDate || filters.endDate) && (
            <Badge variant="secondary" className="gap-1">
              {filters.startDate || '...'} - {filters.endDate || '...'}
              <button
                onClick={() => setFilters({ ...filters, startDate: undefined, endDate: undefined })}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </motion.div>
  )
}
