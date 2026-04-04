import { useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Zap, Users, CheckCircle } from 'lucide-react'
import { useLanguageStore } from '../stores/languageStore'
import { t } from '../utils/i18n'
import { Footer } from '../components/shared/Footer'

export function Landing() {
  const navigate = useNavigate()
  const { language } = useLanguageStore()

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden pt-20 hero-diagonal">
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
          <div className="space-y-8 text-white">
            <h1 className="font-headline text-5xl font-black leading-[0.95] tracking-tighter md:text-7xl">
              {t('home.title', language).split('Cagliari')[0]}
              <span className="italic text-primary-fixed">Cagliari</span>
            </h1>
            <p className="max-w-lg text-xl font-medium text-white/90 md:text-2xl">
              {t('home.subtitle', language)}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate('/search')}
                className="kinetic-gradient flex items-center gap-3 rounded-xl px-10 py-5 text-lg font-black text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                {t('home.cta.findCoach', language)}
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/coach/signup')}
                className="rounded-xl border-2 border-white/30 bg-white/10 px-10 py-5 text-lg font-black text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                {t('home.cta.becomeCoach', language)}
              </button>
            </div>
          </div>

          <div className="relative hidden justify-center md:flex">
            <div className="absolute h-[500px] w-[500px] rounded-full bg-primary-container/20 blur-[120px]" />
            <div className="relative h-72 w-72 md:h-96 md:w-96">
              <div className="absolute inset-0 animate-bounce-slow rounded-full bg-tertiary-fixed shadow-[0_0_80px_rgba(148,249,144,0.4)]" />
              <div className="absolute -bottom-10 -right-10 w-48 rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md rotate-6 hover:rotate-0 transition-transform duration-500">
                <ShieldCheck className="mb-2 h-10 w-10 text-tertiary-fixed" />
                <p className="font-headline text-lg font-black text-white">
                  {language === 'it' ? 'Qualità Pro' : 'Pro Quality'}
                </p>
                <p className="text-xs font-medium text-white/70">
                  {language === 'it'
                    ? 'Coach selezionati manualmente'
                    : 'Handpicked coaches'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-surface to-transparent" />
      </section>

      {/* Why Us */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-20 text-center">
          <h2 className="font-headline text-4xl font-black tracking-tighter text-primary md:text-5xl">
            {t('home.whyUs', language)}
          </h2>
          <div className="mx-auto mt-4 h-1.5 w-24 rounded-full kinetic-gradient" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="group rounded-[2rem] bg-surface-container-lowest p-10 shadow-teal-ambient transition-all duration-500 hover:scale-105 hover:shadow-elevated">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/10 transition-colors group-hover:bg-primary group-hover:text-white">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="mb-4 font-headline text-2xl font-extrabold">
              {t('home.verifiedCoaches', language)}
            </h3>
            <p className="leading-relaxed text-on-surface-variant">
              {t('home.verifiedCoachesDesc', language)}
            </p>
          </div>

          <div className="group rounded-[2rem] bg-surface-container-lowest p-10 shadow-teal-ambient transition-all duration-500 hover:scale-105 hover:shadow-elevated">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-container/10 transition-colors group-hover:bg-secondary-container group-hover:text-white">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="mb-4 font-headline text-2xl font-extrabold">
              {t('home.instantBooking', language)}
            </h3>
            <p className="leading-relaxed text-on-surface-variant">
              {t('home.instantBookingDesc', language)}
            </p>
          </div>

          <div className="group rounded-[2rem] bg-surface-container-lowest p-10 shadow-teal-ambient transition-all duration-500 hover:scale-105 hover:shadow-elevated">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-tertiary-container/10 transition-colors group-hover:bg-tertiary-container group-hover:text-white">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="mb-4 font-headline text-2xl font-extrabold">
              {t('home.padelCommunity', language)}
            </h3>
            <p className="leading-relaxed text-on-surface-variant">
              {t('home.padelCommunityDesc', language)}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-outline-variant/10 bg-surface-container-low py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-12 px-6 text-center md:grid-cols-3">
          <div className="space-y-2">
            <p className="font-headline text-5xl font-black tracking-tighter text-primary md:text-6xl">
              50+
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">
              {t('home.stats.coaches', language)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-headline text-5xl font-black tracking-tighter text-primary md:text-6xl">
              1000+
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">
              {t('home.stats.students', language)}
            </p>
          </div>
          <div className="col-span-2 space-y-2 md:col-span-1">
            <p className="font-headline text-5xl font-black tracking-tighter text-primary md:text-6xl">
              500+
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">
              {t('home.stats.lessons', language)}
            </p>
          </div>
        </div>
      </section>

      {/* Feature */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col overflow-hidden rounded-[3rem] bg-primary text-white shadow-elevated md:flex-row">
          <div className="flex flex-col justify-center p-12 md:w-1/2 md:p-20">
            <h2 className="mb-8 font-headline text-4xl font-black leading-tight md:text-5xl">
              {t('home.findCourt', language)}
            </h2>
            <ul className="space-y-6">
              {[
                t('home.interactiveMap', language),
                t('home.filterPrice', language),
                t('home.certifiedReviews', language),
              ].map((text) => (
                <li key={text} className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-primary-fixed" />
                  <span className="text-lg font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative min-h-[400px] bg-primary-container/30 md:w-1/2">
            <div className="absolute inset-0 flex items-center justify-center text-on-primary/30">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                  <Search className="h-10 w-10" />
                </div>
                <p className="font-headline text-lg font-bold">
                  {language === 'it' ? 'Mappa interattiva' : 'Interactive map'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-24 text-center">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[3rem] p-12 kinetic-gradient md:p-24">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative mb-8 font-headline text-4xl font-black tracking-tighter text-white md:text-6xl">
            {t('home.startPlaying', language)}
          </h2>
          <p className="relative mx-auto mb-12 max-w-xl text-xl text-white/80">
            {t('home.startPlayingDesc', language)}
          </p>
          <div className="relative flex flex-col justify-center gap-4 md:flex-row">
            <button
              onClick={() => navigate('/search')}
              className="rounded-xl bg-white px-12 py-5 text-xl font-black text-primary shadow-xl transition-all hover:scale-105"
            >
              {t('home.searchCoach', language)}
            </button>
            <button
              onClick={() => navigate('/coach/signup')}
              className="rounded-xl border-2 border-white/40 bg-transparent px-12 py-5 text-xl font-black text-white transition-all hover:bg-white/10"
            >
              {t('home.coachArea', language)}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx={11} cy={11} r={8} />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
