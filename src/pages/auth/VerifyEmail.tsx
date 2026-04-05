import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle } from 'lucide-react'
import { authService } from '../../services/api'
import { Button } from '../../components/ui/Button'

export function VerifyEmail() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token')
  const [status, setStatus] = useState<'loading' | 'ok' | 'err'>('loading')

  useEffect(() => {
    if (!token) {
      setStatus('err')
      return
    }
    authService
      .verifyEmail(token)
      .then(() => setStatus('ok'))
      .catch(() => setStatus('err'))
  }, [token])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-container-lowest px-6 py-16 pt-24">
      {status === 'loading' && (
        <p className="text-on-surface-variant">Verifica in corso…</p>
      )}
      {status === 'ok' && (
        <div className="max-w-md text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-tertiary" />
          <h1 className="font-headline text-2xl font-bold text-on-surface">Email verificata</h1>
          <p className="mt-2 text-on-surface-variant">
            Il tuo account è attivo. Puoi prenotare lezioni e usare tutte le funzioni.
          </p>
          <Button className="mt-8" onClick={() => navigate('/search')}>
            Vai alla ricerca coach
          </Button>
        </div>
      )}
      {status === 'err' && (
        <div className="max-w-md text-center">
          <XCircle className="mx-auto mb-4 h-16 w-16 text-error" />
          <h1 className="font-headline text-2xl font-bold text-on-surface">Link non valido</h1>
          <p className="mt-2 text-on-surface-variant">
            Il link è scaduto o non è valido. Accedi e richiedi un nuovo messaggio di verifica.
          </p>
          <Link to="/login">
            <Button className="mt-8" variant="outline">
              Vai al login
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
