export interface User {
  userId: number
  name: string
  email: string
  createdAt: string
}

export interface Account {
  accountId: number
  userId: number
  accountType: 'CHECKING' | 'SAVINGS'
  balance: number
  createdAt: string
}

export interface BankTransaction {
  transactionId: number
  accountId: number
  type: 'DEPOSIT' | 'WITHDRAW'
  amount: number
  date: string
}

export interface MoneyResult {
  accountId: number
  previousBalance: number
  balance: number
  transaction: BankTransaction
}
