import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useLanguageStore } from '../../stores/languageStore'
import { useAuthStore } from '../../stores/authStore'
import { useToastStore } from '../../stores/toastStore'
import { authService } from '../../services/api'
import { t } from '../../utils/i18n'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'

export function Header() {
  const navigate = useNavigate()
  const { language, toggleLanguage } = useLanguageStore()
  const { isLoggedIn, user, logout, getToken } = useAuthStore()
  const toast = useToastStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [resendBusy, setResendBusy] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const initials = user
    ? `${user.name?.[0] ?? ''}${user.surname?.[0] ?? user.name?.[1] ?? ''}`
    : ''

  useEffect(() => {
    if (!userMenuOpen) return
    const onClose = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClose)
    return () => document.removeEventListener('mousedown', onClose)
  }, [userMenuOpen])

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
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-1 rounded-full p-1 ring-2 ring-transparent transition-all hover:ring-primary/20"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  aria-label={language === 'it' ? 'Menu utente' : 'User menu'}
                >
                  <Avatar initials={initials.toUpperCase()} size="sm" />
                  <ChevronDown className={`h-4 w-4 text-on-surface-variant transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 min-w-[200px] rounded-xl border border-surface-container bg-surface-container-lowest py-2 shadow-elevated z-50"
                  >
                    {user?.role === 'COACH' && (
                      <Link
                        to="/coach/profile"
                        role="menuitem"
                        className="block px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {t('nav.profile', language)}
                      </Link>
                    )}
                    <Link
                      to={user?.role === 'COACH' ? '/coach/settings' : '/player/settings'}
                      role="menuitem"
                      className="block px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t('nav.settings', language)}
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      className="w-full px-4 py-2.5 text-left text-sm font-medium text-error hover:bg-error/5"
                      onClick={() => {
                        setUserMenuOpen(false)
                        logout()
                        navigate('/')
                      }}
                    >
                      {t('nav.logout', language)}
                    </button>
                  </div>
                )}
              </div>
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

      {isLoggedIn && user && user.emailVerified !== true && (
        <div className="border-b border-amber-200/80 bg-amber-50 px-4 py-2 text-center text-sm text-amber-950">
          <span>
            {language === 'it'
              ? 'Conferma la tua email per prenotare lezioni.'
              : 'Confirm your email to book lessons.'}{' '}
          </span>
          <button
            type="button"
            disabled={resendBusy}
            onClick={async () => {
              const tok = getToken()
              if (!tok) return
              setResendBusy(true)
              try {
                await authService.resendVerification(tok)
                toast.show(
                  language === 'it' ? 'Ti abbiamo inviato un nuovo link.' : 'We sent a new link.',
                  'success',
                )
              } catch {
                toast.show(language === 'it' ? 'Invio non riuscito' : 'Could not send', 'error')
              } finally {
                setResendBusy(false)
              }
            }}
            className="font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-700 disabled:opacity-50"
          >
            {language === 'it' ? 'Invia di nuovo' : 'Resend'}
          </button>
        </div>
      )}

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
