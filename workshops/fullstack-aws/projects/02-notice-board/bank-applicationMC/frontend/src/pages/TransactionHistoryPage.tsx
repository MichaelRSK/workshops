import TransactionTable from '@/components/transactions/TransactionTable'
import { useBank } from '@/context/BankContext'

function TransactionHistoryPage() {
  const { accounts, transactions } = useBank()
  return <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-5 py-10 lg:px-8"><header><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-800">Combined ledger</p><h1 className="mt-2 font-heading text-4xl font-semibold">Transaction history</h1><p className="mt-2 text-muted-foreground">{accounts.length ? `Activity across all ${accounts.length} of your Dinero account${accounts.length === 1 ? '' : 's'}.` : 'Open an account to start tracking activity.'}</p></header><TransactionTable description="Every deposit and withdrawal across checking and savings, newest first." title="Complete activity" transactions={transactions} /></main>
}

export default TransactionHistoryPage
