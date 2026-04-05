'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useTransactions, useFilteredTransactions, deleteTransactionById } from '@/lib/hooks'
import { useSettingsStore } from '@/lib/store'
import { CURRENCIES, type Transaction } from '@/lib/types'
import { MoreHorizontal, Pencil, Trash2, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TransactionsTableProps {
  onEdit: (transaction: Transaction) => void
}

export function TransactionsTable({ onEdit }: TransactionsTableProps) {
  const { filters, currency } = useSettingsStore()
  const currencySymbol = CURRENCIES[currency].symbol
  
  // Use filtered transactions if filters are active, otherwise use all transactions
  const hasFilters = filters.type || filters.category || filters.startDate || filters.endDate
  const { transactions: allTransactions, isLoading: allLoading, error: allError } = useTransactions()
  const { transactions: filteredTransactions, isLoading: filterLoading } = useFilteredTransactions(filters)
  
  const transactions = hasFilters ? filteredTransactions : allTransactions
  const isLoading = hasFilters ? filterLoading : allLoading
  const error = allError
  
  // Sort by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (deleteId !== null) {
      setIsDeleting(true)
      try {
        await deleteTransactionById(deleteId)
      } catch (err) {
        console.error('Failed to delete transaction:', err)
      } finally {
        setIsDeleting(false)
        setDeleteId(null)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <ArrowUpRight className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold">Failed to load transactions</h3>
        <p className="text-sm text-muted-foreground">
          Make sure your backend server is running.
        </p>
      </div>
    )
  }

  if (sortedTransactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ArrowUpRight className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No transactions found</h3>
        <p className="text-sm text-muted-foreground">
          Add your first transaction or adjust your filters
        </p>
      </motion.div>
    )
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {sortedTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="group border-b transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg',
                        transaction.type === 'income' ? 'bg-accent/10' : 'bg-destructive/10'
                      )}>
                        {transaction.type === 'income' ? (
                          <ArrowDownLeft className="h-4 w-4 text-accent" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <span>{transaction.description || transaction.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={transaction.type === 'income' ? 'default' : 'destructive'}
                      className={cn(
                        'capitalize',
                        transaction.type === 'income' && 'bg-accent hover:bg-accent/80'
                      )}
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={cn(
                    'text-right font-semibold tabular-nums',
                    transaction.type === 'income' ? 'text-accent' : 'text-destructive'
                  )}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {currencySymbol}{transaction.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(transaction)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteId(transaction.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
