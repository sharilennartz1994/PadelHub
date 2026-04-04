import { Link } from 'react-router-dom'
import { useLanguageStore } from '../../stores/languageStore'
import { t } from '../../utils/i18n'
import { Globe, Camera, AtSign } from 'lucide-react'

export function Footer() {
  const { language } = useLanguageStore()

  return (
    <footer className="bg-surface-container-high py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid gap-12 md:grid-cols-4">
          <div>
            <div className="mb-6 text-3xl font-black tracking-tighter text-primary font-headline">
              PadelHub
            </div>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              {t('footer.description', language)}
            </p>
          </div>

          <div>
            <h4 className="mb-6 font-headline font-extrabold">
              {t('footer.platform', language)}
            </h4>
            <ul className="space-y-4 text-sm font-medium text-on-surface-variant">
              <li>
                <Link
                  to="/search"
                  className="hover:text-primary transition-colors"
                >
                  {t('footer.searchCoach', language)}
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t('footer.affiliatedClubs', language)}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t('footer.tournaments', language)}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-headline font-extrabold">
              {t('footer.support', language)}
            </h4>
            <ul className="space-y-4 text-sm font-medium text-on-surface-variant">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t('footer.helpCenter', language)}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t('footer.contactUs', language)}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t('footer.faq', language)}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-headline font-extrabold">
              {t('footer.social', language)}
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-soft hover:scale-110 transition-all"
                aria-label="Website"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-soft hover:scale-110 transition-all"
                aria-label="Instagram"
              >
                <Camera className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-soft hover:scale-110 transition-all"
                aria-label="Email"
              >
                <AtSign className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-outline-variant/30 pt-8 text-sm font-medium text-on-surface-variant md:flex-row md:items-center md:justify-between">
          <p>{t('footer.rights', language)}</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              {t('footer.privacy', language)}
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              {t('footer.terms', language)}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
