import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Float, PerspectiveCamera, MeshDistortMaterial, OrbitControls, ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { StudioEnvironment, StageLights, goldMaterial } from './materials'
import { Necklace, Ring, Earrings, Bracelet, Diamond } from './Jewels'
import { GoldDust } from './GoldDust'
import { scroll, pointer, damp, range, easeInOut, easeOut } from '../../lib/store'
import { prefersReducedMotion, quality } from '../../lib/device'

const reduced = prefersReducedMotion()
const spin = (v) => (reduced ? 0 : v)

// ------------------------------------------------------------------
// HERO — floating diamond necklace, gold dust, mouse-driven camera
// ------------------------------------------------------------------
export function HeroScene() {
  const cam = useRef()
  const piece = useRef()
  const intro = useRef(0)

  useFrame((state, dt) => {
    intro.current = damp(intro.current, 1, 1.1, dt)
    const s = scroll.hero
    // portrait screens: pull back and lift the necklace above the headline
    const portrait = state.camera.aspect < 0.85
    const zBase = portrait ? 17 : 11.5
    if (cam.current) {
      const tx = pointer.x * 0.6
      const ty = pointer.y * 0.35 + s * 1.2
      cam.current.position.x = damp(cam.current.position.x, tx, 2.5, dt)
      cam.current.position.y = damp(cam.current.position.y, ty, 2.5, dt)
      cam.current.position.z = damp(cam.current.position.z, zBase - intro.current * 1.6 + s * 2.5, 2, dt)
      cam.current.lookAt(0, 0.1 + s * 0.4, 0)
    }
    if (piece.current) {
      piece.current.rotation.y += dt * spin(0.18)
      piece.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08 + pointer.y * 0.08
      piece.current.position.y = (portrait ? 2.6 : 0.15) + (1 - intro.current) * -1.5 + s * 1.4
    }
  })

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault position={[0, 0, 11.5]} fov={34} />
      <StudioEnvironment />
      <StageLights />
      <group ref={piece} scale={1.12}>
        <Float speed={spin(1.4)} rotationIntensity={0.15} floatIntensity={0.5}>
          <Necklace links={quality.tier === 'low' ? 110 : 160} />
        </Float>
      </group>
      <GoldDust count={1100} spread={[16, 12, 10]} size={85} />
    </>
  )
}

