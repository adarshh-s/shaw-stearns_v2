import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { m } from 'motion/react'
import { Mark } from './ui.jsx'
import { ScrollTrigger, reducedMotion, scrollToTarget } from '../smooth.js'

const EASE = [0.76, 0, 0.24, 1]
const OUT = [0.16, 1, 0.3, 1]
const STAGGER = 0.035
// First visit only: hold the curtain as a short intro before it lifts.
const INTRO = 2.4
let firstLoad = true

const PAGES = {
  '/': { n: '01', t: 'Home', title: ['Albemarle', 'Grey.'] },
  '/services': { n: '02', t: 'Services', title: ['Clear advice.', 'Disciplined delivery.'] },
  '/careers': { n: '03', t: 'Careers', title: ['A practice', 'with purpose.'] },
  '/contact': { n: '04', t: 'Contact', title: ['Discuss your', 'project.'] },
  '/privacy': { n: '—', t: 'Legal', title: ['Privacy', 'notice.'] },
}

const NAME = [
  ['Albemarle', 'thin'],
  ['Grey', 'bold'],
]
const TAGLINE = 'Project & Cost Management · Development Advisory'
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// Tagline that decodes left to right, random glyphs running ahead (as in the nav).
function Decode({ text, delay }) {
  const [out, setOut] = useState('')
  useEffect(() => {
    let timer = 0
    const start = setTimeout(() => {
      let locked = 0
      timer = setInterval(() => {
        locked += 1
        setOut([...text].map((ch, i) => (i < locked || ch === ' ' ? ch : i < locked + 3 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : '')).join(''))
        if (locked >= text.length) clearInterval(timer)
      }, 22)
    }, delay * 1000)
    return () => {
      clearTimeout(start)
      clearInterval(timer)
    }
  }, [text, delay])
  return (
    <span className="kicker intro-tag" aria-label={text}>
      <span aria-hidden="true">{out || '\u00a0'}</span>
    </span>
  )
}

// Company name: each letter rises from behind a mask in turn while the
// spacing tightens; the trademark wipes in alongside.
function IntroName() {
  let n = 0
  return (
    <div className="intro">
      <m.span
        className="intro-mark"
        initial={{ clipPath: 'inset(0 100% 0 0)', x: -12 }}
        animate={{ clipPath: 'inset(0 0% 0 0)', x: 0, transition: { duration: 0.9, ease: OUT, delay: 0.95 } }}
      >
        <Mark />
      </m.span>
      <m.h2
        className="intro-name"
        aria-label="Albemarle Grey"
        initial={{ letterSpacing: '0.22em' }}
        animate={{ letterSpacing: '0.02em', transition: { duration: 1.8, ease: OUT, delay: 0.1 } }}
      >
        {NAME.map(([word, weight]) => (
          <span key={word} className={`intro-word ${weight}`} aria-hidden="true">
            {[...word].map((ch) => (
              <span key={n} className="intro-clip">
                <m.span
                  className="intro-ch"
                  initial={{ y: '110%', rotate: 6 }}
                  animate={{ y: '0%', rotate: 0, transition: { duration: 0.8, ease: OUT, delay: 0.15 + n++ * 0.045 } }}
                >
                  {ch}
                </m.span>
              </span>
            ))}
          </span>
        ))}
      </m.h2>
      <Decode text={TAGLINE} delay={1.05} />
    </div>
  )
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
  // Read once per mount; later route changes skip the intro.
  const [intro] = useState(() => firstLoad && !reducedMotion())
  useEffect(() => {
    firstLoad = false
  }, [])
  const hold = intro ? INTRO : 0

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
        animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: OUT, delay: 0.55 + hold } }}
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
            animate={{ scaleY: 0, originY: 0, transition: { duration: 0.7, ease: EASE, delay: 0.3 + hold + i * STAGGER } }}
            exit={{ scaleY: 1, originY: 1, transition: { duration: 0.6, ease: EASE, delay: i * STAGGER } }}
          />
        ))}

        <m.div
          className="curtain-tag"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, y: -16, transition: { duration: 0.35, ease: EASE, delay: 0.15 + hold } }}
          exit={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: OUT, delay: 0.35 } }}
        >
          <span className="curtain-c tl" />
          <span className="curtain-c br" />
          {intro ? (
            <IntroName />
          ) : (
            <>
              <span className="kicker">
                {page.n} / {page.t}
              </span>
              <span className="curtain-title">
                <span className="thin">{page.title[0]}</span>
                <b>{page.title[1]}</b>
              </span>
            </>
          )}
          <span className="curtain-bar">
            <m.i
              initial={{ scaleX: intro ? 0 : 1 }}
              animate={{ scaleX: 1, transition: { duration: INTRO - 0.3, ease: [0.65, 0, 0.35, 1], delay: 0.2 } }}
              exit={{ scaleX: [0, 1], transition: { duration: 0.75, ease: EASE, delay: 0.2 } }}
            />
          </span>
        </m.div>
      </div>
    </>
  )
}
