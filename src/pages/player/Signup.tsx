import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useLanguageStore } from '../../stores/languageStore'
import { t } from '../../utils/i18n'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

interface PlayerSignupForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  level: string
}

const levels: { value: string; labelKey: string }[] = [
  { value: 'BEGINNER', labelKey: 'player.signup.level.beginner' },
  { value: 'INTERMEDIATE', labelKey: 'player.signup.level.intermediate' },
  { value: 'ADVANCED', labelKey: 'player.signup.level.advanced' },
]

export function PlayerSignup() {
  const navigate = useNavigate()
  const { signupPlayer, isLoading } = useAuthStore()
  const { language } = useLanguageStore()
  const [apiError, setApiError] = useState<string | null>(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PlayerSignupForm>({ defaultValues: { level: 'BEGINNER' } })

  const selectedLevel = watch('level')

  const onSubmit = async (data: PlayerSignupForm) => {
    setApiError(null)
    try {
      await signupPlayer({
        email: data.email,
        password: data.password,
        name: data.firstName,
        surname: data.lastName,
        phone: data.phone || undefined,
        level: data.level,
      })
      navigate('/search')
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Signup failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-container-low px-4 py-24">
      <Card className="w-full max-w-md" padding="lg">
        <div className="mb-8 text-center">
          <Link to="/" className="text-3xl font-black tracking-tighter text-primary font-headline">
            PadelHub
          </Link>
          <h1 className="mt-4 font-headline text-2xl font-bold text-on-surface">
            {t('player.signup.title', language)}
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            {t('player.signup.subtitle', language)}
          </p>
        </div>

        {apiError && (
          <div className="mb-4 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('player.signup.firstName', language)}
              placeholder="Mario"
              icon={<User className="h-5 w-5" />}
              error={errors.firstName?.message}
              {...register('firstName', { required: 'Obbligatorio' })}
            />
            <Input
              label={t('player.signup.lastName', language)}
              placeholder="Rossi"
              error={errors.lastName?.message}
              {...register('lastName', { required: 'Obbligatorio' })}
            />
          </div>

          <Input
            label={t('auth.email', language)}
            type="email"
            placeholder="mario.rossi@example.com"
            icon={<Mail className="h-5 w-5" />}
            error={errors.email?.message}
            {...register('email', {
              required: 'Email è obbligatoria',
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email non valida' },
            })}
          />

          <Input
            label={t('player.signup.phone', language)}
            type="tel"
            placeholder="+39 333 123 4567"
            icon={<Phone className="h-5 w-5" />}
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Input
            label={t('auth.password', language)}
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-5 w-5" />}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password obbligatoria',
              minLength: { value: 6, message: 'Minimo 6 caratteri' },
            })}
          />

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {t('player.signup.level', language)}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {levels.map((lvl) => (
                <label
                  key={lvl.value}
                  className={`flex cursor-pointer items-center justify-center rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all ${
                    selectedLevel === lvl.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-surface-container-high text-on-surface-variant hover:border-primary/30'
                  }`}
                >
                  <input type="radio" value={lvl.value} className="sr-only" {...register('level')} />
                  {t(lvl.labelKey, language)}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-2 border-t border-surface-container pt-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-outline text-primary focus:ring-primary/20"
              />
              <span className="text-sm text-on-surface-variant">
                {language === 'it' ? 'Ho letto e accetto la ' : 'I have read and accept the '}
                <Link to="/privacy" target="_blank" className="font-semibold text-primary hover:underline">
                  Privacy Policy
                </Link>
                {language === 'it' ? ' e i ' : ' and the '}
                <Link to="/terms" target="_blank" className="font-semibold text-primary hover:underline">
                  {language === 'it' ? 'Termini di Servizio' : 'Terms of Service'}
                </Link>
              </span>
            </label>
          </div>

          <Button type="submit" className="w-full" loading={isLoading} disabled={!acceptedTerms}>
            {t('player.signup.cta', language)}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          {t('auth.hasAccount', language)}{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-container transition-colors">
            {t('auth.loginHere', language)}
          </Link>
        </p>
      </Card>
    </div>
  )
}
