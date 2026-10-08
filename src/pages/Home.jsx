import { Link } from 'react-router-dom'
import Figures from '../components/Figures.jsx'
import HeroStructure from '../components/HeroStructure.jsx'
import ProtectStack from '../components/ProtectStack.jsx'
import Statement from '../components/Statement.jsx'
import { Arrow, SplitText, useReveal } from '../components/ui.jsx'
import { PILLARS } from '../content.js'

export default function Home() {
  useReveal()
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1 className="hero-title">
              <SplitText text={'Peace of mind,'} />
              <SplitText text={'delivered.'} delay={160} className="dim" />
            </h1>
            <p className="hero-lede">
              Independent project management, cost management and development advisory for owners and developers in
              the UAE.
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-solid">
                Request a discussion
              </Link>
              <Link to="/services" className="btn btn-ghost">
                Services <Arrow />
              </Link>
            </div>
          </div>
          <HeroStructure />
        </div>
        <div className="container hero-foot">
          {PILLARS.map((p, i) => (
            <span key={p.k}>
              <i>0{i + 1}</i>
              {p.k}
            </span>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Statement
            lead="A pure client-side practice."
            rest="Not contractors, designers or suppliers — independent advisors working only for owners and developers."
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Figures />
        </div>
      </section>

      <ProtectStack />

      <CtaCard />
    </>
  )
}

// Closing call to action, centred like a final statement.
export function CtaCard() {
  return (
    <section className="cta">
      <div className="container cta-inner" data-reveal>
        <h2>
          Protect what matters.
          <br />
          <span className="dim">Start with a conversation.</span>
        </h2>
        <div className="cta-actions">
          <Link to="/contact" className="btn btn-solid">
            Request a discussion
          </Link>
          <Link to="/services" className="btn btn-ghost">
            Explore services <Arrow />
          </Link>
        </div>
      </div>
    </section>
  )
}
