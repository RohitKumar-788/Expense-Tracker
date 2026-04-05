'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { TransactionsTable } from '@/components/transactions/transactions-table'
import { TransactionsFilters } from '@/components/transactions/transactions-filters'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { Plus } from 'lucide-react'
import type { Transaction } from '@/lib/types'

export default function TransactionsPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null)

  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction)
    setFormOpen(true)
  }

  const handleFormClose = (open: boolean) => {
    setFormOpen(open)
    if (!open) {
      setEditTransaction(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Manage your income and expenses</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button onClick={() => setFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        </motion.div>
      </div>

      <TransactionsFilters />

      <TransactionsTable onEdit={handleEdit} />

      <TransactionForm
        open={formOpen}
        onOpenChange={handleFormClose}
        transaction={editTransaction}
      />
    </div>
  )
}
