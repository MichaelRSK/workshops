/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { bankApi } from '@/api/client'
import { useAuth } from '@/context/AuthContext'
import type { Account, BankTransaction } from '@/types/bank'

interface BankContextValue {
  accounts: Account[]
  selectedAccount: Account | null
  transactions: BankTransaction[]
  loading: boolean
  selectAccount: (id: number) => void
  refresh: () => Promise<void>
  createAccount: (type: Account['accountType']) => Promise<void>
  moveMoney: (action: 'deposit' | 'withdraw', amount: number) => Promise<void>
}

const BankContext = createContext<BankContextValue | null>(null)

export function BankProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<BankTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const selectedAccount = accounts.find((account) => account.accountId === selectedId) ?? accounts[0] ?? null

  const refresh = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const nextAccounts = await bankApi.accounts(token)
      setAccounts(nextAccounts)
      const activeId = nextAccounts.some((account) => account.accountId === selectedId)
        ? selectedId
        : nextAccounts[0]?.accountId ?? null
      setSelectedId(activeId)
      const accountTransactions = await Promise.all(
        nextAccounts.map((account) => bankApi.transactions(token, account.accountId)),
      )
      setTransactions(
        accountTransactions.flat().sort((left, right) => {
          const dateDifference = new Date(right.date).getTime() - new Date(left.date).getTime()
          return dateDifference || right.transactionId - left.transactionId
        }),
      )
    } finally {
      setLoading(false)
    }
  }, [token, selectedId])

  useEffect(() => {
    // The provider intentionally refreshes its server-backed state when auth changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  const selectAccount = useCallback((id: number) => {
    setSelectedId(id)
  }, [])

  const createAccount = useCallback(async (type: Account['accountType']) => {
    if (!token) return
    const account = await bankApi.createAccount(token, type)
    setAccounts((current) => [
      ...current.filter((item) => item.accountId !== account.accountId),
      account,
    ])
    setSelectedId(account.accountId)
  }, [token])

  const moveMoney = useCallback(async (action: 'deposit' | 'withdraw', amount: number) => {
    if (!token || !selectedAccount) return
    await bankApi.moveMoney(token, selectedAccount.accountId, action, amount)
    await refresh()
  }, [token, selectedAccount, refresh])

  const value = useMemo(() => ({ accounts, selectedAccount, transactions, loading, selectAccount, refresh, createAccount, moveMoney }), [accounts, selectedAccount, transactions, loading, selectAccount, refresh, createAccount, moveMoney])
  return <BankContext.Provider value={value}>{children}</BankContext.Provider>
}

export function useBank() {
  const context = useContext(BankContext)
  if (!context) throw new Error('useBank must be used inside BankProvider')
  return context
}
