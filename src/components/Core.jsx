import { useEffect, useRef, useState } from 'react'
import { STAGES } from '../content.js'

// "The client-side core": a pinned section. Scrolling steps through the four
// stages on the left; the diagram on the right lights the matching nodes on
// the delivery plane, with Shaw Stearns' control plane governing above.
// Hovering a node inspects it.
const NODES = [
  { id: 'brief', t: 'Brief', s: 'Owner objectives', d: 'Objectives, budget and success criteria agreed and signed off.', icon: 'doc' },
  { id: 'plan', t: 'Cost & Programme', s: 'Baseline', d: 'Cost plan and master programme set as the baseline for every party.', icon: 'grid' },
  { id: 'design', t: 'Design', s: 'Value review', d: 'Design integrated and challenged for value, buildability and compliance.', icon: 'layers' },
  { id: 'tender', t: 'Tender', s: 'Evaluation', d: 'Tender lists approved; bids evaluated on merit, with no commercial ties.', icon: 'scale' },
  { id: 'site', t: 'Site', s: 'Change control', d: 'Contracts administered, progress monitored and every change controlled.', icon: 'crane' },
  { id: 'handover', t: 'Handover', s: 'Final account', d: 'Handover managed and the final account settled with certainty.', icon: 'key' },
]
const CONTROL = [
  { t: 'Governance', s: 'Gateways · reporting' },
  { t: 'Commercial control', s: 'Cost · change · risk' },
]

function Glyph({ name }) {
  const d = {
    doc: 'M5 2h7l3 3v11H5zM12 2v3h3M7.5 9h5M7.5 12h5',
    grid: 'M3 3h14v14H3zM3 8h14M3 13h14M8 3v14M13 3v14',
    layers: 'M10 3l7 4-7 4-7-4zM3 11l7 4 7-4',
    scale: 'M10 3v14M4 6h12M4 6l-2 5h4zM16 6l-2 5h4z',
    crane: 'M4 17V4h12M4 4l5 4M15 4v5M13 9h4v3h-4zM2 17h8',
    key: 'M7 13a4 4 0 1 1 3-3l7 0v3h-2v2h-2v-2h-3',
  }[name]
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export default function Core() {
  const sectionRef = useRef(null)
  const [active, setActive] = useState(0)
  const [inspect, setInspect] = useState(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = sectionRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const span = r.height - window.innerHeight
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0
      setActive(Math.min(STAGES.length - 1, Math.floor(p * STAGES.length)))
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
    window.scrollTo({ top: el.offsetTop + (span * (i + 0.5)) / STAGES.length, behavior: 'smooth' })
  }

  const lit = STAGES[active].nodes
  const shown = NODES.find((n) => n.id === inspect)

  return (
    <section className="core" ref={sectionRef}>
      <div className="core-sticky">
        <div className="container core-inner">
          <div className="core-head">
            <span className="kicker">01 / How we work</span>
            <h2 className="display">
              The client-side <b>core.</b>
            </h2>
          </div>

          <div className="core-grid">
            <ol className="core-steps">
              {STAGES.map((s, i) => (
                <li key={s.t} className={active === i ? 'active' : ''}>
                  <button onClick={() => jump(i)}>
                    <span className="mono">0{i + 1}</span>
                    {s.t}
                  </button>
                  <div className="core-desc">
                    <div>
                      <span className="mono">{s.sub}</span>
                      <p>{s.d}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="core-panel">
              <div className="cp-top">
                <div>
                  <span className="cp-title">
                    Shaw Stearns <em>Control</em>
                  </span>
                  <div className="cp-legend">
                    <span>
                      <i className="sq a" /> Control plane
                    </span>
                    <span>
                      <i className="sq b" /> Delivery plane
                    </span>
                  </div>
                </div>
                <span className="kicker">Owner-side · independent</span>
              </div>

              <div className="cp-control">
                {CONTROL.map((c) => (
                  <div className="cp-ctl" key={c.t}>
                    {c.t}
                    <span>{c.s}</span>
                  </div>
                ))}
              </div>

              <div className="cp-plane">
                <svg className="cp-wires" viewBox="0 0 600 100" preserveAspectRatio="none" aria-hidden="true">
                  {NODES.map((n, i) => {
                    const x = 50 + i * 100
                    const on = lit.includes(n.id)
                    return <path key={n.id} className={`cp-v ${on ? 'on' : ''}`} d={`M${x} 0 V100`} />
                  })}
                </svg>
                <div className="cp-nodes">
                  {NODES.map((n, i) => {
                    const on = lit.includes(n.id)
                    const done = STAGES.slice(0, active).some((s) => s.nodes.includes(n.id))
                    return (
                      <div
                        key={n.id}
                        className={`cp-node ${on ? 'on' : ''} ${done ? 'done' : ''} ${inspect === n.id ? 'insp' : ''}`}
                        onMouseEnter={() => setInspect(n.id)}
                        onMouseLeave={() => setInspect(null)}
                      >
                        <span className="cp-n-t">{n.t}</span>
                        <Glyph name={n.icon} />
                        <span className="cp-n-s">{n.s}</span>
                        {i < NODES.length - 1 && <span className="cp-link" />}
                      </div>
                    )
                  })}
                </div>
                <span className="cp-plane-label">Project delivery plane</span>
              </div>

              <div className="cp-foot">
                {shown ? (
                  <span key={shown.id} className="cp-insp">
                    <b>{shown.t}.</b> {shown.d}
                  </span>
                ) : (
                  <span className="kicker">Hover a stage to inspect</span>
                )}
                <span className="cp-stage">
                  Stage 0{active + 1} / 0{STAGES.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
