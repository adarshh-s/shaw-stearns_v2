import { useState } from 'react'
import ClientModel from '../components/ClientModel.jsx'
import PageHero from '../components/PageHero.jsx'
import { Arrow, Card, Pill, useReveal } from '../components/ui.jsx'
import { CAREER_OFFER, CONTACT, VALUES } from '../content.js'

const NOT = ['contractors', 'designers', 'suppliers']

export default function About() {
  useReveal()
  const [open, setOpen] = useState(0)

  return (
    <>
      <PageHero
        label="About"
        title="A pure client-side"
        accent="practice."
        lede="To protect the capital, programme and reputation of owners and developers through independent advice — and to build a practice of lasting international standing."
      />

      <section className="section section-tight">
        <div className="container not-grid" data-reveal>
          {NOT.map((n) => (
            <Card className="not-cell" key={n}>
              <span className="mono muted">We are not</span>
              <strong className="strike">{n}</strong>
            </Card>
          ))}
          <Card className="not-cell not-yes">
            <span className="mono">We work for</span>
            <strong>you. Only you.</strong>
          </Card>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature-head" data-reveal>
            <h2>Advice without an agenda</h2>
            <p>One side of the table — yours. No commissions and no ties to the supply chain.</p>
          </div>
          <div className="about-model" data-reveal>
            <ClientModel />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div data-reveal>
            <Pill n="01">Values</Pill>
            <h2>Five principles govern every engagement.</h2>
          </div>
          <ul className="values" data-reveal>
            {VALUES.map((v, i) => (
              <li key={v.t} className={open === i ? 'open' : ''}>
                <button onMouseEnter={() => setOpen(i)} onFocus={() => setOpen(i)} onClick={() => setOpen(i)} aria-expanded={open === i}>
                  <span className="mono muted">0{i + 1}</span>
                  <span className="v-title">{v.t}</span>
                  <span className="v-plus" aria-hidden="true" />
                </button>
                <div className="v-body">
                  <p className="muted">{v.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-cta" id="careers">
        <div className="container">
          <Card className="careers-card" data-reveal>
            <div>
              <Pill n="02">Careers</Pill>
              <h2>Grow with purpose.</h2>
              <p className="muted">
                We seek dedicated professionals who take pride in their work and want to advise at the highest standard.
              </p>
              <a className="btn btn-solid" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Careers — CV submission')}`}>
                Send your CV <Arrow />
              </a>
            </div>
            <ul className="offer">
              {CAREER_OFFER.map((o, i) => (
                <li key={o}>
                  <span className="mono accent">0{i + 1}</span>
                  {o}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
    </>
  )
}
