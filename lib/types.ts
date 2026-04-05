export interface Transaction {
  id: number
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  description?: string
}

export interface TransactionSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  transactionCount: number
}

export interface FilterParams {
  startDate?: string
  endDate?: string
  category?: string
  type?: 'income' | 'expense'
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY'

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other',
] as const

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Rental',
  'Other',
] as const

export const CURRENCIES: Record<Currency, { symbol: string; name: string }> = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
}
