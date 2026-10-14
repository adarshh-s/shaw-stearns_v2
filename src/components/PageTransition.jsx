import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { m } from 'motion/react'
import { ScrollTrigger, scrollToTarget } from '../smooth.js'

const EASE = [0.76, 0, 0.24, 1]
const OUT = [0.16, 1, 0.3, 1]
const STAGGER = 0.035

const PAGES = {
  '/': { n: '01', t: 'Home', title: ['Albemarle', 'Grey.'] },
  '/services': { n: '02', t: 'Services', title: ['Clear advice.', 'Disciplined delivery.'] },
  '/careers': { n: '03', t: 'Careers', title: ['A practice', 'with purpose.'] },
  '/contact': { n: '04', t: 'Contact', title: ['Discuss your', 'project.'] },
  '/privacy': { n: '—', t: 'Legal', title: ['Privacy', 'notice.'] },
}

// Same column width as the fluted background, so the curtain lines up with it.
const columnCount = () => {
  const w = window.innerWidth
  return Math.max(1, Math.round(w / Math.max(w / 12, 88)))
}

// Wraps each route. Leaving: fluted glass columns rise from the bottom, one
// after another, each catching the blue light band at its own height, and the
// destination's tag and title appear over a drafting grid. Arriving: the
// columns lift away left to right and the new page settles in, then any #hash
// target is scrolled into view.
export default function PageTransition({ children }) {
  // While a page is leaving, the router already points at the destination.
  const { pathname } = useLocation()
  const page = PAGES[pathname] || PAGES['/']
  const [cols] = useState(columnCount)

  const entered = () => {
    ScrollTrigger.refresh()
    const id = window.location.hash.slice(1)
    const el = id && document.getElementById(id)
    if (el) scrollToTarget(el)
  }

  return (
    <>
      <m.div
        className="page"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: OUT, delay: 0.55 } }}
        exit={{ opacity: 0, y: -24, transition: { duration: 0.4, ease: EASE } }}
        onAnimationComplete={(target) => target.opacity === 1 && entered()}
      >
        {children}
      </m.div>

      <div className="curtain" aria-hidden="true">
        {Array.from({ length: cols }, (_, i) => (
          <m.span
            key={i}
            className="curtain-col"
            style={{ '--band': `${18 + 14 * Math.sin(i * 0.9 + 1.2) + 8 * Math.sin(i * 2.1)}%` }}
            initial={{ scaleY: 1, originY: 0 }}
            animate={{ scaleY: 0, originY: 0, transition: { duration: 0.7, ease: EASE, delay: 0.3 + i * STAGGER } }}
            exit={{ scaleY: 1, originY: 1, transition: { duration: 0.6, ease: EASE, delay: i * STAGGER } }}
          />
        ))}

        <m.div
          className="curtain-tag"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, y: -16, transition: { duration: 0.35, ease: EASE, delay: 0.15 } }}
          exit={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: OUT, delay: 0.35 } }}
        >
          <span className="curtain-c tl" />
          <span className="curtain-c br" />
          <span className="kicker">
            {page.n} / {page.t}
          </span>
          <span className="curtain-title">
            <span className="thin">{page.title[0]}</span>
            <b>{page.title[1]}</b>
          </span>
          <span className="curtain-bar">
            <m.i initial={{ scaleX: 1 }} animate={{ scaleX: 1 }} exit={{ scaleX: [0, 1], transition: { duration: 0.75, ease: EASE, delay: 0.2 } }} />
          </span>
        </m.div>
      </div>
    </>
  )
}
