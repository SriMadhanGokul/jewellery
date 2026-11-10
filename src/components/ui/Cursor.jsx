import { useEffect, useRef, useState } from 'react'
import { isTouch, prefersReducedMotion } from '../../lib/device'

// Gold dot + trailing ring. Grows over interactive elements; shows a label for
// elements carrying data-cursor="label".
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [label, setLabel] = useState('')
  const [active, setActive] = useState(false)
  const [enabled] = useState(() => !isTouch() && !prefersReducedMotion())

  useEffect(() => {
    if (!enabled) return
    document.body.classList.add('has-cursor')
    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const ringPos = { ...pos }
    let raf
    const move = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      const el = e.target.closest?.('a, button, [data-cursor]')
      setActive(!!el)
      setLabel(el?.getAttribute('data-cursor') || '')
    }
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16
      ringPos.y += (pos.y - ringPos.y) * 0.16
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null
  const big = !!label
  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[95]">
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-100 transition-all duration-300 ${active ? 'h-0 w-0' : 'h-1.5 w-1.5'}`}
        />
      </div>
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[95]">
        <div
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
            big
              ? 'h-24 w-24 border-transparent bg-gold-200/90 backdrop-blur-sm'
              : active
                ? 'h-14 w-14 border-gold-200/80 bg-gold-200/5'
                : 'h-9 w-9 border-gold-300/40'
          }`}
        >
          <span
            className={`font-sans text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-ink transition-opacity ${big ? 'opacity-100' : 'opacity-0'}`}
          >
            {label}
          </span>
        </div>
      </div>
    </>
  )
}
