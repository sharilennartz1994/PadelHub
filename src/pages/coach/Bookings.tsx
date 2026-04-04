import { useState, useEffect, useCallback } from 'react'
import { Search, Clock, MapPin, Users, Calendar, Mail, User } from 'lucide-react'
import { Sidebar } from '../../components/shared/Sidebar'
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
import { Modal } from '../../components/ui/Modal'

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

interface BookingItem {
  id: string
  bookingNumber?: string
  lessonDate: string
  duration: number
  type: string
  status: BookingStatus
  price: number
  locationName?: string
  notes?: string
  player?: { user: { name: string; surname?: string; email?: string } }
}

interface BookingDetail extends BookingItem {
  coach?: { user: { name: string; surname?: string; email?: string } }
  createdAt?: string
}

const statusBadgeVariant: Record<BookingStatus, 'success' | 'warning' | 'error' | 'info'> = {
  CONFIRMED: 'success',
  PENDING: 'warning',
  COMPLETED: 'info',
  CANCELLED: 'error',
}

const statusLabel: Record<BookingStatus, Record<string, string>> = {
  CONFIRMED: { it: 'Confermata', en: 'Confirmed' },
  PENDING: { it: 'In Attesa', en: 'Pending' },
  COMPLETED: { it: 'Completata', en: 'Completed' },
  CANCELLED: { it: 'Cancellata', en: 'Cancelled' },
}

type FilterTab = 'all' | BookingStatus

