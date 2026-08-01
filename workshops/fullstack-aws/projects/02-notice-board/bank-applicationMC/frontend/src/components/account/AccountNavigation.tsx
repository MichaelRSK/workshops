import { NavLink, useNavigate } from 'react-router'
import { RiBankLine, RiBookOpenLine, RiDashboardLine, RiExchangeDollarLine, RiLogoutBoxRLine, RiShieldCheckLine } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { paths } from '@/routes/paths'

function AccountNavigation() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate(paths.login)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-950/8 bg-[#edf7f3]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <NavLink className="flex items-center gap-3" to={paths.account} aria-label="Dinero Bank dashboard">
          <span className="brand-mark"><RiBankLine aria-hidden="true" /></span>
          <span className="hidden font-heading text-xl font-bold tracking-tight text-[#173f36] sm:inline">Dinero</span>
        </NavLink>
        <nav aria-label="Account navigation">
          <ul className="flex items-center gap-1">
            <li><NavLink className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} end to={paths.account}><RiDashboardLine /><span className="hidden sm:inline">Overview</span></NavLink></li>
            <li><NavLink className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} to={paths.transactions}><RiExchangeDollarLine /><span className="hidden sm:inline">Activity</span></NavLink></li>
            <li><NavLink className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} to={paths.learn}><RiBookOpenLine /><span className="hidden sm:inline">Learn</span></NavLink></li>
            <li className="ml-1 hidden items-center gap-2 rounded-full border border-emerald-900/10 bg-white/70 px-3 py-2 md:flex"><RiShieldCheckLine className="size-4 text-emerald-700" /><span className="max-w-28 truncate text-xs font-semibold text-emerald-950">{user?.name}</span></li>
            <li><Button aria-label="Logout" onClick={handleLogout} variant="ghost"><RiLogoutBoxRLine /> <span className="hidden sm:inline">Logout</span></Button></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default AccountNavigation
