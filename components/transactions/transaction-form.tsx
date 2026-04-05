'use client'

import { useState, useEffect } from 'react'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { addTransaction, updateTransactionById } from '@/lib/hooks'
import { useSettingsStore } from '@/lib/store'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CURRENCIES, type Transaction } from '@/lib/types'
import { Loader2 } from 'lucide-react'

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction | null
}

export function TransactionForm({ open, onOpenChange, transaction }: TransactionFormProps) {
  const { currency } = useSettingsStore()
  const currencySymbol = CURRENCIES[currency].symbol

  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: String(transaction.amount),
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
        description: transaction.description || '',
      })
    } else {
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      })
    }
    setErrors({})
    setSubmitError(null)
  }, [transaction, open])

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitError(null)

    const transactionData = {
      amount: Number(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
      description: formData.description,
    }

    try {
      if (transaction) {
        await updateTransactionById(transaction.id, transactionData)
      } else {
        await addTransaction(transactionData)
      }
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to save transaction:', err)
      setSubmitError('Failed to save transaction. Make sure the backend server is running.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {submitError && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {submitError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.type === 'expense' ? 'default' : 'outline'}
                className="flex-1"
                disabled={isSubmitting}
                onClick={() => {
                  setFormData({ ...formData, type: 'expense', category: '' })
                }}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={formData.type === 'income' ? 'default' : 'outline'}
                className="flex-1"
                disabled={isSubmitting}
                onClick={() => {
                  setFormData({ ...formData, type: 'income', category: '' })
                }}
              >
                Income
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({currencySymbol})</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={errors.amount ? 'border-destructive' : ''}
              disabled={isSubmitting}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              disabled={isSubmitting}
            >
              <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={errors.date ? 'border-destructive' : ''}
              disabled={isSubmitting}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="Add a note..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                transaction ? 'Save Changes' : 'Add Transaction'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
