import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { prefersReducedMotion } from '../../lib/device'

const LETTERS = 'AURELIA'.split('')

// Premium loading screen: counts to 100 while fonts and the WebGL context warm
// up, then parts like a curtain to reveal the hero.
const SKIP = typeof location !== 'undefined' && new URLSearchParams(location.search).has('skipintro')

export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(SKIP)

  useEffect(() => {
    if (SKIP) {
      onDone?.()
      return
    }
    document.body.classList.add('is-loading')
    const reduced = prefersReducedMotion() || new URLSearchParams(location.search).has('skipintro')
    const minTime = reduced ? 400 : 2600
    const start = performance.now()
    let fontsReady = false
    document.fonts?.ready.then(() => (fontsReady = true))
    let raf
    let timer
    const tick = (now) => {
      const t = Math.min(1, (now - start) / minTime)
      const eased = 1 - Math.pow(1 - t, 2.4)
      const cap = fontsReady ? 100 : 92
      setPct(Math.min(cap, Math.round(eased * 100)))
      if (t >= 1 && fontsReady) {
        timer = setTimeout(() => {
          setLeaving(true)
          onDone?.()
        }, reduced ? 0 : 350)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AnimatePresence onExitComplete={() => document.body.classList.remove('is-loading')}>
      {!leaving && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,154,62,0.14),transparent_60%)]" />
          <div className="flex overflow-hidden pl-[0.35em] font-serif text-5xl tracking-[0.35em] md:text-7xl">
            {LETTERS.map((l, i) => (
              <motion.span
                key={i}
                className="text-gold inline-block"
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {l}
              </motion.span>
            ))}
          </div>
          <motion.p
            className="eyebrow mt-6 text-[0.6rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.9, duration: 1 }}
          >
            Haute Joaillerie · Est. 1926
          </motion.p>
          <div className="absolute bottom-14 left-1/2 w-[min(70vw,360px)] -translate-x-1/2">
            <div className="mb-3 flex justify-between font-sans text-[0.65rem] tracking-[0.3em] text-mist">
              <span>LOADING</span>
              <span className="tabular-nums text-gold-200">{String(pct).padStart(3, '0')}</span>
            </div>
            <div className="h-px w-full bg-white/10">
              <div
                className="h-px origin-left bg-gradient-to-r from-gold-600 via-gold-100 to-gold-400"
                style={{ transform: `scaleX(${pct / 100})` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
