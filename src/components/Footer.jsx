import { Link } from 'react-router-dom'
import { Logo, Mark } from './ui.jsx'
import { COMPANY, CONTACT, DISCIPLINES, PORTALS } from '../content.js'

const YEAR = new Date().getFullYear()

// A link that stays a quiet placeholder until its url is configured.
function Placeholder({ url, children }) {
  if (url)
    return (
      <a href={url} target="_blank" rel="noreferrer">
        {children} ↗
      </a>
    )
  return (
    <span className="footer-soon" aria-disabled="true">
      {children} <em>Soon</em>
    </span>
  )
}

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
          <h4>02 / Practice</h4>
          <Link to="/careers">Careers ↗</Link>
          <Link to="/contact">Contact ↗</Link>
          <Link to="/privacy">Privacy notice ↗</Link>
          <Placeholder url={COMPANY.linkedin}>LinkedIn</Placeholder>
        </div>
        <div className="footer-brand">
          <h4>03 / {COMPANY.name}</h4>
          <Logo />
          <p>{COMPANY.tagline}</p>
        </div>
        <div>
          <h4>04 / Office</h4>
          <p>
            {CONTACT.office[0]}
            <br />
            {CONTACT.office[1]}
          </p>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </div>
      </div>

      <div className="container footer-portals">
        <h4>05 / Login</h4>
        {PORTALS.map((p) => (
          <Placeholder key={p.label} url={p.url}>
            {p.label}
          </Placeholder>
        ))}
      </div>

      <div className="container footer-base">
        <span className="footer-id">
          <Mark />
          {COMPANY.name} — {COMPANY.tagline}
        </span>
        <span>
          © {YEAR} {COMPANY.name}. Dubai, UAE. All rights reserved.
        </span>
        <span className="footer-legal">{COMPANY.legal}</span>
        {/* Reserved for the RICS regulatory statement and permitted branding. */}
        <span className="footer-rics">{COMPANY.rics.active && COMPANY.rics.text}</span>
      </div>
    </footer>
  )
}
