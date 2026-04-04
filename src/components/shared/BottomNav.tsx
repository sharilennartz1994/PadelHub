import { Link, useLocation } from 'react-router-dom'
import { Search, Calendar, User } from 'lucide-react'
import { useLanguageStore } from '../../stores/languageStore'
import { t } from '../../utils/i18n'

export function BottomNav() {
  const location = useLocation()
  const { language } = useLanguageStore()

  const items = [
    { label: t('nav.search', language), href: '/search', icon: Search },
    { label: t('nav.bookings', language), href: '/player/bookings', icon: Calendar },
    { label: t('nav.profile', language), href: '/player/settings', icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around rounded-t-3xl border-t border-white/20 bg-white/70 px-4 pb-6 pt-2 shadow-[0_-12px_32px_rgba(0,69,115,0.08)] glass-nav md:hidden">
      {items.map((item) => {
        const isActive = location.pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            to={item.href}
            className={`
              flex flex-col items-center justify-center rounded-2xl p-3
              transition-all
              ${
                isActive
                  ? 'kinetic-gradient text-white -translate-y-2 scale-110'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }
            `}
          >
            <Icon className="h-5 w-5" />
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
