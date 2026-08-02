export type TransactionType = 'Deposit' | 'Withdraw'

export interface Transaction {
  id: number
  type: TransactionType
  amount: string
  date: string
}
