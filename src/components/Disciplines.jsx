import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { DISCIPLINES } from '../content.js'
import { gsap, reducedMotion, scrollToTarget } from '../smooth.js'

// Share of the pinned scroll spent on each phase: a short settle once the
// section pins, the eased horizontal travel, then a hold on the last card so
// the hand-back to vertical scrolling never lurches.
const HOLD_IN = 0.08
const TRAVEL = 0.76

// Pinned horizontal rail of discipline cards. Vertical scroll slides the rail
// sideways (eased, slightly trailing the scroll); the tab bar underneath tracks
// progress and jumps to a card.
export default function Disciplines() {
  const sectionRef = useRef(null)
  const railRef = useRef(null)
  const barRef = useRef(null)
  const trigger = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const rail = railRef.current
    const travel = () => Math.max(0, rail.scrollWidth - rail.parentElement.clientWidth)
    const last = DISCIPLINES.length - 1

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: reducedMotion() ? true : 0.9,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const t = travel()
          const p = t > 0 ? -gsap.getProperty(rail, 'x') / t : 0
          setActive(Math.min(last, Math.max(0, Math.round(p * last))))
        },
      })
      tl.to({}, { duration: HOLD_IN })
        .to(rail, { x: () => -travel(), ease: 'power2.inOut', duration: TRAVEL })
        .fromTo(barRef.current, { scaleX: 1 / DISCIPLINES.length }, { scaleX: 1, ease: 'power2.inOut', duration: TRAVEL }, '<')
        .to({}, { duration: 1 - HOLD_IN - TRAVEL })
      trigger.current = tl.scrollTrigger
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Scroll to the point in the travel where card i sits in view.
  const jump = (i) => {
    const st = trigger.current
    if (!st) return
    const p = HOLD_IN + (TRAVEL * i) / (DISCIPLINES.length - 1)
    scrollToTarget(st.start + (st.end - st.start) * p)
  }

  return (
    <section className="disc" ref={sectionRef}>
      <div className="disc-sticky">
        <div className="container disc-head">
          <span className="kicker">01 / Disciplines</span>
          <h2 className="display">
            Three disciplines.
            <br />
            <b>One partner.</b>
          </h2>
        </div>

        <div className="disc-viewport">
          <div className="disc-rail" ref={railRef}>
            {DISCIPLINES.map((d, i) => (
              <Link key={d.id} to={d.to} className={`disc-card ${active === i ? 'active' : ''}`}>
                <div className="dc-index" aria-hidden="true">
                  <span className="dc-num">0{i + 1}</span>
                  <span className="dc-of">/ 0{DISCIPLINES.length}</span>
                  <i />
                </div>
                <h3>{d.title}</h3>
                <span className="dc-tags">{d.tags.join(' · ')}</span>
                <p>{d.short}</p>
                <span className="dc-more">
                  Explore <span aria-hidden="true">↗</span>
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
              0{i + 1} {d.tab}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
