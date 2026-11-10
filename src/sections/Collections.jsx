import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { View } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ProductScene, ViewerScene } from '../components/three/Scenes'
import { RevealText, SectionTag, FadeUp } from '../components/ui/Reveal'
import { GoldButton } from '../components/ui/Magnetic'
import { useLenis, useScrollTo } from '../lib/smooth'
import { isTouch, quality } from '../lib/device'

export const PRODUCTS = [
  {
    kind: 'necklace',
    no: '01',
    title: 'Royal Necklaces',
    desc: 'Cascades of graduated diamonds, set by hand to fall like light on skin.',
    specs: [['Metal', '18K yellow gold'], ['Stones', '31 round brilliants'], ['Total weight', '11.2 ct'], ['Atelier hours', '640']],
    tint: 'from-[#2a1d0c]',
  },
  {
    kind: 'ring',
    no: '02',
    title: 'Signature Rings',
    desc: 'A solitaire held aloft by six whisper-thin claws and a pavé crown.',
    specs: [['Metal', '18K yellow gold'], ['Centre stone', '3.05 ct, D / IF'], ['Pavé', '12 brilliants'], ['Atelier hours', '210']],
    tint: 'from-[#241a10]',
  },
  {
    kind: 'earrings',
    no: '03',
    title: 'Timeless Earrings',
    desc: 'Pear-cut drops framed in gold, designed to move with every word you say.',
    specs: [['Metal', '18K yellow gold'], ['Stones', '2 pear cuts, 2 studs'], ['Total weight', '6.4 ct'], ['Atelier hours', '320']],
    tint: 'from-[#1e1710]',
  },
  {
    kind: 'bracelet',
    no: '04',
    title: 'Luxury Bracelets',
    desc: 'An unbroken line of forty-four diamonds — a tennis bracelet re-imagined.',
    specs: [['Metal', '18K yellow & rose gold'], ['Stones', '44 brilliants'], ['Total weight', '8.8 ct'], ['Atelier hours', '380']],
    tint: 'from-[#2a1a12]',
  },
]

