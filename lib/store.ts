'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency, FilterParams } from './types'

// Store only handles local settings (currency, filters) 
// Transaction data is managed by SWR hooks (lib/hooks.ts)
interface SettingsStore {
  currency: Currency
  filters: FilterParams
  
  // Actions
  setCurrency: (currency: Currency) => void
  setFilters: (filters: FilterParams) => void
  clearFilters: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      currency: 'USD',
      filters: {},
      
      setCurrency: (currency) => {
        set({ currency })
      },
      
      setFilters: (filters) => {
        set({ filters })
      },
      
      clearFilters: () => {
        set({ filters: {} })
      },
    }),
    {
      name: 'expense-tracker-settings',
    }
  )
)
