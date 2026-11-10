import { useRef } from 'react'
import { View } from '@react-three/drei'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { FinaleScene } from '../components/three/Scenes'
import { GoldButton } from '../components/ui/Magnetic'
import { useSectionProgress } from '../lib/useProgress'
import { useScrollTo } from '../lib/smooth'

export default function FinalCTA() {
  const ref = useRef(null)
  const scrollTo = useScrollTo()
  useSectionProgress(ref, 'finale', { start: 'top bottom', end: 'bottom bottom' })

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom bottom', scrub: 1 },
      })
      tl.fromTo('.fin-line', { yPercent: 110 }, { yPercent: 0, stagger: 0.05, duration: 0.2, ease: 'power2.out' }, 0)
        .fromTo('.fin-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.12 }, 0.18)
        .fromTo('.fin-btn', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.12 }, 0.24)
        .to('.fin-copy', { opacity: 0, y: -80, scale: 0.96, duration: 0.15, ease: 'power1.in' }, 0.55)
        .fromTo('.fin-letter', { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.03, duration: 0.2, ease: 'power3.out' }, 0.62)
        .fromTo('.fin-logo', { letterSpacing: '0.9em' }, { letterSpacing: '0.3em', duration: 0.35, ease: 'power2.out' }, 0.62)
        .fromTo('.fin-tag', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.85)
        .fromTo('.fin-fade', { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.75)
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="relative h-[300vh]" aria-labelledby="final-title">
      <div className="sticky top-0 z-[1] h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,154,62,0.16),transparent_60%)]" />
        <View className="absolute inset-0" index={10}>
          <FinaleScene />
        </View>

        <div className="fin-copy relative z-10 flex h-full flex-col items-center justify-end px-6 pb-[11vh] text-center [text-shadow:0_2px_30px_rgba(0,0,0,0.85)]">
          <p className="eyebrow mb-8">The Finale</p>
          <h2 id="final-title" className="max-w-5xl font-serif text-[clamp(2.5rem,6.4vw,6.6rem)] font-light leading-[0.98] text-pearl">
            <span className="block overflow-hidden pb-[0.1em]">
              <span className="fin-line block">Your Story Deserves</span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <span className="fin-line text-gold text-gold-shimmer block italic">Something Extraordinary.</span>
            </span>
          </h2>
          <p className="fin-sub mt-8 max-w-md text-[0.95rem] leading-relaxed text-pearl/70">
            Discover a world where art, elegance, and craftsmanship become one.
          </p>
          <div className="fin-btn mt-10">
            <GoldButton onClick={() => scrollTo('#collections', { duration: 2.8 })}>Explore the Collection</GoldButton>
          </div>
        </div>

        {/* brand logo reveal */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
          <p className="fin-logo flex overflow-hidden pl-[0.3em] font-serif text-[clamp(3.5rem,13vw,13rem)] font-light leading-none" aria-label="AURELIA">
            {'AURELIA'.split('').map((l, i) => (
              <span key={i} className="fin-letter text-gold inline-block" aria-hidden>
                {l}
              </span>
            ))}
          </p>
          <p className="fin-tag mt-6 font-serif text-xl italic text-pearl/70 md:text-2xl">Elegance. Artistry. Eternity.</p>
        </div>

        {/* dissolve into the footer */}
        <div className="fin-fade pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      </div>
    </section>
  )
}
