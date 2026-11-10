import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

// Masked word-by-word text reveal. `play` forces the animation (e.g. after the
// loader); otherwise it triggers when scrolled into view.
export function RevealText({ text, as: Tag = 'h2', className = '', wordClassName = '', delay = 0, stagger = 0.06, play, once = true }) {
  const words = text.split(' ')
  const MotionTag = motion[Tag] || motion.h2
  const control =
    play === undefined ? { whileInView: 'show', viewport: { once, amount: 0.4 } } : { animate: play ? 'show' : 'hide' }
  return (
    <MotionTag className={className} initial="hide" {...control} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.14em] align-bottom" aria-hidden>
          <motion.span
            className={`inline-block will-change-transform ${wordClassName}`}
            variants={{
              hide: { y: '115%', rotate: 4 },
              show: { y: '0%', rotate: 0, transition: { duration: 1.2, ease, delay: delay + i * stagger } },
            }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}

export function FadeUp({ children, delay = 0, className = '', y = 30, play }) {
  const control =
    play === undefined ? { whileInView: 'show', viewport: { once: true, amount: 0.3 } } : { animate: play ? 'show' : 'hide' }
  return (
    <motion.div
      className={className}
      initial="hide"
      {...control}
      variants={{
        hide: { opacity: 0, y, filter: 'blur(8px)' },
        show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.3, ease, delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function SectionTag({ index, label, className = '' }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="font-serif text-sm italic text-gold-300">{index}</span>
      <span className="h-px w-10 bg-gold-300/50" />
      <span className="eyebrow">{label}</span>
    </div>
  )
}
