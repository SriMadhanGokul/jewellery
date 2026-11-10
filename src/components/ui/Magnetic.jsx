import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { isTouch } from '../../lib/device'

// Wraps any element so it is gently pulled towards the pointer.
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 })
  const touch = isTouch()

  const onMove = (e) => {
    if (touch || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={reset} style={{ x: sx, y: sy }} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  )
}

const ARROW = (
  <svg width="14" height="14" viewBox="0 0 14 14" className="relative transition-transform duration-500 group-hover:translate-x-1" aria-hidden>
    <path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
  </svg>
)

export function GoldButton({ children, onClick, href, variant = 'solid', className = '', icon = ARROW, ...rest }) {
  const base =
    'group relative isolate inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.28em] transition-colors duration-500 md:px-8'
  const styles =
    variant === 'solid'
      ? 'btn-gold text-ink'
      : 'border border-gold-300/40 text-gold-100 hover:border-gold-200 hover:text-ink'
  const Tag = href ? 'a' : 'button'
  return (
    <Magnetic>
      <Tag href={href} onClick={onClick} className={`${base} ${styles} ${className}`} {...rest}>
        {variant !== 'solid' && (
          <span className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-gold-200 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
        )}
        <span className="relative">{children}</span>
        {icon}
      </Tag>
    </Magnetic>
  )
}
