import { Outlet } from 'react-router'
import AccountNavigation from '@/components/account/AccountNavigation'
import DineroAssistant from '@/components/assistant/DineroAssistant'
import { BankProvider } from '@/context/BankContext'

function AccountLayout() {
  return (
    <BankProvider>
      <div className="app-shell min-h-screen text-foreground">
        <div className="app-frame"><AccountNavigation /><Outlet /></div>
        <DineroAssistant />
      </div>
    </BankProvider>
  )
}

export default AccountLayout
