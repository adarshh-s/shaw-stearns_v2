import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { DISCIPLINES, DISCIPLINE_TAGS } from '../content.js'

// Pinned horizontal rail of discipline cards. Vertical scroll slides the rail
// sideways; the tab bar underneath tracks progress and jumps to a card.
export default function Disciplines() {
  const sectionRef = useRef(null)
  const railRef = useRef(null)
  const barRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = sectionRef.current
      const rail = railRef.current
      if (!el || !rail) return
      const r = el.getBoundingClientRect()
      const span = r.height - window.innerHeight
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0
      const travel = Math.max(0, rail.scrollWidth - rail.parentElement.clientWidth)
      rail.style.transform = `translate3d(${-p * travel}px, 0, 0)`
      if (barRef.current) barRef.current.style.transform = `scaleX(${(p * (DISCIPLINES.length - 1) + 1) / DISCIPLINES.length})`
      setActive(Math.min(DISCIPLINES.length - 1, Math.round(p * (DISCIPLINES.length - 1))))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const jump = (i) => {
    const el = sectionRef.current
    const span = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: el.offsetTop + (span * i) / (DISCIPLINES.length - 1), behavior: 'smooth' })
  }

  return (
    <section className="disc" ref={sectionRef}>
      <div className="disc-sticky">
        <div className="container disc-head">
          <span className="kicker">02 / Disciplines</span>
          <h2 className="display">
            Three disciplines.
            <br />
            <b>One side.</b>
          </h2>
        </div>

        <div className="disc-viewport">
          <div className="disc-rail" ref={railRef}>
            {DISCIPLINES.map((d, i) => (
              <Link key={d.id} to={`/services?d=${d.id}#disciplines`} className={`disc-card ${active === i ? 'active' : ''}`}>
                <div className="dc-top">
                  <span className="mono">0{i + 1}</span>
                  <span className="dc-tags">{DISCIPLINE_TAGS[d.id].join(' · ')}</span>
                </div>
                <h3>{d.title}</h3>
                <p>{d.short}</p>
                <span className="dc-more">
                  Explore <span aria-hidden="true">↗</span>
                </span>
                <span className="dc-num" aria-hidden="true">
                  0{i + 1}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="container disc-tabs">
          <span className="disc-bar">
            <span ref={barRef} />
          </span>
          {DISCIPLINES.map((d, i) => (
            <button key={d.id} className={active === i ? 'active' : ''} onClick={() => jump(i)}>
              0{i + 1} {d.code === 'CM' ? 'Cost Management' : d.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
