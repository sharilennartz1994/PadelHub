import { useState, useEffect, useCallback } from 'react'
import { Search, Clock, MapPin, Users } from 'lucide-react'
import { useLanguageStore } from '../../stores/languageStore'
import { useAuthStore } from '../../stores/authStore'
import { t } from '../../utils/i18n'
import { bookingService } from '../../services/api'
import { useToastStore } from '../../stores/toastStore'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { BottomNav } from '../../components/shared/BottomNav'

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

interface BookingItem {
  id: string
  lessonDate: string
  duration: number
  type: string
  status: BookingStatus
  price: number
  locationName?: string
  coach?: { user: { name: string; surname?: string } }
}

const statusVariant: Record<BookingStatus, 'success' | 'warning' | 'error' | 'info'> = {
  CONFIRMED: 'success',
  PENDING: 'warning',
  COMPLETED: 'info',
  CANCELLED: 'error',
}

const statusLabels: Record<BookingStatus, Record<string, string>> = {
  CONFIRMED: { it: 'Confermata', en: 'Confirmed' },
  PENDING: { it: 'In Attesa', en: 'Pending' },
  COMPLETED: { it: 'Completata', en: 'Completed' },
  CANCELLED: { it: 'Cancellata', en: 'Cancelled' },
}

type Tab = 'upcoming' | 'past' | 'cancelled'

export function PlayerBookings() {
  const { language } = useLanguageStore()
  const { user, getToken } = useAuthStore()
  const toast = useToastStore()
  const [activeTab, setActiveTab] = useState<Tab>('upcoming')
  const [searchQuery, setSearchQuery] = useState('')
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const token = getToken()

  const fetchBookings = useCallback(async () => {
    if (!token || user?.role !== 'PLAYER') return
    setIsLoading(true)
    try {
      const data = await bookingService.getPlayerBookings(token)
      setBookings(data as BookingItem[])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [token, user?.role])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleCancel = async (bookingId: string) => {
    if (!token) return
    try {
      await bookingService.cancelBooking(bookingId, token)
      toast.show(language === 'it' ? 'Prenotazione cancellata' : 'Booking cancelled', 'info')
      fetchBookings()
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Error', 'error')
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'upcoming', label: t('booking.upcoming', language) },
    { id: 'past', label: t('booking.past', language) },
    { id: 'cancelled', label: t('booking.cancelled', language) },
  ]

  const filterMap: Record<Tab, BookingStatus[]> = {
    upcoming: ['CONFIRMED', 'PENDING'],
    past: ['COMPLETED'],
    cancelled: ['CANCELLED'],
  }

  const filtered = bookings.filter((b) => {
    if (!filterMap[activeTab].includes(b.status)) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const coachName = `${b.coach?.user.name ?? ''} ${b.coach?.user.surname ?? ''}`.toLowerCase()
      return coachName.includes(q) || (b.locationName ?? '').toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="min-h-screen bg-surface pb-24 pt-20 md:pb-8">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-headline text-2xl font-bold text-on-surface">{t('nav.bookings', language)}</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('search.placeholder', language)} className="rounded-xl bg-surface-container-lowest py-2.5 pl-10 pr-4 text-sm shadow-soft border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        <div className="mb-6 flex gap-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-secondary-container text-on-secondary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => {
              const coachName = `${booking.coach?.user.name ?? ''} ${booking.coach?.user.surname ?? ''}`.trim()
              const initials = coachName.split(' ').map((n) => n[0]).join('').toUpperCase()
              const d = new Date(booking.lessonDate)
              const dateStr = d.toLocaleDateString()
              const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              const endTime = new Date(d.getTime() + booking.duration * 60000)
              const endStr = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

              return (
                <Card key={booking.id} padding="none" className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="h-2 w-full kinetic-gradient md:h-auto md:w-2" />
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar initials={initials || '??'} size="lg" />
                          <div>
                            <p className="font-headline font-bold text-on-surface">{coachName || '—'}</p>
                            <Badge variant={statusVariant[booking.status]} size="sm">{statusLabels[booking.status][language]}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-headline text-xl font-bold text-primary">€{booking.price}</p>
                          <Badge variant={booking.type === 'SINGLE' ? 'default' : 'info'} size="sm">
                            {booking.type === 'SINGLE' ? t('booking.single', language) : t('booking.group', language)}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-on-surface-variant">
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{dateStr} · {timeStr} - {endStr}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{booking.locationName ?? '—'}</span>
                        {booking.type === 'GROUP' && <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{t('booking.group', language)}</span>}
                      </div>
                      {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                        <div className="mt-4 flex gap-2 border-t border-surface-container pt-4">
                          <Button variant="outline" size="sm">{t('booking.details', language)}</Button>
                          <Button variant="danger" size="sm" onClick={() => handleCancel(booking.id)}>{t('booking.cancel', language)}</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-on-surface-variant">{language === 'it' ? 'Nessuna prenotazione trovata' : 'No bookings found'}</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
