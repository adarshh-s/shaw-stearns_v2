// Abstract hero object: an isometric stack of plates that floats and breathes,
// a light plane scanning up through it, and three satellite blocks wired to
// the core with flowing connectors. The whole object tilts toward the pointer.
const S = 17
const iso = (x, y, z) => [(x - y) * 0.866 * S, (x + y) * 0.5 * S - z * S]
const pts = (arr) => arr.map((p) => iso(...p).map((n) => n.toFixed(1)).join(',')).join(' ')

function box(x, y, z, w, d, h) {
  return [
    pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]),
    pts([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]),
    pts([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]),
  ]
}

const PLATES = Array.from({ length: 9 }, (_, i) => box(0, 0, i * 1.05, 7, 7, 0.32))
const SATS = [
  { faces: box(-9, 1.5, 0, 3, 3, 3), anchor: [-6, 3, 1.5], to: [0, 3.5, 2] },
  { faces: box(1.5, -9.5, 2, 3, 3, 2.2), anchor: [3, -6.5, 3], to: [3.5, 0, 4] },
  { faces: box(11, 10, 0, 2.6, 2.6, 4), anchor: [11, 11.3, 2], to: [7, 7, 3] },
]
const line = ([a, b]) => {
  const [x1, y1] = iso(...a)
  const [x2, y2] = iso(...b)
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`
}
const SCAN = pts([[-0.6, -0.6, 0], [7.6, -0.6, 0], [7.6, 7.6, 0], [-0.6, 7.6, 0]])
const GROUND = Array.from({ length: 9 }, (_, i) => i * 2 - 6)

export default function HeroStructure() {
  return (
    <div className="hs" aria-hidden="true">
      <svg className="hs-svg" viewBox="-210 -200 420 400">
        <g className="hs-ground">
          {GROUND.map((k) => (
            <g key={k}>
              <path d={line([[k, -6, -1.4], [k, 14, -1.4]])} />
              <path d={line([[-6, k, -1.4], [14, k, -1.4]])} />
            </g>
          ))}
        </g>

        {SATS.map((s, i) => (
          <g key={i}>
            <path className="hs-wire" d={line([s.anchor, s.to])} />
            <path className="hs-flow" d={line([s.anchor, s.to])} style={{ animationDelay: `${-i * 0.8}s` }} />
          </g>
        ))}

        {SATS.slice(0, 2).map((s, i) => (
          <g key={i} className="hs-sat" style={{ '--i': i }}>
            {s.faces.map((f, fi) => (
              <polygon key={fi} points={f} />
            ))}
          </g>
        ))}

        {PLATES.map((faces, i) => (
          <g key={i} className={`hs-plate ${i === 4 ? 'key' : ''}`} style={{ '--i': i }}>
            {faces.map((f, fi) => (
              <polygon key={fi} points={f} />
            ))}
          </g>
        ))}

        <polygon className="hs-scan" points={SCAN} />

        <g className="hs-sat" style={{ '--i': 2 }}>
          {SATS[2].faces.map((f, fi) => (
            <polygon key={fi} points={f} />
          ))}
        </g>
      </svg>
    </div>
  )
}
