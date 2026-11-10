import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollTo } from '../../lib/smooth'

const FAQS = [
  ['Are AURELIA diamonds ethically sourced?', 'Every stone is conflict-free, traceable to its origin and accompanied by an independent grading certificate.'],
  ['Do you offer bespoke commissions?', 'Yes. Our atelier creates one-of-one pieces through private consultations, in person or virtually.'],
  ['What is your lifetime care promise?', 'Complimentary cleaning, inspection and re-polishing for the life of every piece.'],
  ['How is my order delivered?', 'Fully insured, discreet white-glove delivery to over 60 countries.'],
]

const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'Facebook', href: 'https://www.facebook.com/' },
  { label: 'Pinterest', href: 'https://www.pinterest.com/' },
]

export default function Footer() {
  const scrollTo = useScrollTo()
  const [faqOpen, setFaqOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const go = (e, id) => {
    e.preventDefault()
    scrollTo(id)
  }

  return (
    <footer id="contact" className="relative overflow-hidden border-t border-gold-300/10 bg-ink pb-10 pt-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-[120px]" />
      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-gold font-serif text-5xl tracking-[0.3em] md:text-6xl">AURELIA</p>
            <p className="mt-5 font-serif text-2xl italic text-pearl/80">Elegance. Artistry. Eternity.</p>
            <form
              className="mt-10 max-w-md"
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <label htmlFor="email" className="eyebrow block text-[0.6rem]">
                Private appointments &amp; previews
              </label>
              <div className="mt-4 flex items-center border-b border-gold-300/30 focus-within:border-gold-200">
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Your email address"
                  className="w-full bg-transparent py-3 font-sans text-sm text-pearl placeholder:text-mist/60 focus:outline-none"
                />
                <button type="submit" className="nav-link shrink-0 font-sans text-[0.65rem] uppercase tracking-[0.3em] text-gold-100">
                  {sent ? 'Thank you' : 'Subscribe'}
                </button>
              </div>
              <AnimatePresence>
                {sent && (
                  <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-xs text-gold-200/80">
                    You are on the list. Our concierge will be in touch.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="eyebrow mb-6 text-[0.6rem]">Maison</p>
              <ul className="space-y-4 text-sm text-pearl/70">
                {[
                  ['Home', '#home'],
                  ['Collections', '#collections'],
                  ['Our Story', '#story'],
                  ['Contact', '#contact'],
                ].map(([l, h]) => (
                  <li key={l}>
                    <a href={h} onClick={(e) => go(e, h)} className="nav-link hover:text-gold-100">
                      {l}
                    </a>
                  </li>
                ))}
                <li>
                  <button onClick={() => setFaqOpen((o) => !o)} className="nav-link hover:text-gold-100" aria-expanded={faqOpen}>
                    FAQs
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-6 text-[0.6rem]">Follow</p>
              <ul className="space-y-4 text-sm text-pearl/70">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer noopener" className="nav-link hover:text-gold-100">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow mb-6 text-[0.6rem]">Atelier</p>
              <address className="space-y-2 text-sm not-italic leading-relaxed text-pearl/70">
                <p>12 Place Vendôme</p>
                <p>75001 Paris</p>
                <a href="mailto:concierge@aurelia.example" className="nav-link mt-3 inline-block text-gold-100">
                  concierge@aurelia.example
                </a>
              </address>
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {faqOpen && (
            <motion.div
              id="faqs"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-gold-300/10 md:grid-cols-2">
                {FAQS.map(([q, a]) => (
                  <div key={q} className="bg-ink-2 p-8">
                    <p className="font-serif text-xl text-gold-100">{q}</p>
                    <p className="mt-3 text-sm leading-relaxed text-pearl/65">{a}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hairline mt-20" />
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-[0.68rem] uppercase tracking-[0.25em] text-mist md:flex-row">
          <p>© 2026 AURELIA. All Rights Reserved.</p>
          <a href="#home" onClick={(e) => go(e, '#home')} className="nav-link hover:text-gold-100">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
