import { useState } from 'react'
import { Arrow, Card, Pill, SplitText } from '../components/ui.jsx'
import { CONTACT } from '../content.js'

const FIELDS = [
  { name: 'name', label: 'Full name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'company', label: 'Company' },
  { name: 'project', label: 'Project type / location', wide: true },
]

// No backend yet: the form composes an email to the enquiries inbox.
function toMailto(data) {
  const body = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone && `Phone: ${data.phone}`,
    data.company && `Company: ${data.company}`,
    data.project && `Project: ${data.project}`,
    '',
    data.brief,
  ]
    .filter((l) => l !== undefined && l !== '')
    .join('\n')
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent('Confidential discussion request')}&body=${encodeURIComponent(body)}`
}

export default function Contact() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    window.location.href = toMailto(data)
    setSent(true)
  }

  return (
    <section className="contact">
      <div className="container contact-grid">
        <div className="contact-info">
          <Pill>Contact</Pill>
          <h1>
            <SplitText text="Start a" />
            <SplitText text="conversation." delay={160} className="dim" />
          </h1>
          <p className="lede">A private discussion to explore whether Shaw Stearns is the right partner for your project.</p>
          <dl className="details">
            <div>
              <dt className="mono muted">Office</dt>
              <dd>
                {CONTACT.office[0]}
                <br />
                {CONTACT.office[1]}
              </dd>
            </div>
            <div>
              <dt className="mono muted">Email</dt>
              <dd>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </dd>
            </div>
            <div>
              <dt className="mono muted">Discretion</dt>
              <dd>Confidential by default</dd>
            </div>
          </dl>
          <LocationMark />
        </div>

        <Card as="form" className="form" onSubmit={onSubmit}>
          <div className="form-head">
            <span className="mono muted">Request a confidential discussion</span>
          </div>
          <div className="form-fields">
            {FIELDS.map((f) => (
              <label key={f.name} className={`field ${f.wide ? 'wide' : ''}`}>
                <span>
                  {f.label}
                  {f.required && <em>*</em>}
                </span>
                <input name={f.name} type={f.type || 'text'} required={f.required} autoComplete="on" />
              </label>
            ))}
            <label className="field wide">
              <span>Brief description</span>
              <textarea name="brief" rows={4} />
            </label>
          </div>
          <button className="btn btn-solid btn-block" type="submit">
            {sent ? 'Opening your email…' : 'Request a confidential discussion'} <Arrow />
          </button>
          <p className="form-note muted">Every enquiry is treated with full discretion.</p>
        </Card>
      </div>
    </section>
  )
}

// Abstract location marker: a drafting grid with a pulsing pin, no map imagery.
function LocationMark() {
  return (
    <div className="locmark" aria-hidden="true">
      <svg viewBox="0 0 240 120" preserveAspectRatio="none">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="120" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 20} x2="240" y2={i * 20} />
        ))}
        <path className="road" d="M0 92 C60 88, 90 70, 140 60 S210 40, 240 30" />
        <line className="axis" x1="140" y1="0" x2="140" y2="120" />
        <line className="axis" x1="0" y1="60" x2="240" y2="60" />
      </svg>
      <span className="pin" />
      <span className="mono loc-label">Trade Centre · Dubai</span>
    </div>
  )
}
