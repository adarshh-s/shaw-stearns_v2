import { useSearchParams } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import { Card, useReveal } from '../components/ui.jsx'
import { DISCIPLINES } from '../content.js'
import { CtaCard } from './Home.jsx'

export default function Services() {
  useReveal()
  const [params, setParams] = useSearchParams()
  const current = DISCIPLINES.find((d) => d.id === params.get('d')) || DISCIPLINES[0]
  const select = (id) => setParams({ d: id }, { replace: true, preventScrollReset: true })

  return (
    <>
      <PageHero
        label="Services"
        title="Three disciplines."
        accent="One client-side view."
        lede="Delivered separately or as one integrated commission — always on the owner’s behalf, always independent."
      />

      <section className="section" id="disciplines">
        <div className="container">
          <div className="segmented" role="tablist" aria-label="Disciplines">
            {DISCIPLINES.map((d) => (
              <button
                key={d.id}
                role="tab"
                aria-selected={d.id === current.id}
                className={d.id === current.id ? 'active' : ''}
                onClick={() => select(d.id)}
              >
                <span className="mono">{d.code}</span>
                {d.title}
              </button>
            ))}
          </div>
          <Card className="panel" role="tabpanel" key={current.id}>
            <div className="panel-lead">
              <h2>{current.title}</h2>
              <p className="muted">{current.lead}</p>
            </div>
            <ul className="scope">
              {current.scope.map((s, i) => (
                <li key={s} style={{ '--d': `${i * 40}ms` }}>
                  <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <CtaCard />
    </>
  )
}
