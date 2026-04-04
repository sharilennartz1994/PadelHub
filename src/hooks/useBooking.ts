import { useState, useCallback } from 'react'
import type { BookingFormData } from '../types/booking'

export function useBooking() {
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingFormData>({
    coachId: '',
    date: '',
    time: '',
    duration: 60,
    type: 'single',
    participants: [],
  })

  const totalSteps = 4

  const nextStep = useCallback(() => {
    setStep((s) => Math.min(s + 1, totalSteps))
  }, [])

  const prevStep = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1))
  }, [])

  const resetBooking = useCallback(() => {
    setStep(1)
    setBookingData({
      coachId: '',
      date: '',
      time: '',
      duration: 60,
      type: 'single',
      participants: [],
    })
  }, [])

  const updateBookingData = useCallback(
    (data: Partial<BookingFormData>) => {
      setBookingData((prev) => ({ ...prev, ...data }))
    },
    [],
  )

  const submitBooking = useCallback(async () => {
    // TODO: POST /api/bookings
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      id: crypto.randomUUID(),
      code: `PH-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
    }
  }, [])

  return {
    step,
    totalSteps,
    bookingData,
    updateBookingData,
    nextStep,
    prevStep,
    resetBooking,
    submitBooking,
  }
}
