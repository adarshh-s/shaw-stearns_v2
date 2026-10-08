import { Link } from 'react-router-dom'
import Core from '../components/Core.jsx'
import Disciplines from '../components/Disciplines.jsx'
import HeroStructure from '../components/HeroStructure.jsx'
import Manifesto from '../components/Manifesto.jsx'
import { SplitText, useReveal } from '../components/ui.jsx'

export default function Home() {
  useReveal()
  return (
    <>
      <section className="hero" data-bg>
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1 className="display hero-title">
              <SplitText text="Peace of mind," className="thin" />
              <SplitText text="delivered." delay={180} className="bold" />
            </h1>
            <p className="hero-lede">
              Independent project management, cost management and development advisory for owners and developers.
            </p>
            <Link to="/contact" className="btn-box hero-cta">
              Request a discussion <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <HeroStructure />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Manifesto />
        </div>
      </section>

      <Core />

      <Disciplines />

      <CtaCard />
    </>
  )
}

// Closing call to action over the abstract background.
export function CtaCard() {
  return (
    <section className="cta" data-bg>
      <div className="container cta-inner" data-reveal>
        <h2 className="display">
          Bring the brief.
          <br />
          <b>We’ll protect the rest.</b>
        </h2>
        <div className="cta-side">
          <p>Every enquiry is confidential by default. Tell us about your project.</p>
          <Link to="/contact" className="cta-field">
            <span>Request a discussion</span>
            <i aria-hidden="true">↗</i>
          </Link>
        </div>
      </div>
    </section>
  )
}
