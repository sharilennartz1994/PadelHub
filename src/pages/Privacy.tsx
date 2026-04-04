import { useLanguageStore } from '../stores/languageStore'

export function Privacy() {
  const { language } = useLanguageStore()
  const isIt = language === 'it'

  return (
    <div className="min-h-screen bg-surface-container-lowest pt-20">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-2 font-headline text-4xl font-black text-on-surface">
          {isIt ? 'Informativa sulla Privacy' : 'Privacy Policy'}
        </h1>
        <p className="mb-10 text-sm text-on-surface-variant">
          {isIt ? 'Ultimo aggiornamento: 4 aprile 2026' : 'Last updated: April 4, 2026'}
        </p>

        <div className="space-y-10 text-on-surface-variant leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              1. {isIt ? 'Titolare del trattamento' : 'Data Controller'}
            </h2>
            <p>
              {isIt
                ? 'Il Titolare del trattamento dei dati personali è Marco Rossi, con sede in Cagliari (di seguito "PadelHub" o "Titolare").'
                : 'The Data Controller is Marco Rossi, based in Cagliari (hereinafter "PadelHub" or "Controller").'}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Email: marco@padelhub.it</li>
              <li>{isIt ? 'Sede' : 'Address'}: Cagliari, Italia</li>
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              2. {isIt ? 'Quali dati raccogliamo' : 'Data we collect'}
            </h2>
            <p className="mb-3">
              {isIt
                ? 'PadelHub raccoglie i seguenti dati personali:'
                : 'PadelHub collects the following personal data:'}
            </p>

            <h3 className="mb-2 mt-4 font-headline text-lg font-bold text-on-surface">
              {isIt ? 'Dati di registrazione' : 'Registration data'}
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>{isIt ? 'Nome e cognome' : 'First and last name'}</li>
              <li>{isIt ? 'Indirizzo email' : 'Email address'}</li>
              <li>{isIt ? 'Numero di telefono (opzionale)' : 'Phone number (optional)'}</li>
              <li>{isIt ? 'Password (hash crittografico)' : 'Password (cryptographic hash)'}</li>
              <li>{isIt ? 'Ruolo: Coach o Allievo' : 'Role: Coach or Player'}</li>
            </ul>

            <h3 className="mb-2 mt-4 font-headline text-lg font-bold text-on-surface">
              {isIt ? 'Dati del coach (aggiuntivi)' : 'Coach data (additional)'}
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>{isIt ? 'Qualifiche e certificazioni' : 'Qualifications and certifications'}</li>
              <li>{isIt ? 'Anni di esperienza' : 'Years of experience'}</li>
              <li>{isIt ? 'Prezzo per lezione' : 'Lesson price'}</li>
              <li>{isIt ? 'Bio professionale' : 'Professional bio'}</li>
              <li>{isIt ? 'Posizione dei campi (coordinate GPS)' : 'Court locations (GPS coordinates)'}</li>
              <li>{isIt ? 'Disponibilità oraria' : 'Hourly availability'}</li>
            </ul>

            <h3 className="mb-2 mt-4 font-headline text-lg font-bold text-on-surface">
              {isIt ? 'Dati di utilizzo' : 'Usage data'}
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>{isIt ? 'Prenotazioni effettuate (date, orari, status)' : 'Bookings (dates, times, status)'}</li>
              <li>{isIt ? 'Messaggi scambiati tra coach e allievi' : 'Messages between coach and players'}</li>
              <li>{isIt ? 'Recensioni e valutazioni' : 'Reviews and ratings'}</li>
              <li>{isIt ? 'Log di accesso (IP, browser, data/ora)' : 'Access logs (IP, browser, date/time)'}</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              3. {isIt ? 'Finalità del trattamento' : 'Purpose of processing'}
            </h2>
            <p className="mb-3">
              {isIt ? 'I dati sono trattati per le seguenti finalità:' : 'Data is processed for the following purposes:'}
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>{isIt ? 'Erogazione del servizio:' : 'Service delivery:'}</strong>{' '}
                {isIt
                  ? 'Creare e gestire il tuo account, permettere la ricerca di coach, la prenotazione di lezioni, la comunicazione tra utenti.'
                  : 'Create and manage your account, enable coach search, lesson booking, and user communication.'}
              </li>
              <li>
                <strong>{isIt ? 'Sicurezza:' : 'Security:'}</strong>{' '}
                {isIt
                  ? 'Proteggere la piattaforma da accessi non autorizzati, frodi e abusi.'
                  : 'Protect the platform from unauthorized access, fraud, and abuse.'}
              </li>
              <li>
                <strong>{isIt ? 'Miglioramento del servizio:' : 'Service improvement:'}</strong>{' '}
                {isIt
                  ? 'Analizzare l\'utilizzo della piattaforma per migliorare l\'esperienza utente.'
                  : 'Analyze platform usage to improve user experience.'}
              </li>
              <li>
                <strong>{isIt ? 'Comunicazioni:' : 'Communications:'}</strong>{' '}
                {isIt
                  ? 'Inviarti notifiche relative alle prenotazioni, messaggi dai coach/allievi, aggiornamenti del servizio.'
                  : 'Send booking notifications, messages from coaches/players, service updates.'}
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              4. {isIt ? 'Base giuridica' : 'Legal basis'}
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>{isIt ? 'Esecuzione del contratto' : 'Contract execution'}</strong> (Art. 6.1.b GDPR):{' '}
                {isIt
                  ? 'Per fornire i servizi richiesti (registrazione, prenotazione, messaggistica).'
                  : 'To provide the requested services (registration, booking, messaging).'}
              </li>
              <li>
                <strong>{isIt ? 'Consenso' : 'Consent'}</strong> (Art. 6.1.a GDPR):{' '}
                {isIt
                  ? 'Per comunicazioni di marketing (se espressamente autorizzate).'
                  : 'For marketing communications (if expressly authorized).'}
              </li>
              <li>
                <strong>{isIt ? 'Interesse legittimo' : 'Legitimate interest'}</strong> (Art. 6.1.f GDPR):{' '}
                {isIt
                  ? 'Per prevenire frodi, garantire la sicurezza, migliorare il servizio.'
                  : 'To prevent fraud, ensure security, and improve the service.'}
              </li>
              <li>
                <strong>{isIt ? 'Obbligo di legge' : 'Legal obligation'}</strong> (Art. 6.1.c GDPR):{' '}
                {isIt
                  ? 'Per adempiere a obblighi fiscali e normativi.'
                  : 'To comply with tax and regulatory obligations.'}
              </li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              5. {isIt ? 'Conservazione dei dati' : 'Data retention'}
            </h2>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong>{isIt ? 'Account attivo:' : 'Active account:'}</strong>{' '}
                {isIt ? 'Per tutta la durata dell\'iscrizione.' : 'For the duration of the subscription.'}
              </li>
              <li>
                <strong>{isIt ? 'Messaggi:' : 'Messages:'}</strong>{' '}
                {isIt ? '12 mesi dalla data di invio.' : '12 months from the date sent.'}
              </li>
              <li>
                <strong>{isIt ? 'Dati fiscali:' : 'Tax data:'}</strong>{' '}
                {isIt ? '5 anni come richiesto dalla legge italiana.' : '5 years as required by Italian law.'}
              </li>
              <li>
                <strong>{isIt ? 'Dopo cancellazione account:' : 'After account deletion:'}</strong>{' '}
                {isIt
                  ? 'I dati personali vengono cancellati entro 30 giorni, salvo obblighi di legge.'
                  : 'Personal data is deleted within 30 days, except for legal obligations.'}
              </li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              6. {isIt ? 'Condivisione dei dati' : 'Data sharing'}
            </h2>
            <p className="mb-3">
              {isIt
                ? 'I tuoi dati NON vengono venduti a terzi. Possono essere condivisi con:'
                : 'Your data is NOT sold to third parties. It may be shared with:'}
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong>{isIt ? 'Altri utenti:' : 'Other users:'}</strong>{' '}
                {isIt
                  ? 'Nome, qualifiche, posizione e disponibilità dei coach sono visibili agli allievi. Nome degli allievi è visibile ai coach con cui hanno prenotato.'
                  : 'Coach name, qualifications, location, and availability are visible to players. Player names are visible to coaches they booked with.'}
              </li>
              <li>
                <strong>{isIt ? 'Provider di servizi:' : 'Service providers:'}</strong>{' '}
                {isIt
                  ? 'Hosting (server in UE), servizi di geocodifica (OpenStreetMap/Nominatim).'
                  : 'Hosting (EU servers), geocoding services (OpenStreetMap/Nominatim).'}
              </li>
              <li>
                <strong>{isIt ? 'Autorità competenti:' : 'Competent authorities:'}</strong>{' '}
                {isIt
                  ? 'Se richiesto dalla legge, da un ordine giudiziario o per proteggere i diritti di PadelHub.'
                  : 'If required by law, court order, or to protect PadelHub\'s rights.'}
              </li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              7. {isIt ? 'I tuoi diritti (GDPR)' : 'Your rights (GDPR)'}
            </h2>
            <p className="mb-3">
              {isIt
                ? 'Ai sensi del Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003, hai il diritto di:'
                : 'Under EU Regulation 2016/679 (GDPR) and Italian D.Lgs. 196/2003, you have the right to:'}
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>{isIt ? 'Accedere ai tuoi dati personali' : 'Access your personal data'}</li>
              <li>{isIt ? 'Rettificare dati inesatti' : 'Rectify inaccurate data'}</li>
              <li>{isIt ? 'Cancellare i tuoi dati ("diritto all\'oblio")' : 'Delete your data ("right to be forgotten")'}</li>
              <li>{isIt ? 'Limitare il trattamento' : 'Restrict processing'}</li>
              <li>{isIt ? 'Portabilità dei dati' : 'Data portability'}</li>
              <li>{isIt ? 'Opporti al trattamento' : 'Object to processing'}</li>
              <li>{isIt ? 'Revocare il consenso in qualsiasi momento' : 'Withdraw consent at any time'}</li>
            </ul>
            <p className="mt-4">
              {isIt
                ? 'Per esercitare questi diritti, contattaci a: marco@padelhub.it'
                : 'To exercise these rights, contact us at: marco@padelhub.it'}
            </p>
            <p className="mt-2">
              {isIt
                ? 'Hai inoltre il diritto di proporre reclamo all\'Autorità Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).'
                : 'You also have the right to lodge a complaint with the Italian Data Protection Authority (www.garanteprivacy.it).'}
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              8. {isIt ? 'Sicurezza dei dati' : 'Data security'}
            </h2>
            <p>
              {isIt
                ? 'PadelHub adotta misure tecniche e organizzative per proteggere i tuoi dati, tra cui: crittografia delle password (bcrypt), comunicazioni HTTPS/TLS, autenticazione tramite token JWT, accesso limitato ai dati su base "need-to-know".'
                : 'PadelHub implements technical and organizational measures to protect your data, including: password encryption (bcrypt), HTTPS/TLS communications, JWT token authentication, data access limited on a "need-to-know" basis.'}
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              9. Cookie
            </h2>
            <p>
              {isIt
                ? 'PadelHub utilizza esclusivamente cookie tecnici necessari per il funzionamento della piattaforma (autenticazione, preferenze lingua). Non utilizziamo cookie di profilazione né di terze parti per scopi pubblicitari.'
                : 'PadelHub only uses technical cookies necessary for platform operation (authentication, language preferences). We do not use profiling or third-party cookies for advertising purposes.'}
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              10. {isIt ? 'Modifiche alla presente informativa' : 'Changes to this policy'}
            </h2>
            <p>
              {isIt
                ? 'PadelHub si riserva il diritto di modificare questa informativa in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con la data di aggiornamento. Ti invitiamo a consultare periodicamente questa pagina.'
                : 'PadelHub reserves the right to modify this policy at any time. Changes will be published on this page with the update date. We encourage you to periodically review this page.'}
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              11. {isIt ? 'Contatti' : 'Contact'}
            </h2>
            <p>
              {isIt
                ? 'Per qualsiasi domanda o richiesta relativa alla privacy, scrivi a:'
                : 'For any privacy-related questions or requests, write to:'}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Email: marco@padelhub.it</li>
              <li>{isIt ? 'Sede' : 'Address'}: Cagliari, Italia</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  )
}
