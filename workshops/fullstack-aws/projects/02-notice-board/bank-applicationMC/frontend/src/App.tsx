import { Navigate, Outlet, Route, Routes } from 'react-router'
import { useAuth } from '@/context/AuthContext'
import AccountLayout from '@/layouts/AccountLayout'
import AccountDetailsPage from '@/pages/AccountDetailsPage'
import CreateAccountPage from '@/pages/CreateAccountPage'
import DepositPage from '@/pages/DepositPage'
import LoginPage from '@/pages/LoginPage'
import LearnPage from '@/pages/LearnPage'
import TransactionHistoryPage from '@/pages/TransactionHistoryPage'
import WithdrawPage from '@/pages/WithdrawPage'
import { paths } from '@/routes/paths'
import { Toaster } from '@/components/ui/sonner'

function ProtectedRoute() {
  const { token, loading } = useAuth()
  if (loading) return <div className="grid min-h-screen place-items-center"><div className="brand-loader" aria-label="Loading" /></div>
  return token ? <Outlet /> : <Navigate to={paths.login} replace />
}

function App() {
  return (
    <><Routes>
      <Route path={paths.login} element={<LoginPage />} />
      <Route path={paths.register} element={<CreateAccountPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path={paths.account} element={<AccountLayout />}>
          <Route index element={<AccountDetailsPage />} />
          <Route path="new" element={<CreateAccountPage />} />
          <Route path="deposit" element={<DepositPage />} />
          <Route path="withdraw" element={<WithdrawPage />} />
          <Route path="transactions" element={<TransactionHistoryPage />} />
          <Route path="learn" element={<LearnPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={paths.login} replace />} />
    </Routes><Toaster richColors position="top-right" /></>
  )
}

export default App
