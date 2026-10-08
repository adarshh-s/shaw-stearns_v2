import { useEffect, useRef, useState } from 'react'

// A large statement whose words brighten one by one as it scrolls through the
// viewport. The lead sentence starts bright; the rest starts dim.
export default function Statement({ lead, rest }) {
  const ref = useRef(null)
  const words = rest.split(' ')
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [lit, setLit] = useState(reduced ? words.length : 0)

  useEffect(() => {
    if (reduced) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = ref.current.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)))
      setLit(Math.round(p * words.length))
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
  }, [words.length, reduced])

  return (
    <p className="statement" ref={ref}>
      <span className="st-lead">{lead} </span>
      {words.map((w, i) => (
        <span key={i} className={`st-word ${i < lit ? 'lit' : ''}`}>
          {w}{' '}
        </span>
      ))}
    </p>
  )
}