export function CoachBookings() {
  const { language } = useLanguageStore()
  const { user, getToken } = useAuthStore()
  const toast = useToastStore()
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  const token = getToken()
  const coachId = user?.coachId

  const fetchBookings = useCallback(async () => {
    if (!coachId || !token) return
    setIsLoading(true)
    try {
      const data = await bookingService.getCoachBookings(coachId, token)
      setBookings(data as BookingItem[])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [coachId, token])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const openDetail = async (bookingId: string) => {
    if (!token) return
    setIsLoadingDetail(true)
    try {
      const data = await bookingService.getBookingDetail(bookingId, token)
      setSelectedBooking(data as unknown as BookingDetail)
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Error', 'error')
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const closeDetail = () => setSelectedBooking(null)

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    if (!token) return
    try {
      await bookingService.updateStatus(bookingId, newStatus, token)
      toast.show(language === 'it' ? 'Stato aggiornato' : 'Status updated', 'success')
      closeDetail()
      fetchBookings()
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Error', 'error')
    }
  }

  const handleCancel = async (bookingId: string) => {
    if (!token) return
    try {
      await bookingService.cancelBooking(bookingId, token)
      toast.show(language === 'it' ? 'Prenotazione cancellata' : 'Booking cancelled', 'info')
      closeDetail()
      fetchBookings()
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Error', 'error')
    }
  }

  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: language === 'it' ? 'Tutte' : 'All' },
    { id: 'PENDING', label: statusLabel.PENDING[language] },
    { id: 'CONFIRMED', label: statusLabel.CONFIRMED[language] },
    { id: 'COMPLETED', label: statusLabel.COMPLETED[language] },
    { id: 'CANCELLED', label: statusLabel.CANCELLED[language] },
  ]

  const filtered = bookings.filter((b) => {
    if (activeTab !== 'all' && b.status !== activeTab) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const playerName = `${b.player?.user.name ?? ''} ${b.player?.user.surname ?? ''}`.toLowerCase()
      return playerName.includes(q) || (b.locationName ?? '').toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar variant="coach" />
      <main className="flex-1 md:ml-64">
        <div className="mx-auto max-w-6xl p-6 pt-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-headline text-2xl font-bold text-on-surface">{t('nav.bookings', language)}</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('search.placeholder', language)} className="rounded-xl bg-surface-container-high py-2.5 pl-10 pr-4 text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          <div className="mb-6 flex gap-2 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all ${activeTab === tab.id ? 'kinetic-gradient text-white shadow-teal-ambient' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {filtered.map((booking) => {
                const playerName = `${booking.player?.user.name ?? ''} ${booking.player?.user.surname ?? ''}`.trim()
                const initials = playerName.split(' ').map((n) => n[0]).join('').toUpperCase()
                const d = new Date(booking.lessonDate)
                const dateStr = d.toLocaleDateString()
                const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                return (
                  <Card key={booking.id} className="overflow-hidden cursor-pointer hover:shadow-elevated transition-shadow" onClick={() => openDetail(booking.id)}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar initials={initials} size="lg" />
                        <div>
                          <p className="font-headline font-bold text-on-surface">{playerName || '—'}</p>
                          <Badge variant={statusBadgeVariant[booking.status]} size="sm">{statusLabel[booking.status][language]}</Badge>
                        </div>
                      </div>
                      <p className="font-headline text-xl font-bold text-primary">€{booking.price}</p>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 text-sm text-on-surface-variant"><Clock className="h-4 w-4" /><span>{dateStr} · {timeStr}</span></div>
                      <div className="flex items-center gap-2 text-sm text-on-surface-variant"><MapPin className="h-4 w-4" /><span className="truncate">{booking.locationName ?? '—'}</span></div>
                      <div className="flex items-center gap-2 text-sm text-on-surface-variant"><Users className="h-4 w-4" /><span>{booking.type === 'SINGLE' ? t('booking.single', language) : t('booking.group', language)}</span></div>
                    </div>
                    {booking.status === 'PENDING' && (
                      <div className="mt-4 flex gap-2 border-t border-surface-container pt-4">
                        <Button variant="danger" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); handleCancel(booking.id) }}>{t('booking.cancel', language)}</Button>
                        <Button size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); handleStatusChange(booking.id, 'CONFIRMED') }}>{t('common.confirm', language)}</Button>
                      </div>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <div className="mt-4 flex gap-2 border-t border-surface-container pt-4">
                        <Button variant="outline" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); handleStatusChange(booking.id, 'COMPLETED') }}>{language === 'it' ? 'Completa' : 'Complete'}</Button>
                        <Button variant="danger" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); handleCancel(booking.id) }}>{t('booking.cancel', language)}</Button>
                      </div>
                    )}
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
      </main>

      {/* Booking detail modal */}
      <Modal
        isOpen={selectedBooking !== null || isLoadingDetail}
        onClose={closeDetail}
        title={language === 'it' ? 'Dettagli Prenotazione' : 'Booking Details'}
        size="lg"
      >
        {isLoadingDetail ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : selectedBooking && (() => {
          const b = selectedBooking
          const playerName = `${b.player?.user.name ?? ''} ${b.player?.user.surname ?? ''}`.trim()
          const playerEmail = b.player?.user.email ?? '—'
          const initials = playerName.split(' ').map((n) => n[0]).join('').toUpperCase()
          const d = new Date(b.lessonDate)
          const dateStr = d.toLocaleDateString(language === 'it' ? 'it-IT' : 'en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
          const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          const endTime = new Date(d.getTime() + b.duration * 60000)
          const endStr = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

          return (
            <div className="space-y-6">
              {/* Player info */}
              <div className="flex items-center gap-4 rounded-xl bg-surface-container-low p-4">
                <Avatar initials={initials || '??'} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="font-headline text-lg font-bold text-on-surface">{playerName || '—'}</p>
                  <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{playerEmail}</span>
                  </div>
                </div>
                <Badge variant={statusBadgeVariant[b.status]} size="sm">
                  {statusLabel[b.status][language]}
                </Badge>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-surface-container-low p-4">
                  <div className="mb-1.5 flex items-center gap-1.5 text-on-surface-variant">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">{language === 'it' ? 'Data' : 'Date'}</span>
                  </div>
                  <p className="font-medium text-on-surface">{dateStr}</p>
                </div>
                <div className="rounded-xl bg-surface-container-low p-4">
                  <div className="mb-1.5 flex items-center gap-1.5 text-on-surface-variant">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">{language === 'it' ? 'Orario' : 'Time'}</span>
                  </div>
                  <p className="font-medium text-on-surface">{timeStr} – {endStr}</p>
                </div>
                <div className="rounded-xl bg-surface-container-low p-4">
                  <div className="mb-1.5 flex items-center gap-1.5 text-on-surface-variant">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">{language === 'it' ? 'Durata' : 'Duration'}</span>
                  </div>
                  <p className="font-medium text-on-surface">{b.duration} min</p>
                </div>
                <div className="rounded-xl bg-surface-container-low p-4">
                  <div className="mb-1.5 flex items-center gap-1.5 text-on-surface-variant">
                    <Users className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">{language === 'it' ? 'Tipo' : 'Type'}</span>
                  </div>
                  <p className="font-medium text-on-surface">
                    {b.type === 'SINGLE' ? t('booking.single', language) : t('booking.group', language)}
                  </p>
                </div>
                <div className="rounded-xl bg-surface-container-low p-4">
                  <div className="mb-1.5 flex items-center gap-1.5 text-on-surface-variant">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">{language === 'it' ? 'Luogo' : 'Location'}</span>
                  </div>
                  <p className="font-medium text-on-surface">{b.locationName || '—'}</p>
                </div>
                <div className="rounded-xl bg-surface-container-low p-4">
                  <div className="mb-1.5 flex items-center gap-1.5 text-on-surface-variant">
                    <User className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">{language === 'it' ? 'Prezzo' : 'Price'}</span>
                  </div>
                  <p className="font-headline text-xl font-bold text-primary">€{b.price}</p>
                </div>
              </div>

              {b.bookingNumber && (
                <div className="flex items-center justify-between rounded-lg bg-surface-container-lowest border border-surface-container p-3">
                  <span className="text-xs text-on-surface-variant">{language === 'it' ? 'Codice prenotazione' : 'Booking code'}</span>
                  <span className="font-mono font-bold text-primary">{b.bookingNumber}</span>
                </div>
              )}

              {b.notes && (
                <div className="rounded-xl bg-surface-container-low p-4">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-on-surface-variant">{language === 'it' ? 'Note' : 'Notes'}</p>
                  <p className="text-sm text-on-surface">{b.notes}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 border-t border-surface-container pt-4">
                {b.status === 'PENDING' && (
                  <>
                    <Button size="sm" className="flex-1" onClick={() => handleStatusChange(b.id, 'CONFIRMED')}>
                      {t('common.confirm', language)}
                    </Button>
                    <Button variant="danger" size="sm" className="flex-1" onClick={() => handleCancel(b.id)}>
                      {t('booking.cancel', language)}
                    </Button>
                  </>
                )}
                {b.status === 'CONFIRMED' && (
                  <>
                    <Button size="sm" className="flex-1" onClick={() => handleStatusChange(b.id, 'COMPLETED')}>
                      {language === 'it' ? 'Completa' : 'Complete'}
                    </Button>
                    <Button variant="danger" size="sm" className="flex-1" onClick={() => handleCancel(b.id)}>
                      {t('booking.cancel', language)}
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" className="flex-1" onClick={closeDetail}>
                  {language === 'it' ? 'Chiudi' : 'Close'}
                </Button>
              </div>
            </div>
          )
        })()}
      </Modal>
    </div>
  )
}
