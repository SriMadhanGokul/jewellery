import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scroll } from './store'

// Writes the scroll progress (0..1) of a tall "sticky" section into the shared
// store so the WebGL scene can read it every frame without React renders.
export function useSectionProgress(ref, key, { start = 'top top', end = 'bottom bottom', onUpdate } = {}) {
  useEffect(() => {
    if (!ref.current) return
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start,
      end,
      onUpdate: (self) => {
        scroll[key] = self.progress
        onUpdate?.(self.progress)
      },
    })
    scroll[key] = st.progress
    return () => st.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, key, start, end])
}
