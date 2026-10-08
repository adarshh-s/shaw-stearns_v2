import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import { Card, Pill, useReveal } from '../components/ui.jsx'
import { DISCIPLINES, LIFECYCLE } from '../content.js'
import { CtaCard } from './Home.jsx'

export default function Services() {
  useReveal()
  const [params, setParams] = useSearchParams()
  const current = DISCIPLINES.find((d) => d.id === params.get('d')) || DISCIPLINES[0]
  const select = (id) => setParams({ d: id }, { replace: true, preventScrollReset: true })

  return (
    <>
      <PageHero
        label="Services"
        title="Three disciplines."
        accent="One client-side view."
        lede="Delivered separately or as one integrated commission — always on the owner’s behalf, always independent."
      />

      <section className="section" id="disciplines">
        <div className="container">
          <div className="segmented" role="tablist" aria-label="Disciplines">
            {DISCIPLINES.map((d) => (
              <button
                key={d.id}
                role="tab"
                aria-selected={d.id === current.id}
                className={d.id === current.id ? 'active' : ''}
                onClick={() => select(d.id)}
              >
                <span className="mono">{d.code}</span>
                {d.title}
              </button>
            ))}
          </div>
          <Card className="panel" role="tabpanel" key={current.id}>
            <div className="panel-lead">
              <h2>{current.title}</h2>
              <p className="muted">{current.lead}</p>
            </div>
            <ul className="scope">
              {current.scope.map((s, i) => (
                <li key={s} style={{ '--d': `${i * 40}ms` }}>
                  <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="head-row" data-reveal>
            <div>
              <Pill n="02">Integrated methodology</Pill>
              <h2>One process, eight controlled stages.</h2>
            </div>
          </div>
          <Lifecycle />
        </div>
      </section>

      <CtaCard />
    </>
  )
}

function Lifecycle() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setActive((a) => (a + 1) % LIFECYCLE.length), 2800)
    return () => clearInterval(id)
  }, [paused])

  const pct = (active / (LIFECYCLE.length - 1)) * 100

  return (
    <Card className="lifecycle" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} data-reveal>
      <div className="lc-track">
        <div className="lc-progress" style={{ width: `${pct}%` }} />
      </div>
      <ol className="lc-steps">
        {LIFECYCLE.map((s, i) => (
          <li key={s.t}>
            <button
              className={`lc-step ${i === active ? 'active' : ''} ${i < active ? 'done' : ''}`}
              onClick={() => {
                setActive(i)
                setPaused(true)
              }}
            >
              <span className="lc-node" />
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="lc-title">{s.t}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="lc-detail" key={active}>
        <span className="mono accent">
          Stage {String(active + 1).padStart(2, '0')} / {String(LIFECYCLE.length).padStart(2, '0')}
        </span>
        <h3>{LIFECYCLE[active].t}</h3>
        <p className="muted">{LIFECYCLE[active].d}</p>
      </div>
    </Card>
  )
}
