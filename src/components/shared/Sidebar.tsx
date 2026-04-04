import { Link, useLocation } from 'react-router-dom'
import { useLanguageStore } from '../../stores/languageStore'
import { useAuthStore } from '../../stores/authStore'
import { Avatar } from '../ui/Avatar'
import { t } from '../../utils/i18n'
import {
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  User,
  Search,
  BookOpen,
} from 'lucide-react'

interface SidebarItem {
  label: string
  href: string
  icon: React.ElementType
}

interface SidebarProps {
  variant?: 'coach' | 'player'
}

export function Sidebar({ variant = 'player' }: SidebarProps) {
  const location = useLocation()
  const { language } = useLanguageStore()
  const { user, logout } = useAuthStore()

  const coachItems: SidebarItem[] = [
    { label: t('nav.dashboard', language), href: '/coach/dashboard', icon: LayoutDashboard },
    { label: t('nav.bookings', language), href: '/coach/bookings', icon: Calendar },
    { label: t('nav.profile', language), href: '/coach/profile', icon: User },
    { label: t('nav.settings', language), href: '/coach/settings', icon: Settings },
  ]

  const playerItems: SidebarItem[] = [
    { label: t('nav.search', language), href: '/search', icon: Search },
    { label: t('nav.bookings', language), href: '/player/bookings', icon: BookOpen },
    { label: t('nav.profile', language), href: '/player/settings', icon: User },
  ]

  const items = variant === 'coach' ? coachItems : playerItems
  const initials = user
    ? `${user.name?.[0] ?? ''}${user.surname?.[0] ?? user.name?.[1] ?? ''}`.toUpperCase()
    : ''

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-surface-container bg-surface-container-lowest pt-6 md:flex">
      <div className="px-6 pb-6">
        <Link to="/" className="text-2xl font-black tracking-tighter text-primary font-headline">
          PadelHub
        </Link>
      </div>

      {user && (
        <div className="mx-4 mb-6 flex items-center gap-3 rounded-2xl bg-surface-container-low p-4">
          <Avatar initials={initials} size="lg" />
          <div className="min-w-0">
            <p className="truncate font-headline font-bold text-on-surface">
              {user.name} {user.surname ?? ''}
            </p>
            <p className="truncate text-xs text-on-surface-variant">{user.email}</p>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1 px-4">
        {items.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                isActive
                  ? 'kinetic-gradient text-on-primary shadow-teal-ambient'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-surface-container p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-on-surface-variant hover:bg-error/5 hover:text-error transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>{t('nav.logout', language)}</span>
        </button>
      </div>
    </aside>
  )
}
