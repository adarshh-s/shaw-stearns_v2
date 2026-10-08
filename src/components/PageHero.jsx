import { Pill, SplitText } from './ui.jsx'

// Inner-page header: a small label, a large left-aligned title that reveals
// word by word, and a lede.
export default function PageHero({ label, title, accent, lede, children }) {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner">
        <Pill>{label}</Pill>
        <h1>
          <SplitText text={title} />
          <SplitText text={accent} delay={220} className="dim" />
        </h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </section>
  )
}
