import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search as SearchIcon, MapPin, Star, SlidersHorizontal, List, Map } from 'lucide-react'
import { useLanguageStore } from '../../stores/languageStore'
import { t } from '../../utils/i18n'
import { coachService } from '../../services/api'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'

interface CoachResult {
  id: string
  user: { name: string; surname?: string }
  bio?: string
  pricePerHour: number
  qualifications: string[]
  yearsExperience: number
  offersGroupLessons?: boolean
  groupPricePerPerson?: number
  locations: { id: string; name: string; address: string }[]
  _avg?: { rating: number }
  _count?: { reviews: number }
}

export function PlayerSearch() {
  const navigate = useNavigate()
  const { language } = useLanguageStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [coaches, setCoaches] = useState<CoachResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 })

  const fetchCoaches = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await coachService.searchCoaches({
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      })
      setCoaches(data as CoachResult[])
    } catch (err) {
      console.error('Failed to fetch coaches:', err)
    } finally {
      setIsLoading(false)
    }
  }, [priceRange.min, priceRange.max])

  useEffect(() => {
    fetchCoaches()
  }, [fetchCoaches])

  const filters = [
    { id: 'distance', label: t('search.distance', language) },
    { id: 'price', label: t('search.price', language) },
    { id: 'level', label: t('search.level', language) },
    { id: 'group', label: language === 'it' ? 'Gruppo' : 'Group' },
  ]

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    )
    if (id === 'price') {
      setPriceRange((p) => (p.max === 200 ? { min: 0, max: 50 } : { min: 0, max: 200 }))
    }
  }

  const displayed = coaches.filter((coach) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    const fullName = `${coach.user.name} ${coach.user.surname ?? ''}`.toLowerCase()
    return (
      fullName.includes(q) ||
      coach.locations.some((l) => l.name.toLowerCase().includes(q))
    )
  })

  return (
    <div className="min-h-screen bg-surface pt-20">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="mb-6 font-headline text-3xl font-bold text-on-surface">
            {t('search.title', language)}
          </h1>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder', language)}
                className="w-full rounded-xl bg-surface-container-lowest py-3.5 pl-12 pr-4 text-base shadow-soft border-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${viewMode === 'list' ? 'kinetic-gradient text-white shadow-sm' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}>
                <List className="h-4 w-4" />{t('search.list', language)}
              </button>
              <button onClick={() => setViewMode('map')} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${viewMode === 'map' ? 'kinetic-gradient text-white shadow-sm' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}>
                <Map className="h-4 w-4" />{t('search.map', language)}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3 overflow-x-auto hide-scrollbar">
          <button className="flex items-center gap-2 rounded-full bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface-variant shadow-soft hover:bg-surface-container">
            <SlidersHorizontal className="h-4 w-4" />{t('search.filters', language)}
          </button>
          {filters.map((filter) => (
            <button key={filter.id} onClick={() => toggleFilter(filter.id)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${activeFilters.includes(filter.id) ? 'bg-secondary-container text-on-secondary shadow-sm' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}>
              {filter.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : viewMode === 'list' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayed.map((coach) => {
              const name = `${coach.user.name} ${coach.user.surname ?? ''}`.trim()
              const initials = `${coach.user.name[0]}${(coach.user.surname?.[0] ?? coach.user.name[1] ?? '').toUpperCase()}`
              const rating = coach._avg?.rating ?? 0
              const reviewCount = coach._count?.reviews ?? 0

              return (
                <Card key={coach.id} padding="none" onClick={() => navigate(`/coach/${coach.id}`)} className="overflow-hidden">
                  <div className="relative h-40 kinetic-gradient">
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <Avatar initials={initials} size="xl" className="border-4 border-white shadow-elevated" />
                      <Badge variant="success" size="sm">
                        {language === 'it' ? 'Verificato' : 'Verified'}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-headline text-lg font-bold text-on-surface">{name}</h3>
                        {coach.locations[0] && (
                          <div className="mt-1 flex items-center gap-1.5 text-sm text-on-surface-variant">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate">{coach.locations[0].name}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-headline text-xl font-bold text-primary">€{coach.pricePerHour}</p>
                        <p className="text-xs text-on-surface-variant">{t('search.perHour', language)}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-on-surface">{rating ? rating.toFixed(1) : '—'}</span>
                        <span className="text-xs text-on-surface-variant">({reviewCount})</span>
                      </div>
                      <span className="text-xs text-on-surface-variant">{coach.yearsExperience} {language === 'it' ? 'anni' : 'years'}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {coach.qualifications?.slice(0, 2).map((q) => (
                        <Badge key={q} variant="default" size="sm">{q}</Badge>
                      ))}
                    </div>
                    <Button className="mt-4 w-full" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/coach/${coach.id}`) }}>
                      {t('search.bookNow', language)}
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="flex h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container">
                <Map className="h-10 w-10 text-on-surface-variant/30" />
              </div>
              <p className="font-headline text-lg font-bold text-on-surface-variant">
                {language === 'it' ? 'Mappa interattiva in arrivo' : 'Interactive map coming soon'}
              </p>
            </div>
          </Card>
        )}

        {!isLoading && displayed.length === 0 && viewMode === 'list' && (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-on-surface-variant">
              {language === 'it' ? 'Nessun coach trovato' : 'No coaches found'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
