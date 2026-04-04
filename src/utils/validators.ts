export const emailPattern = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: 'Inserisci un indirizzo email valido',
}

export const passwordRules = {
  required: 'La password è obbligatoria',
  minLength: {
    value: 8,
    message: 'La password deve contenere almeno 8 caratteri',
  },
}

export const phonePattern = {
  value: /^(\+39)?\s?\d{3}\s?\d{3}\s?\d{4}$/,
  message: 'Inserisci un numero di telefono valido',
}

export const requiredField = (fieldName: string) => ({
  required: `${fieldName} è obbligatorio`,
})

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function formatDate(dateStr: string, lang: 'it' | 'en' = 'it'): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function formatTime(time: string): string {
  return time.slice(0, 5)
}
