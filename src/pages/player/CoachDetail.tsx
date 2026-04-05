import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, Star, Shield, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguageStore } from '../../stores/languageStore'
import { useAuthStore } from '../../stores/authStore'
import { t } from '../../utils/i18n'
import { coachService, bookingService } from '../../services/api'
import { Card } from '../../components/ui/Card'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { BookingFlow } from '../BookingFlow'
import type { TrainingOfferRow } from '../BookingFlow'

type Tab = 'info' | 'availability' | 'reviews'

interface CoachData {
  id: string
  user: { name: string; surname?: string }
  bio?: string
  pricePerHour: number
  qualifications: string[]
  yearsExperience: number
  offersGroupLessons?: boolean
  groupPricePerPerson?: number
  trainingOffers?: TrainingOfferRow[]
  profileImage?: string
  locations: { id: string; name: string; address: string; latitude?: number; longitude?: number }[]
  availabilities?: { id: string; dayOfWeek: number; startTime: string; endTime: string }[]
  _avg?: { rating: number }
  _count?: { reviews: number }
}

interface ReviewData {
  id: string
  rating: number
  comment?: string
  createdAt: string
  player: { user: { name: string; surname?: string } }
}

const weekDates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() + i)
  return d
})

function generateTimeSlots(availabilities: CoachData['availabilities'], dayOfWeek: number) {
  const dayAvail = availabilities?.filter((a) => a.dayOfWeek === dayOfWeek) ?? []
  if (dayAvail.length === 0) return []

  const slots: string[] = []
  for (const a of dayAvail) {
    const [sh, sm] = a.startTime.split(':').map(Number)
    const [eh, em] = a.endTime.split(':').map(Number)
    let cur = sh * 60 + sm
    const end = eh * 60 + em
    while (cur < end) {
      const hh = String(Math.floor(cur / 60)).padStart(2, '0')
      const mm = String(cur % 60).padStart(2, '0')
      slots.push(`${hh}:${mm}`)
      cur += 30
    }
  }
  return slots
}

