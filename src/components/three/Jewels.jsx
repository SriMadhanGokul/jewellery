import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import {
  goldMaterial,
  roseGoldMaterial,
  diamondMaterial,
  diamondGeometry,
  smallDiamondGeometry,
  pearGeometry,
  wireMaterial,
} from './materials'
import { range, easeOut, easeInOut } from '../../lib/store'

const tmp = new THREE.Object3D()
const UP = new THREE.Vector3(0, 1, 0)
const FWD = new THREE.Vector3(0, 0, 1)

// ------------------------------------------------------------------
// Diamond
// ------------------------------------------------------------------
export function Diamond({ segments, ...props }) {
  return <mesh geometry={diamondGeometry} material={diamondMaterial} {...props} />
}

// ------------------------------------------------------------------
// Royal necklace: woven chain, graduated stones and a haloed pendant
// ------------------------------------------------------------------
export function Necklace({ links = 150, ...props }) {
  const chainRef = useRef()
  const stoneRef = useRef()
  const bezelRef = useRef()

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          [-1.55, 1.9, -0.7],
          [-1.5, 1.0, -0.3],
          [-1.25, 0.15, 0.05],
          [-0.78, -0.55, 0.28],
          [0, -0.86, 0.38],
          [0.78, -0.55, 0.28],
          [1.25, 0.15, 0.05],
          [1.5, 1.0, -0.3],
          [1.55, 1.9, -0.7],
        ].map((p) => new THREE.Vector3(...p)),
        false,
        'catmullrom',
        0.5,
      ),
    [],
  )

  const stones = useMemo(() => {
    const out = []
    const n = 17
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1)
      const t = 0.25 + u * 0.5
      if (Math.abs(t - 0.5) < 0.02) continue // pendant sits here
      // graduated: larger near the centre
      const size = 0.06 + 0.055 * Math.pow(1 - Math.abs(u - 0.5) * 2, 1.5)
      out.push({ t, size })
    }
    return out
  }, [])

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const T = new THREE.Vector3()
    const N = new THREE.Vector3()
    const B = new THREE.Vector3()
    for (let i = 0; i < links; i++) {
      const t = i / (links - 1)
      const p = curve.getPointAt(t)
      curve.getTangentAt(t, T)
      N.crossVectors(T, FWD).normalize()
      B.crossVectors(T, N).normalize()
      if (i % 2) m.makeBasis(T, B, N.clone().negate())
      else m.makeBasis(T, N, B)
      m.setPosition(p)
      chainRef.current.setMatrixAt(i, m)
    }
    chainRef.current.instanceMatrix.needsUpdate = true

    stones.forEach(({ t, size }, i) => {
      const p = curve.getPointAt(t)
      tmp.position.copy(p).add(new THREE.Vector3(0, -size * 0.9, 0.04))
      tmp.quaternion.setFromUnitVectors(UP, FWD)
      tmp.scale.setScalar(size)
      tmp.updateMatrix()
      stoneRef.current.setMatrixAt(i, tmp.matrix)
      tmp.scale.setScalar(size * 1.05)
      tmp.position.z -= size * 0.12
      tmp.updateMatrix()
      bezelRef.current.setMatrixAt(i, tmp.matrix)
    })
    stoneRef.current.instanceMatrix.needsUpdate = true
    bezelRef.current.instanceMatrix.needsUpdate = true
  }, [curve, links, stones])

  const linkGeo = useMemo(() => {
    const g = new THREE.TorusGeometry(0.03, 0.009, 6, 14)
    g.scale(1.5, 1, 1)
    return g
  }, [])
  const bezelGeo = useMemo(() => new THREE.TorusGeometry(1, 0.16, 8, 24), [])
  const haloStones = 14

  return (
    <group {...props}>
      <instancedMesh ref={chainRef} args={[linkGeo, goldMaterial, links]} />
      <instancedMesh ref={stoneRef} args={[smallDiamondGeometry, diamondMaterial, stones.length]} />
      <instancedMesh ref={bezelRef} args={[bezelGeo, goldMaterial, stones.length]} />

      {/* Pendant */}
      <group position={[0, -1.32, 0.42]}>
        <mesh material={goldMaterial} position={[0, 0.36, 0]}>
          <torusGeometry args={[0.07, 0.022, 10, 24]} />
        </mesh>
        <mesh geometry={diamondGeometry} material={diamondMaterial} rotation-x={Math.PI / 2} scale={0.27} />
        <mesh material={goldMaterial} position={[0, 0, -0.04]}>
          <torusGeometry args={[0.29, 0.018, 10, 64]} />
        </mesh>
        {Array.from({ length: haloStones }, (_, i) => {
          const a = (i / haloStones) * Math.PI * 2
          return (
            <mesh
              key={i}
              geometry={smallDiamondGeometry}
              material={diamondMaterial}
              position={[Math.cos(a) * 0.36, Math.sin(a) * 0.36, -0.02]}
              rotation-x={Math.PI / 2}
              scale={0.055}
            />
          )
        })}
        <mesh material={goldMaterial} position={[0, 0, -0.05]}>
          <torusGeometry args={[0.43, 0.014, 8, 64]} />
        </mesh>
      </group>
    </group>
  )
}