// ------------------------------------------------------------------
// STORY — molten gold that cools into a faceted stone
// ------------------------------------------------------------------
export function StoryScene() {
  const blob = useRef()
  const gem = useRef()
  const mat = useRef()
  const light = useRef()

  useFrame((state, dt) => {
    const p = scroll.story
    const melt = 1 - range(p, 0.35, 0.7) // molten → solid
    const gemIn = easeOut(range(p, 0.55, 0.85))
    const pour = easeOut(range(p, 0.18, 0.4)) // the gold arrives with chapter II
    if (blob.current) {
      blob.current.scale.setScalar(Math.max(0.0001, 1.0 * pour * (0.3 + 0.7 * melt) * (1 - gemIn)))
      blob.current.rotation.y += dt * spin(0.3)
    }
    if (mat.current) {
      mat.current.emissiveIntensity = 0.05 + melt * 0.35
      mat.current.roughness = 0.1 + melt * 0.1
      mat.current.distort = 0.2 + melt * 0.4
      mat.current.speed = reduced ? 0 : 1 + melt * 2.5
    }
    if (gem.current) {
      gem.current.scale.setScalar(Math.max(0.0001, gemIn * 0.95))
      gem.current.rotation.y += dt * spin(0.5)
      gem.current.rotation.x = 0.45
      gem.current.rotation.z = 0.12
    }
    if (light.current) light.current.intensity = 10 + range(p, 0.1, 0.6) * 90
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={35} />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#120d07']} />
        <Lightformer form="rect" intensity={1.6} color="#ffd59a" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer form="rect" intensity={3} color="#fff1d6" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[0.6, 12, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#ffc070" position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[0.6, 12, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ff9a3c" position={[0, -3, -6]} scale={[14, 4, 1]} />
      </Environment>
      <ambientLight intensity={0.2} />
      <pointLight ref={light} position={[0, 2, 3]} color="#ffb04a" intensity={20} />
      <Float speed={spin(1.6)} floatIntensity={0.6}>
        <mesh ref={blob}>
          <icosahedronGeometry args={[1, 24]} />
          <MeshDistortMaterial ref={mat} color="#f2bd5c" emissive="#ff8a1a" emissiveIntensity={0.3} metalness={1} roughness={0.15} envMapIntensity={1.4} distort={0.5} speed={2} />
        </mesh>
        <group ref={gem}>
          <Diamond />
        </group>
      </Float>
      <GoldDust count={600} spread={[10, 10, 6]} size={60} color="#ffbf66" rise={1.6} />
    </>
  )
}

// ------------------------------------------------------------------
// COLLECTION PREVIEW — small turntable used by product cards
// ------------------------------------------------------------------
const PIECES = {
  necklace: { C: Necklace, props: { scale: 0.82, position: [0, 0.25, 0] } },
  ring: { C: Ring, props: { scale: 0.85, position: [0, -0.55, 0], rotation: [0.35, 0, 0] } },
  earrings: { C: Earrings, props: { scale: 0.62, position: [0, -0.55, 0] } },
  bracelet: { C: Bracelet, props: { scale: 0.92, rotation: [1.05, 0, 0.2] } },
}

export function ProductScene({ kind, hovered }) {
  const g = useRef()
  const speed = useRef(0.3)
  const { C, props } = PIECES[kind]
  useFrame((state, dt) => {
    speed.current = damp(speed.current, hovered.current ? 1.6 : 0.3, 3, dt)
    if (g.current) {
      g.current.rotation.y += dt * spin(speed.current)
      const tilt = hovered.current ? pointer.y * 0.25 : 0
      g.current.rotation.x = damp(g.current.rotation.x, tilt, 4, dt)
      const sc = hovered.current ? 1.08 : 1
      g.current.scale.setScalar(damp(g.current.scale.x, sc, 4, dt))
    }
  })
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5.4]} fov={34} />
      <StudioEnvironment />
      <StageLights strength={1.6} />
      <group ref={g}>
        <C {...props} />
      </group>
      <GoldDust count={120} spread={[6, 6, 3]} size={45} opacity={0.6} />
    </>
  )
}

// Interactive viewer used inside the product modal
export function ViewerScene({ kind }) {
  const { C, props } = PIECES[kind]
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.3, 7]} fov={34} />
      <StudioEnvironment intensity={1.1} />
      <StageLights strength={1.8} />
      <Float speed={spin(1.2)} floatIntensity={0.3} rotationIntensity={0.1}>
        <C {...props} />
      </Float>
      <ContactShadows position={[0, -1.6, 0]} opacity={0.5} scale={8} blur={2.6} far={3} color="#000" />
      <OrbitControls enablePan={false} minDistance={3.5} maxDistance={10} autoRotate={!reduced} autoRotateSpeed={1.2} enableDamping />
      <GoldDust count={160} spread={[8, 6, 5]} size={50} opacity={0.5} />
    </>
  )
}

// ------------------------------------------------------------------
// CRAFTSMANSHIP — the ring builds itself as the user scrolls
// ------------------------------------------------------------------
export function CraftScene() {
  const g = useRef()
  const key = useRef()
  const cam = useRef()
  const p = useRef(0)

  useFrame((state, dt) => {
    p.current = damp(p.current, scroll.craft, 6, dt)
    const v = p.current
    const finale = easeInOut(range(v, 0.8, 1))
    if (g.current) {
      // gentle presentation turn, accelerating into the final reveal
      g.current.rotation.y += dt * spin(0.25 + finale * 0.6)
      g.current.rotation.x = 0.35 - finale * 0.15
    }
    if (key.current) key.current.intensity = 25 + finale * 120
    if (cam.current) {
      cam.current.position.z = 8.2 - finale * 1.2
      cam.current.position.y = 0.6 + pointer.y * 0.2
      cam.current.position.x = pointer.x * 0.3
      cam.current.lookAt(0, 0.1, 0)
    }
  })

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault position={[0, 0.6, 7]} fov={32} />
      <StudioEnvironment />
      <ambientLight intensity={0.12} />
      <spotLight ref={key} position={[3, 6, 4]} angle={0.5} penumbra={1} color="#ffe0a8" intensity={25} />
      <pointLight position={[-4, -1, 2]} intensity={14} color="#a9c1ff" />
      <group ref={g} position={[0, -0.2, 0]}>
        <Ring getProgress={() => p.current} showGhost />
      </group>
      <GoldDust count={380} spread={[10, 8, 6]} size={55} opacity={0.75} />
    </>
  )
}

