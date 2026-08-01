import type { Account, BankTransaction, MoneyResult, User } from '@/types/bank'

const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions extends RequestInit {
  token?: string | null
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...requestOptions } = options
  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: {
      ...(requestOptions.body instanceof URLSearchParams ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.'
    try {
      const body = (await response.json()) as { detail?: string }
      if (body.detail) message = body.detail
    } catch {
      // Keep the friendly fallback if the server did not return JSON.
    }
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

function normalizeUser(raw: Record<string, unknown>): User {
  return {
    userId: Number(raw.userId ?? raw.user_id),
    name: String(raw.name ?? ''),
    email: String(raw.email ?? ''),
    createdAt: String(raw.createdAt ?? raw.created_at ?? ''),
  }
}

function normalizeAccount(raw: Record<string, unknown>): Account {
  return {
    accountId: Number(raw.accountId ?? raw.account_id),
    userId: Number(raw.userId ?? raw.user_id),
    accountType: String(raw.accountType ?? raw.account_type).toUpperCase() as Account['accountType'],
    balance: Number(raw.balance ?? 0),
    createdAt: String(raw.createdAt ?? raw.created_at ?? ''),
  }
}

function normalizeTransaction(raw: Record<string, unknown>): BankTransaction {
  return {
    transactionId: Number(raw.transactionId ?? raw.transaction_id),
    accountId: Number(raw.accountId ?? raw.account_id),
    type: String(raw.type ?? raw.transaction_type).toUpperCase() as BankTransaction['type'],
    amount: Number(raw.amount ?? 0),
    date: String(raw.date ?? raw.created_at ?? ''),
  }
}

export const bankApi = {
  async register(name: string, email: string, password: string) {
    const raw = await request<Record<string, unknown>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
    return normalizeUser(raw)
  },

  async login(email: string, password: string) {
    const body = new URLSearchParams({ username: email, password })
    return request<{ access_token: string; token_type: string }>('/auth/token', {
      method: 'POST',
      body,
    })
  },

  async me(token: string) {
    return normalizeUser(await request<Record<string, unknown>>('/auth/me', { token }))
  },

  async accounts(token: string) {
    const rows = await request<Record<string, unknown>[]>('/accounts', { token })
    return rows.map(normalizeAccount)
  },

  async createAccount(token: string, accountType: Account['accountType']) {
    const raw = await request<Record<string, unknown>>(`/accounts?account_type=${accountType}`, {
      method: 'POST',
      token,
    })
    return normalizeAccount(raw)
  },

  async transactions(token: string, accountId: number) {
    const rows = await request<Record<string, unknown>[]>(`/accounts/${accountId}/transactions`, { token })
    return rows.map(normalizeTransaction)
  },

  async moveMoney(token: string, accountId: number, action: 'deposit' | 'withdraw', amount: number) {
    const raw = await request<Omit<MoneyResult, 'transaction'> & { transaction: Record<string, unknown> }>(
      `/accounts/${accountId}/${action}`,
      { method: 'POST', token, body: JSON.stringify({ amount }) },
    )
    return { ...raw, transaction: normalizeTransaction(raw.transaction) }
  },
}
