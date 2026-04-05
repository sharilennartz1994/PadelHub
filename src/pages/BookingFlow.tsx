import { useState, useEffect, useMemo } from 'react'
import { mapApiErrorMessage } from '../utils/apiErrors'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Clock, Calendar, MapPin, Users, User, CreditCard, Banknote, Copy, Check } from 'lucide-react'
import { useLanguageStore } from '../stores/languageStore'
import { useAuthStore } from '../stores/authStore'
import { t } from '../utils/i18n'
import { bookingService } from '../services/api'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'

export interface BookingLocation {
  id: string
  name: string
  address: string
  latitude?: number
  longitude?: number
}

export interface TrainingOfferRow {
  kind: 'SINGLE' | 'GROUP'
  priceCents: number
}

interface BookingFlowProps {
  coachId: string
  coachName: string
  coachInitials: string
  coachQualification: string
  /** Prezzo/ora in centesimi (come da API) */
  pricePerHourCents: number
  groupPriceCents?: number | null
  offersGroup: boolean
  /** Se presente, ha priorità sui campi legacy sopra */
  trainingOffers?: TrainingOfferRow[]
  locations: BookingLocation[]
  selectedDate: string
  selectedTime: string
  onClose: () => void
}

function euroFromCents(cents: number) {
  return (cents / 100).toLocaleString('it-IT', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

type LessonType = 'SINGLE' | 'GROUP'

export function BookingFlow({
  coachId,
  coachName,
  coachInitials,
  coachQualification,
  pricePerHourCents,
  groupPriceCents,
  offersGroup,
  trainingOffers,
  locations,
  selectedDate,
  selectedTime,
  onClose,
}: BookingFlowProps) {
  const navigate = useNavigate()
  const { language } = useLanguageStore()
  const { user, getToken } = useAuthStore()
  const [step, setStep] = useState(1)
  const [duration, setDuration] = useState(60)
  const [lessonType, setLessonType] = useState<LessonType>('SINGLE')
  const [, setPaymentMethod] = useState<'later' | 'card'>('later')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingCode, setBookingCode] = useState('')
  const [apiError, setApiError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [selectedLocationId, setSelectedLocationId] = useState('')

  useEffect(() => {
    if (locations.length > 0 && !selectedLocationId) {
      setSelectedLocationId(locations[0].id)
    }
  }, [locations, selectedLocationId])

  const selectedLocation = useMemo(
    () => locations.find((l) => l.id === selectedLocationId),
    [locations, selectedLocationId],
  )

  const singleCents = useMemo(() => {
    const o = trainingOffers?.find((x) => x.kind === 'SINGLE')
    return o?.priceCents ?? pricePerHourCents
  }, [trainingOffers, pricePerHourCents])

  const groupOfferCents = useMemo(() => {
    const o = trainingOffers?.find((x) => x.kind === 'GROUP')
    return o?.priceCents ?? groupPriceCents ?? null
  }, [trainingOffers, groupPriceCents])

  const canBookGroup = useMemo(() => {
    if (trainingOffers?.some((x) => x.kind === 'GROUP')) return true
    return offersGroup && groupOfferCents != null && groupOfferCents > 0
  }, [trainingOffers, offersGroup, groupOfferCents])

  useEffect(() => {
    if (lessonType === 'GROUP' && !canBookGroup) setLessonType('SINGLE')
  }, [lessonType, canBookGroup])

  const rateCents =
    lessonType === 'GROUP' && groupOfferCents ? groupOfferCents : singleCents
  const totalPriceCents = Math.round(rateCents * (duration / 60))

  const nextStep = () => setStep((s) => Math.min(s + 1, 4))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const goNextFromStep1 = () => {
    if (locations.length === 0 || !selectedLocationId) {
      setApiError(
        language === 'it'
          ? 'Seleziona un campo / club dove svolgere la lezione.'
          : 'Please select a court / location for the lesson.',
      )
      return
    }
    setApiError(null)
    nextStep()
  }

  const handleConfirm = async () => {
    const token = getToken()
    if (!token || !user) {
      navigate('/login')
      return
    }
    if (!user.playerId) {
      setApiError(
        language === 'it'
          ? 'Profilo giocatore non trovato. Esci e accedi di nuovo.'
          : 'Player profile not found. Please log in again.',
      )
      return
    }
    setIsSubmitting(true)
    setApiError(null)
    try {
      const lessonDateTime = `${selectedDate}T${selectedTime}:00.000Z`
      const result = await bookingService.createBooking(
        {
          coachId,
          playerId: user.playerId,
          lessonDate: lessonDateTime,
          duration,
          type: lessonType,
          price: totalPriceCents,
          locationId: selectedLocationId,
          locationName: selectedLocation?.name ?? '',
          latitude: selectedLocation?.latitude,
          longitude: selectedLocation?.longitude,
        },
        token,
      )
      setBookingCode((result as Record<string, unknown>).bookingNumber as string ?? (result as Record<string, unknown>).id as string ?? 'OK')
      nextStep()
    } catch (err) {
      setApiError(
        mapApiErrorMessage(err, language === 'it' ? 'it' : 'en'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(bookingCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stepLabels = [
    t('booking.details', language),
    t('booking.summary', language),
    t('booking.payment', language),
    t('booking.confirmation', language),
  ]

  return (
    <Modal isOpen onClose={step === 4 ? () => navigate('/player/bookings') : onClose} size="lg">
      {/* Stepper */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${i + 1 <= step ? 'kinetic-gradient text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                  {i + 1 < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className="mt-1 hidden text-[10px] font-medium text-on-surface-variant sm:block">{label}</span>
              </div>
              {i < 3 && <div className={`mx-2 h-0.5 flex-1 rounded-full transition-all ${i + 1 < step ? 'kinetic-gradient' : 'bg-surface-container'}`} />}
            </div>
          ))}
        </div>
      </div>

      {apiError && (
        <div className="mb-4 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">{apiError}</div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <h3 className="font-headline text-xl font-bold">{t('booking.details', language)}</h3>
          {locations.length > 0 ? (
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {language === 'it' ? 'Campo / Club' : 'Court / Club'}
              </label>
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-low px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} — {loc.address}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-on-surface">
              {language === 'it'
                ? 'Questo coach non ha ancora indicato un campo. Contatta il coach.'
                : 'This coach has no locations yet. Please contact the coach.'}
            </p>
          )}
          <div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-4">
            <Calendar className="h-5 w-5 text-primary" /><span className="font-medium">{selectedDate}</span>
            <Clock className="ml-4 h-5 w-5 text-primary" /><span className="font-medium">{selectedTime}</span>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">{t('booking.duration', language)}</label>
            <div className="grid grid-cols-4 gap-2">
              {[60, 90, 120].map((d) => (
                <button key={d} onClick={() => setDuration(d)} className={`rounded-xl px-3 py-3 text-sm font-medium transition-all ${duration === d ? 'kinetic-gradient text-white shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}>{d} min</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">{t('booking.type', language)}</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setLessonType('SINGLE')} className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${lessonType === 'SINGLE' ? 'border-primary bg-primary/5' : 'border-surface-container-high hover:border-primary/30'}`}>
                <User className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-on-surface">{t('booking.single', language)}</p>
                  <p className="text-xs text-on-surface-variant">€{euroFromCents(singleCents)}/h</p>
                </div>
              </button>
              <button onClick={() => setLessonType('GROUP')} disabled={!canBookGroup} className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${lessonType === 'GROUP' ? 'border-primary bg-primary/5' : 'border-surface-container-high hover:border-primary/30'} disabled:opacity-40 disabled:cursor-not-allowed`}>
                <Users className="h-5 w-5 text-secondary" />
                <div className="text-left">
                  <p className="font-medium text-on-surface">{t('booking.group', language)}</p>
                  <p className="text-xs text-on-surface-variant">
                    {groupOfferCents ? `€${euroFromCents(groupOfferCents)}/h` : 'N/A'}
                  </p>
                </div>
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>{t('booking.cancel', language)}</Button>
            <Button
              className="flex-1"
              disabled={locations.length === 0}
              onClick={goNextFromStep1}
            >
              {t('booking.continue', language)}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h3 className="font-headline text-xl font-bold">{t('booking.summary', language)}</h3>
          <div className="flex items-center gap-4 rounded-xl bg-surface-container-low p-4">
            <Avatar initials={coachInitials} size="lg" />
            <div className="flex-1">
              <p className="font-headline font-bold">{coachName}</p>
              <p className="text-sm text-on-surface-variant">{coachQualification}</p>
            </div>
            <div className="rounded-xl p-3 kinetic-gradient text-center text-white"><p className="text-2xl font-black">€{euroFromCents(totalPriceCents)}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-surface-container-low p-4"><Calendar className="mb-2 h-5 w-5 text-primary" /><p className="text-xs text-on-surface-variant">{language === 'it' ? 'Data' : 'Date'}</p><p className="font-medium">{selectedDate}</p></div>
            <div className="rounded-xl bg-surface-container-low p-4"><Clock className="mb-2 h-5 w-5 text-primary" /><p className="text-xs text-on-surface-variant">{language === 'it' ? 'Orario' : 'Time'}</p><p className="font-medium">{selectedTime}</p></div>
            <div className="rounded-xl bg-surface-container-low p-4"><MapPin className="mb-2 h-5 w-5 text-primary" /><p className="text-xs text-on-surface-variant">{t('booking.duration', language)}</p><p className="font-medium">{duration} min</p></div>
            <div className="rounded-xl bg-surface-container-low p-4"><Users className="mb-2 h-5 w-5 text-primary" /><p className="text-xs text-on-surface-variant">{t('booking.type', language)}</p><p className="font-medium">{lessonType === 'SINGLE' ? t('booking.single', language) : t('booking.group', language)}</p></div>
            <div className="col-span-2 rounded-xl bg-surface-container-low p-4"><MapPin className="mb-2 h-5 w-5 text-primary" /><p className="text-xs text-on-surface-variant">{language === 'it' ? 'Luogo' : 'Location'}</p><p className="font-medium">{selectedLocation?.name ?? '—'}</p></div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={prevStep}>{t('common.back', language)}</Button>
            <Button className="flex-1" onClick={nextStep}>{t('booking.confirm', language)}</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h3 className="font-headline text-xl font-bold">{t('booking.payment', language)}</h3>
          <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4 text-sm text-secondary">
            {language === 'it' ? 'Seleziona il metodo di pagamento preferito' : 'Select your preferred payment method'}
          </div>
          <div className="space-y-3">
            <button onClick={() => setPaymentMethod('later')} className="flex w-full items-center gap-4 rounded-xl border-2 border-primary bg-primary/5 p-5 text-left">
              <Banknote className="h-6 w-6 text-primary" />
              <div>
                <p className="font-bold text-on-surface">{t('booking.payLater', language)}</p>
                <p className="text-sm text-on-surface-variant">{language === 'it' ? 'Paga direttamente al coach alla lezione' : 'Pay the coach directly at the lesson'}</p>
              </div>
            </button>
            <button disabled className="flex w-full items-center gap-4 rounded-xl border-2 border-surface-container-high p-5 text-left opacity-40 cursor-not-allowed">
              <CreditCard className="h-6 w-6 text-on-surface-variant" />
              <div>
                <p className="font-bold text-on-surface">{t('booking.payCard', language)}</p>
                <p className="text-sm text-on-surface-variant">{t('booking.payCardSoon', language)}</p>
              </div>
              <Badge variant="info" size="sm" className="ml-auto">Soon</Badge>
            </button>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={prevStep}>{t('common.back', language)}</Button>
            <Button className="flex-1" loading={isSubmitting} onClick={handleConfirm}>{language === 'it' ? 'Procedi' : 'Proceed'}</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-tertiary/10">
            <CheckCircle className="h-10 w-10 text-tertiary" />
          </div>
          <div>
            <h3 className="font-headline text-2xl font-bold text-on-surface">{t('booking.success', language)}</h3>
            <p className="mt-2 text-on-surface-variant">{t('booking.successDesc', language)}</p>
          </div>
          <div className="rounded-xl bg-surface-container-low p-6 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-on-surface-variant">Coach</p><p className="font-bold">{coachName}</p></div>
              <div><p className="text-xs text-on-surface-variant">{language === 'it' ? 'Data' : 'Date'}</p><p className="font-bold">{selectedDate}</p></div>
              <div><p className="text-xs text-on-surface-variant">{language === 'it' ? 'Orario' : 'Time'}</p><p className="font-bold">{selectedTime}</p></div>
              <div><p className="text-xs text-on-surface-variant">{language === 'it' ? 'Prezzo' : 'Price'}</p><p className="font-bold text-primary">€{euroFromCents(totalPriceCents)}</p></div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-surface-container-lowest p-3">
              <div><p className="text-xs text-on-surface-variant">{t('booking.code', language)}</p><p className="font-mono font-bold text-primary">{bookingCode}</p></div>
              <button onClick={handleCopyCode} className="rounded-lg p-2 hover:bg-surface-container transition-colors" aria-label="Copy booking code">
                {copied ? <Check className="h-4 w-4 text-tertiary" /> : <Copy className="h-4 w-4 text-on-surface-variant" />}
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => navigate('/search')}>{t('booking.backToSearch', language)}</Button>
            <Button className="flex-1" onClick={() => navigate('/player/bookings')}>{t('booking.viewBookings', language)}</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
