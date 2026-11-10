import { useRef, useState } from 'react'
import { View } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { CraftScene } from '../components/three/Scenes'
import { RevealText, SectionTag, FadeUp } from '../components/ui/Reveal'
import { useSectionProgress } from '../lib/useProgress'

const STAGES = [
  { n: '01', title: 'The Vision', text: 'Our designers sketch hundreds of studies until one line feels inevitable.', at: 0 },
  { n: '02', title: 'The Design', text: 'The chosen form is sculpted digitally, balanced to the hundredth of a millimetre.', at: 0.3 },
  { n: '03', title: 'The Craft', text: 'Master setters raise six claws and lay twelve pavé stones entirely by hand.', at: 0.57 },
  { n: '04', title: 'The Perfection', text: 'Polished for forty hours until gold and diamond speak as one.', at: 0.8 },
]

export default function Craftsmanship() {
  const ref = useRef(null)
  const bar = useRef(null)
  const [stage, setStage] = useState(0)

  useSectionProgress(ref, 'craft', {
    onUpdate: (p) => {
      let s = 0
      STAGES.forEach((st, i) => p >= st.at && (s = i))
      setStage(s)
      if (bar.current) bar.current.style.transform = `scaleY(${p})`
    },
  })

  return (
    <section id="craftsmanship" ref={ref} className="relative h-[460vh]">
      <div className="sticky top-0 z-[1] h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_68%_50%,rgba(201,154,62,0.12),transparent_55%)]" />

        {/* giant stage numeral */}
        <AnimatePresence mode="wait">
          <motion.span
            key={stage}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -80 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute right-[2%] top-1/2 -translate-y-1/2 font-serif text-[42vw] font-light leading-none text-transparent [-webkit-text-stroke:1px_rgba(220,181,98,0.1)] md:text-[30vw]"
            aria-hidden
          >
            {STAGES[stage].n}
          </motion.span>
        </AnimatePresence>

        <View className="absolute inset-x-0 top-0 h-[55%] md:inset-y-0 md:left-[38%] md:h-full" index={8}>
          <CraftScene />
        </View>

        <div className="relative z-10 mx-auto flex h-full max-w-[1320px] flex-col justify-end px-6 pb-10 md:justify-center md:px-10 md:pb-0">
          <div className="max-w-md">
            <SectionTag index="03" label="Craftsmanship" />
            <RevealText
              text="Not Made. Masterfully Crafted."
              className="mt-6 font-serif text-[clamp(2.3rem,4.8vw,4.6rem)] font-light leading-[0.98] text-pearl md:mt-8"
            />
            <FadeUp delay={0.2}>
              <p className="mt-5 text-sm leading-relaxed text-pearl/60 md:mt-6">
                Behind every beautiful creation lies patience, precision, and passion.
              </p>
            </FadeUp>

            <div className="relative mt-8 pl-8 md:mt-12">
              <div className="absolute bottom-1 left-0 top-1 w-px bg-white/10">
                <div ref={bar} className="h-full w-full origin-top scale-y-0 bg-gradient-to-b from-gold-100 to-gold-500" />
              </div>
              <ol className="space-y-3 md:space-y-6">
                {STAGES.map((s, i) => {
                  const on = i === stage
                  return (
                    <li key={s.n} className={`transition-all duration-700 ${on ? 'opacity-100' : i < stage ? 'opacity-45' : 'opacity-25'}`}>
                      <div className="flex items-baseline gap-4">
                        <span className={`font-sans text-[0.65rem] tracking-[0.2em] ${on ? 'text-gold-200' : 'text-mist'}`}>{s.n}</span>
                        <span className={`font-serif text-xl md:text-3xl ${on ? 'text-gold text-gold-shimmer' : 'text-pearl'}`}>{s.title}</span>
                      </div>
                      <div className={`grid transition-all duration-700 ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        <p className="overflow-hidden pl-9 text-xs leading-relaxed text-pearl/60 md:text-sm">{s.text}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
