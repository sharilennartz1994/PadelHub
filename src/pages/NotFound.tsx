import { useNavigate } from 'react-router-dom'
import { useLanguageStore } from '../stores/languageStore'
import { t } from '../utils/i18n'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function NotFound() {
  const navigate = useNavigate()
  const { language } = useLanguageStore()

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-container-low px-4 pt-20">
      <Card className="max-w-md text-center" padding="lg">
        <div className="mb-6 font-headline text-8xl font-black text-primary/20">
          404
        </div>
        <h1 className="mb-3 font-headline text-2xl font-bold text-on-surface">
          {t('notFound.title', language)}
        </h1>
        <p className="mb-8 text-on-surface-variant">
          {t('notFound.description', language)}
        </p>
        <Button onClick={() => navigate('/')}>
          {t('notFound.backHome', language)}
        </Button>
      </Card>
    </div>
  )
}
