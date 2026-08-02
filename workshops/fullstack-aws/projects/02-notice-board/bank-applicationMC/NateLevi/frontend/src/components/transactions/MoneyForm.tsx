import type { FormEventHandler } from 'react'
import { Link } from 'react-router'
import { RiBankCard2Line, RiCheckboxCircleFill } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { paths } from '@/routes/paths'
import type { Account } from '@/types/bank'

const moneyFormCopy = {
  deposit: {
    description: 'Enter the amount you want to add.',
    fieldLabel: 'Deposit amount',
    submitLabel: 'Submit deposit',
    title: 'Deposit money',
  },
  withdraw: {
    description: 'Enter the amount you want to remove.',
    fieldLabel: 'Withdrawal amount',
    submitLabel: 'Submit withdrawal',
    title: 'Withdraw money',
  },
} as const

export type MoneyAction = keyof typeof moneyFormCopy

interface MoneyFormProps {
  accounts: Account[]
  action: MoneyAction
  busy?: boolean
  onSubmit: FormEventHandler<HTMLFormElement>
  onSelectAccount: (accountId: number) => void
  selectedAccount: Account | null
}

function MoneyForm({ accounts, action, busy, onSubmit, onSelectAccount, selectedAccount }: MoneyFormProps) {
  const copy = moneyFormCopy[action]
  const amountId = `${action}-amount`
  const selectedType = selectedAccount
    ? selectedAccount.accountType[0] + selectedAccount.accountType.slice(1).toLowerCase()
    : 'account'
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

  return (
    <Card className="surface-card border-0 p-2">
      <CardHeader>
        <CardTitle>
          <h1 className="font-heading text-3xl">{copy.title}</h1>
        </CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>

      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <CardContent>
          <fieldset className="mb-6">
            <legend className="mb-3 text-sm font-semibold text-foreground">Choose an account</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {accounts.map((account) => {
                const selected = selectedAccount?.accountId === account.accountId
                const label = account.accountType[0] + account.accountType.slice(1).toLowerCase()
                return <button aria-pressed={selected} className={`relative rounded-2xl border p-4 text-left transition-all ${selected ? 'border-emerald-600 bg-emerald-50 shadow-md ring-2 ring-emerald-600/20' : 'border-border bg-white/75 hover:border-emerald-400 hover:bg-emerald-50/50'}`} key={account.accountId} onClick={() => onSelectAccount(account.accountId)} type="button">
                  <div className="flex items-start justify-between gap-2"><RiBankCard2Line className={selected ? 'text-emerald-700' : 'text-muted-foreground'} />{selected && <RiCheckboxCircleFill className="text-emerald-700" />}</div>
                  <p className="mt-3 font-heading font-semibold">{label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Account •••• {String(account.accountId).slice(-4).padStart(4, '0')}</p>
                  <p className="mt-2 text-sm font-semibold">{money.format(account.balance)}</p>
                </button>
              })}
            </div>
          </fieldset>
          {selectedAccount ? <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-100/70 p-4 text-emerald-950"><p className="text-xs font-bold uppercase tracking-wider">{action === 'deposit' ? 'Depositing into' : 'Withdrawing from'}</p><p className="mt-1 font-heading text-lg font-semibold">{selectedType} •••• {String(selectedAccount.accountId).slice(-4).padStart(4, '0')}</p><p className="mt-1 text-sm">Available balance: {money.format(selectedAccount.balance)}</p></div> : null}
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={amountId}>{copy.fieldLabel}</FieldLabel>
              <Input
                id={amountId}
                name="amount"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                required
              />
            </Field>
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <Button className="w-full" disabled={busy || !selectedAccount} size="lg" type="submit">
            {busy ? 'Processing…' : `${copy.submitLabel} to ${selectedType}`}
          </Button>
          <Button
            className="w-full"
            nativeButton={false}
            render={<Link to={paths.account} />}
            size="lg"
            variant="outline"
          >
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default MoneyForm
