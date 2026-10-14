import { Link } from 'react-router-dom'
import Disciplines from '../components/Disciplines.jsx'
import HeroStructure from '../components/HeroStructure.jsx'
import Manifesto from '../components/Manifesto.jsx'
import { SplitText, useReveal } from '../components/ui.jsx'

// Home stays short: introduction, statement, three service summaries that link
// to Services, and the closing call to action.
export default function Home() {
  useReveal()
  return (
    <>
      <section className="hero" data-bg>
        <div className="container hero-grid">
          <div className="hero-copy" data-parallax="0.35">
            <h1 className="display hero-title">
              <SplitText text="Project & Cost Management," className="thin" />
              <SplitText text="Development Advisory." delay={180} className="bold" />
            </h1>
            <p className="hero-lede">
              Albemarle Grey advises owners and developers on development feasibility, project delivery and construction costs, from initial appraisal through to completion.
            </p>
          </div>
          <div className="hero-art" data-parallax="0.15">
            <HeroStructure />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Manifesto />
        </div>
      </section>

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
          Send us your project brief
          <br />
          <b>to get started.</b>
        </h2>
        <div className="cta-side">
          <Link to="/contact" className="cta-field">
            <span>Discuss your project</span>
            <i aria-hidden="true">↗</i>
          </Link>
        </div>
      </div>
    </section>
  )
}
