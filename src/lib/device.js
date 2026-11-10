import { useEffect, useState } from 'react'

const mq = (q) => (typeof window !== 'undefined' ? window.matchMedia(q) : null)

export const isTouch = () => !!mq('(pointer: coarse)')?.matches
export const isMobileWidth = () => (typeof window !== 'undefined' ? window.innerWidth < 768 : false)
export const prefersReducedMotion = () => !!mq('(prefers-reduced-motion: reduce)')?.matches

export function useMedia(query) {
  const [match, setMatch] = useState(() => !!mq(query)?.matches)
  useEffect(() => {
    const m = mq(query)
    if (!m) return
    const on = () => setMatch(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return match
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
export const useIsMobile = () => useMedia('(max-width: 767px)')

// Rendering quality tier for the 3D scenes
export const quality = (() => {
  if (typeof window === 'undefined') return { tier: 'high', particles: 1, dpr: [1, 2] }
  const mobile = isMobileWidth() || isTouch()
  const lowCores = (navigator.hardwareConcurrency || 8) <= 4
  if (mobile || lowCores) return { tier: 'low', particles: 0.4, dpr: [1, 1.5] }
  return { tier: 'high', particles: 1, dpr: [1, 1.75] }
})()
