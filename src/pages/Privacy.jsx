import PageHero from '../components/PageHero.jsx'
import { useReveal } from '../components/ui.jsx'
import { CONTACT } from '../content.js'

// TODO: have the final privacy notice reviewed by the firm's legal adviser.
const SECTIONS = [
  {
    t: 'Information we collect',
    d: 'When you contact us or send an enquiry, we receive the details you choose to provide, such as your name, email address, phone number, company and information about your project.',
  },
  {
    t: 'How we use it',
    d: 'We use this information only to respond to your enquiry, prepare proposals you request and manage our relationship with you. We do not sell your information or use it for unrelated marketing.',
  },
  {
    t: 'Sharing and retention',
    d: 'Your information is shared only with people within Albemarle Grey who need it to respond to you, or where required by law. We keep it for as long as needed for these purposes.',
  },
  {
    t: 'Your choices',
    d: `You can ask us to access, correct or delete the information we hold about you at any time by writing to ${CONTACT.email}.`,
  },
]

export default function Privacy() {
  useReveal()
  return (
    <>
      <PageHero label="Legal" title="Privacy" accent="notice." lede="How Albemarle Grey handles the personal information you share with us." />
      <section className="section section-cta">
        <div className="container">
          <ul className="reasons privacy" data-reveal>
            {SECTIONS.map((s, i) => (
              <li key={s.t}>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{s.t}</strong>
                  <span>{s.d}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