// ------------------------------------------------------------------
// SIGNATURE — a lone diamond that becomes a ring
// ------------------------------------------------------------------
export function SignatureScene() {
  const gem = useRef()
  const group = useRef()
  const halo = useRef()
  const p = useRef(0)
  const morphRef = useRef(0)

  // ring stages: band forms around the stone, then prongs & pavé lock it in
  const ringProgress = () => {
    const v = p.current
    const a = range(v, 0.28, 0.6)
    const b = range(v, 0.6, 0.88)
    return a < 1 ? a * 0.32 : 0.58 + b * 0.42
  }

  useFrame((state, dt) => {
    p.current = damp(p.current, scroll.signature, 5, dt)
    const v = p.current
    state.camera.position.z = state.camera.aspect < 0.85 ? 11 : 6.5
    const morph = easeInOut(range(v, 0.2, 0.62))
    morphRef.current = morph
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.x = 0.3 * morph
      group.current.rotation.y += dt * spin(0.35 * morph)
    }
    if (gem.current) {
      // the lone stone (group-local coords) settles into the ring's head
      gem.current.rotation.y += dt * spin(0.6)
      gem.current.position.y = THREE.MathUtils.lerp(1.05 + Math.sin(t) * 0.08, 1.5, morph)
      gem.current.scale.setScalar(THREE.MathUtils.lerp(0.95, 0.42, morph))
    }
    if (halo.current) {
      halo.current.scale.setScalar(1 + morph * 1.8)
      halo.current.material.opacity = 0.35 * Math.sin(morph * Math.PI)
    }
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.3, 6.5]} fov={34} />
      <StudioEnvironment />
      <StageLights strength={2} />
      <group ref={group} scale={0.72} position={[0, -0.7, 0]}>
        <group ref={gem}>
          <Diamond />
        </group>
        <Ring getProgress={ringProgress} hideHead />
      </group>
      <mesh ref={halo} position={[0, 0.3, -1]}>
        <ringGeometry args={[1.2, 1.26, 128]} />
        <meshBasicMaterial color="#e9cc84" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <GoldDust count={500} spread={[12, 10, 8]} size={60} />
    </>
  )
}

// ------------------------------------------------------------------
// FINALE — diamond, rising gold, camera zoom-out
// ------------------------------------------------------------------
export function FinaleScene() {
  const cam = useRef()
  const gem = useRef()
  const ringOrbit = useRef()
  const p = useRef(0)

  useFrame((state, dt) => {
    p.current = damp(p.current, scroll.finale, 4, dt)
    const v = p.current
    if (cam.current) {
      const portrait = cam.current.aspect < 0.85 ? 1.7 : 1
      cam.current.position.z = THREE.MathUtils.lerp(5.4, 12, easeInOut(v)) * portrait
      cam.current.position.x = damp(cam.current.position.x, pointer.x * 0.5, 2, dt)
      cam.current.position.y = damp(cam.current.position.y, pointer.y * 0.3 + v * 0.5, 2, dt)
      cam.current.lookAt(0, 0, 0)
    }
    if (gem.current) {
      // floats above the copy, then crowns the logo as the camera pulls away
      gem.current.position.y = THREE.MathUtils.lerp(1.15, 1.75, easeInOut(range(v, 0.5, 0.85)))
      gem.current.rotation.y += dt * spin(0.45)
      gem.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.15
    }
    if (ringOrbit.current) ringOrbit.current.rotation.z += dt * spin(0.08)
  })

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault position={[0, 0, 5.4]} fov={38} />
      <StudioEnvironment intensity={1.2} />
      <StageLights strength={2.4} />
      <group ref={gem} scale={0.75}>
        <Diamond />
      </group>
      <group ref={ringOrbit}>
        {[2.2, 3.1].map((r, i) => (
          <mesh key={r} material={goldMaterial} rotation={[Math.PI / 2 + 0.25 * (i ? -1 : 1), 0.2, 0]}>
            <torusGeometry args={[r, 0.008, 6, 200]} />
          </mesh>
        ))}
      </group>
      <GoldDust count={1400} spread={[18, 14, 14]} size={80} rise={0.7} />
    </>
  )
}
