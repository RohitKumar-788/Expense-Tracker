'use client'

import useSWR, { mutate } from 'swr'
import type { Transaction, TransactionSummary, FilterParams } from './types'
import * as api from './api'

// SWR cache keys
export const TRANSACTIONS_KEY = '/api/transactions'
export const SUMMARY_KEY = '/api/transactions/summary'

// Generic fetcher
const fetcher = async () => api.fetchTransactions()
const summaryFetcher = async () => api.fetchSummary()

// Transaction hooks
export function useTransactions() {
  const { data, error, isLoading, isValidating } = useSWR<Transaction[]>(
    TRANSACTIONS_KEY,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  return {
    transactions: data ?? [],
    isLoading,
    isValidating,
    error,
  }
}

export function useSummary() {
  const { data, error, isLoading } = useSWR<TransactionSummary>(
    SUMMARY_KEY,
    summaryFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  return {
    summary: data ?? { totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: 0 },
    isLoading,
    error,
  }
}

export function useFilteredTransactions(filters: FilterParams) {
  const hasFilters = filters.type || filters.category || filters.startDate || filters.endDate
  
  const { data, error, isLoading } = useSWR<Transaction[]>(
    hasFilters ? [TRANSACTIONS_KEY, 'filter', JSON.stringify(filters)] : null,
    () => api.filterTransactions(filters),
    {
      revalidateOnFocus: false,
    }
  )

  return {
    transactions: data ?? [],
    isLoading,
    error,
  }
}

// Mutation helpers
export async function addTransaction(transaction: Omit<Transaction, 'id'>) {
  const newTransaction = await api.createTransaction(transaction)
  
  // Optimistically update the cache
  mutate(TRANSACTIONS_KEY)
  mutate(SUMMARY_KEY)
  
  return newTransaction
}

export async function updateTransactionById(id: number, data: Partial<Transaction>) {
  const updated = await api.updateTransaction(id, data)
  
  // Revalidate caches
  mutate(TRANSACTIONS_KEY)
  mutate(SUMMARY_KEY)
  
  return updated
}

export async function deleteTransactionById(id: number) {
  await api.deleteTransaction(id)
  
  // Revalidate caches
  mutate(TRANSACTIONS_KEY)
  mutate(SUMMARY_KEY)
}

// Helper functions for calculating derived data from transactions
export function getTransactionSummary(transactions: Transaction[]): TransactionSummary {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionCount: transactions.length,
  }
}

export function getMonthlyData(transactions: Transaction[]) {
  const monthlyData: Record<string, { income: number; expense: number }> = {}
  
  transactions.forEach(t => {
    const date = new Date(t.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 }
    }
    
    if (t.type === 'income') {
      monthlyData[monthKey].income += t.amount
    } else {
      monthlyData[monthKey].expense += t.amount
    }
  })
  
  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      income: data.income,
      expense: data.expense,
    }))
}

export function getExpensesByCategory(transactions: Transaction[]) {
  const categoryData: Record<string, number> = {}
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryData[t.category] = (categoryData[t.category] || 0) + t.amount
    })
  
  return Object.entries(categoryData).map(([category, amount]) => ({
    category,
    amount,
  }))
}
