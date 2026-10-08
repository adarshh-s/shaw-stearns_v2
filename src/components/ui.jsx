import { useEffect } from 'react'
import logoRaw from '../logo.svg?raw'

export function Logo({ className = '' }) {
  return <span className={`logo ${className}`} role="img" aria-label="Shaw Stearns" dangerouslySetInnerHTML={{ __html: logoRaw }} />
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

// Adds .in to every [data-reveal] element on the page when it scrolls into view.
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]:not(.in)')
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
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

