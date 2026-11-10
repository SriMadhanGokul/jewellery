import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLenis, useScrollTo } from '../../lib/smooth'
import { GoldButton } from './Magnetic'

export const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Collections', href: '#collections' },
  { label: 'Our Story', href: '#story' },
  { label: 'Craftsmanship', href: '#craftsmanship' },
  { label: 'Contact', href: '#contact' },
]

const ease = [0.16, 1, 0.3, 1]

export function Logo({ play = true, className = '' }) {
  return (
    <span className={`relative inline-block overflow-hidden ${className}`}>
      <motion.span
        className="text-gold text-gold-shimmer block font-serif text-2xl tracking-[0.42em]"
        initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
        animate={play ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 } : {}}
        transition={{ duration: 1.6, ease }}
      >
        AURELIA
      </motion.span>
      {/* golden light sweep */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-10 -skew-x-12 bg-gradient-to-r from-transparent via-[#fff6d8] to-transparent mix-blend-overlay blur-[2px]"
        initial={{ left: '-20%', opacity: 0 }}
        animate={play ? { left: '120%', opacity: [0, 1, 1, 0] } : {}}
        transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.3 }}
      />
    </span>
  )
}

export default function Header({ ready }) {
  const lenis = useLenis()
  const scrollTo = useScrollTo()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let last = 0
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > 500 && y > last + 2)
      if (y < last - 2) setHidden(false)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!lenis) return
    if (open) lenis.stop()
    else lenis.start()
  }, [open, lenis])

  const go = (e, href) => {
    e.preventDefault()
    // resume Lenis *before* scrolling: start() resets any in-flight animation
    lenis?.start()
    setOpen(false)
    scrollTo(href)
  }

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !open ? '-110%' : '0%' }}
        transition={{ duration: 0.8, ease }}
      >
        <div
          className={`mx-auto flex items-center justify-between px-5 transition-all duration-700 md:px-10 ${
            scrolled ? 'mx-3 mt-3 max-w-[1320px] rounded-full border border-gold-300/15 bg-ink/55 py-3 backdrop-blur-xl md:mx-6 xl:mx-auto' : 'py-6 md:py-8'
          }`}
        >
          <a href="#home" onClick={(e) => go(e, '#home')} aria-label="AURELIA home" className="relative z-10">
            <Logo play={ready} />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {NAV.map((n, i) => (
                <motion.li
                  key={n.href}
                  initial={{ opacity: 0, y: -12 }}
                  animate={ready ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.09, duration: 1, ease }}
                >
                  <a
                    href={n.href}
                    onClick={(e) => go(e, n.href)}
                    className="nav-link font-sans text-[0.7rem] uppercase tracking-[0.28em] text-pearl/75 transition-colors hover:text-gold-100"
                  >
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>

          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 1.1, duration: 1 }}
          >
            <GoldButton variant="outline" href="#collections" onClick={(e) => go(e, '#collections')} className="!px-6 !py-3">
              Explore Collection
            </GoldButton>
          </motion.div>

          <button
            className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gold-300/30 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className={`absolute h-px w-5 bg-gold-100 transition-transform duration-500 ${open ? 'rotate-45' : '-translate-y-1'}`} />
            <span className={`absolute h-px w-5 bg-gold-100 transition-transform duration-500 ${open ? '-rotate-45' : 'translate-y-1'}`} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink/95 px-8 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: 'circle(0% at 92% 5%)' }}
            animate={{ clipPath: 'circle(150% at 92% 5%)' }}
            exit={{ clipPath: 'circle(0% at 92% 5%)' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="space-y-5">
              {NAV.map((n, i) => (
                <motion.li
                  key={n.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.9, ease }}
                >
                  <a href={n.href} onClick={(e) => go(e, n.href)} className="flex items-baseline gap-4 font-serif text-5xl text-pearl">
                    <span className="font-sans text-xs text-gold-300">0{i + 1}</span>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-12">
              <GoldButton href="#collections" onClick={(e) => go(e, '#collections')}>
                Explore Collection
              </GoldButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
