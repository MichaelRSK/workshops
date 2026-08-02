import { Link } from 'react-router'
import { RiAddLine, RiArrowDownLine, RiArrowUpLine, RiBankCard2Line } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import { useBank } from '@/context/BankContext'
import { paths } from '@/routes/paths'

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

function AccountSummaryCard() {
  const { accounts, selectedAccount, selectAccount } = useBank()
  if (!selectedAccount) return null
  return <section aria-label="Your accounts" className="space-y-4">
    <div className="flex items-end justify-between"><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-800">Your accounts</p><Button nativeButton={false} render={<Link to={paths.createAccount} />} size="sm" variant="outline"><RiAddLine /> Add account</Button></div>
    <div className="grid gap-4 md:grid-cols-2">{accounts.map((account, index) => {
      const active = account.accountId === selectedAccount.accountId
      return <button aria-pressed={active} className={`group relative min-h-52 overflow-hidden rounded-[1.7rem] p-6 text-left text-white shadow-xl transition hover:-translate-y-1 ${index % 2 ? 'bg-[linear-gradient(145deg,#6239bd,#8f56e9)]' : 'bg-[linear-gradient(145deg,#e7673f,#f49b4a)]'} ${active ? 'ring-4 ring-white ring-offset-2 ring-offset-emerald-100' : 'opacity-75 hover:opacity-100'}`} key={account.accountId} onClick={() => selectAccount(account.accountId)} type="button">
        <span className="absolute -right-12 -top-16 size-52 rounded-[42%] bg-white/10" /><div className="relative flex h-full flex-col justify-between"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-white/70">Dinero {account.accountType.toLowerCase()}</p><p className="mt-2 text-sm">Available balance</p></div><RiBankCard2Line className="size-7" /></div><div><p className="font-heading text-3xl font-semibold">{money.format(account.balance)}</p><div className="mt-5 flex items-center justify-between text-sm"><span className="tracking-[.25em]">•••• {String(account.accountId).slice(-4).padStart(4, '0')}</span><span className="font-bold italic">DI</span></div></div></div>
      </button>})}</div>
    <div className="flex flex-wrap gap-3"><Button nativeButton={false} render={<Link to={paths.deposit} />} size="lg"><RiArrowDownLine /> Make a deposit</Button><Button nativeButton={false} render={<Link to={paths.withdraw} />} size="lg" variant="outline"><RiArrowUpLine /> Withdraw funds</Button></div>
  </section>
}

export default AccountSummaryCard
