import { useRef, useState } from 'react'
import { View } from '@react-three/drei'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { StoryScene } from '../components/three/Scenes'
import { RevealText, SectionTag } from '../components/ui/Reveal'
import { useSectionProgress } from '../lib/useProgress'

const COPY =
  'Every masterpiece begins with a vision. Inspired by timeless elegance and crafted with extraordinary attention to detail, we transform precious materials into unforgettable expressions of beauty.'

const CHAPTERS = [
  { n: 'I', title: 'The Vision', text: 'A single line on paper — the first breath of a jewel.' },
  { n: 'II', title: 'The Fire', text: 'Gold is melted at 1,064°C and poured by hand.' },
  { n: 'III', title: 'The Stone', text: 'Each diamond is cut to 57 facets to capture light.' },
]

// Hand-drawn design sketch of a pendant, revealed stroke by stroke.
function Sketch() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden>
      <g className="sketch-guides" strokeWidth="0.6" opacity="0.35" strokeDasharray="3 5">
        <circle cx="200" cy="230" r="120" />
        <line x1="200" y1="20" x2="200" y2="380" />
        <line x1="40" y1="230" x2="360" y2="230" />
      </g>
      <g strokeWidth="1.7">
        <path className="sketch-line" pathLength="1" d="M70 40 C 90 140, 150 175, 200 182 C 250 175, 310 140, 330 40" />
        <path className="sketch-line" pathLength="1" d="M200 182 L 200 196" />
        <path className="sketch-line" pathLength="1" d="M200 196 L 252 236 L 200 318 L 148 236 Z" />
        <path className="sketch-line" pathLength="1" d="M148 236 L 252 236 M 172 236 L 200 318 L 228 236 M 166 216 L 172 236 M 234 216 L 228 236 M 166 216 L 234 216" />
        <path className="sketch-line" pathLength="1" d="M200 236 m -78 0 a 78 78 0 1 0 156 0 a 78 78 0 1 0 -156 0" />
      </g>
      <g className="sketch-notes" fontFamily="Cormorant Garamond, serif" fontSize="11" fill="currentColor" stroke="none" opacity="0">
        <text x="262" y="226">table 56%</text>
        <text x="262" y="296">pavilion 43°</text>
        <text x="40" y="330">AURELIA · N°01 — pendant study</text>
      </g>
    </svg>
  )
}

export default function Story() {
  const ref = useRef(null)
  const [chapter, setChapter] = useState(0)
  useSectionProgress(ref, 'story', {
    onUpdate: (p) => setChapter(p < 0.33 ? 0 : p < 0.66 ? 1 : 2),
  })

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom bottom', scrub: 1 },
      })
      tl.fromTo('.story-glow', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1.15, duration: 0.7 }, 0)
        .fromTo('.story-rays', { opacity: 0 }, { opacity: 0.8, duration: 0.4 }, 0.25)
        .fromTo('.story-word', { opacity: 0.12 }, { opacity: 1, stagger: 0.012, duration: 0.05 }, 0.04)
        .fromTo('.story-bigword', { xPercent: 10 }, { xPercent: -45, duration: 1 }, 0)
        .fromTo('.sketch-line', { strokeDashoffset: 1, strokeDasharray: '1 1' }, { strokeDashoffset: 0, stagger: 0.04, duration: 0.18 }, 0.02)
        .to('.sketch-notes', { opacity: 0.8, duration: 0.05 }, 0.2)
        .to('.story-sketch', { opacity: 0, scale: 1.15, filter: 'blur(6px)', duration: 0.1 }, 0.3)
        .fromTo('.story-progress', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
    },
    { scope: ref },
  )

  const words = COPY.split(' ')

  return (
    <section id="story" ref={ref} className="relative h-[420vh] bg-ink">
      <div className="sticky top-0 z-[1] h-[100svh] overflow-hidden">
        {/* darkness → golden light */}
        <div className="story-glow pointer-events-none absolute left-[62%] top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,180,90,0.26)_0%,rgba(168,124,44,0.12)_35%,transparent_68%)]" />
        <div className="story-rays pointer-events-none absolute inset-0 bg-[conic-gradient(from_200deg_at_62%_50%,transparent_0deg,rgba(255,214,140,0.08)_12deg,transparent_24deg,rgba(255,214,140,0.06)_40deg,transparent_60deg,rgba(255,214,140,0.07)_95deg,transparent_120deg)]" />
        <p className="story-bigword pointer-events-none absolute bottom-[4%] left-0 whitespace-nowrap font-serif text-[28vw] font-light leading-none text-transparent [-webkit-text-stroke:1px_rgba(220,181,98,0.12)]">
          Origin · Origine
        </p>

        {/* the sketch (chapter I) and the 3D forge (II–III) */}
        <div className="story-sketch pointer-events-none absolute right-[10%] top-[24%] aspect-square w-[min(80vw,560px)] -translate-y-1/2 md:top-1/2 text-gold-200 md:right-[10%]">
          <Sketch />
        </div>
        <View className="absolute inset-x-0 top-0 h-[48%] md:inset-y-0 md:left-[40%] md:h-auto" index={2}>
          <StoryScene />
        </View>

        <div className="relative z-10 mx-auto flex h-full max-w-[1320px] flex-col justify-end px-6 pb-36 pt-20 md:justify-center md:px-10 md:pb-40">
          <div className="max-w-xl">
            <SectionTag index="01" label="Our Story" />
            <RevealText
              text="Every Masterpiece Has a Beginning."
              className="mt-6 font-serif text-[clamp(2.4rem,4.6vw,4.6rem)] font-light leading-[0.98] text-pearl"
            />
            <p className="mt-6 font-serif text-[clamp(1.15rem,1.7vw,1.55rem)] leading-snug">
              {words.map((w, i) => (
                <span key={i} className="story-word">
                  {w}{' '}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* chapter tracker */}
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1320px] px-6 pb-8 md:px-10 md:pb-12">
          <div className="relative mb-6 h-px w-full bg-white/10">
            <div className="story-progress absolute inset-0 origin-left bg-gradient-to-r from-gold-500 via-gold-100 to-gold-300" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {CHAPTERS.map((c, i) => (
              <div key={c.n} className={`transition-all duration-700 ${chapter === i ? 'opacity-100' : 'opacity-35'}`}>
                <p className="font-serif text-sm italic text-gold-300">Chapter {c.n}</p>
                <p className="mt-1 font-serif text-lg text-pearl md:text-2xl">{c.title}</p>
                <p className="mt-2 hidden max-w-xs text-xs leading-relaxed text-pearl/60 md:block">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
