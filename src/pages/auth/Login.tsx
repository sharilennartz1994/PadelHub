import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useLanguageStore } from '../../stores/languageStore'
import { t } from '../../utils/i18n'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

interface LoginForm {
  email: string
  password: string
}

export function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const { language } = useLanguageStore()
  const [apiError, setApiError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setApiError(null)
    try {
      await login(data.email, data.password)
      const user = useAuthStore.getState().user
      if (user?.role === 'COACH') {
        navigate('/coach/dashboard')
      } else {
        navigate('/search')
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-container-low px-4 pt-20">
      <Card className="w-full max-w-md" padding="lg">
        <div className="mb-8 text-center">
          <Link to="/" className="text-3xl font-black tracking-tighter text-primary font-headline">
            PadelHub
          </Link>
          <p className="mt-2 text-on-surface-variant">
            {language === 'it' ? 'Accedi al tuo account' : 'Sign in to your account'}
          </p>
        </div>

        {apiError && (
          <div className="mb-4 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label={t('auth.email', language)}
            type="email"
            placeholder="mario.rossi@example.com"
            icon={<Mail className="h-5 w-5" />}
            error={errors.email?.message}
            {...register('email', {
              required: 'Email è obbligatoria',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Inserisci un email valida',
              },
            })}
          />

          <Input
            label={t('auth.password', language)}
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-5 w-5" />}
            error={errors.password?.message}
            {...register('password', {
              required: 'La password è obbligatoria',
              minLength: { value: 6, message: 'Minimo 6 caratteri' },
            })}
          />

          <div className="text-right">
            <a href="#" className="text-sm font-medium text-primary hover:text-primary-container transition-colors">
              {t('auth.forgotPassword', language)}
            </a>
          </div>

          <Button type="submit" className="w-full" loading={isLoading}>
            {t('auth.login', language)}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          {t('auth.noAccount', language)}{' '}
          <Link to="/player/signup" className="font-semibold text-primary hover:text-primary-container transition-colors">
            {t('auth.signupHere', language)}
          </Link>
        </p>
      </Card>
    </div>
  )
}
