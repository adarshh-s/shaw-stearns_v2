import { Link } from 'react-router-dom'
import { Logo } from './ui.jsx'
import { CONTACT, DISCIPLINES } from '../content.js'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>Independent client-side advisors to owners and developers across the UAE.</p>
        </div>
        <div>
          <h4>Services</h4>
          {DISCIPLINES.map((d) => (
            <Link key={d.id} to={`/services?d=${d.id}#disciplines`}>
              {d.title}
            </Link>
          ))}
        </div>
        <div>
          <h4>Practice</h4>
          <Link to="/about">About</Link>
          <Link to="/about#careers">Careers</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <h4>Office</h4>
          <p>
            {CONTACT.office[0]}
            <br />
            {CONTACT.office[1]}
          </p>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </div>
      </div>
      <div className="container footer-base">
        <span>© {YEAR} Shaw Stearns. All rights reserved.</span>
        <span>Client-Side Advisory · Dubai</span>
      </div>
    </footer>
  )
}
