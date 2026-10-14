import { useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import PageHero from '../components/PageHero.jsx'
import { Card, useReveal } from '../components/ui.jsx'
import { CAREERS, CONTACT } from '../content.js'

const pad = (n) => String(n).padStart(2, '0')

// Line glyphs for the three practice pillars, drawn in on reveal.
const GLYPHS = [
  // Professional Standards: a set square and a level line
  'M8 40 L40 8 L40 40 Z M16 40 L40 16 M4 46 H44',
  // People & Development: three figures rising
  'M10 38 v-6 M24 38 v-14 M38 38 v-22 M6 42 H42 M10 26 a3 3 0 1 0 0.01 0 M24 18 a3 3 0 1 0 0.01 0 M38 10 a3 3 0 1 0 0.01 0',
  // Responsible Business: a leaf over a ground line
  'M24 40 C10 32 10 14 24 6 C38 14 38 32 24 40 Z M24 40 V14 M4 44 H44',
]

function Glyph({ d }) {
  return (
    <svg className="cr-glyph" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d={d} pathLength="1" />
    </svg>
  )
}

// Careers: the practice introduction, mission and vision, what defines the
// practice, values, career opportunities and the future alumni network.
export default function Careers() {
  useReveal()
  const [value, setValue] = useState(0)
  const v = CAREERS.values[value]
  const introduce = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Careers — introduction')}`

  return (
    <>
      <PageHero label="Albemarle Grey / Careers" title="A practice" accent="with purpose." lede={CAREERS.intro} />

      {/* Mission and vision as two framed statements */}
      <section className="section section-tight">
        <div className="container cr-statements" data-reveal>
          <span className="sheet-c tl" aria-hidden="true" />
          <span className="sheet-c br" aria-hidden="true" />
          {[
            ['01 / Our mission', 'Our Mission', CAREERS.mission],
            ['02 / Our vision', 'Our Vision', CAREERS.vision],
          ].map(([k, t, d]) => (
            <div className="cr-statement" key={t}>
              <span className="kicker">{k}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="svc-head" data-reveal>
            <span className="kicker">03 / Practice</span>
            <h2 className="display svc-display">
              <span className="thin">What defines</span>
              <br />
              <b>our practice.</b>
            </h2>
          </div>
          <div className="cr-three" data-reveal>
            {CAREERS.defines.map((d, i) => (
              <Card className="cr-pillar" key={d.t}>
                <div className="cr-pillar-top">
                  <Glyph d={GLYPHS[i]} />
                  <span className="mono">{pad(i + 1)}</span>
                </div>
                <h3>{d.t}</h3>
                <p className="muted">{d.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values: pick one from the index to bring it forward */}
      <section className="section">
        <div className="container">
          <div className="svc-head" data-reveal>
            <span className="kicker">04 / Values</span>
            <h2 className="display svc-display">
              <span className="thin">Our</span> <b>values.</b>
            </h2>
          </div>
          <div className="sheet cr-values-board" data-reveal>
            <span className="sheet-c tl" aria-hidden="true" />
            <span className="sheet-c tr" aria-hidden="true" />
            <span className="sheet-c bl" aria-hidden="true" />
            <span className="sheet-c br" aria-hidden="true" />
            <ol className="cr-vlist" role="tablist" aria-label="Values">
              {CAREERS.values.map((x, i) => (
                <li key={x.t}>
                  <button role="tab" aria-selected={value === i} className={value === i ? 'active' : ''} onClick={() => setValue(i)} onMouseEnter={() => setValue(i)}>
                    {value === i && <m.span layoutId="value-hl" className="cr-vhl" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                    <span className="mono">{pad(i + 1)}</span>
                    <span className="cr-vname">{x.t}</span>
                    <span className="cr-varrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="cr-vstage" role="tabpanel">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={v.t}
                  className="cr-vbody"
                  initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(6px)', transition: { duration: 0.2 } }}
                >
                  <span className="cr-vword" aria-hidden="true">
                    {v.t}
                  </span>
                  <span className="kicker">
                    Value {pad(value + 1)} / {pad(CAREERS.values.length)}
                  </span>
                  <p className="fw-statement">{v.d}</p>
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Joining and growing: a drawing sheet with a rising-steps figure */}
      <section className="section" id="join">
        <div className="container">
          <div className="sheet cr-join" data-reveal>
            <span className="sheet-c tl" aria-hidden="true" />
            <span className="sheet-c tr" aria-hidden="true" />
            <span className="sheet-c bl" aria-hidden="true" />
            <span className="sheet-c br" aria-hidden="true" />
            <div className="sheet-title">
              <span className="fw-brand">Albemarle Grey</span>
              <span className="kicker">Careers</span>
              <span className="mono sheet-no">05</span>
            </div>
            <div className="cr-join-grid">
              <div>
                <h2 className="display svc-display">
                  <span className="thin">Join the</span>
                  <br />
                  <b>practice.</b>
                </h2>
                <p className="muted cr-join-lede">{CAREERS.join}</p>
                <a className="cta-field cr-join-cta" href={introduce}>
                  <span>Introduce yourself</span>
                  <i aria-hidden="true">↗</i>
                </a>
              </div>
              <div className="cr-grow">
                <Steps />
                <h3>Grow with us.</h3>
                {CAREERS.grow.map((p) => (
                  <p key={p} className="muted">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alumni: future network, shown as a quiet diagram */}
      <section className="section section-cta" id="alumni">
        <div className="container cr-alumni" data-reveal>
          <div>
            <span className="kicker">06 / Alumni</span>
            <h2 className="display svc-display">
              <span className="thin">Once part of</span>
              <br />
              <b>the practice.</b>
            </h2>
            <p className="muted">{CAREERS.alumni}</p>
            <span className="tag-soon">Alumni network · Coming soon</span>
          </div>
          <Network />
        </div>
      </section>
    </>
  )
}

// Isometric-style rising steps with a blue light climbing them.
function Steps() {
  return (
    <svg className="cr-steps" viewBox="0 0 240 110" fill="none" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={i * 46} y={88 - i * 20} width="40" height={22 + i * 20} rx="1" style={{ '--i': i }} />
      ))}
      <path className="cr-steps-line" d="M4 96 L46 76 L92 56 L138 36 L184 16 L232 4" pathLength="1" />
    </svg>
  )
}

// Nodes around the practice, connected by faint lines that pulse in turn.
const NODES = [
  [50, 40],
  [170, 30],
  [210, 110],
  [150, 180],
  [40, 160],
  [100, 100],
]
function Network() {
  const hub = NODES[5]
  return (
    <svg className="cr-net" viewBox="0 0 250 220" fill="none" aria-hidden="true">
      {NODES.slice(0, 5).map(([x, y], i) => (
        <g key={i}>
          <line x1={hub[0]} y1={hub[1]} x2={x} y2={y} />
          <line className="cr-net-pulse" x1={hub[0]} y1={hub[1]} x2={x} y2={y} pathLength="1" style={{ '--i': i }} />
          <rect x={x - 4} y={y - 4} width="8" height="8" />
        </g>
      ))}
      <rect className="cr-net-hub" x={hub[0] - 7} y={hub[1] - 7} width="14" height="14" />
    </svg>
  )
}
