import { Link } from 'react-router'
import { RiAddLine, RiArrowRightUpLine, RiLock2Line, RiShieldCheckLine, RiSparkling2Line } from '@remixicon/react'
import AccountSummaryCard from '@/components/account/AccountSummaryCard'
import TransactionTable from '@/components/transactions/TransactionTable'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { useBank } from '@/context/BankContext'
import { paths } from '@/routes/paths'

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

function CashFlow() {
  const { transactions } = useBank()
  const deposits = transactions.filter((item) => item.type === 'DEPOSIT').reduce((sum, item) => sum + item.amount, 0)
  const withdrawals = transactions.filter((item) => item.type === 'WITHDRAW').reduce((sum, item) => sum + item.amount, 0)
  const total = deposits + withdrawals
  const percentage = total ? Math.round((deposits / total) * 100) : 0
  return <section className="surface-card rounded-[1.6rem] p-6"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-800">Cash flow</p><h2 className="mt-1 font-heading text-xl font-semibold">Money movement</h2></div><RiArrowRightUpLine className="text-emerald-700" /></div><div className="mt-7 grid grid-cols-[8rem_1fr] items-center gap-5"><div className="relative grid aspect-square place-items-center rounded-full" style={{ background: `conic-gradient(#19705b 0 ${percentage}%, #f09a64 ${percentage}% 100%)` }}><div className="grid size-[5.8rem] place-items-center rounded-full bg-white text-center"><span><b className="block text-xl">{transactions.length}</b><small className="text-muted-foreground">movements</small></span></div></div><dl className="space-y-4 text-sm"><div><dt className="text-muted-foreground">Deposited</dt><dd className="font-semibold text-emerald-700">{money.format(deposits)}</dd></div><div><dt className="text-muted-foreground">Withdrawn</dt><dd className="font-semibold">{money.format(withdrawals)}</dd></div></dl></div></section>
}

function SecurityCard() {
  return <section className="rounded-[1.6rem] bg-[#164e40] p-6 text-white shadow-xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-200">Security center</p><h2 className="mt-1 font-heading text-xl font-semibold">Your session is protected</h2></div><RiShieldCheckLine className="size-7 text-emerald-200" /></div><div className="mt-7 space-y-3 text-sm text-emerald-50/80"><p className="flex items-center gap-2"><RiLock2Line className="size-4" /> JWT identity verified</p><p className="flex items-center gap-2"><RiSparkling2Line className="size-4" /> Account ownership enforced</p></div></section>
}

function AccountDetailsPage() {
  const { user } = useAuth()
  const { accounts, transactions, loading } = useBank()
  const firstName = user?.name.split(' ')[0] || 'there'
  if (loading) return <main className="grid min-h-[70vh] place-items-center"><div className="brand-loader" aria-label="Loading account" /></main>

  return <main className="page-reveal mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-5 py-8 lg:px-8 lg:py-10">
    <header><p className="text-sm font-medium text-emerald-800">Welcome back, {firstName}</p><h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Here’s your financial compass</h1><p className="mt-2 max-w-2xl text-muted-foreground">Review balances, move money, and understand your recent activity at a glance</p></header>
    {accounts.length ? <><AccountSummaryCard /><div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]"><TransactionTable action={{ label: 'See all', to: paths.transactions }} description="The newest account activity appears first" title="Latest activity" transactions={transactions.slice(0, 5)} /><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1"><CashFlow /><SecurityCard /></div></div></> : <section className="surface-card rounded-[2rem] p-8 text-center sm:p-14"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-800"><RiAddLine /></div><h2 className="mt-5 font-heading text-3xl font-semibold">Your first account starts here</h2><p className="mx-auto mt-2 max-w-md text-muted-foreground">Choose checking for everyday spending or savings for the next milestone.</p><Button className="mt-6" nativeButton={false} render={<Link to={paths.createAccount} />} size="lg">Open an account</Button></section>}
  </main>
}

export default AccountDetailsPage
