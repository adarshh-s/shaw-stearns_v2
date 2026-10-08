import { useCallback, useLayoutEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Logo, Arrow } from './ui.jsx'
import { useTheme } from '../theme.jsx'

const LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/about#careers', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
]

// Logo left; links, theme toggle and the primary action right. A soft
// highlight slides between links on hover. The bar gains a hairline and blur
// once the page scrolls.
export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname, hash } = useLocation()
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false })
  const close = () => setOpen(false)
  const isActive = (to) => (to.includes('#') ? pathname + hash === to : pathname === to && !(to === '/about' && hash === '#careers'))

  const moveTo = useCallback((el) => {
    if (!el) return setPill((p) => ({ ...p, visible: false }))
    setPill({ left: el.offsetLeft, width: el.offsetWidth, visible: true })
  }, [])
  const hide = useCallback(() => setPill((p) => ({ ...p, visible: false })), [])

  useLayoutEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${open ? 'is-open' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" onClick={close} className="nav-logo" aria-label="Shaw Stearns home">
          <Logo />
        </Link>

        <nav className="nav-links" aria-label="Primary" onMouseLeave={hide}>
          <span
            className="nav-hover"
            aria-hidden="true"
            style={{ transform: `translateX(${pill.left}px)`, width: pill.width, opacity: pill.visible ? 1 : 0 }}
          />
          {LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end
              onMouseEnter={(e) => moveTo(e.currentTarget)}
              onFocus={(e) => moveTo(e.currentTarget)}
              className={() => `nav-link ${isActive(l.to) ? 'active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <span className="nav-divider" aria-hidden="true" />
          <ThemeToggle />
          <Link to="/contact" className="btn-box nav-cta">
            Request a discussion <span aria-hidden="true">↗</span>
          </Link>
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
          Request a discussion <Arrow />
        </Link>
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
