import { useEffect } from 'react'
import { gsap, ScrollTrigger, reducedMotion } from '../smooth.js'

// The official Albemarle Grey artwork, applied as a CSS mask so each use can
// take its colour from the brand palette (navy, white on dark, gold).
export function Mark({ className = '' }) {
  return <span className={`mark ${className}`} aria-hidden="true" />
}

// Horizontal lock-up: wordmark followed by the trademark.
export function Logo({ className = '' }) {
  return <span className={`logo ${className}`} role="img" aria-label="Albemarle Grey" />
}

// Small section label, e.g. "01 — Disciplines".
export function Pill({ n, children, className = '' }) {
  return (
    <span className={`pill ${className}`}>
      {n && <span className="pill-n">{n}</span>}
      {children}
    </span>
  )
}

export function Arrow() {
  return (
    <svg className="arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

// Hairline card whose border lights up under the pointer.
export function Card({ as: Tag = 'div', className = '', children, onMouseMove, ...rest }) {
  const move = (e) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--cx', `${e.clientX - r.left}px`)
    el.style.setProperty('--cy', `${e.clientY - r.top}px`)
    onMouseMove?.(e)
  }
  return (
    <Tag className={`card ${className}`} onMouseMove={move} {...rest}>
      {children}
    </Tag>
  )
}

// Splits text into words that blur and rise in one after another.
// Lines are separated with "\n".
export function SplitText({ text, as: Tag = 'span', delay = 0, step = 55, className = '' }) {
  let i = 0
  return (
    <Tag className={`split-text ${className}`} aria-label={text.replace(/\n/g, ' ')}>
      {text.split('\n').map((line, li) => (
        <span className="split-line" key={li} aria-hidden="true">
          {line.split(' ').map((w, wi) => (
            <span className="split-word" key={wi} style={{ animationDelay: `${delay + i++ * step}ms` }}>
              {w}
              {wi < line.split(' ').length - 1 ? ' ' : ''}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}

// Scroll effects for the current page, run with GSAP ScrollTrigger:
// - [data-reveal] elements gain .in as they enter, staggered when several
//   arrive together (the CSS handles the rise and sharpen);
// - [data-parallax="n"] elements drift against the scroll by n (0.1 – 0.4),
//   on wider screens only.
export function useReveal() {
  useEffect(() => {
    const els = gsap.utils.toArray('[data-reveal]:not(.in)')
    if (reducedMotion()) {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.batch(els, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => batch.forEach((el, i) => gsap.delayedCall(i * 0.12, () => el.classList.add('in'))),
      })
      // Parallax only where layers sit side by side; stacked on phones they would collide.
      if (window.innerWidth <= 860) return
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const n = parseFloat(el.dataset.parallax) || 0.2
        gsap.fromTo(
          el,
          { y: 0 },
          {
            y: () => -n * window.innerHeight * 0.5,
            ease: 'none',
            scrollTrigger: {
              trigger: el.closest('section') || el,
              start: 'clamp(top bottom)',
              end: 'clamp(bottom top)',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })
    })
    return () => ctx.revert()
  }, [])
}

// Shares the pointer as --gx/--gy (px) and --nx/--ny (-1..1) so surfaces can
// react to it from CSS.
export function useGlassLight() {
  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    let x = 0
    let y = 0
    const apply = () => {
      raf = 0
      root.style.setProperty('--gx', `${x}px`)
      root.style.setProperty('--gy', `${y}px`)
      root.style.setProperty('--nx', ((x / window.innerWidth) * 2 - 1).toFixed(3))
      root.style.setProperty('--ny', ((y / window.innerHeight) * 2 - 1).toFixed(3))
    }
    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (!raf) raf = requestAnimationFrame(apply)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])
}

