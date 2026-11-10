import { useRef } from 'react'
import { View } from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import { HeroScene } from '../components/three/Scenes'
import { RevealText, FadeUp } from '../components/ui/Reveal'
import { GoldButton } from '../components/ui/Magnetic'
import { useSectionProgress } from '../lib/useProgress'
import { useScrollTo } from '../lib/smooth'

export default function Hero({ ready }) {
  const ref = useRef(null)
  const scrollTo = useScrollTo()
  useSectionProgress(ref, 'hero', { start: 'top top', end: 'bottom top' })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-35%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.25])

  return (
    <section id="home" ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden">
      {/* backdrop light */}
      <motion.div style={{ scale: bgScale }} className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-[40%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/15 blur-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent" />
      </motion.div>

      {/* 3D */}
      <View className="absolute inset-0 md:left-[18%]" index={1}>
        <HeroScene />
      </View>

      {/* Copy */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-[1320px] flex-col justify-end px-6 pb-16 md:px-10 md:pb-24"
      >
        <FadeUp play={ready} delay={0.2}>
          <p className="eyebrow mb-6">Haute Joaillerie · Collection N°01</p>
        </FadeUp>
        <h1 className="max-w-4xl font-serif text-[clamp(3.1rem,8.6vw,8.4rem)] font-light leading-[0.92] tracking-[-0.01em] text-pearl">
          <RevealText as="span" text="Beyond Beauty." play={ready} delay={0.35} className="block" />
          <RevealText as="span" text="Beyond Time." play={ready} delay={0.6} className="block italic" wordClassName="text-gold text-gold-shimmer pr-[0.08em]" />
        </h1>
        <div className="mt-8 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <FadeUp play={ready} delay={1.0} className="max-w-md">
            <p className="text-[0.95rem] leading-relaxed text-pearl/70">
              Some things are more than beautiful. They carry emotions, memories, and stories that last forever.
            </p>
          </FadeUp>
          <FadeUp play={ready} delay={1.2} className="flex flex-wrap items-center gap-4">
            <GoldButton onClick={() => scrollTo('#collections')}>Discover Our Collection</GoldButton>
            <GoldButton
              variant="outline"
              onClick={() => scrollTo('#story', { duration: 2.6 })}
              icon={
                <span className="relative flex h-5 w-5 items-center justify-center rounded-full border border-current">
                  <svg width="7" height="8" viewBox="0 0 7 8" aria-hidden>
                    <path d="M0 0l7 4-7 4z" fill="currentColor" />
                  </svg>
                </span>
              }
            >
              Watch Our Story
            </GoldButton>
          </FadeUp>
        </div>
      </motion.div>

      {/* side details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 1.2 }}
        className="pointer-events-none absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-6 md:flex"
      >
        <span className="h-20 w-px bg-gradient-to-b from-transparent to-gold-300/60" />
        <span className="font-sans text-[0.6rem] uppercase tracking-[0.4em] text-mist [writing-mode:vertical-rl]">
          18K Gold · 42 Diamonds · 11.2 ct
        </span>
        <span className="h-20 w-px bg-gradient-to-t from-transparent to-gold-300/60" />
      </motion.div>

      <motion.button
        onClick={() => scrollTo('#story')}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        aria-label="Scroll to our story"
      >
        <span className="font-sans text-[0.55rem] uppercase tracking-[0.45em] text-mist">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_cubic-bezier(.76,0,.24,1)_infinite] bg-gold-200" />
        </span>
      </motion.button>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  )
}
