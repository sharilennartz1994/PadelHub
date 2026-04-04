import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Bell, TrendingUp, Calendar, Star } from 'lucide-react'
import { Sidebar } from '../../components/shared/Sidebar'
import { useLanguageStore } from '../../stores/languageStore'
import { useAuthStore } from '../../stores/authStore'
import { t } from '../../utils/i18n'
import { bookingService } from '../../services/api'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Avatar } from '../../components/ui/Avatar'
import { Spinner } from '../../components/ui/Spinner'

const weekDays = ['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM']
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00']

interface BookingItem {
  id: string
  lessonDate: string
  duration: number
  type: string
  status: string
  price: number
  player?: { user: { name: string; surname?: string } }
  coach?: { user: { name: string; surname?: string } }
  locationName?: string
}

interface CalendarEvent {
  day: number
  startSlot: number
  endSlot: number
  title: string
  color: string
}

function bookingsToCalendarEvents(bookings: BookingItem[], weekStart: Date): CalendarEvent[] {
  return bookings
    .filter((b) => b.status !== 'CANCELLED')
    .map((b) => {
      const d = new Date(b.lessonDate)
      const dayDiff = Math.floor((d.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24))
      if (dayDiff < 0 || dayDiff >= 7) return null
      const hour = d.getHours()
      const startSlotIdx = timeSlots.findIndex((t) => parseInt(t) === hour)
      if (startSlotIdx < 0) return null
      const slotsNeeded = Math.max(1, Math.ceil(b.duration / 60))
      const playerName = b.player?.user
        ? `${b.player.user.name} ${b.player.user.surname?.[0] ?? ''}.`
        : '—'
      const isGroup = b.type === 'GROUP'
      return {
        day: dayDiff,
        startSlot: startSlotIdx,
        endSlot: Math.min(startSlotIdx + slotsNeeded, timeSlots.length),
        title: `${playerName} - ${isGroup ? 'Gruppo' : 'Singola'}`,
        color: isGroup
          ? 'bg-secondary/10 text-secondary border-l-4 border-secondary'
          : 'bg-primary/10 text-primary border-l-4 border-primary',
      }
    })
    .filter(Boolean) as CalendarEvent[]
}

