import { ApiError } from '../services/api'

const IT: Record<string, string> = {
  'Invalid credentials': 'Email o password non corretti',
  'Email already registered': 'Email già registrata',
  'Timeout: la richiesta ha impiegato troppo tempo': 'La richiesta ha impiegato troppo tempo. Riprova.',
  'Request failed (401)': 'Non autorizzato. Effettua di nuovo il login.',
  'Request failed (403)': 'Accesso negato.',
  'Request failed (404)': 'Risorsa non trovata.',
  'Request failed (500)': 'Errore del server. Riprova più tardi.',
}

const EN: Record<string, string> = {
  'Invalid credentials': 'Invalid email or password',
  'Email already registered': 'Email already registered',
  'Timeout: la richiesta ha impiegato troppo tempo': 'The request took too long. Please try again.',
}

export function mapApiErrorMessage(
  err: unknown,
  lang: 'it' | 'en',
): string {
  if (err instanceof ApiError && err.code === 'INSUFFICIENT_ROLE') {
    return lang === 'it'
      ? 'Non hai i permessi necessari per questa operazione.'
      : 'You do not have permission for this action.'
  }
  if (err instanceof ApiError && err.code === 'UNAUTHORIZED_RESOURCE_ACCESS') {
    return lang === 'it'
      ? 'Non puoi accedere a questa risorsa.'
      : 'You cannot access this resource.'
  }
  if (err instanceof ApiError && err.code === 'EMAIL_NOT_VERIFIED') {
    return lang === 'it'
      ? 'Verifica l’email prima di prenotare. Controlla la posta o richiedi un nuovo link dal profilo.'
      : 'Verify your email before booking. Check your inbox or request a new link from your profile.'
  }
  const msg = err instanceof Error ? err.message : String(err)
  if (msg === 'Email not verified') {
    return lang === 'it'
      ? 'Verifica l’email prima di prenotare.'
      : 'Verify your email before booking.'
  }
  const table = lang === 'it' ? IT : EN
  return table[msg] ?? msg
}
