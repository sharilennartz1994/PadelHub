import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useLanguageStore } from '../../stores/languageStore'
import { useAuthStore } from '../../stores/authStore'
import { t } from '../../utils/i18n'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'

export function Header() {
  const navigate = useNavigate()
  const { language, toggleLanguage } = useLanguageStore()
  const { isLoggedIn, user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const initials = user
    ? `${user.name?.[0] ?? ''}${user.surname?.[0] ?? user.name?.[1] ?? ''}`
    : ''

  return (
    <header className="fixed top-0 z-40 w-full bg-white/70 glass-nav border-b border-surface-container">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-black tracking-tighter text-primary font-headline"
        >
          PadelHub
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-lg font-headline font-bold tracking-tight text-primary hover:text-primary-container transition-colors"
          >
            {t('nav.home', language)}
          </Link>
          <Link
            to="/search"
            className="text-lg font-headline font-bold tracking-tight text-on-surface-variant hover:text-primary transition-colors"
          >
            {t('nav.search', language)}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Toggle language"
          >
            {language === 'it' ? '🇬🇧 EN' : '🇮🇹 IT'}
          </button>

          {isLoggedIn ? (
            <div className="hidden items-center gap-3 md:flex">
              {user?.role === 'COACH' && (
                <Link to="/coach/dashboard">
                  <Button variant="ghost" size="sm">
                    {t('nav.dashboard', language)}
                  </Button>
                </Link>
              )}
              <Link to="/player/bookings">
                <Button variant="ghost" size="sm">
                  {t('nav.bookings', language)}
                </Button>
              </Link>
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                <Avatar initials={initials.toUpperCase()} size="sm" />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                to="/login"
                className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors px-4 py-2"
              >
                {t('nav.login', language)}
              </Link>
              <Button size="sm" onClick={() => navigate('/search')}>
                {t('home.cta.searchCoach', language)}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/coach/signup')}
              >
                {t('home.cta.imCoach', language)}
              </Button>
            </div>
          )}

          <button
            className="md:hidden rounded-lg p-2 text-on-surface-variant hover:bg-surface-container"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-surface-container bg-white/95 glass-nav px-6 py-4 md:hidden animate-slide-up">
          <div className="flex flex-col gap-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3 font-medium text-on-surface hover:bg-surface-container">
              {t('nav.home', language)}
            </Link>
            <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3 font-medium text-on-surface hover:bg-surface-container">
              {t('nav.search', language)}
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/player/bookings" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3 font-medium text-on-surface hover:bg-surface-container">
                  {t('nav.bookings', language)}
                </Link>
                <Link to="/player/settings" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3 font-medium text-on-surface hover:bg-surface-container">
                  {t('nav.settings', language)}
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); navigate('/') }}
                  className="rounded-xl px-4 py-3 text-left font-medium text-error hover:bg-error/5"
                >
                  {t('nav.logout', language)}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3 font-medium text-on-surface hover:bg-surface-container">
                  {t('nav.login', language)}
                </Link>
                <Button className="w-full" onClick={() => { navigate('/player/signup'); setMobileMenuOpen(false) }}>
                  {t('auth.signup', language)}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
