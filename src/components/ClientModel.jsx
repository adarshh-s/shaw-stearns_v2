import { useState } from 'react'

// Interactive diagram of the client-side model. Positions are percentages of the
// diagram box; lines are drawn in a 0–100 SVG space stretched to fit.
const NODES = [
  { id: 'owner', code: 'CLIENT', t: 'Owner / Developer', x: 50, y: 11, d: 'Your capital, programme and reputation. Every report, decision and recommendation flows back here.' },
  { id: 'ss', code: 'CONTROL', t: 'Shaw Stearns', x: 50, y: 43, d: 'The independent control layer. We set the brief, test the numbers and hold every party to account — for you alone.' },
  { id: 'designers', code: 'DESIGN', t: 'Designers', x: 13, y: 87, d: 'Design integrated and challenged for value, buildability and compliance.' },
  { id: 'contractors', code: 'BUILD', t: 'Contractors', x: 37.7, y: 87, d: 'Tendered on merit, administered to contract and measured against programme.' },
  { id: 'suppliers', code: 'SUPPLY', t: 'Suppliers', x: 62.3, y: 87, d: 'Procured competitively. No commissions, no ties, no conflicts on our side.' },
  { id: 'authorities', code: 'REGULATE', t: 'Authorities', x: 87, y: 87, d: 'Regulatory requirements and approvals coordinated early, not discovered late.' },
]

const BELOW = NODES.slice(2)
const INDEPENDENCE_Y = 64

export default function ClientModel() {
  const [active, setActive] = useState('ss')
  const node = NODES.find((n) => n.id === active)
  const lit = (id) => active === 'ss' || active === id || (active === 'owner' && id === 'owner')

  return (
    <div className="model">
      <div className="model-stage" onMouseLeave={() => setActive('ss')}>
        <svg className="model-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line className={`m-base ${lit('owner') ? 'lit' : ''}`} x1="50" y1="43" x2="50" y2="11" />
          <line className={`m-flow up ${lit('owner') ? 'lit' : ''}`} x1="50" y1="43" x2="50" y2="11" />
          {BELOW.map((n) => {
            const d = `M50 43 C50 66, ${n.x} 62, ${n.x} 87`
            return (
              <g key={n.id}>
                <path className={`m-base ${lit(n.id) ? 'lit' : ''}`} d={d} />
                <path className={`m-flow ${lit(n.id) ? 'lit' : ''}`} d={d} />
              </g>
            )
          })}
          <line className="m-indep" x1="0" y1={INDEPENDENCE_Y} x2="100" y2={INDEPENDENCE_Y} />
        </svg>

        <span className="m-indep-label mono" style={{ top: `${INDEPENDENCE_Y}%` }}>
          Independence line
        </span>
        <span className="m-indep-label right mono" style={{ top: `${INDEPENDENCE_Y}%` }}>
          No commercial ties below
        </span>

        {NODES.map((n) => (
          <button
            key={n.id}
            className={`m-node ${n.id === 'ss' ? 'core' : ''} ${active === n.id ? 'active' : ''}`}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            onMouseEnter={() => setActive(n.id)}
            onFocus={() => setActive(n.id)}
            onClick={() => setActive(n.id)}
          >
            <span className="mono">{n.code}</span>
            <strong>{n.t}</strong>
          </button>
        ))}
      </div>
      <div className="model-detail" key={node.id} aria-live="polite">
        <span className="mono accent">{node.code}</span>
        <p>
          <strong>{node.t}.</strong> {node.d}
        </p>
      </div>
    </div>
  )
}
