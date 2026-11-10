import { useRef } from 'react'
import { View } from '@react-three/drei'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SignatureScene } from '../components/three/Scenes'
import { SectionTag } from '../components/ui/Reveal'
import { useSectionProgress } from '../lib/useProgress'

const MOMENTS = ['A promise.', 'A celebration.', 'A memory.']

export default function Signature() {
  const ref = useRef(null)
  useSectionProgress(ref, 'signature')

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom bottom', scrub: 1 },
      })
      tl.fromTo('.sig-line', { yPercent: 110 }, { yPercent: 0, stagger: 0.06, duration: 0.18 }, 0.02)
        .fromTo('.sig-moment', { opacity: 0, y: 30, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.1, duration: 0.12 }, 0.22)
        .fromTo('.sig-desc', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15 }, 0.55)
        .fromTo('.sig-halo', { scale: 0.4, opacity: 0 }, { scale: 1.3, opacity: 1, duration: 0.6 }, 0.2)
        .to('.sig-copy', { opacity: 0, y: -60, duration: 0.12, ease: 'power1.in' }, 0.88)
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="relative h-[320vh]" aria-label="Signature experience">
      <div className="sticky top-0 z-[1] h-[100svh] overflow-hidden">
        <div className="sig-halo pointer-events-none absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,204,132,0.22),transparent_62%)]" />
        <View className="absolute inset-0" index={9}>
          <SignatureScene />
        </View>

        <div className="sig-copy relative z-10 mx-auto flex h-full max-w-[1320px] flex-col justify-between px-6 py-24 md:px-10 md:py-28">
          <div className="flex flex-col items-center text-center">
            <SectionTag index="04" label="Signature Experience" />
            <h2 className="mt-8 font-serif text-[clamp(2.5rem,6.2vw,6.2rem)] font-light leading-[0.98] text-pearl">
              <span className="block overflow-hidden pb-[0.1em]">
                <span className="sig-line block">Some Moments</span>
              </span>
              <span className="block overflow-hidden pb-[0.1em]">
                <span className="sig-line text-gold text-gold-shimmer block italic">Deserve Forever.</span>
              </span>
            </h2>
          </div>

          <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-end md:justify-between md:text-left">
            <div className="hidden gap-6 font-serif text-xl italic text-gold-100 md:flex md:flex-col md:gap-2 md:text-3xl">
              {MOMENTS.map((m) => (
                <span key={m} className="sig-moment">
                  {m}
                </span>
              ))}
            </div>
            <p className="sig-desc max-w-sm text-sm leading-relaxed text-pearl/65 md:text-right">
              A promise. A celebration. A memory. Whatever the occasion, let our creations become a part of the moments you never want
              to forget.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
