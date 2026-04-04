import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Camera, Plus, X, MapPin } from 'lucide-react'
import { Sidebar } from '../../components/shared/Sidebar'
import { useLanguageStore } from '../../stores/languageStore'
import { t } from '../../utils/i18n'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Avatar } from '../../components/ui/Avatar'

interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
  hourlyRate: number
  lessonDuration: number
  groupLessons: boolean
  groupSurcharge: number
}

export function CoachProfile() {
  const { language } = useLanguageStore()
  const [qualifications, setQualifications] = useState(['FIP Livello 2', 'FIT Certificato', '10+ Anni Esperienza'])
  const [newQual, setNewQual] = useState('')
  const [activeSection, setActiveSection] = useState('info')

  const { register, handleSubmit } = useForm<ProfileForm>({
    defaultValues: {
      firstName: 'Luca',
      lastName: 'Veloci',
      email: 'luca.veloci@example.com',
      phone: '+39 333 1234567',
      bio: 'Coach professionista con oltre 10 anni di esperienza nel padel.',
      hourlyRate: 45,
      lessonDuration: 90,
      groupLessons: true,
      groupSurcharge: 10,
    },
  })

  const onSubmit = (data: ProfileForm) => {
    console.log('Saving profile:', data)
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

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar variant="coach" />
      <main className="flex-1 md:ml-64">
        <div className="mx-auto max-w-5xl p-6 pt-8">
          <h1 className="mb-8 font-headline text-2xl font-bold text-on-surface">
            {t('nav.profile', language)}
          </h1>

          <div className="flex gap-6">
            {/* Section nav */}
            <nav className="hidden w-48 shrink-0 space-y-1 lg:block">
              {sections.map((s) => (
                <button
                  key={s.id}
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

            {/* Content */}
            <div className="flex-1 space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal info */}
                <Card>
                  <div className="mb-6 flex items-center gap-6">
                    <div className="group relative">
                      <Avatar initials="LV" size="xl" />
                      <button
                        type="button"
                        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Change photo"
                      >
                        <Camera className="h-6 w-6 text-white" />
                      </button>
                    </div>
                    <div>
                      <p className="font-headline text-lg font-bold">Luca Veloci</p>
                      <p className="text-sm text-on-surface-variant">
                        luca.veloci@example.com
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label={t('player.signup.firstName', language)}
                      {...register('firstName')}
                    />
                    <Input
                      label={t('player.signup.lastName', language)}
                      {...register('lastName')}
                    />
                    <Input
                      label={t('auth.email', language)}
                      type="email"
                      {...register('email')}
                    />
                    <Input
                      label={t('player.signup.phone', language)}
                      type="tel"
                      {...register('phone')}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Bio
                    </label>
                    <textarea
                      className="w-full rounded-xl bg-surface-container-high px-4 py-3 text-on-surface border-none focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none"
                      {...register('bio')}
                    />
                  </div>
                </Card>

                {/* Qualifications */}
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
                          onClick={() =>
                            setQualifications((prev) => prev.filter((x) => x !== q))
                          }
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
                      className="flex-1 rounded-xl bg-surface-container-high px-4 py-2.5 text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQualification())}
                    />
                    <Button type="button" size="sm" onClick={addQualification}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>

                {/* Locations */}
                <Card>
                  <h3 className="mb-4 font-headline text-lg font-bold">
                    {language === 'it' ? 'I tuoi campi' : 'Your courts'}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {['Padel Club Cagliari', 'Sporting Club Quartu'].map((club) => (
                      <div
                        key={club}
                        className="flex items-center gap-3 rounded-xl bg-surface-container-low p-4"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-on-surface">{club}</p>
                          <p className="text-xs text-on-surface-variant">Cagliari</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Pricing */}
                <Card>
                  <h3 className="mb-4 font-headline text-lg font-bold">
                    {language === 'it' ? 'Prezzi e orari' : 'Pricing'}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label={t('coach.signup.hourlyRate', language)}
                      type="number"
                      {...register('hourlyRate', { valueAsNumber: true })}
                    />
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                        {t('coach.signup.duration', language)}
                      </label>
                      <select
                        className="w-full rounded-xl bg-surface-container-high px-4 py-3 border-none text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        {...register('groupLessons')}
                      />
                      <div className="h-6 w-11 rounded-full bg-surface-container-high peer-checked:bg-primary after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline">
                    {t('settings.cancel', language)}
                  </Button>
                  <Button type="submit">
                    {t('settings.save', language)}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
