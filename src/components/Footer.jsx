import { Link } from 'react-router-dom'
import { Logo } from './ui.jsx'
import { COMPANY, CONTACT, DISCIPLINES } from '../content.js'

const YEAR = new Date().getFullYear()

const PAGES = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h4>01 / Services</h4>
          {DISCIPLINES.map((d) => (
            <Link key={d.id} to={d.to}>
              {d.title} ↗
            </Link>
          ))}
        </div>
        <div>
          <h4>02 / Pages</h4>
          {PAGES.map((p) => (
            <Link key={p.to} to={p.to}>
              {p.label} ↗
            </Link>
          ))}
        </div>
        <div>
          <h4>03 / Office</h4>
          <p>
            {CONTACT.office[0]}
            <br />
            {CONTACT.office[1]}
          </p>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </div>
      </div>

      {/* Two-row base: brand and copyright, then the legal entity and privacy notice. */}
      <div className="container footer-base">
        <div className="footer-row">
          <span className="footer-id">
            <Link to="/" className="footer-logo" aria-label="Albemarle Grey home">
              <Logo />
            </Link>
            <span className="footer-sep" aria-hidden="true" />
            {COMPANY.tagline}
          </span>
          <span>
            © {YEAR} {COMPANY.name}. All rights reserved.
          </span>
        </div>
        <div className="footer-row">
          <span>
            {COMPANY.entity} · {COMPANY.location} · Trade licence no. {COMPANY.licence}
          </span>
          {/* Reserved for the RICS regulatory statement and permitted branding. */}
          <span className="footer-rics">{COMPANY.rics.active && COMPANY.rics.text}</span>
          <Link to="/privacy" className="footer-privacy">
            Privacy notice ↗
          </Link>
        </div>
      </div>
    </footer>
  )
}
