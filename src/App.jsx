import { useEffect, useRef } from 'react'
import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, LazyMotion, MotionConfig, domMax } from 'motion/react'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import { useGlassLight } from './components/ui.jsx'
// Swap Columns for Ribbons to use the diagonal ribbon background instead.
import Columns from './components/Columns.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import Careers from './pages/Careers.jsx'
import Contact from './pages/Contact.jsx'
import Privacy from './pages/Privacy.jsx'
import PageTransition from './components/PageTransition.jsx'
import { initSmoothScroll, scrollToTarget } from './smooth.js'

// Same-page #hash links scroll smoothly; page changes are handled by the transition.
function HashScroll() {
  const { pathname, hash } = useLocation()
  const lastPath = useRef(pathname)
  useEffect(() => {
    const samePage = lastPath.current === pathname
    lastPath.current = pathname
    const el = hash && document.getElementById(hash.slice(1))
    if (samePage && el) scrollToTarget(el)
  }, [pathname, hash])
  return null
}

export default function App() {
  useGlassLight()
  useEffect(() => initSmoothScroll(), [])
  const location = useLocation()

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        <HashScroll />
        <Columns />
        <Nav />
        <main>
          <AnimatePresence mode="wait" onExitComplete={() => scrollToTarget(0, { immediate: true })}>
            <PageTransition key={location.pathname}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/about" element={<Navigate to="/careers" replace />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </PageTransition>
          </AnimatePresence>
        </main>
        <Footer />
      </MotionConfig>
    </LazyMotion>
  )
}
