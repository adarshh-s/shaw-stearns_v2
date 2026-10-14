import { useEffect, useRef, useState } from 'react'

// Large uppercase statement. Words light up one by one as it scrolls through
// the viewport; key words are set bold, and the keyword tabs on the right
// switch on as their word is reached.
const TEXT = [
  ['Independent.', 1],
  ['Client-side.', 1],
  ['Uncompromising.', 1],
  ['We', 0],
  ['protect', 0],
  ['the', 0],
  ['capital,', 2],
  ['programme', 2],
  ['and', 0],
  ['quality', 2],
  ['of', 0],
  ['owners', 0],
  ['and', 0],
  ['developers', 0],
  ['—', 0],
  ['with', 0],
  ['no', 0],
  ['competing', 0],
  ['interests.', 0],
]
const TABS = [
  { label: 'Capital', at: 6 },
  { label: 'Programme', at: 7 },
  { label: 'Quality', at: 9 },
]

export default function Manifesto() {
  const ref = useRef(null)
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [lit, setLit] = useState(reduced ? TEXT.length : 0)

  useEffect(() => {
    if (reduced) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = ref.current.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.25)))
      setLit(Math.round(p * TEXT.length))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [reduced])

  return (
    <div className="manifesto" ref={ref}>
      <div className="mf-head">
        <span className="mf-rule" />
        <div className="mf-tabs">
          {TABS.map((t) => (
            <span key={t.label} className={lit > t.at ? 'on' : ''}>
              {t.label}
            </span>
          ))}
        </div>
      </div>
      <p className="mf-text">
        {TEXT.map(([w, kind], i) => (
          <span key={i} className={`mf-word ${kind ? 'strong' : ''} ${i < lit ? 'lit' : ''}`}>
            {w}{' '}
          </span>
        ))}
      </p>
    </div>
  )
}