function ProductCard({ product, index, onOpen }) {
  const hovered = useRef(false)
  const card = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 18 })
  const glowX = useTransform(mx, [-0.5, 0.5], ['20%', '80%'])
  const glowY = useTransform(my, [-0.5, 0.5], ['20%', '80%'])
  const glow = useTransform([glowX, glowY], ([x, y]) => `radial-gradient(600px circle at ${x} ${y}, rgba(233,204,132,0.16), transparent 45%)`)
  const touch = isTouch()

  const onMove = (e) => {
    if (touch) return
    const r = card.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 140, rotateX: 18, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.4, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 1200 }}
      className={index % 2 ? 'lg:mt-24' : ''}
    >
      <motion.div
        ref={card}
        onPointerMove={onMove}
        onPointerEnter={() => (hovered.current = true)}
        onPointerLeave={() => {
          hovered.current = false
          mx.set(0)
          my.set(0)
        }}
        onClick={() => onOpen(product)}
        data-cursor="View"
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
        className="gold-frame group relative cursor-pointer overflow-hidden rounded-[28px] bg-ink-2"
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${product.tint} via-ink-2 to-ink transition-opacity duration-700`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(233,204,132,0.18),transparent_60%)] opacity-60 transition-all duration-1000 group-hover:scale-125 group-hover:opacity-100" />
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: glow }} />
        {/* light sweep on hover */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-full" />

        <div className="relative aspect-[4/5]">
          <View className="absolute inset-0" index={3 + index}>
            <ProductScene kind={product.kind} hovered={hovered} />
          </View>
          <span className="absolute left-6 top-6 font-serif text-sm italic text-gold-300">N° {product.no}</span>
          <span className="absolute right-6 top-6 font-sans text-[0.55rem] uppercase tracking-[0.35em] text-mist">Explore in 3D</span>
        </div>

        <div className="relative z-10 border-t border-gold-300/10 p-6 md:p-7">
          <h3 className="font-serif text-3xl font-light text-pearl transition-colors duration-500 group-hover:text-gold-100">{product.title}</h3>
          <p className="mt-3 min-h-[3.2em] text-sm leading-relaxed text-pearl/60">{product.desc}</p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpen(product)
            }}
            className="mt-6 inline-flex items-center gap-3 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-gold-200"
          >
            <span className="nav-link">Explore</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-300/40 transition-all duration-500 group-hover:rotate-[-45deg] group-hover:bg-gold-200 group-hover:text-ink">
              →
            </span>
          </button>
        </div>
      </motion.div>
    </motion.article>
  )
}

function ProductModal({ product, onClose }) {
  const lenis = useLenis()
  const scrollTo = useScrollTo()

  useEffect(() => {
    if (!product) return
    lenis?.stop()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [product, lenis, onClose])

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          role="dialog"
          aria-modal="true"
          aria-label={product.title}
          data-lenis-prevent
        >
          <div className="absolute inset-0 bg-ink/85 backdrop-blur-xl" onClick={onClose} />
          <motion.div
            className="gold-frame relative grid h-full max-h-[860px] w-full max-w-[1200px] overflow-y-auto rounded-[28px] bg-ink-2 md:grid-cols-[1.25fr_1fr] md:overflow-hidden"
            initial={{ y: 60, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative min-h-[46vh] bg-[radial-gradient(ellipse_at_50%_45%,rgba(233,204,132,0.16),transparent_65%)] md:min-h-0" data-cursor="Drag">
              <Canvas
                dpr={quality.dpr}
                gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
                style={{ position: 'absolute', inset: 0, touchAction: 'none' }}
              >
                <Suspense fallback={null}>
                  <ViewerScene kind={product.kind} />
                </Suspense>
              </Canvas>
              <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 font-sans text-[0.55rem] uppercase tracking-[0.4em] text-mist">
                Drag to rotate · Scroll to zoom
              </p>
            </div>
            <div className="relative flex flex-col justify-center p-8 md:p-12">
              <p className="eyebrow">Collection N° {product.no}</p>
              <h3 className="mt-4 font-serif text-5xl font-light text-pearl">{product.title}</h3>
              <p className="mt-5 leading-relaxed text-pearl/65">{product.desc}</p>
              <dl className="mt-8 divide-y divide-gold-300/10 border-y border-gold-300/10">
                {product.specs.map(([k, v]) => (
                  <div key={k} className="flex justify-between py-3 text-sm">
                    <dt className="text-mist">{k}</dt>
                    <dd className="text-gold-100">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10">
                <GoldButton
                  onClick={() => {
                    onClose()
                    setTimeout(() => scrollTo('#contact'), 350)
                  }}
                >
                  Book a Private Viewing
                </GoldButton>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gold-300/30 bg-ink/60 text-gold-100 backdrop-blur transition-colors hover:bg-gold-200 hover:text-ink"
              aria-label="Close"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Collections() {
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  return (
    <section id="collections" className="relative overflow-hidden py-28 md:py-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />
      <div className="pointer-events-none absolute right-[-10%] top-1/3 h-[60vmin] w-[60vmin] rounded-full bg-gold-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionTag index="02" label="Collections" />
            <RevealText
              text="Elegance in Every Detail."
              className="relative z-10 mt-8 max-w-3xl font-serif text-[clamp(2.6rem,6vw,5.8rem)] font-light leading-[0.98] text-pearl"
            />
          </div>
          <FadeUp delay={0.3} className="relative z-10 max-w-sm">
            <p className="text-sm leading-relaxed text-pearl/60">
              Four houses of design, one devotion to light. Hover to bring each piece to life — select one to hold it in your hands.
            </p>
          </FadeUp>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.kind} product={p} index={i} onOpen={setOpen} />
          ))}
        </div>
      </div>

      {/* marquee bridge into craftsmanship */}
      <div className="relative mt-28 overflow-hidden border-y border-gold-300/10 py-6 md:mt-40">
        <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-12 whitespace-nowrap font-serif text-4xl font-light italic text-pearl/30 md:text-6xl">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-12" aria-hidden={k === 1}>
              {['Royal Necklaces', 'Signature Rings', 'Timeless Earrings', 'Luxury Bracelets', 'Haute Joaillerie', 'Bespoke Commissions'].map((t) => (
                <span key={t} className="flex items-center gap-12">
                  {t} <span className="text-gold text-2xl not-italic">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee{to{transform:translateX(-50%)}} @media (prefers-reduced-motion: reduce){[class*="animate-[marquee"]{animation:none!important}}`}</style>

      <ProductModal product={open} onClose={close} />
    </section>
  )
}