// ------------------------------------------------------------------
// Solitaire ring with pavé shoulders. `getProgress` (0..1) drives the
// four-stage construction sequence used in the Craftsmanship section.
// ------------------------------------------------------------------
const PRONGS = 6
const PAVE = 12

export function Ring({ getProgress, material = goldMaterial, showGhost = false, hideHead = false, ...props }) {
  const band = useRef()
  const head = useRef()
  const prongs = useRef()
  const pave = useRef()
  const ghost = useRef()
  const lastArc = useRef(-1)
  const ghostMat = useMemo(() => wireMaterial.clone(), [])

  const prongGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.018, 0.026, 0.62, 8)
    g.translate(0, 0.31, 0) // grow from the base
    return g
  }, [])

  const paveData = useMemo(() => {
    const out = []
    for (let i = 0; i < PAVE; i++) {
      const side = i < PAVE / 2 ? -1 : 1
      const k = i % (PAVE / 2)
      const theta = Math.PI / 2 + side * (0.32 + k * 0.13)
      out.push(theta)
    }
    return out
  }, [])

  useEffect(() => () => band.current?.geometry?.dispose(), [])

  useFrame(() => {
    const p = getProgress ? getProgress() : 1

    // Stage 1 – the band forms (0 → .32)
    const s1 = easeInOut(range(p, 0.02, 0.32))
    const arc = Math.max(0.0001, s1 * Math.PI * 2)
    const q = Math.round(arc * 40) / 40
    if (q !== lastArc.current && band.current) {
      lastArc.current = q
      const old = band.current.geometry
      band.current.geometry = new THREE.TorusGeometry(1, 0.11, 28, Math.max(4, Math.ceil(120 * (q / (Math.PI * 2)))), Math.max(q, 0.0001))
      old?.dispose()
      band.current.rotation.z = -Math.PI / 2 - q / 2
    }
    if (band.current) band.current.visible = s1 > 0.001

    // Stage 2 – centre stone descends (.32 → .58)
    const s2 = easeOut(range(p, 0.32, 0.58))
    if (head.current) {
      head.current.visible = !hideHead && s2 > 0.001
      head.current.position.y = 1.5 + (1 - s2) * 1.6
      head.current.rotation.y = (1 - s2) * Math.PI * 3
      head.current.scale.setScalar(0.42 * Math.max(s2, 0.001))
    }

    // Stage 3 – prongs & pavé refine the piece (.58 → .82)
    const s3 = range(p, 0.58, 0.82)
    if (prongs.current) {
      for (let i = 0; i < PRONGS; i++) {
        const a = (i / PRONGS) * Math.PI * 2 + Math.PI / PRONGS
        const local = easeOut(range(s3, i * 0.06, 0.5 + i * 0.06))
        tmp.position.set(Math.cos(a) * 0.3, 1.06, Math.sin(a) * 0.3)
        tmp.quaternion.setFromUnitVectors(UP, new THREE.Vector3(Math.cos(a) * 0.22, 1, Math.sin(a) * 0.22).normalize())
        tmp.scale.set(1, Math.max(local, 0.0001), 1)
        tmp.updateMatrix()
        prongs.current.setMatrixAt(i, tmp.matrix)
      }
      prongs.current.instanceMatrix.needsUpdate = true
    }
    if (pave.current) {
      paveData.forEach((theta, i) => {
        const local = easeOut(range(s3, 0.3 + (i % (PAVE / 2)) * 0.1, 0.55 + (i % (PAVE / 2)) * 0.1))
        const r = 1.1
        tmp.position.set(Math.cos(theta) * r, Math.sin(theta) * r, 0)
        tmp.quaternion.setFromUnitVectors(UP, new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0))
        tmp.scale.setScalar(0.065 * Math.max(local, 0.0001))
        tmp.updateMatrix()
        pave.current.setMatrixAt(i, tmp.matrix)
      })
      pave.current.instanceMatrix.needsUpdate = true
    }

    ghostMat.opacity = 0.18 * (1 - range(p, 0.75, 1))
  })

  return (
    <group {...props}>
      {showGhost && (
        <group ref={ghost}>
          <mesh material={ghostMat}>
            <torusGeometry args={[1, 0.11, 10, 64]} />
          </mesh>
          <mesh material={ghostMat} position={[0, 1.5, 0]} scale={0.42} geometry={smallDiamondGeometry} />
        </group>
      )}
      <mesh ref={band} material={material} />
      <instancedMesh ref={prongs} args={[prongGeo, material, PRONGS]} />
      <instancedMesh ref={pave} args={[smallDiamondGeometry, diamondMaterial, PAVE]} />
      {/* basket under the stone */}
      <group ref={head} position={[0, 1.5, 0]}>
        <mesh geometry={diamondGeometry} material={diamondMaterial} />
        <mesh material={material} position={[0, -0.42, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.62, 0.07, 10, 40]} />
        </mesh>
      </group>
    </group>
  )
}

