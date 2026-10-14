import { Pill, SplitText } from './ui.jsx'

// Inner-page header: a small label, a large left-aligned title that reveals
// word by word, and a lede.
export default function PageHero({ label, title, accent, lede, children }) {
  return (
    <section className="page-hero" data-bg>
      <div className="container page-hero-inner" data-parallax="0.3">
        <Pill>{label}</Pill>
        <h1 className="display">
          <SplitText text={title} className="thin" />
          <SplitText text={accent} delay={220} className="bold" />
        </h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </section>
  )
}

