import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { RiAddCircleLine, RiArrowLeftLine } from '@remixicon/react'
import { toast } from 'sonner'
import CreateAccountForm from '@/components/auth/CreateAccountForm'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { useBank } from '@/context/BankContext'
import { paths } from '@/routes/paths'
import type { Account } from '@/types/bank'

function NewBankAccount() {
  const { accounts, createAccount } = useBank()
  const navigate = useNavigate()
  const [type, setType] = useState<Account['accountType']>('CHECKING')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await createAccount(type)
      toast.success(`${type[0] + type.slice(1).toLowerCase()} account opened`)
      navigate(paths.account, { replace: true })
    }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not create account.') }
    finally { setBusy(false) }
  }

  return <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-12">
    <Button className="mb-5 self-start" nativeButton={false} render={<a href={paths.account} />} variant="ghost"><RiArrowLeftLine /> Overview</Button>
    {error && <Alert className="mb-4" variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
    <Card className="surface-card border-0 p-2"><CardHeader><div className="mb-3 grid size-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-800"><RiAddCircleLine /></div><CardTitle className="font-heading text-3xl">Open a bank account</CardTitle><CardDescription>Step 1: select checking or savings. Step 2: press the green button below.</CardDescription></CardHeader>
      <CardContent><form onSubmit={submit} className="space-y-5"><div className="grid gap-3 sm:grid-cols-2">{(['CHECKING', 'SAVINGS'] as const).map((option) => { const unavailable = accounts.some((account) => account.accountType === option); return <button aria-pressed={type === option} className={`rounded-2xl border p-5 text-left transition ${type === option ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/15' : 'bg-white'} disabled:cursor-not-allowed disabled:opacity-40`} disabled={unavailable || busy} key={option} onClick={() => setType(option)} type="button"><span className="font-heading text-lg font-semibold">{option[0] + option.slice(1).toLowerCase()}</span><span className="mt-1 block text-sm text-muted-foreground">{unavailable ? 'Already opened — view it on Overview' : option === 'CHECKING' ? 'For everyday money movement' : 'For money you are building'}</span></button> })}</div><Button className="w-full" disabled={busy || accounts.some((account) => account.accountType === type)} size="lg" type="submit">{busy ? 'Opening account…' : `Open ${type.toLowerCase()} and view dashboard`}</Button></form></CardContent>
    </Card>
  </main>
}

function RegisterProfile() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('')
    const form = new FormData(event.currentTarget)
    try {
      await register(String(form.get('name')), String(form.get('email')), String(form.get('password')))
      navigate(paths.login, { replace: true, state: { registered: true } })
    }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not create profile.') }
  }
  return <main className="flex min-h-screen items-center justify-center p-6"><div className="w-full max-w-md">{error && <Alert className="mb-4" variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}<CreateAccountForm onSubmit={handleSubmit} /></div></main>
}

function CreateAccountPage() {
  const { token } = useAuth()
  return token ? <NewBankAccount /> : <RegisterProfile />
}

export default CreateAccountPage
