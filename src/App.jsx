import { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'
import * as THREE from 'three'
import { SmoothScroll } from './lib/smooth'
import { quality } from './lib/device'
import Loader from './components/ui/Loader'
import Cursor from './components/ui/Cursor'
import Header from './components/ui/Header'
import Footer from './components/ui/Footer'
import Hero from './sections/Hero'
import Story from './sections/Story'
import Collections from './sections/Collections'
import Craftsmanship from './sections/Craftsmanship'
import Signature from './sections/Signature'
import WhyUs from './sections/WhyUs'
import FinalCTA from './sections/FinalCTA'

export default function App() {
  const root = useRef(null)
  const [ready, setReady] = useState(false)

  return (
    <SmoothScroll>
      <div ref={root} className="relative">
        <Loader onDone={() => setReady(true)} />
        <Cursor />
        <Header ready={ready} />

        <main>
          <Hero ready={ready} />
          <Story />
          <Collections />
          <Craftsmanship />
          <Signature />
          <WhyUs />
          <FinalCTA />
        </main>
        <Footer />

        {/* One shared WebGL context; every section draws into it through a
            <View> that tracks its own DOM rectangle. */}
        <Canvas
          eventSource={root}
          eventPrefix="client"
          dpr={quality.dpr}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
          style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
        >
          <Suspense fallback={null}>
            <View.Port />
          </Suspense>
        </Canvas>

        <div className="vignette" aria-hidden />
        <div className="grain" aria-hidden />
      </div>
    </SmoothScroll>
  )
}
