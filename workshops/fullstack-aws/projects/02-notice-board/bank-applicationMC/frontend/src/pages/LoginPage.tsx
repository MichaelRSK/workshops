import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { RiBankLine, RiFlashlightLine, RiLock2Line, RiPulseLine, RiSparkling2Line } from '@remixicon/react'
import LoginForm from '@/components/auth/LoginForm'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/context/AuthContext'
import { paths } from '@/routes/paths'

function LoginPage() {
  const { login, token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const registered = Boolean((location.state as { registered?: boolean } | null)?.registered)
  if (token) return <Navigate to={paths.account} replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      await login(String(form.get('email')), String(form.get('password')))
      navigate(paths.account)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to log in.')
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.15fr_.85fr]">
      <section className="relative hidden overflow-hidden bg-[#123f35] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
        <div className="relative z-10 flex items-center gap-3"><span className="brand-mark"><RiBankLine aria-hidden="true" /></span><span className="font-heading text-2xl font-bold">Dinero</span></div>
        <div className="relative z-10 mt-10 max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm"><RiFlashlightLine className="size-4" /> Welcome </p>
          <h1 className="max-w-xl font-heading text-5xl font-semibold leading-[1.03] xl:text-6xl">Enter a message in the box and click submit to post to the notice board!/h1>
</div>
      </section>
      <section className="login-form-panel flex items-center justify-center p-6 sm:p-10">
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden"><span className="brand-mark"><RiBankLine aria-hidden="true" /></span><span className="font-heading text-xl font-bold">Notice board</span></div>
          {registered && <Alert className="mb-4 border-emerald-200 bg-emerald-50"><AlertDescription> Enter into the text box to submit! </AlertDescription></Alert>}
          {error && <Alert className="mb-4" variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <LoginForm onSubmit={handleSubmit} />
          {/* <p className="mt-5 text-center text-xs text-muted-foreground">Your session token is kept only for this browser tab.</p> */}
        </div>
      </section>
    </main>
  )
}

export default LoginPage
