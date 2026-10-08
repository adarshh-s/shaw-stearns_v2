import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Arrow, Logo, Pill } from './ui.jsx'
import { PROTECT } from '../content.js'

// "What we protect": a pinned section with an isometric stack of glass slabs.
// Scrolling first opens the closed stack into an exploded view, then lifts each
// slab (Capital → Programme → Reputation) in turn while the list on the left
// fills its progress line and swaps in that item's detail. Layer spacing and
// the lift are CSS (see .ps-layer / .ps-slab.lifted); JS only feeds --open.
const OPEN_SHARE = 0.16

const smooth = (t) => t * t * (3 - 2 * t)
const clamp01 = (v) => Math.min(1, Math.max(0, v))

function CostPlan() {
  const rows = [
    ['Substructure', 0.52],
    ['Frame', 0.74],
    ['Envelope', 0.63],
    ['Services', 0.86],
    ['Fit-out', 0.58],
    ['Risk allowance', 0.3, true],
  ]
  return (
    <>
      <div className="ps-head">
        <span>Capital · Cost plan</span>
        <span className="ps-pills">
          <i>CP1 Concept</i>
          <i>CP2 Developed</i>
          <i className="on">CP3 Technical</i>
        </span>
      </div>
      <div className="ps-rows">
        {rows.map(([name, w, gold]) => (
          <div className="ps-row" key={name}>
            <span>{name}</span>
            <b className={gold ? 'accent-bar' : ''} style={{ '--w': w }} />
          </div>
        ))}
      </div>
      <div className="ps-foot">
        <span className="ps-dash" />
        <span>Budget locked</span>
      </div>
    </>
  )
}

function Programme() {
  const bars = [
    [0, 2.2],
    [1.4, 3.6],
    [3, 5.4],
    [4.6, 6.6],
    [6, 7.8],
  ]
  const path = bars.map(([, e], i) => `${((e / 8) * 100).toFixed(1)},${(18 + i * 16).toFixed(1)}`).join(' ')
  return (
    <>
      <div className="ps-head">
        <span>Programme · RIBA 0–7</span>
        <span className="ps-tag">Critical path</span>
      </div>
      <div className="ps-gantt">
        <div className="ps-stages">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
        {bars.map(([s, e], i) => (
          <b key={i} style={{ left: `${(s / 8) * 100}%`, width: `${((e - s) / 8) * 100}%`, top: `${18 + i * 16}%` }} />
        ))}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={path} />
        </svg>
        {bars.map(([, e], i) => (
          <i key={i} className="ps-node" style={{ left: `${(e / 8) * 100}%`, top: `${18 + i * 16}%` }} />
        ))}
      </div>
    </>
  )
}

function Governance() {
  const rows = ['Approval gateways', 'Authority consents', 'Stakeholder alignment', 'Change control', 'Final account']
  return (
    <>
      <div className="ps-head">
        <span>Reputation · Governance</span>
      </div>
      <div className="ps-checks">
        {rows.map((r) => (
          <div key={r}>
            <span className="ps-check" />
            <span>{r}</span>
            <em>Cleared</em>
          </div>
        ))}
      </div>
    </>
  )
}

// Abstract site plan in place of a photograph: plots, roads and footprints.
function SitePlan() {
  return (
    <>
      <svg className="ps-site" viewBox="0 0 160 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="road" d="M-5 62 C40 58, 70 40, 165 34" />
        <path className="road" d="M58 -5 C62 30, 70 70, 66 105" />
        {[
          [8, 8, 34, 22],
          [12, 72, 30, 20],
          [80, 6, 26, 18],
          [112, 8, 38, 20],
          [84, 52, 30, 22],
          [122, 46, 30, 30],
          [80, 80, 22, 14],
          [30, 38, 22, 14],
        ].map(([x, y, w, h], i) => (
          <g key={i}>
            <rect className="plot" x={x} y={y} width={w} height={h} />
            <rect className="fp" x={x + 4} y={y + 4} width={w * 0.5} height={h * 0.55} />
          </g>
        ))}
        <circle className="pin" cx="70" cy="44" r="2" />
      </svg>
      <div className="ps-head ps-head-base">
        <span>Site · Dubai</span>
      </div>
    </>
  )
}

const LAYERS = [CostPlan, Programme, Governance]

export default function ProtectStack() {
  const sectionRef = useRef(null)
  const stackRef = useRef(null)
  const barRefs = useRef([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = sectionRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const span = r.height - window.innerHeight
      const p = span > 0 ? clamp01(-r.top / span) : 0
      const open = smooth(clamp01(p / OPEN_SHARE))
      const c = clamp01((p - OPEN_SHARE) / (1 - OPEN_SHARE)) * PROTECT.items.length
      const idx = Math.min(PROTECT.items.length - 1, Math.floor(c))
      stackRef.current?.style.setProperty('--open', open.toFixed(4))
      barRefs.current.forEach((bar, i) => {
        if (!bar) return
        const fill = i < idx ? 1 : i === idx ? clamp01(c - idx) : 0
        bar.style.transform = `scaleX(${fill})`
      })
      setActive(open < 0.6 ? -1 : idx)
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
    const p = OPEN_SHARE + ((i + 0.35) / PROTECT.items.length) * (1 - OPEN_SHARE)
    window.scrollTo({ top: el.offsetTop + span * p, behavior: 'smooth' })
  }

  const shown = Math.max(0, active)
  const item = PROTECT.items[shown]

  return (
    <section className="protect" ref={sectionRef} id="protect">
      <div className="protect-sticky">
        <div className="container protect-grid">
          <div className="protect-copy">
            <Pill n="02">{PROTECT.label}</Pill>
            <h2>
              Certainty for the three things that matter most
            </h2>
            <ol className="protect-list">
              {PROTECT.items.map((it, i) => (
                <li key={it.name} className={active === i ? 'active' : ''}>
                  <button onClick={() => jump(i)}>
                    <span className="mono">0{i + 1}</span>
                    {it.name}
                  </button>
                  <span className="protect-track">
                    <span ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </li>
              ))}
            </ol>
            <div className="protect-detail" key={shown}>
              <h3>
                We protect your <em className="accent">{item.name.toLowerCase()}</em>.
              </h3>
              <ul>
                {item.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <Link to={item.link.to} className="text-link">
                {item.link.label} <Arrow />
              </Link>
            </div>
          </div>

          <div className="ps-scene" aria-hidden="true">
            <div className="ps-stack" ref={stackRef} style={{ '--open': 0 }}>
              <div className="ps-layer" style={{ '--i': 0 }}>
                <div className="ps-slab ps-base">
                  <SitePlan />
                </div>
              </div>
              {LAYERS.map((Art, i) => {
                const level = LAYERS.length - i
                return (
                  <div className="ps-layer" key={i} style={{ '--i': level }}>
                    <div className={`ps-slab ${active === i ? 'lifted' : ''} ${active > i ? 'above' : ''} ${active >= 0 && active !== i ? 'dim' : ''}`}>
                      <Art />
                    </div>
                  </div>
                )
              })}
              <div className="ps-layer ps-cover-layer" style={{ '--i': LAYERS.length + 0.15 }}>
                <div className="ps-slab ps-cover">
                  <Logo />
                  <span className="mono">Capital · Programme · Reputation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

