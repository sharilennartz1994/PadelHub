import { useState, useCallback } from 'react'
import type { Coach, CoachSearchFilters } from '../types/coach'
import { mockCoaches } from '../services/mockData'

export function useCoach() {
  const [coaches, setCoaches] = useState<Coach[]>(mockCoaches)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)

  const searchCoaches = useCallback(async (filters: CoachSearchFilters) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    let results = [...mockCoaches]
    if (filters.query) {
      const q = filters.query.toLowerCase()
      results = results.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          c.locations.some((l) => l.name.toLowerCase().includes(q)),
      )
    }
    if (filters.maxPrice) {
      results = results.filter((c) => c.hourlyRate <= filters.maxPrice!)
    }

    setCoaches(results)
    setIsLoading(false)
  }, [])

  const getCoachById = useCallback(
    (id: string) => {
      const coach = mockCoaches.find((c) => c.id === id) ?? null
      setSelectedCoach(coach)
      return coach
    },
    [],
  )

  return { coaches, isLoading, selectedCoach, searchCoaches, getCoachById }
}
