import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Camera, Plus, X, MapPin } from 'lucide-react'
import { Sidebar } from '../../components/shared/Sidebar'
import { useLanguageStore } from '../../stores/languageStore'
import { useAuthStore } from '../../stores/authStore'
import { coachService } from '../../services/api'
import { useToastStore } from '../../stores/toastStore'
import { t } from '../../utils/i18n'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Avatar } from '../../components/ui/Avatar'
import { Spinner } from '../../components/ui/Spinner'

interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
  hourlyRate: number
  lessonDuration: number
  yearsExperience: number
  groupLessons: boolean
  groupSurcharge: number
}

type CoachLocationRow = {
  id: string
  name: string
  address: string
}

type LoadedCoach = {
  bio: string | null
  qualifications: string[]
  yearsExperience: number | null
  pricePerHour: number
  defaultDuration: number
  offersGroupLessons: boolean
  groupPricePerPerson: number | null
  trainingOffers?: { kind: 'SINGLE' | 'GROUP'; priceCents: number; maxGroupSize?: number | null }[]
  locations: CoachLocationRow[]
  user: {
    name: string
    surname: string | null
    email: string
    phone: string | null
  }
}

function initialsFrom(name: string, surname: string | null) {
  const a = name?.trim().charAt(0) ?? ''
  const b = surname?.trim().charAt(0) ?? ''
  return (a + b).toUpperCase() || '?'
}

