import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Logo, Arrow } from './ui.jsx'
import { useTheme } from '../theme.jsx'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
]

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

// Text-scramble "tag" (as on hubtown.co.in): the word types itself in from the
// left, a couple of random glyphs running just ahead of the settled letters.
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// With `intro`, the word starts blank and decodes in on load.
function useScramble(text, intro = false) {
  const [out, setOut] = useState(() => (intro && !reducedMotion() ? '' : text))
  const timer = useRef(0)

  const run = useCallback(() => {
    if (reducedMotion()) return setOut(text)
    clearInterval(timer.current)
    const chars = [...text]
    // Fixed duration (~0.5s) so a long label like the CTA decodes as quickly as the short tags.
    const step = Math.max(0.5, chars.length / 14)
    let locked = 0
    timer.current = setInterval(() => {
      locked += step
      const shown = chars.map((ch, i) => {
        if (i < locked || ch === ' ') return ch
        if (i < locked + 2) return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        return ''
      })
      setOut(shown.join(''))
      if (locked >= chars.length) {
        clearInterval(timer.current)
        setOut(text)
      }
    }, 34)
  }, [text])

  useEffect(() => () => clearInterval(timer.current), [])
  return [out, run]
}

// The real word sits invisibly underneath so the width never jumps.
function Scramble({ text, out }) {
  return (
    <span className="scramble" aria-hidden="true">
      <span className="scramble-ghost">{text}</span>
      <span className="scramble-live">{out}</span>
    </span>
  )
}

function NavItem({ link, index, active, onHover }) {
  const [out, run] = useScramble(link.label, true)

  // Decode in once on load, one tag after another.
  useEffect(() => {
    const t = setTimeout(run, 350 + index * 110)
    return () => clearTimeout(t)
  }, [run, index])

  const enter = (e) => {
    onHover(e.currentTarget)
    run()
  }

  return (
    <NavLink to={link.to} end aria-label={link.label} onMouseEnter={enter} onFocus={enter} className={`nav-link ${active ? 'active' : ''}`}>
      <Scramble text={link.label} out={out} />
    </NavLink>
  )
}

function NavCta() {
  const label = 'Discuss your project'
  const [out, run] = useScramble(label)
  return (
    <Link to="/contact" className="btn-box nav-cta" aria-label={label} onMouseEnter={run} onFocus={run}>
      <Scramble text={label} out={out} /> <span aria-hidden="true">↗</span>
    </Link>
  )
}

// Logo left; tags, theme toggle and the primary action right. A soft blue
// highlight slides between tags on hover while the word re-scrambles. Once the
// page scrolls, the bar lifts into a floating glass panel with crosshair corners
// and a hairline that tracks reading progress.
export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false })
  const close = () => setOpen(false)
  const isActive = (to) => pathname === to

  const moveTo = useCallback((el) => {
    if (!el) return setPill((p) => ({ ...p, visible: false }))
    setPill({ left: el.offsetLeft, width: el.offsetWidth, visible: true })
  }, [])
  const hide = useCallback(() => setPill((p) => ({ ...p, visible: false })), [])

  const progress = useRef(null)

  useLayoutEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${open ? 'is-open' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-shell">
        <div className="nav-panel">
          <span className="nav-c tl" aria-hidden="true" />
          <span className="nav-c tr" aria-hidden="true" />
          <span className="nav-c bl" aria-hidden="true" />
          <span className="nav-c br" aria-hidden="true" />
          <div className="nav-inner">
            <Link to="/" onClick={close} className="nav-logo" aria-label="Albemarle Grey home">
              <Logo />
            </Link>

            <nav className="nav-links" aria-label="Primary" onMouseLeave={hide}>
              <span className="nav-hover" aria-hidden="true" style={{ transform: `translateX(${pill.left}px)`, width: pill.width, opacity: pill.visible ? 1 : 0 }} />
              {LINKS.map((l, i) => (
                <NavItem key={l.label} link={l} index={i} active={isActive(l.to)} onHover={moveTo} />
              ))}
            </nav>

            <div className="nav-actions">
              <span className="nav-divider" aria-hidden="true" />
              <ThemeToggle />
              <NavCta />
              <button className="icon-btn nav-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
                <span />
                <span />
              </button>
            </div>
          </div>

          <div className="nav-drawer">
            {LINKS.map((l) => (
              <Link key={l.label} to={l.to} onClick={close} className={isActive(l.to) ? 'active' : ''}>
                {l.label}
                <Arrow />
              </Link>
            ))}
            <Link to="/contact" onClick={close} className="btn btn-solid">
              Discuss your project <Arrow />
            </Link>
          </div>

          <span className="nav-progress" aria-hidden="true">
            <i ref={progress} />
          </span>
        </div>
      </div>
    </header>
  )
}

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <button className="icon-btn theme-toggle" onClick={toggle} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`} title={`${dark ? 'Light' : 'Dark'} mode`}>
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <g className="t-sun" stroke="currentColor" strokeWidth="1.3">
          <circle cx="8" cy="8" r="3" />
          <path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9 13 13M3 13l1.1-1.1M11.9 4.1 13 3" />
        </g>
        <path className="t-moon" d="M13.5 9.6A5.6 5.6 0 0 1 6.4 2.5a5.6 5.6 0 1 0 7.1 7.1Z" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    </button>
  )
}
