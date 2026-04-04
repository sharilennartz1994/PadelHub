import { useLanguageStore } from '../stores/languageStore'

export function Terms() {
  const { language } = useLanguageStore()
  const isIt = language === 'it'

  return (
    <div className="min-h-screen bg-surface-container-lowest pt-20">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-2 font-headline text-4xl font-black text-on-surface">
          {isIt ? 'Termini di Servizio' : 'Terms of Service'}
        </h1>
        <p className="mb-10 text-sm text-on-surface-variant">
          {isIt ? 'Ultimo aggiornamento: 4 aprile 2026' : 'Last updated: April 4, 2026'}
        </p>

        <div className="space-y-10 text-on-surface-variant leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              1. {isIt ? 'Accettazione dei termini' : 'Acceptance of terms'}
            </h2>
            <p>
              {isIt
                ? 'Utilizzando PadelHub ("Piattaforma"), accetti integralmente i presenti Termini di Servizio ("Termini"). Se non accetti, non utilizzare la Piattaforma. La registrazione comporta l\'accettazione esplicita dei Termini e dell\'Informativa sulla Privacy.'
                : 'By using PadelHub ("Platform"), you fully accept these Terms of Service ("Terms"). If you do not agree, do not use the Platform. Registration constitutes explicit acceptance of the Terms and Privacy Policy.'}
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              2. {isIt ? 'Descrizione del servizio' : 'Service description'}
            </h2>
            <p>
              {isIt
                ? 'PadelHub è una piattaforma web che mette in contatto coach di padel con allievi, consentendo la ricerca di istruttori, la prenotazione di lezioni, la comunicazione tra le parti e la gestione delle prenotazioni. PadelHub NON è un datore di lavoro dei coach, né un fornitore diretto di lezioni di padel. PadelHub agisce esclusivamente come intermediario tecnologico.'
                : 'PadelHub is a web platform that connects padel coaches with students, enabling instructor search, lesson booking, communication, and booking management. PadelHub is NOT an employer of coaches, nor a direct provider of padel lessons. PadelHub acts exclusively as a technology intermediary.'}
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              3. {isIt ? 'Requisiti di registrazione' : 'Registration requirements'}
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>{isIt ? 'Devi avere almeno 18 anni per registrarti.' : 'You must be at least 18 years old to register.'}</li>
              <li>{isIt ? 'I dati forniti devono essere veritieri, accurati e aggiornati.' : 'The data provided must be truthful, accurate, and up-to-date.'}</li>
              <li>{isIt ? 'Sei responsabile della sicurezza del tuo account e della tua password.' : 'You are responsible for the security of your account and password.'}</li>
              <li>{isIt ? 'Un utente può avere un solo account.' : 'A user may have only one account.'}</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              4. {isIt ? 'Obblighi dei Coach' : 'Coach obligations'}
            </h2>
            <p className="mb-3">{isIt ? 'Registrandoti come Coach, dichiari e garantisci che:' : 'By registering as a Coach, you declare and warrant that:'}</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>{isIt ? 'Possiedi le qualifiche e le competenze dichiarate nel profilo.' : 'You possess the qualifications and skills declared in your profile.'}</li>
              <li>{isIt ? 'Manterrai aggiornate le informazioni su disponibilità, prezzi e qualifiche.' : 'You will keep availability, pricing, and qualification information up to date.'}</li>
              <li>{isIt ? 'Fornirai le lezioni prenotate con professionalità e puntualità.' : 'You will provide booked lessons with professionalism and punctuality.'}</li>
              <li>{isIt ? 'Possiedi un\'adeguata copertura assicurativa per l\'attività sportiva.' : 'You have adequate insurance coverage for sports activities.'}</li>
              <li>{isIt ? 'Rispetterai le normative locali, fiscali e di sicurezza applicabili.' : 'You will comply with applicable local, tax, and safety regulations.'}</li>
              <li>{isIt ? 'Non condurrai comunicazioni o pagamenti al di fuori della piattaforma per eludere PadelHub.' : 'You will not conduct communications or payments outside the platform to circumvent PadelHub.'}</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              5. {isIt ? 'Obblighi degli Allievi' : 'Player obligations'}
            </h2>
            <p className="mb-3">{isIt ? 'Registrandoti come Allievo, accetti di:' : 'By registering as a Player, you agree to:'}</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>{isIt ? 'Fornire informazioni accurate sul tuo livello di gioco.' : 'Provide accurate information about your playing level.'}</li>
              <li>{isIt ? 'Presentarti puntualmente alle lezioni prenotate.' : 'Show up punctually to booked lessons.'}</li>
              <li>{isIt ? 'Effettuare il pagamento come concordato con il coach.' : 'Make payment as agreed with the coach.'}</li>
              <li>{isIt ? 'Trattare i coach e gli altri utenti con rispetto.' : 'Treat coaches and other users with respect.'}</li>
              <li>{isIt ? 'Comunicare tempestivamente eventuali cancellazioni.' : 'Communicate any cancellations promptly.'}</li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              6. {isIt ? 'Prenotazioni e cancellazioni' : 'Bookings and cancellations'}
            </h2>

            <h3 className="mb-2 mt-4 font-headline text-lg font-bold text-on-surface">
              {isIt ? 'Creazione della prenotazione' : 'Booking creation'}
            </h3>
            <p>
              {isIt
                ? 'La prenotazione è confermata quando il coach accetta la richiesta. Fino a quel momento, lo stato è "In attesa".'
                : 'The booking is confirmed when the coach accepts the request. Until then, the status is "Pending".'}
            </p>

            <h3 className="mb-2 mt-4 font-headline text-lg font-bold text-on-surface">
              {isIt ? 'Politica di cancellazione' : 'Cancellation policy'}
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong>{isIt ? 'Più di 24 ore prima:' : 'More than 24 hours before:'}</strong>{' '}
                {isIt ? 'Cancellazione gratuita.' : 'Free cancellation.'}
              </li>
              <li>
                <strong>{isIt ? 'Tra 24 e 2 ore prima:' : 'Between 24 and 2 hours before:'}</strong>{' '}
                {isIt ? 'Il coach può richiedere il 50% del prezzo.' : 'The coach may request 50% of the price.'}
              </li>
              <li>
                <strong>{isIt ? 'Meno di 2 ore prima o no-show:' : 'Less than 2 hours before or no-show:'}</strong>{' '}
                {isIt ? 'Il coach può richiedere il 100% del prezzo.' : 'The coach may request 100% of the price.'}
              </li>
            </ul>
            <p className="mt-3">
              {isIt
                ? 'Le cancellazioni vanno effettuate tramite la piattaforma. Cancellazioni comunicate solo verbalmente non sono valide.'
                : 'Cancellations must be made through the platform. Cancellations communicated only verbally are not valid.'}
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              7. {isIt ? 'Pagamenti' : 'Payments'}
            </h2>
            <p>
              {isIt
                ? 'Attualmente il pagamento avviene direttamente tra allievo e coach al momento della lezione (contanti o altro metodo concordato). PadelHub non gestisce pagamenti online per conto degli utenti in questa fase. PadelHub si riserva il diritto di introdurre un sistema di pagamento integrato in futuro.'
                : 'Currently, payment occurs directly between player and coach at the time of the lesson (cash or other agreed method). PadelHub does not manage online payments on behalf of users at this stage. PadelHub reserves the right to introduce an integrated payment system in the future.'}
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              8. {isIt ? 'Limitazione di responsabilità' : 'Limitation of liability'}
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>{isIt ? 'PadelHub NON è responsabile per la qualità delle lezioni fornite dai coach.' : 'PadelHub is NOT responsible for the quality of lessons provided by coaches.'}</li>
              <li>{isIt ? 'PadelHub NON è responsabile per infortuni o danni fisici che si verificano durante le lezioni.' : 'PadelHub is NOT responsible for injuries or physical damage occurring during lessons.'}</li>
              <li>{isIt ? 'PadelHub NON è responsabile per dispute tra coach e allievi relative a pagamenti o servizi.' : 'PadelHub is NOT responsible for disputes between coaches and players regarding payments or services.'}</li>
              <li>{isIt ? 'PadelHub NON garantisce la disponibilità continua della piattaforma.' : 'PadelHub does NOT guarantee continuous platform availability.'}</li>
            </ul>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              9. {isIt ? 'Assunzione del rischio sportivo' : 'Assumption of sports risk'}
            </h2>
            <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5">
              <p className="font-medium text-on-surface">
                {isIt
                  ? '⚠️ Utilizzando PadelHub e partecipando a lezioni di padel, riconosci e accetti che:'
                  : '⚠️ By using PadelHub and participating in padel lessons, you acknowledge and accept that:'}
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                <li>{isIt ? 'Il padel è un\'attività sportiva che comporta rischi intrinseci di infortunio.' : 'Padel is a sport that carries inherent risks of injury.'}</li>
                <li>{isIt ? 'Partecipi volontariamente e a tuo rischio e pericolo.' : 'You participate voluntarily and at your own risk.'}</li>
                <li>{isIt ? 'È tua responsabilità verificare la tua idoneità fisica.' : 'It is your responsibility to verify your physical fitness.'}</li>
                <li>{isIt ? 'PadelHub non si assume alcuna responsabilità per danni fisici o materiali.' : 'PadelHub assumes no liability for physical or material damages.'}</li>
              </ul>
            </div>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              10. {isIt ? 'Contenuti degli utenti' : 'User content'}
            </h2>
            <p>
              {isIt
                ? 'Pubblicando contenuti sulla piattaforma (recensioni, bio, messaggi), concedi a PadelHub una licenza non esclusiva per utilizzare tali contenuti ai fini del funzionamento del servizio. Sei responsabile dei contenuti che pubblichi. PadelHub si riserva il diritto di rimuovere contenuti offensivi, falsi, illegali o che violano questi Termini.'
                : 'By publishing content on the platform (reviews, bio, messages), you grant PadelHub a non-exclusive license to use such content for the operation of the service. You are responsible for the content you publish. PadelHub reserves the right to remove offensive, false, illegal content or content that violates these Terms.'}
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              11. {isIt ? 'Sospensione e terminazione' : 'Suspension and termination'}
            </h2>
            <p className="mb-3">{isIt ? 'PadelHub può sospendere o terminare il tuo account se:' : 'PadelHub may suspend or terminate your account if:'}</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>{isIt ? 'Violi questi Termini di Servizio.' : 'You violate these Terms of Service.'}</li>
              <li>{isIt ? 'Fornisci informazioni false o fuorvianti.' : 'You provide false or misleading information.'}</li>
              <li>{isIt ? 'Ti comporti in modo inappropriato con altri utenti.' : 'You behave inappropriately with other users.'}</li>
              <li>{isIt ? 'Utilizzi la piattaforma per scopi illegali.' : 'You use the platform for illegal purposes.'}</li>
            </ul>
            <p className="mt-3">
              {isIt
                ? 'Puoi cancellare il tuo account in qualsiasi momento dalla sezione Impostazioni.'
                : 'You can delete your account at any time from the Settings section.'}
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              12. {isIt ? 'Legge applicabile e foro competente' : 'Applicable law and jurisdiction'}
            </h2>
            <p>
              {isIt
                ? 'I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia sarà competente il Foro di Cagliari, fatti salvi i diritti del consumatore ai sensi del D.Lgs. 206/2005 (Codice del Consumo).'
                : 'These Terms are governed by Italian law. For any dispute, the Court of Cagliari shall have jurisdiction, without prejudice to consumer rights under Italian Consumer Code (D.Lgs. 206/2005).'}
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              13. {isIt ? 'Modifiche ai termini' : 'Changes to terms'}
            </h2>
            <p>
              {isIt
                ? 'PadelHub si riserva il diritto di modificare i presenti Termini in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina e, in caso di modifiche sostanziali, notificate via email. L\'utilizzo continuato della piattaforma dopo la modifica costituisce accettazione dei nuovi Termini.'
                : 'PadelHub reserves the right to modify these Terms at any time. Changes will be published on this page and, for substantial changes, notified via email. Continued use of the platform after modification constitutes acceptance of the new Terms.'}
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="mb-3 font-headline text-2xl font-bold text-on-surface">
              14. {isIt ? 'Contatti' : 'Contact'}
            </h2>
            <p>{isIt ? 'Per qualsiasi domanda sui presenti Termini:' : 'For any questions about these Terms:'}</p>
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
