// Mutable, non-reactive store shared between DOM scroll logic (GSAP) and the
// WebGL render loop. Writing here never triggers React renders.
export const scroll = {
  hero: 0, // 0 → 1 as the hero scrolls out
  story: 0,
  craft: 0,
  signature: 0,
  finale: 0,
  velocity: 0,
}

export const pointer = { x: 0, y: 0 } // normalised -1..1

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    },
    { passive: true },
  )
}

export const damp = (current, target, lambda, dt) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt))

export const clamp01 = (v) => Math.min(1, Math.max(0, v))

// Remap v from [a,b] to [0,1], clamped
export const range = (v, a, b) => clamp01((v - a) / (b - a))

export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeOut = (t) => 1 - Math.pow(1 - t, 3)