// ------------------------------------------------------------------
// Drop earrings (pair)
// ------------------------------------------------------------------
function Earring(props) {
  const haloGeo = useMemo(() => {
    const pts = []
    const n = 40
    for (let i = 0; i <= n; i++) {
      const t = i / n
      const ang = t * Math.PI * 2
      // teardrop outline: pointed at the top
      const y = -Math.cos(ang) * 1.12
      const x = Math.sin(ang) * 0.72 * Math.pow(Math.sin(ang / 2), 0.9) * 1.0
      pts.push(new THREE.Vector3(x, y - 0.05, 0))
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 80, 0.045, 8, true)
  }, [])

  return (
    <group {...props}>
      {/* stud */}
      <mesh geometry={diamondGeometry} material={diamondMaterial} rotation-x={Math.PI / 2} scale={0.2} position={[0, 1.95, 0]} />
      <mesh material={goldMaterial} position={[0, 1.95, -0.03]}>
        <torusGeometry args={[0.215, 0.03, 8, 32]} />
      </mesh>
      {/* links */}
      <mesh material={goldMaterial} position={[0, 1.66, 0]}>
        <torusGeometry args={[0.07, 0.022, 8, 24]} />
      </mesh>
      <mesh material={goldMaterial} position={[0, 1.5, 0]} rotation-y={Math.PI / 2}>
        <torusGeometry args={[0.07, 0.022, 8, 24]} />
      </mesh>
      <mesh material={goldMaterial} position={[0, 1.33, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
      </mesh>
      {/* pear drop with halo */}
      <group position={[0, 0.15, 0]}>
        <mesh geometry={pearGeometry} material={diamondMaterial} scale={[1, 1.05, 1]} />
        <mesh geometry={haloGeo} material={goldMaterial} scale={[1.08, 1.04, 1]} />
      </group>
    </group>
  )
}

export function Earrings(props) {
  return (
    <group {...props}>
      <Earring position={[-0.95, 0, 0]} rotation-y={0.35} />
      <Earring position={[0.95, 0.12, -0.2]} rotation-y={-0.5} />
    </group>
  )
}

// ------------------------------------------------------------------
// Tennis bracelet
// ------------------------------------------------------------------
export function Bracelet({ count = 44, ...props }) {
  const stones = useRef()
  const cups = useRef()
  const cupGeo = useMemo(() => new THREE.CylinderGeometry(1, 0.7, 0.5, 12, 1, true), [])

  useLayoutEffect(() => {
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2
      const dir = new THREE.Vector3(Math.cos(a), Math.sin(a), 0)
      tmp.position.copy(dir).multiplyScalar(1.36)
      tmp.quaternion.setFromUnitVectors(UP, dir)
      tmp.scale.setScalar(0.085)
      tmp.updateMatrix()
      stones.current.setMatrixAt(i, tmp.matrix)
      tmp.position.copy(dir).multiplyScalar(1.31)
      tmp.scale.set(0.09, 0.09, 0.09)
      tmp.updateMatrix()
      cups.current.setMatrixAt(i, tmp.matrix)
    }
    stones.current.instanceMatrix.needsUpdate = true
    cups.current.instanceMatrix.needsUpdate = true
  }, [count])

  return (
    <group {...props}>
      <mesh material={goldMaterial}>
        <torusGeometry args={[1.26, 0.05, 12, 160]} />
      </mesh>
      <mesh material={roseGoldMaterial} position={[0, 0, 0.09]}>
        <torusGeometry args={[1.28, 0.022, 8, 160]} />
      </mesh>
      <mesh material={roseGoldMaterial} position={[0, 0, -0.09]}>
        <torusGeometry args={[1.28, 0.022, 8, 160]} />
      </mesh>
      <instancedMesh ref={cups} args={[cupGeo, goldMaterial, count]} />
      <instancedMesh ref={stones} args={[smallDiamondGeometry, diamondMaterial, count]} />
    </group>
  )
}
