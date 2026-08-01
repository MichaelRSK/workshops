import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import MoneyForm from '@/components/transactions/MoneyForm'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useBank } from '@/context/BankContext'
import { paths } from '@/routes/paths'

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

function DepositPage() {
  const { accounts, selectedAccount, selectAccount, moveMoney } = useBank()
  const navigate = useNavigate(); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  async function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(''); setBusy(true); const form = new FormData(event.currentTarget)
    try {
      const amount = Number(form.get('amount'))
      const accountLabel = selectedAccount
        ? `${selectedAccount.accountType[0] + selectedAccount.accountType.slice(1).toLowerCase()} •••• ${String(selectedAccount.accountId).slice(-4).padStart(4, '0')}`
        : 'Selected account'
      await moveMoney('deposit', amount)
      toast.success(`Deposit of ${money.format(amount)} successful`, {
        description: `${accountLabel} has been updated`,
      })
      navigate(paths.account)
    }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Deposit failed.') } finally { setBusy(false) }
  }
  return <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-12">{error && <Alert className="mb-4" variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}<MoneyForm accounts={accounts} action="deposit" busy={busy} onSelectAccount={selectAccount} onSubmit={handleSubmit} selectedAccount={selectedAccount} /></main>
}
export default DepositPage
