import { useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { Link, useSearchParams } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import { useReveal } from '../components/ui.jsx'
import { ADVISORY, DELIVERY } from '../content.js'
import { CtaCard } from './Home.jsx'

const pad = (n) => String(n).padStart(2, '0')

// Shared motion for switching panels: the old one lifts and blurs out, the new
// one rises in, offset in the direction of travel.
const swap = {
  initial: (dir) => ({ opacity: 0, y: 18 * dir, filter: 'blur(6px)' }),
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: (dir) => ({ opacity: 0, y: -12 * dir, filter: 'blur(6px)', transition: { duration: 0.22, ease: 'easeIn' } }),
}
const glide = { type: 'spring', stiffness: 380, damping: 34 }

// Remembers the last value to tell which way a switch is going (1 forward, -1 back).
function useDirection(value) {
  const [state, setState] = useState({ value, dir: 1 })
  if (state.value !== value) setState({ value, dir: value > state.value ? 1 : -1 })
  return state.dir
}

export default function Services() {
  useReveal()
  return (
    <>
      <PageHero
        label="Services"
        title="Clear advice."
        accent="Disciplined delivery."
        lede="Our services span development feasibility, project delivery and commercial management, with each appointment tailored to your objectives."
      />
      <Advisory />
      <Delivery />
      <CtaCard />
    </>
  )
}

// Drawing-sheet frame: crosshair corners and a title block, as on a drafting sheet.
function Sheet({ brand, title, sheet, children }) {
  return (
    <div className="sheet" data-reveal>
      <span className="sheet-c tl" aria-hidden="true" />
      <span className="sheet-c tr" aria-hidden="true" />
      <span className="sheet-c bl" aria-hidden="true" />
      <span className="sheet-c br" aria-hidden="true" />
      <div className="sheet-title">
        <span className="fw-brand">{brand}</span>
        <span className="kicker">{title}</span>
        <span className="mono sheet-no">{sheet}</span>
      </div>
      {children}
    </div>
  )
}

// The three considerations / pillars, then a flowing connector into the process.
function Axes({ label, items, flow }) {
  return (
    <>
      <div className="fw-axes">
        {label && <span className="kicker fw-axes-label">{label}</span>}
        {items.map((c, i) => (
          <div className="fw-axis" key={c.t}>
            <span className="mono accent">{String.fromCharCode(65 + i)}</span>
            <strong>{c.t}</strong>
            <span className="kicker">{c.s}</span>
          </div>
        ))}
      </div>
      <div className="fw-flow" aria-hidden="true">
        <span className="kicker">{flow}</span>
        <i />
        <span className="fw-flow-arrow">↓</span>
      </div>
    </>
  )
}

function StageTile({ n, title, sub, active, inPhase, group, onClick, ...rest }) {
  return (
    <button className={`fw-tile ${inPhase ? 'in' : ''} ${active ? 'active' : ''}`} onClick={onClick} {...rest}>
      {active && <m.span layoutId={`${group}-hl`} className="fw-hl" transition={glide} aria-hidden="true" />}
      <span className="fw-tile-top">
        <span className="mono">{pad(n)}</span>
        <span className="fw-go" aria-hidden="true">
          ↗
        </span>
      </span>
      <strong>{title}</strong>
      <span className="kicker">{sub}</span>
      <span className="fw-tile-num" aria-hidden="true">
        {pad(n)}
      </span>
    </button>
  )
}

function Advisory() {
  const [active, setActive] = useState(0)
  const dir = useDirection(active)
  const stages = ADVISORY.stages
  const s = stages[active]

  return (
    <section className="section" id="advisory">
      <div className="container">
        <div className="svc-head" data-reveal>
          <span className="kicker">01 / Development Advisory</span>
          <h2 className="display svc-display">
            <span className="thin">From opportunity to</span>
            <br />
            <b>investment decision.</b>
          </h2>
          <p className="lede">
            We help owners and developers evaluate development opportunities, assess financial viability and develop strategies for investment, delivery and exit.
          </p>
        </div>

        <Sheet brand="Albemarle Grey" title="Development advisory framework" sheet={`Stage ${pad(active + 1)} / ${pad(stages.length)}`}>
          <Axes label="Key investment considerations" items={ADVISORY.considerations} flow="Advisory process" />

          <div className="fw-tiles fw-cols-2" role="tablist" aria-label="Advisory process">
            {stages.map((st, i) => (
              <StageTile key={st.t} n={i + 1} title={st.t} sub={st.s} active={active === i} group="adv" onClick={() => setActive(i)} role="tab" aria-selected={active === i} />
            ))}
          </div>

          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <m.div className="fw-detail" role="tabpanel" key={active} custom={dir} variants={swap} initial="initial" animate="animate" exit="exit">
              <div className="fw-detail-lead">
                <span className="fw-big" aria-hidden="true">
                  {pad(active + 1)}
                </span>
                <h3>{s.title}</h3>
                <p className="muted">{s.d}</p>
              </div>
              <div className="fw-detail-body">
                <span className="kicker">Advisory activities</span>
                <ol className="fw-list">
                  {s.activities.map((a, i) => (
                    <li key={a}>
                      <span className="mono">{pad(i + 1)}</span>
                      {a}
                    </li>
                  ))}
                </ol>
                <div className="fw-outcome">
                  <span className="kicker">Indicative outcome</span>
                  <p>{s.outcome}</p>
                </div>
              </div>
            </m.div>
          </AnimatePresence>

          <div className="fw-nav">
            <button className="fw-step" disabled={active === 0} onClick={() => setActive(active - 1)}>
              <span aria-hidden="true">←</span> Previous
            </button>
            <div className="fw-progress">
              <span className="kicker">Select a stage to explore</span>
              <div>
                {stages.map((st, i) => (
                  <button key={st.t} aria-label={st.title} className={i <= active ? 'on' : ''} onClick={() => setActive(i)}>
                    {i === active && <m.i layoutId="adv-progress" className="fw-progress-head" transition={glide} />}
                  </button>
                ))}
              </div>
            </div>
            <button className="fw-step" disabled={active === stages.length - 1} onClick={() => setActive(active + 1)}>
              Next <span aria-hidden="true">→</span>
            </button>
          </div>
        </Sheet>
      </div>
    </section>
  )
}

function Delivery() {
  const [params, setParams] = useSearchParams()
  const service = DELIVERY.services.find((d) => d.id === params.get('d')) || DELIVERY.services[0]
  const pickService = (id) => setParams({ d: id }, { replace: true, preventScrollReset: true })
  const [stage, setStage] = useState(0)
  const dir = useDirection(stage)
  const st = DELIVERY.stages[stage]
  const pickPhase = (p) => setStage(DELIVERY.stages.findIndex((x) => x.phase === p))

  return (
    <section className="section" id="delivery">
      <div className="container">
        <div className="svc-head" data-reveal>
          <span className="kicker">02 / Project Delivery</span>
        </div>

        <div className="svc-intro" data-reveal>
          {DELIVERY.services.map((d, i) => (
            <div key={d.id}>
              <span className="kicker">
                {pad(i + 1)} / {d.kicker}
              </span>
              <h3>{d.title}</h3>
              <p className="muted">{d.d}</p>
            </div>
          ))}
        </div>

        <div className="svc-joint" data-reveal>
          <h3>Appointed independently or together.</h3>
          <p className="muted">Our services can be commissioned separately or as an integrated appointment, tailored to the requirements of each project.</p>
        </div>

        <div className="svc-head" data-reveal>
          <span className="kicker">03 / Our approach</span>
          <h2 className="display svc-display">
            <span className="thin">From brief to</span>
            <br />
            <b>handover.</b>
          </h2>
          <p className="lede">Explore how our project management and commercial expertise support each stage of the construction lifecycle.</p>
        </div>

        <Sheet brand="Project delivery framework" title="Continuous oversight">
          <Axes items={DELIVERY.pillars} flow="Project lifecycle" />

          <div className="fw-life">
            <div>
              <span className="kicker fw-label">Project phases</span>
              <ol className="fw-phases">
                {DELIVERY.phases.map((p, i) => (
                  <li key={p} className={`${st.phase === i ? 'active' : ''} ${st.phase > i ? 'done' : ''}`}>
                    <button aria-pressed={st.phase === i} onClick={() => pickPhase(i)}>
                      {st.phase === i && <m.span layoutId="phase-hl" className="fw-phase-hl" transition={glide} aria-hidden="true" />}
                      <span className="mono">{pad(i + 1)}</span>
                      <span className="fw-phase-name">{p}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <span className="kicker fw-label">Project stages</span>
              <div className="fw-tiles fw-cols-3">
                {DELIVERY.stages.map((x, i) => (
                  <StageTile
                    key={x.t}
                    n={i + 1}
                    title={x.t}
                    sub={x.tag}
                    active={stage === i}
                    inPhase={x.phase === st.phase}
                    group="del"
                    onClick={() => setStage(i)}
                    aria-pressed={stage === i}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="fw-explore">
            <div className="fw-explore-head">
              <span className="kicker">Explore services</span>
              <span className="mono fw-count">
                Stage {pad(stage + 1)} / {pad(DELIVERY.stages.length)}
              </span>
              <div className="fw-toggle" role="tablist" aria-label="Service">
                {DELIVERY.services.map((d) => (
                  <button key={d.id} role="tab" aria-selected={service.id === d.id} className={service.id === d.id ? 'active' : ''} onClick={() => pickService(d.id)}>
                    {service.id === d.id && <m.span layoutId="svc-toggle" className="fw-toggle-hl" transition={glide} aria-hidden="true" />}
                    <span>{d.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <m.div className="fw-detail" role="tabpanel" key={`${stage}-${service.id}`} custom={dir} variants={swap} initial="initial" animate="animate" exit="exit">
                <div className="fw-detail-lead">
                  <span className="fw-big" aria-hidden="true">
                    {pad(stage + 1)}
                  </span>
                  <span className="kicker">
                    {DELIVERY.phases[st.phase]} / {service.title}
                  </span>
                  <h3>{st.t}</h3>
                </div>
                <div className="fw-detail-body">
                  <p className="fw-statement">{st[service.id]}</p>
                </div>
              </m.div>
            </AnimatePresence>
          </div>

          <div className="fw-discuss">
            <div>
              <h3>Discuss your project.</h3>
              <p className="muted">Tell us about your objectives and the support you require.</p>
            </div>
            <Link to="/contact" className="btn-box">
              Discuss your project <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </Sheet>
      </div>
    </section>
  )
}