function getWeekStart(offset: number) {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) + offset * 7
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function CoachDashboard() {
  const { language } = useLanguageStore()
  const { user, getToken } = useAuthStore()
  const [view, setView] = useState<'week' | 'month'>('week')
  const [weekOffset, setWeekOffset] = useState(0)
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const weekStart = getWeekStart(weekOffset)
  const token = getToken()
  const coachId = user?.coachId

  useEffect(() => {
    if (!coachId || !token) return
    setIsLoading(true)
    bookingService
      .getCoachBookings(coachId, token)
      .then((data) => setBookings(data as BookingItem[]))
      .catch((err) => console.error('Failed to fetch bookings:', err))
      .finally(() => setIsLoading(false))
  }, [coachId, token])

  const calendarEvents = bookingsToCalendarEvents(bookings, weekStart)
  const totalBookings = bookings.length
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED')
  const revenue = completedBookings.reduce((sum, b) => sum + (b.price ?? 0), 0)
  const nextBooking = bookings
    .filter((b) => b.status === 'CONFIRMED' && new Date(b.lessonDate) > new Date())
    .sort((a, b) => new Date(a.lessonDate).getTime() - new Date(b.lessonDate).getTime())[0]

  const initials = user
    ? `${user.name?.[0] ?? ''}${user.surname?.[0] ?? ''}`.toUpperCase()
    : ''

  const weekLabel = (() => {
    const end = new Date(weekStart)
    end.setDate(end.getDate() + 6)
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' }
    const loc = language === 'it' ? 'it-IT' : 'en-GB'
    return `${weekStart.toLocaleDateString(loc, opts)} - ${end.toLocaleDateString(loc, opts)}`
  })()

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar variant="coach" />

      <main className="flex-1 md:ml-64">
        <header className="sticky top-0 z-20 border-b border-surface-container bg-surface-container-lowest/80 glass-nav px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-on-surface-variant">{t('nav.dashboard', language)}</p>
              <h1 className="font-headline text-2xl font-bold text-on-surface">{t('coach.dashboard.title', language)}</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative rounded-xl p-2 text-on-surface-variant hover:bg-surface-container transition-colors" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-error" />
              </button>
              <Avatar initials={initials} size="md" />
            </div>
          </div>
        </header>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-9">
                <Card padding="none" className="overflow-hidden">
                  <div className="flex items-center justify-between border-b border-surface-container p-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setWeekOffset((o) => o - 1)} className="rounded-lg p-1.5 hover:bg-surface-container transition-colors" aria-label="Previous week"><ChevronLeft className="h-5 w-5" /></button>
                      <h3 className="font-headline font-bold">{weekLabel}</h3>
                      <button onClick={() => setWeekOffset((o) => o + 1)} className="rounded-lg p-1.5 hover:bg-surface-container transition-colors" aria-label="Next week"><ChevronRight className="h-5 w-5" /></button>
                    </div>
                    <div className="flex rounded-xl bg-surface-container-low p-1">
                      <button onClick={() => setView('week')} className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${view === 'week' ? 'kinetic-gradient text-white shadow-sm' : 'text-on-surface-variant'}`}>{t('coach.dashboard.week', language)}</button>
                      <button onClick={() => setView('month')} className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${view === 'month' ? 'kinetic-gradient text-white shadow-sm' : 'text-on-surface-variant'}`}>{t('coach.dashboard.month', language)}</button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                      <div className="grid grid-cols-8 border-b border-surface-container">
                        <div className="p-3 text-xs font-medium text-on-surface-variant" />
                        {weekDays.map((day, i) => {
                          const d = new Date(weekStart)
                          d.setDate(d.getDate() + i)
                          return (
                            <div key={day} className="border-l border-surface-container p-3 text-center">
                              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{day}</p>
                              <p className="mt-1 font-headline text-lg font-bold text-on-surface">{d.getDate()}</p>
                            </div>
                          )
                        })}
                      </div>
                      {timeSlots.map((time, rowIdx) => (
                        <div key={time} className="grid grid-cols-8 border-b border-surface-container/50">
                          <div className="flex items-start p-3 text-xs font-medium text-on-surface-variant">{time}</div>
                          {weekDays.map((_, dayIdx) => {
                            const event = calendarEvents.find((e) => e.day === dayIdx && rowIdx >= e.startSlot && rowIdx < e.endSlot)
                            const isEventStart = event && rowIdx === event.startSlot
                            return (
                              <div key={dayIdx} className="relative h-14 border-l border-surface-container/50">
                                {isEventStart && (
                                  <div className={`absolute inset-x-1 top-1 rounded-lg px-2 py-1 text-xs font-medium ${event.color}`} style={{ height: `${(event.endSlot - event.startSlot) * 56 - 8}px` }}>
                                    {event.title}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-6 lg:col-span-3">
                <Card>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><Calendar className="h-5 w-5 text-primary" /></div>
                    <div><p className="text-2xl font-bold text-on-surface">{totalBookings}</p><p className="text-xs text-on-surface-variant">{t('coach.dashboard.totalBookings', language)}</p></div>
                  </div>
                </Card>
                <Card>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary/10"><TrendingUp className="h-5 w-5 text-tertiary" /></div>
                    <div><p className="text-2xl font-bold text-on-surface">€{revenue}</p><p className="text-xs text-on-surface-variant">{t('coach.dashboard.revenue', language)}</p></div>
                  </div>
                </Card>
                <Card>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10"><Star className="h-5 w-5 text-secondary" /></div>
                    <div><p className="text-2xl font-bold text-on-surface">{completedBookings.length > 0 ? Math.round((completedBookings.length / totalBookings) * 100) : 0}%</p><p className="text-xs text-on-surface-variant">{t('coach.dashboard.satisfaction', language)}</p></div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-surface-container"><div className="h-2 rounded-full kinetic-gradient" style={{ width: `${completedBookings.length > 0 ? Math.round((completedBookings.length / totalBookings) * 100) : 0}%` }} /></div>
                </Card>

                {nextBooking && (
                  <div className="rounded-2xl p-6 kinetic-gradient text-white">
                    <p className="text-xs font-bold uppercase tracking-wider text-white/70">{t('coach.dashboard.nextLesson', language)}</p>
                    <p className="mt-2 font-headline text-lg font-bold">
                      {nextBooking.player?.user.name ?? '—'}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-white/80">
                        {new Date(nextBooking.lessonDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {nextBooking.locationName ? ` · ${nextBooking.locationName}` : ''}
                      </span>
                      <Badge variant="success" size="sm">{language === 'it' ? 'Confermata' : 'Confirmed'}</Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
