import { Link } from 'react-router-dom'
import { DISCIPLINES } from '../content.js'

// Isometric line drawings, one per discipline. Boxes are drawn back to front as
// filled faces so nearer shapes hide the lines behind them; strokes draw in
// when the row scrolls into view, and the shapes part on hover.
const S = 15
const iso = (x, y, z) => [(x - y) * 0.866 * S, (x + y) * 0.5 * S - z * S]
const pts = (arr) => arr.map((p) => iso(...p).map((n) => n.toFixed(1)).join(',')).join(' ')

function box(x, y, z, w, d, h) {
  return [
    pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]),
    pts([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]),
    pts([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]),
  ]
}

// FIG 0.1 · Project Management: the lifecycle as stacked plates.
const STACK = Array.from({ length: 7 }, (_, i) => ({ faces: box(0, 0, i * 1.1, 8, 8, 0.45), lift: i }))
// FIG 0.2 · Cost Management: elements measured as blocks.
const BLOCKS = [
  [0, 0, 0, 4, 4, 3.6],
  [4.6, 0, 0, 4, 4, 2.4],
  [0, 4.6, 0, 4, 4, 2.2],
  [4.6, 4.6, 0, 4, 4, 4.2],
  [2.3, 2.3, 4.4, 4, 4, 2],
].map((b, i) => ({ faces: box(...b), lift: i }))
// FIG 0.3 · Development Advisory: options rising toward the right decision.
const FINS = Array.from({ length: 11 }, (_, i) => ({ faces: box(i * 0.85, 0, 0, 0.32, 7, 1 + i * 0.62), lift: i }))

const FIGS = [
  { shapes: STACK, view: '-130 -120 260 250', mode: 'up' },
  { shapes: BLOCKS, view: '-130 -110 260 250', mode: 'out' },
  { shapes: FINS, view: '-120 -150 260 250', mode: 'up' },
]

function Fig({ shapes, view, mode }) {
  let n = 0
  return (
    <svg className={`fig fig-${mode}`} viewBox={view} aria-hidden="true">
      {shapes.map((s, si) => (
        <g key={si} className="fig-shape" style={{ '--i': s.lift }}>
          {s.faces.map((f, fi) => (
            <polygon key={fi} points={f} pathLength="1" style={{ '--d': `${n++ * 28}ms` }} />
          ))}
        </g>
      ))}
    </svg>
  )
}

export default function Figures() {
  return (
    <div className="figs" data-reveal>
      {DISCIPLINES.map((d, i) => (
        <Link key={d.id} to={`/services?d=${d.id}#disciplines`} className="fig-col">
          <span className="fig-label">FIG 0.{i + 1}</span>
          <Fig {...FIGS[i]} />
          <h3>{d.title}</h3>
          <p>{d.short}</p>
        </Link>
      ))}
    </div>
  )
}
