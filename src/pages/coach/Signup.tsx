import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, Award, MapPin, DollarSign } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useLanguageStore } from '../../stores/languageStore'
import { t } from '../../utils/i18n'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

interface CoachSignupForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  bio: string
  qualifications: string
  yearsExperience: number
  location: string
  hourlyRate: number
  lessonDuration: number
  groupLessons: boolean
}

export function CoachSignup() {
  const navigate = useNavigate()
  const { signupCoach, isLoading } = useAuthStore()
  const { language } = useLanguageStore()
  const [step, setStep] = useState(1)
  const [apiError, setApiError] = useState<string | null>(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const totalSteps = 4

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<CoachSignupForm>({
    defaultValues: { lessonDuration: 60, hourlyRate: 40, groupLessons: false, confirmPassword: '' },
  })

  const nextStep = async () => {
    const fieldsToValidate: Record<number, (keyof CoachSignupForm)[]> = {
      1: ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'],
      2: ['qualifications', 'yearsExperience'],
      3: ['location'],
    }
    const isValid = await trigger(fieldsToValidate[step])
    if (isValid) setStep((s) => Math.min(s + 1, totalSteps))
  }

  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const onSubmit = async (data: CoachSignupForm) => {
    setApiError(null)
    try {
      await signupCoach({
        email: data.email,
        password: data.password,
        name: data.firstName,
        surname: data.lastName,
        phone: data.phone || undefined,
        qualifications: data.qualifications.split(',').map((q) => q.trim()).filter(Boolean),
        yearsExperience: data.yearsExperience,
        pricePerHour: Math.round(data.hourlyRate * 100),
      })
      navigate('/coach/dashboard')
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Signup failed')
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left hero panel */}
      <div className="relative hidden w-2/5 flex-col justify-between overflow-hidden bg-primary p-12 lg:flex">
        <div className="absolute inset-0">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-container/30 blur-[80px]" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary-container/20 blur-[100px]" />
        </div>
        <div className="relative">
          <Link to="/" className="text-2xl font-black tracking-tighter text-white font-headline">PadelHub</Link>
        </div>
        <div className="relative space-y-6">
          <h2 className="font-headline text-5xl font-black leading-tight text-white">{t('coach.signup.title', language)}</h2>
          <p className="text-lg font-medium text-white/80">{t('coach.signup.subtitle', language)}</p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['LV', 'AS', 'MF'].map((i) => (
                <div key={i} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary-container text-xs font-bold text-on-primary">{i}</div>
              ))}
            </div>
            <span className="text-sm font-medium text-white/70">+500 coach</span>
          </div>
        </div>
        <div className="relative" />
      </div>

      {/* Right form */}
      <div className="flex flex-1 items-center justify-center bg-surface-container-lowest px-6 py-24">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <p className="mb-3 text-sm font-medium text-on-surface-variant">{t('coach.signup.step', language)} {step}/{totalSteps}</p>
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < step ? 'kinetic-gradient' : 'bg-surface-container-high'}`} />
              ))}
            </div>
          </div>

          {apiError && (
            <div className="mb-4 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">{apiError}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <>
                <h2 className="font-headline text-2xl font-bold text-on-surface">{t('coach.signup.step1', language)}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input label={t('player.signup.firstName', language)} placeholder="Mario" icon={<User className="h-5 w-5" />} error={errors.firstName?.message} {...register('firstName', { required: 'Obbligatorio' })} />
                  <Input label={t('player.signup.lastName', language)} placeholder="Rossi" error={errors.lastName?.message} {...register('lastName', { required: 'Obbligatorio' })} />
                </div>
                <Input label={t('auth.email', language)} type="email" placeholder="coach@example.com" icon={<Mail className="h-5 w-5" />} error={errors.email?.message} {...register('email', { required: 'Email obbligatoria', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email non valida' } })} />
                <Input label={t('player.signup.phone', language)} type="tel" placeholder="+39 333 123 4567" icon={<Phone className="h-5 w-5" />} error={errors.phone?.message} {...register('phone', { required: 'Obbligatorio' })} />
                <Input label={t('auth.password', language)} type="password" placeholder="••••••••" icon={<Lock className="h-5 w-5" />} error={errors.password?.message} {...register('password', { required: 'Password obbligatoria', minLength: { value: 6, message: 'Minimo 6 caratteri' } })} />
                <Input label={language === 'it' ? 'Conferma password' : 'Confirm password'} type="password" placeholder="••••••••" icon={<Lock className="h-5 w-5" />} error={errors.confirmPassword?.message} {...register('confirmPassword', { required: language === 'it' ? 'Conferma la password' : 'Confirm password', validate: (v, f) => v === f.password || (language === 'it' ? 'Le password non coincidono' : 'Passwords do not match') })} />
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="font-headline text-2xl font-bold text-on-surface">{t('coach.signup.step2', language)}</h2>
                <Input label={t('coach.signup.qualifications', language)} placeholder="FIP Livello 2, FIT Certificato..." icon={<Award className="h-5 w-5" />} error={errors.qualifications?.message} helperText={language === 'it' ? 'Separa con virgola' : 'Comma-separated'} {...register('qualifications', { required: 'Obbligatorio' })} />
                <Input label={t('coach.signup.yearsExp', language)} type="number" placeholder="5" error={errors.yearsExperience?.message} {...register('yearsExperience', { required: 'Obbligatorio', valueAsNumber: true, min: { value: 0, message: 'Valore non valido' } })} />
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Bio</label>
                  <textarea className="w-full rounded-xl bg-surface-container-high px-4 py-3 text-on-surface placeholder-on-surface-variant/50 border-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[120px] resize-none" placeholder={language === 'it' ? 'Raccontaci la tua esperienza...' : 'Tell us about your experience...'} {...register('bio')} />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="font-headline text-2xl font-bold text-on-surface">{t('coach.signup.step3', language)}</h2>
                <Input label={language === 'it' ? 'Club / Campo' : 'Club / Court'} placeholder="Padel Club Cagliari" icon={<MapPin className="h-5 w-5" />} error={errors.location?.message} {...register('location', { required: 'Obbligatorio' })} />
                <div className="rounded-2xl bg-surface-container-high p-8 text-center">
                  <MapPin className="mx-auto mb-3 h-12 w-12 text-on-surface-variant/30" />
                  <p className="text-sm text-on-surface-variant">{language === 'it' ? 'La mappa interattiva sarà disponibile a breve' : 'Interactive map coming soon'}</p>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="font-headline text-2xl font-bold text-on-surface">{t('coach.signup.step4', language)}</h2>
                <Input label={t('coach.signup.hourlyRate', language)} type="number" placeholder="40" icon={<DollarSign className="h-5 w-5" />} error={errors.hourlyRate?.message} {...register('hourlyRate', { required: 'Obbligatorio', valueAsNumber: true, min: { value: 10, message: 'Minimo €10' } })} />
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">{t('coach.signup.duration', language)}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[60, 90, 120].map((dur) => (
                      <label key={dur} className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-surface-container-high px-3 py-3 text-sm font-medium text-on-surface-variant transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:text-primary hover:border-primary/30">
                        <input type="radio" value={dur} className="sr-only" {...register('lessonDuration', { valueAsNumber: true })} />
                        {dur} min
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-4">
                  <span className="font-medium text-on-surface">{t('coach.signup.groupLessons', language)}</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" {...register('groupLessons')} />
                    <div className="h-6 w-11 rounded-full bg-surface-container-high peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>
              </>
            )}

            {step === totalSteps && (
              <div className="border-t border-surface-container pt-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-outline text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-on-surface-variant">
                    {language === 'it' ? 'Ho letto e accetto la ' : 'I have read and accept the '}
                    <Link to="/privacy" target="_blank" className="font-semibold text-primary hover:underline">Privacy Policy</Link>
                    {language === 'it' ? ' e i ' : ' and the '}
                    <Link to="/terms" target="_blank" className="font-semibold text-primary hover:underline">{language === 'it' ? 'Termini di Servizio' : 'Terms of Service'}</Link>
                  </span>
                </label>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {step > 1 && <Button type="button" variant="outline" className="flex-1" onClick={prevStep}>{t('coach.signup.back', language)}</Button>}
              {step < totalSteps
                ? <Button type="button" className="flex-1" onClick={nextStep}>{t('coach.signup.continue', language)}</Button>
                : <Button type="submit" className="flex-1" loading={isLoading} disabled={!acceptedTerms}>{t('coach.signup.finish', language)}</Button>
              }
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            {t('auth.hasAccount', language)}{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-container transition-colors">{t('auth.loginHere', language)}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
