import type { Transaction } from '@/types/transaction'

export const sampleTransactions: Transaction[] = [
  {
    id: 5003,
    type: 'Deposit',
    amount: '+$250.00',
    date: 'July 28, 2026',
  },
  {
    id: 5002,
    type: 'Withdraw',
    amount: '-$80.00',
    date: 'July 25, 2026',
  },
  {
    id: 5001,
    type: 'Deposit',
    amount: '+$1,200.00',
    date: 'July 20, 2026',
  },
  {
    id: 5000,
    type: 'Withdraw',
    amount: '-$42.75',
    date: 'July 18, 2026',
  },
]

export const recentTransactions = sampleTransactions.slice(0, 3)
