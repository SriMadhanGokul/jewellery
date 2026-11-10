import { motion } from 'framer-motion'
import { RevealText, SectionTag } from '../components/ui/Reveal'

const draw = {
  hide: { pathLength: 0, opacity: 0 },
  show: (i) => ({ pathLength: 1, opacity: 1, transition: { duration: 1.6, delay: 0.3 + i * 0.15, ease: [0.65, 0, 0.35, 1] } }),
}

const ICONS = [
  // Exceptional Quality — diamond
  ['M8 20 L20 8 H44 L56 20 L32 56 Z', 'M8 20 H56', 'M20 8 L26 20 L32 56 L38 20 L44 8', 'M26 20 L32 8 L38 20'],
  // Master Craftsmanship — loupe
  ['M27 10 a17 17 0 1 0 0.01 0', 'M39 39 L55 55', 'M20 27 L27 20 L34 27 L27 34 Z'],
  // Timeless Designs — hourglass
  ['M16 8 H48', 'M16 56 H48', 'M20 8 C20 24 32 26 32 32 C32 38 20 40 20 56', 'M44 8 C44 24 32 26 32 32 C32 38 44 40 44 56', 'M26 50 L32 44 L38 50'],
  // Personal Experience — signature/heart
  ['M32 54 C14 42 8 32 8 22 C8 14 14 9 21 9 C26 9 30 12 32 16 C34 12 38 9 43 9 C50 9 56 14 56 22 C56 32 50 42 32 54 Z', 'M22 26 C26 22 30 30 34 26 S 40 22 42 26'],
]

const FEATURES = [
  { title: 'Exceptional Quality', text: 'Only the top 1% of the world’s diamonds — D to F colour, flawless to VVS clarity — meet our standard.' },
  { title: 'Master Craftsmanship', text: 'Every piece passes through the hands of at least seven artisans with decades at the bench.' },
  { title: 'Timeless Designs', text: 'Forms conceived to be inherited — never following trends, always defining elegance.' },
  { title: 'Personal Experience', text: 'Private salons, bespoke commissions and a lifetime of care for every creation.' },
]

export default function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-ink py-28 md:py-44" aria-labelledby="why-title">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-transparent to-ink" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[50vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/8 blur-[120px]" />
      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="flex flex-col items-center text-center">
          <SectionTag index="05" label="Why AURELIA" />
          <RevealText
            text="Excellence Is Never an Accident."
            className="mt-8 max-w-4xl font-serif text-[clamp(2.5rem,5.6vw,5.4rem)] font-light leading-[0.98] text-pearl"
          />
        </div>

        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hide"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              variants={{
                hide: { opacity: 0, y: 60 },
                show: { opacity: 1, y: 0, transition: { duration: 1.2, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] } },
              }}
              whileHover={{ y: -10 }}
              className="gold-frame group relative overflow-hidden rounded-[24px] bg-ink-2/80 p-8 md:p-9"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gold-300/0 blur-3xl transition-all duration-700 group-hover:bg-gold-300/20" />
              <div className="flex items-center justify-between">
                <svg viewBox="0 0 64 64" className="h-12 w-12 text-gold-200" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" aria-hidden>
                  {ICONS[i].map((d, k) => (
                    <motion.path key={k} d={d} variants={draw} custom={i + k * 0.3} />
                  ))}
                </svg>
                <span className="font-serif text-sm italic text-gold-300/70">0{i + 1}</span>
              </div>
              <h3 className="mt-12 font-serif text-2xl text-pearl transition-colors duration-500 group-hover:text-gold-100">{f.title}</h3>
              <div className="my-5 h-px w-10 bg-gold-300/40 transition-all duration-700 group-hover:w-full" />
              <p className="text-sm leading-relaxed text-pearl/60">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
