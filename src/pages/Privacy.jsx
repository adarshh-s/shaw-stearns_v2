import PageHero from '../components/PageHero.jsx'
import { useReveal } from '../components/ui.jsx'
import { CONTACT, PRIVACY } from '../content.js'

// Readable privacy notice, linked from the footer and the enquiry form.
export default function Privacy() {
  useReveal()
  return (
    <>
      <PageHero label="Albemarle Grey / Privacy" title="Privacy" accent="notice." lede={PRIVACY.intro} />
      <section className="section section-cta">
        <div className="container">
          <article className="pn" data-reveal>
            {PRIVACY.sections.map((s, i) => (
              <section className="pn-item" key={s.t}>
                <span className="mono accent">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{s.t}</h2>
                  {s.d.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  {i === PRIVACY.sections.length - 1 && (
                    <p>
                      For privacy enquiries, email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                    </p>
                  )}
                </div>
              </section>
            ))}
            <p className="pn-updated">Last updated {PRIVACY.updated}</p>
          </article>
        </div>
      </section>
    </>
  )
}