export function CoachProfile() {
  const { language } = useLanguageStore()
  const { user, getToken } = useAuthStore()
  const toast = useToastStore()
  const coachId = user?.coachId

  const [qualifications, setQualifications] = useState<string[]>([])
  const [newQual, setNewQual] = useState('')
  const [activeSection, setActiveSection] = useState('info')
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'error' | 'ready'>('idle')
  const [coachData, setCoachData] = useState<LoadedCoach | null>(null)

  const { register, handleSubmit, reset, watch } = useForm<ProfileForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
      hourlyRate: 0,
      lessonDuration: 60,
      yearsExperience: 0,
      groupLessons: false,
      groupSurcharge: 0,
    },
  })

  const groupLessonsOn = watch('groupLessons')

  const applyCoach = useCallback((c: LoadedCoach) => {
    setCoachData(c)
    setQualifications([...(c.qualifications ?? [])])
    const single = c.trainingOffers?.find((t) => t.kind === 'SINGLE')
    const group = c.trainingOffers?.find((t) => t.kind === 'GROUP')
    const singleCents = single?.priceCents ?? c.pricePerHour
    const groupCents = group?.priceCents ?? c.groupPricePerPerson
    reset({
      firstName: c.user.name ?? '',
      lastName: c.user.surname ?? '',
      email: c.user.email ?? '',
      phone: c.user.phone ?? '',
      bio: c.bio ?? '',
      hourlyRate: Math.round(singleCents) / 100,
      lessonDuration: c.defaultDuration ?? 60,
      yearsExperience: c.yearsExperience ?? 0,
      groupLessons: !!group || (c.offersGroupLessons ?? false),
      groupSurcharge: groupCents != null ? Math.round(groupCents) / 100 : 0,
    })
  }, [reset])

  useEffect(() => {
    if (!coachId) {
      setLoadState('error')
      return
    }
    let cancelled = false
    setLoadState('loading')
    coachService
      .getCoachDetail(coachId)
      .then((raw) => {
        if (cancelled) return
        const c = raw as unknown as LoadedCoach
        applyCoach(c)
        setLoadState('ready')
      })
      .catch(() => {
        if (!cancelled) setLoadState('error')
      })
    return () => {
      cancelled = true
    }
  }, [coachId, applyCoach])

  const onSubmit = async (data: ProfileForm) => {
    if (!coachId) return
    const token = getToken()
    if (!token) {
      toast.show(language === 'it' ? 'Sessione scaduta' : 'Session expired', 'error')
      return
    }
    try {
      const trainingOffers = [
        { kind: 'SINGLE' as const, priceCents: Math.round(data.hourlyRate * 100) },
        ...(data.groupLessons
          ? [
              {
                kind: 'GROUP' as const,
                priceCents: Math.round(data.groupSurcharge * 100),
                maxGroupSize: 4,
              },
            ]
          : []),
      ]
      await coachService.updateProfile(
        coachId,
        {
          bio: data.bio,
          qualifications,
          yearsExperience: data.yearsExperience,
          pricePerHour: Math.round(data.hourlyRate * 100),
          defaultDuration: data.lessonDuration,
          offersGroupLessons: data.groupLessons,
          groupPricePerPerson: data.groupLessons ? Math.round(data.groupSurcharge * 100) : null,
          trainingOffers,
        },
        token,
      )
      const updated = await coachService.getCoachDetail(coachId)
      applyCoach(updated as unknown as LoadedCoach)
      toast.show(language === 'it' ? 'Profilo salvato' : 'Profile saved', 'success')
    } catch {
      toast.show(language === 'it' ? 'Salvataggio non riuscito' : 'Could not save profile', 'error')
    }
  }

  const addQualification = () => {
    if (newQual.trim()) {
      setQualifications((prev) => [...prev, newQual.trim()])
      setNewQual('')
    }
  }

  const sections = [
    { id: 'info', label: language === 'it' ? 'Informazioni' : 'Info' },
    { id: 'qualifications', label: t('coach.signup.qualifications', language) },
    { id: 'locations', label: language === 'it' ? 'Campi' : 'Courts' },
    { id: 'pricing', label: language === 'it' ? 'Prezzi' : 'Pricing' },
  ]

  if (!coachId || loadState === 'loading' || loadState === 'idle') {
    return (
      <div className="flex min-h-screen bg-surface">
        <Sidebar variant="coach" />
        <main className="flex flex-1 items-center justify-center md:ml-64">
          <Spinner size="lg" />
        </main>
      </div>
    )
  }

  if (loadState === 'error' || !coachData) {
    return (
      <div className="flex min-h-screen bg-surface">
        <Sidebar variant="coach" />
        <main className="flex flex-1 items-center justify-center p-6 md:ml-64">
          <p className="text-on-surface-variant">
            {language === 'it' ? 'Impossibile caricare il profilo.' : 'Could not load profile.'}
          </p>
        </main>
      </div>
    )
  }

  const displayInitials = initialsFrom(coachData.user.name, coachData.user.surname)
  const displayName = [coachData.user.name, coachData.user.surname].filter(Boolean).join(' ')

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar variant="coach" />
      <main className="flex-1 md:ml-64">
        <div className="mx-auto max-w-5xl p-6 pt-8">
          <h1 className="mb-8 font-headline text-2xl font-bold text-on-surface">
            {t('nav.profile', language)}
          </h1>

          <div className="flex gap-6">
            <nav className="hidden w-48 shrink-0 space-y-1 lg:block">
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                    activeSection === s.id
                      ? 'kinetic-gradient text-white shadow-teal-ambient'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </nav>

            <div className="flex-1 space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <div className="mb-6 flex items-center gap-6">
                    <div className="group relative">
                      <Avatar initials={displayInitials} size="xl" />
                      <button
                        type="button"
                        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Change photo"
                      >
                        <Camera className="h-6 w-6 text-white" />
                      </button>
                    </div>
                    <div>
                      <p className="font-headline text-lg font-bold">{displayName}</p>
                      <p className="text-sm text-on-surface-variant">{coachData.user.email}</p>
                    </div>
                  </div>

                  <p className="mb-4 text-xs text-on-surface-variant">
                    {language === 'it'
                      ? 'Nome ed email sono collegati all’account. Per modificarli contatta il supporto.'
                      : 'Name and email are tied to your account.'}
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label={t('player.signup.firstName', language)}
                      readOnly
                      className="opacity-80"
                      {...register('firstName')}
                    />
                    <Input
                      label={t('player.signup.lastName', language)}
                      readOnly
                      className="opacity-80"
                      {...register('lastName')}
                    />
                    <Input
                      label={t('auth.email', language)}
                      type="email"
                      readOnly
                      className="opacity-80"
                      {...register('email')}
                    />
                    <Input
                      label={t('player.signup.phone', language)}
                      type="tel"
                      readOnly
                      className="opacity-80"
                      {...register('phone')}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Bio
                    </label>
                    <textarea
                      className="min-h-[100px] w-full resize-none rounded-xl border-none bg-surface-container-high px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      {...register('bio')}
                    />
                  </div>
                </Card>

                <Card>
                  <h3 className="mb-4 font-headline text-lg font-bold">
                    {t('coach.signup.qualifications', language)}
                  </h3>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {qualifications.map((q) => (
                      <span
                        key={q}
                        className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container/20 px-3 py-1.5 text-sm font-medium text-secondary"
                      >
                        {q}
                        <button
                          type="button"
                          onClick={() => setQualifications((prev) => prev.filter((x) => x !== q))}
                          aria-label={`Remove ${q}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newQual}
                      onChange={(e) => setNewQual(e.target.value)}
                      placeholder={language === 'it' ? 'Aggiungi qualifica...' : 'Add qualification...'}
                      className="flex-1 rounded-xl border-none bg-surface-container-high px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQualification())}
                    />
                    <Button type="button" size="sm" onClick={addQualification}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>

                <Card>
                  <h3 className="mb-4 font-headline text-lg font-bold">
                    {language === 'it' ? 'I tuoi campi' : 'Your courts'}
                  </h3>
                  {coachData.locations.length === 0 ? (
                    <p className="text-sm text-on-surface-variant">
                      {language === 'it'
                        ? 'Nessun campo registrato. Aggiungili dalla dashboard o contatta il supporto.'
                        : 'No courts registered yet.'}
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {coachData.locations.map((loc) => (
                        <div
                          key={loc.id}
                          className="flex items-center gap-3 rounded-xl bg-surface-container-low p-4"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-on-surface">{loc.name}</p>
                            <p className="text-xs text-on-surface-variant">{loc.address}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <Card>
                  <h3 className="mb-4 font-headline text-lg font-bold">
                    {language === 'it' ? 'Prezzi e orari' : 'Pricing'}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label={t('coach.signup.hourlyRate', language)}
                      type="number"
                      step="0.01"
                      {...register('hourlyRate', { valueAsNumber: true })}
                    />
                    <Input
                      label={language === 'it' ? 'Anni di esperienza' : 'Years of experience'}
                      type="number"
                      min={0}
                      {...register('yearsExperience', { valueAsNumber: true })}
                    />
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                        {t('coach.signup.duration', language)}
                      </label>
                      <select
                        className="w-full rounded-xl border-none bg-surface-container-high px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                        {...register('lessonDuration', { valueAsNumber: true })}
                      >
                        <option value={60}>60 min</option>
                        <option value={90}>90 min</option>
                        <option value={120}>120 min</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-container-low p-4">
                    <span className="font-medium text-on-surface">
                      {t('coach.signup.groupLessons', language)}
                    </span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" {...register('groupLessons')} />
                      <div className="h-6 w-11 rounded-full bg-surface-container-high after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
                    </label>
                  </div>

                  {groupLessonsOn && (
                    <div className="mt-4">
                      <Input
                        label={
                          language === 'it'
                            ? 'Prezzo gruppo (€ a persona)'
                            : 'Group price (€ per person)'
                        }
                        type="number"
                        step="0.01"
                        min={0}
                        {...register('groupSurcharge', { valueAsNumber: true })}
                      />
                    </div>
                  )}
                </Card>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline">
                    {t('settings.cancel', language)}
                  </Button>
                  <Button type="submit">{t('settings.save', language)}</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
