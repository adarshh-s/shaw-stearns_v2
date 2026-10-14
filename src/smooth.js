import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Smooth scrolling: Lenis eases the native scroll and runs on GSAP's ticker so
// ScrollTrigger animations stay in step with it. Native scroll position is kept,
// so position: sticky sections and plain scroll listeners keep working.
let lenis = null

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initSmoothScroll() {
  if (lenis || reducedMotion()) return () => {}
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) })
  lenis.on('scroll', ScrollTrigger.update)
  const raf = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(raf)
    lenis.destroy()
    lenis = null
  }
}

// Scroll to a y position or an element, clearing the fixed nav.
export function scrollToTarget(target, { immediate = false } = {}) {
  const offset = typeof target === 'number' ? 0 : -(document.querySelector('.nav')?.offsetHeight || 0) - 16
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate, force: true })
    return
  }
  const y = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' })
}

export { gsap, ScrollTrigger }