export function CoachDetail() {
  const { id } = useParams<{ id: string }>()
  const { language } = useLanguageStore()
  const token = useAuthStore((s) => s.getToken())
  const [coach, setCoach] = useState<CoachData | null>(null)
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [showBooking, setShowBooking] = useState(false)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    Promise.all([
      coachService.getCoachDetail(id),
      coachService.getAvailability(id),
      token ? bookingService.getCoachReviews(id, token) : Promise.resolve([]),
    ])
      .then(([detail, avail, rev]) => {
        const c = detail as unknown as CoachData
        c.availabilities = avail as unknown as CoachData['availabilities']
        setCoach(c)
        setReviews(rev as unknown as ReviewData[])
      })
      .catch((err) => console.error('Failed to load coach:', err))
      .finally(() => setIsLoading(false))
  }, [id, token])

  if (isLoading || !coach) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <Spinner size="lg" />
      </div>
    )
  }

  const name = `${coach.user.name} ${coach.user.surname ?? ''}`.trim()
  const initials = `${coach.user.name[0]}${(coach.user.surname?.[0] ?? '').toUpperCase()}`
  const singleCents =
    coach.trainingOffers?.find((t) => t.kind === 'SINGLE')?.priceCents ?? coach.pricePerHour
  const groupCents =
    coach.trainingOffers?.find((t) => t.kind === 'GROUP')?.priceCents ?? coach.groupPricePerPerson
  const rating = coach._avg?.rating ?? 0
  const reviewCount = coach._count?.reviews ?? 0
  const selectedDayOfWeek = weekDates[selectedDate].getDay()
  const timeSlots = generateTimeSlots(coach.availabilities, selectedDayOfWeek)

  const tabs: { id: Tab; label: string }[] = [
    { id: 'info', label: language === 'it' ? 'Informazioni' : 'Info' },
    { id: 'availability', label: language === 'it' ? 'Disponibilità' : 'Availability' },
    { id: 'reviews', label: `${language === 'it' ? 'Recensioni' : 'Reviews'} (${reviewCount})` },
  ]

  return (
    <>
      <div className="min-h-screen bg-surface pt-16">
        <div className="relative overflow-hidden hero-diagonal py-16 md:py-24">
          <div className="relative z-10 mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <div className="relative">
                <Avatar initials={initials} size="xl" className="h-24 w-24 border-4 border-white/30 text-2xl shadow-elevated" />
                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-tertiary-container text-white">
                  <Shield className="h-4 w-4" />
                </div>
              </div>
              <div className="text-white">
                <div className="mb-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  {coach.qualifications?.slice(0, 2).map((q) => (
                    <span key={q} className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">{q}</span>
                  ))}
                </div>
                <h1 className="font-headline text-3xl font-black md:text-5xl">{name}</h1>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-white/80 md:justify-start">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />{rating ? rating.toFixed(1) : '—'} ({reviewCount})
                  </span>
                  {coach.locations[0] && (
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{coach.locations[0].name}</span>
                  )}
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{coach.yearsExperience} {language === 'it' ? 'anni' : 'years'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="mb-6 flex gap-2 border-b border-surface-container">
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`border-b-2 px-5 py-3 text-sm font-medium transition-all ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'info' && (
                <div className="space-y-6">
                  {coach.bio && (
                    <Card>
                      <h3 className="mb-3 font-headline text-lg font-bold">Bio</h3>
                      <p className="leading-relaxed text-on-surface-variant">{coach.bio}</p>
                    </Card>
                  )}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><Shield className="h-6 w-6 text-primary" /></div>
                        <div>
                          <p className="font-bold text-on-surface">{language === 'it' ? 'Certificato' : 'Certified'}</p>
                          <p className="text-sm text-on-surface-variant">{coach.qualifications?.join(', ')}</p>
                        </div>
                      </div>
                    </Card>
                    <Card>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10"><Clock className="h-6 w-6 text-secondary" /></div>
                        <div>
                          <p className="font-bold text-on-surface">{coach.yearsExperience}+ {language === 'it' ? 'anni' : 'years'}</p>
                          <p className="text-sm text-on-surface-variant">{language === 'it' ? 'Esperienza' : 'Experience'}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'availability' && (
                <Card>
                  <div className="mb-4 flex items-center justify-between">
                    <button className="rounded-lg p-1.5 hover:bg-surface-container"><ChevronLeft className="h-5 w-5" /></button>
                    <h3 className="font-headline font-bold">{language === 'it' ? 'Questa settimana' : 'This week'}</h3>
                    <button className="rounded-lg p-1.5 hover:bg-surface-container"><ChevronRight className="h-5 w-5" /></button>
                  </div>
                  <div className="mb-6 flex gap-2 overflow-x-auto hide-scrollbar">
                    {weekDates.map((date, i) => (
                      <button key={i} onClick={() => { setSelectedDate(i); setSelectedTime(null) }} className={`flex min-w-[72px] flex-col items-center rounded-xl px-4 py-3 transition-all ${selectedDate === i ? 'kinetic-gradient text-white shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}>
                        <span className="text-xs font-bold uppercase">{date.toLocaleDateString(language === 'it' ? 'it-IT' : 'en-GB', { weekday: 'short' })}</span>
                        <span className="mt-1 text-lg font-bold">{date.getDate()}</span>
                      </button>
                    ))}
                  </div>
                  {timeSlots.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {timeSlots.map((time) => (
                        <button key={time} onClick={() => setSelectedTime(time)} className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${selectedTime === time ? 'kinetic-gradient text-white shadow-sm' : 'bg-surface-container-low text-on-surface hover:bg-primary/5 hover:text-primary'}`}>
                          {time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-sm text-on-surface-variant">
                      {language === 'it' ? 'Nessuna disponibilità per questa data' : 'No availability for this date'}
                    </p>
                  )}
                </Card>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {reviews.length > 0 ? reviews.map((review) => {
                    const rName = `${review.player.user.name} ${review.player.user.surname?.[0] ?? ''}.`
                    return (
                      <Card key={review.id}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar initials={rName.slice(0, 2).toUpperCase()} size="md" />
                            <div>
                              <p className="font-bold text-on-surface">{rName}</p>
                              <p className="text-xs text-on-surface-variant">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        {review.comment && <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{review.comment}</p>}
                      </Card>
                    )
                  }) : (
                    <p className="py-12 text-center text-on-surface-variant">
                      {language === 'it' ? 'Nessuna recensione ancora' : 'No reviews yet'}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <Card>
                  <div className="mb-4 text-center">
                    <p className="font-headline text-4xl font-black text-primary">€{(singleCents / 100).toFixed(0)}</p>
                    <p className="text-sm text-on-surface-variant">{t('search.perHour', language)}</p>
                  </div>
                  <div className="mb-6 space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-surface-container-low px-4 py-2.5 text-sm">
                      <span className="text-on-surface-variant">{t('booking.single', language)}</span>
                      <span className="font-bold text-on-surface">€{(singleCents / 100).toFixed(0)}</span>
                    </div>
                    {groupCents != null && groupCents > 0 && (
                      <div className="flex items-center justify-between rounded-lg bg-surface-container-low px-4 py-2.5 text-sm">
                        <span className="text-on-surface-variant">{t('booking.group', language)}</span>
                        <span className="font-bold text-on-surface">€{((groupCents ?? 0) / 100).toFixed(0)}</span>
                      </div>
                    )}
                  </div>
                  <Button className="w-full" size="lg" onClick={() => setShowBooking(true)}>
                    {language === 'it' ? 'Prenota lezione' : 'Book lesson'}
                  </Button>
                  <p className="mt-3 text-center text-xs text-on-surface-variant">
                    {language === 'it' ? 'Cancellazione gratuita fino a 24h prima' : 'Free cancellation up to 24h before'}
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingFlow
          coachId={coach.id}
          coachName={name}
          coachInitials={initials}
          coachQualification={coach.qualifications?.[0] ?? ''}
          pricePerHourCents={coach.pricePerHour}
          groupPriceCents={coach.groupPricePerPerson}
          offersGroup={coach.offersGroupLessons ?? false}
          trainingOffers={coach.trainingOffers}
          locations={coach.locations}
          selectedDate={weekDates[selectedDate].toISOString().split('T')[0]}
          selectedTime={selectedTime ?? '10:00'}
          onClose={() => setShowBooking(false)}
        />
      )}
    </>
  )
}
