import type { Transaction, TransactionSummary, FilterParams } from './types'

// API base URL - update this when connecting to your Spring Boot backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Type conversion for API responses
interface ApiTransaction {
  id: number
  amount: number
  type: 'INCOME' | 'EXPENSE'
  category: string
  date: string
  description?: string
}

function convertApiTransaction(apiTransaction: ApiTransaction): Transaction {
  return {
    ...apiTransaction,
    type: apiTransaction.type.toLowerCase() as 'income' | 'expense',
  }
}

function convertToApiTransaction(transaction: Partial<Transaction>): Partial<ApiTransaction> {
  return {
    ...transaction,
    type: transaction.type?.toUpperCase() as 'INCOME' | 'EXPENSE',
  }
}

// API functions
export async function fetchTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE_URL}/transactions`)
  if (!response.ok) {
    throw new Error('Failed to fetch transactions')
  }
  const data: ApiTransaction[] = await response.json()
  return data.map(convertApiTransaction)
}

export async function fetchTransactionById(id: number): Promise<Transaction> {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch transaction')
  }
  const data: ApiTransaction = await response.json()
  return convertApiTransaction(data)
}

export async function createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(convertToApiTransaction(transaction)),
  })
  if (!response.ok) {
    throw new Error('Failed to create transaction')
  }
  const data: ApiTransaction = await response.json()
  return convertApiTransaction(data)
}

export async function updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction> {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(convertToApiTransaction(transaction)),
  })
  if (!response.ok) {
    throw new Error('Failed to update transaction')
  }
  const data: ApiTransaction = await response.json()
  return convertApiTransaction(data)
}

export async function deleteTransaction(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete transaction')
  }
}

export async function fetchSummary(): Promise<TransactionSummary> {
  const response = await fetch(`${API_BASE_URL}/transactions/summary`)
  if (!response.ok) {
    throw new Error('Failed to fetch summary')
  }
  return response.json()
}

export async function filterTransactions(filters: FilterParams): Promise<Transaction[]> {
  const params = new URLSearchParams()
  
  if (filters.type) params.append('type', filters.type.toUpperCase())
  if (filters.category) params.append('category', filters.category)
  if (filters.startDate) params.append('startDate', filters.startDate)
  if (filters.endDate) params.append('endDate', filters.endDate)
  
  const response = await fetch(`${API_BASE_URL}/transactions/filter?${params}`)
  if (!response.ok) {
    throw new Error('Failed to filter transactions')
  }
  const data: ApiTransaction[] = await response.json()
  return data.map(convertApiTransaction)
}
