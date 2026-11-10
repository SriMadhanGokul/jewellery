import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scroll } from './store'
import { prefersReducedMotion } from './device'

gsap.registerPlugin(ScrollTrigger)

const SmoothCtx = createContext(null)

export function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    const instance = new Lenis({
      duration: reduced ? 0 : 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduced,
      touchMultiplier: 1.4,
    })
    ref.current = instance
    setLenis(instance)
    if (import.meta.env.DEV) window.__lenis = instance

    instance.on('scroll', (e) => {
      scroll.velocity = e.velocity
      ScrollTrigger.update()
    })
    const tick = (time) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
    }
  }, [])

  return <SmoothCtx.Provider value={lenis}>{children}</SmoothCtx.Provider>
}

export const useLenis = () => useContext(SmoothCtx)

// Scroll to a section id with a cinematic glide
export function useScrollTo() {
  const lenis = useLenis()
  return (target, opts = {}) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (!el) return
    if (lenis) lenis.scrollTo(el, { duration: 2, offset: 0, force: true, ...opts })
    else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}
