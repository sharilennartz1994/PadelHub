import { useForm } from 'react-hook-form'
import { Camera } from 'lucide-react'
import { useLanguageStore } from '../../stores/languageStore'
import { t } from '../../utils/i18n'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Avatar } from '../../components/ui/Avatar'
import { BottomNav } from '../../components/shared/BottomNav'
import type { PlayerLevel } from '../../types/user'

interface SettingsForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  level: PlayerLevel
}

export function PlayerSettings() {
  const { language, setLanguage } = useLanguageStore()

  const { register, handleSubmit } = useForm<SettingsForm>({
    defaultValues: {
      firstName: 'Marco',
      lastName: 'Rossi',
      email: 'marco.rossi@example.com',
      phone: '+39 333 1234567',
      level: 'intermediate',
    },
  })

  const onSubmit = (data: SettingsForm) => {
    console.log('Settings saved:', data)
  }

  const levels: { value: PlayerLevel; label: string }[] = [
    { value: 'beginner', label: t('player.signup.level.beginner', language) },
    { value: 'intermediate', label: t('player.signup.level.intermediate', language) },
    { value: 'advanced', label: t('player.signup.level.advanced', language) },
  ]

  return (
    <div className="min-h-screen bg-surface pb-24 pt-20 md:pb-8">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="mb-8 font-headline text-2xl font-bold text-on-surface">
          {t('settings.title', language)}
        </h1>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main settings */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <h2 className="mb-6 font-headline text-lg font-bold">
                  {t('settings.account', language)}
                </h2>

                <div className="mb-6 flex items-center gap-6">
                  <div className="group relative">
                    <Avatar initials="MR" size="xl" />
                    <button
                      type="button"
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Change photo"
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </button>
                  </div>
                  <div>
                    <p className="font-headline text-lg font-bold">Marco Rossi</p>
                    <p className="text-sm text-on-surface-variant">marco.rossi@example.com</p>
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

                <div className="mt-6 flex justify-end gap-3">
                  <Button type="button" variant="outline">
                    {t('settings.cancel', language)}
                  </Button>
                  <Button type="submit">
                    {t('settings.save', language)}
                  </Button>
                </div>
              </Card>
            </form>
          </div>

          {/* Right column */}
          <div className="space-y-6 lg:col-span-4">
            {/* Level */}
            <Card>
              <h3 className="mb-4 font-headline text-lg font-bold">
                {t('player.signup.level', language)}
              </h3>
              <div className="space-y-2">
                {levels.map((lvl) => (
                  <label
                    key={lvl.value}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all has-[:checked]:bg-primary/5 has-[:checked]:text-primary hover:bg-surface-container-low"
                  >
                    <input
                      type="radio"
                      value={lvl.value}
                      className="h-4 w-4 accent-primary"
                      {...register('level')}
                    />
                    <span className="font-medium">{lvl.label}</span>
                  </label>
                ))}
              </div>
            </Card>

            {/* Notifications */}
            <Card>
              <h3 className="mb-4 font-headline text-lg font-bold">
                {t('settings.notifications', language)}
              </h3>
              <div className="space-y-4">
                {[
                  { id: 'email_notif', label: 'Email' },
                  { id: 'push_notif', label: 'Push' },
                  { id: 'sms_notif', label: 'SMS' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-on-surface">
                      {item.label}
                    </span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        defaultChecked={item.id === 'email_notif'}
                        className="peer sr-only"
                      />
                      <div className="h-6 w-11 rounded-full bg-surface-container-high peer-checked:bg-primary after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
              </div>
            </Card>

            {/* Language */}
            <Card>
              <h3 className="mb-4 font-headline text-lg font-bold">
                {t('settings.language', language)}
              </h3>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'it' | 'en')}
                className="w-full rounded-xl bg-surface-container-high px-4 py-3 border-none text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="it">🇮🇹 Italiano</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </Card>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
