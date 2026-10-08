import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import { useGlassLight } from './components/ui.jsx'
// Swap Columns for Ribbons to use the diagonal ribbon background instead.
import Columns from './components/Columns.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'

// Scroll to the hash target when present; otherwise reset to the top when the page changes.
function ScrollManager() {
  const { pathname, hash } = useLocation()
  const lastPath = useRef(null)
  useEffect(() => {
    const pageChanged = lastPath.current !== pathname
    lastPath.current = pathname
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: pageChanged ? 'auto' : 'smooth', block: 'start' })
        return
      }
    }
    if (pageChanged) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  useGlassLight()
  return (
    <>
      <ScrollManager />
      <Columns />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
