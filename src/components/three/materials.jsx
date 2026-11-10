import * as THREE from 'three'
import { Environment, Lightformer } from '@react-three/drei'

// ---------- Shared materials (created once, reused across every scene) ----------

export const goldMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#e8b961'),
  metalness: 1,
  roughness: 0.16,
  envMapIntensity: 1.6,
})

export const roseGoldMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#e9a98a'),
  metalness: 1,
  roughness: 0.2,
  envMapIntensity: 1.5,
})

// Diamonds are rendered as faceted, near-perfect mirrors with a thin-film
// iridescence: it reads as "fire" and is far cheaper than real transmission.
export const diamondMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color('#ffffff'),
  metalness: 0.45,
  roughness: 0.04,
  flatShading: true,
  envMapIntensity: 5,
  emissive: new THREE.Color('#2a2f3a'),
  specularIntensity: 1,
  ior: 2.4,
  iridescence: 1,
  iridescenceIOR: 1.9,
  clearcoat: 1,
  clearcoatRoughness: 0,
})

diamondMaterial.iridescenceThicknessMinimum = 180
diamondMaterial.iridescenceThicknessMaximum = 620

export const wireMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color('#dcb562'),
  wireframe: true,
  transparent: true,
  opacity: 0.18,
  depthWrite: false,
})

// ---------- Geometry ----------

// Round brilliant built ring by ring. Alternate rings are rotated half a step
// so the crown and pavilion get star / kite facets like a real brilliant cut.
export function createDiamondGeometry(n = 16) {
  const rings = [
    { r: 0, y: -0.86, off: 0 }, // culet
    { r: 0.46, y: -0.46, off: 0.5 }, // lower pavilion
    { r: 1, y: -0.02, off: 0 }, // girdle bottom
    { r: 1, y: 0.04, off: 0 }, // girdle top
    { r: 0.8, y: 0.21, off: 0.5 }, // star / kite ring
    { r: 0.56, y: 0.36, off: 0 }, // table edge
    { r: 0, y: 0.36, off: 0 }, // table centre
  ]
  const pt = (ring, i) => {
    const a = ((i + ring.off) / n) * Math.PI * 2
    return new THREE.Vector3(Math.cos(a) * ring.r, ring.y, Math.sin(a) * ring.r)
  }
  const pos = []
  const ref = new THREE.Vector3(0, -0.1, 0)
  const tri = (a, b, c) => {
    const nrm = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a))
    const centroid = new THREE.Vector3().add(a).add(b).add(c).divideScalar(3)
    if (nrm.dot(centroid.sub(ref)) < 0) [b, c] = [c, b]
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z)
  }
  for (let k = 0; k < rings.length - 1; k++) {
    const A = rings[k]
    const B = rings[k + 1]
    for (let i = 0; i < n; i++) {
      const a0 = pt(A, i), a1 = pt(A, i + 1), b0 = pt(B, i), b1 = pt(B, i + 1)
      if (A.r === 0) tri(a0, b0, b1)
      else if (B.r === 0) tri(a0, a1, b0)
      else if (B.off > A.off) {
        tri(a0, a1, b0)
        tri(a1, b1, b0)
      } else if (A.off > B.off) {
        tri(b0, b1, a0)
        tri(a0, b1, a1)
      } else {
        tri(a0, a1, b1)
        tri(a0, b1, b0)
      }
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.computeVertexNormals()
  return g
}

// Pear / teardrop cut for earrings
export function createPearGeometry(segments = 14) {
  const pts = []
  for (let i = 0; i <= 10; i++) {
    const t = i / 10
    const y = -1 + t * 2
    const r = Math.sin(Math.PI * Math.pow(t, 0.75)) * (0.62 - t * 0.18)
    pts.push(new THREE.Vector2(Math.max(r, 0.0001), y))
  }
  const g = new THREE.LatheGeometry(pts, segments)
  g.scale(1, 1, 0.55)
  g.computeVertexNormals()
  return g
}

export const diamondGeometry = createDiamondGeometry(16)
export const smallDiamondGeometry = createDiamondGeometry(10)
export const pearGeometry = createPearGeometry(14)

// ---------- Lighting ----------

// Studio environment built from light-formers (no network HDR needed).
// Warm key strips make the gold glow; cool rims give the diamonds sparkle.
export function StudioEnvironment({ intensity = 1, warm = '#ffd9a0', soft = false }) {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#16120d']} />
      <Lightformer form="rect" intensity={3 * intensity} color="#ffffff" position={[0, 5, -6]} scale={[10, 3, 1]} />
      <Lightformer form="rect" intensity={2.2 * intensity} color={warm} position={[-6, 1, 0]} rotation-y={Math.PI / 2} scale={[14, 0.6, 1]} />
      <Lightformer form="rect" intensity={2.2 * intensity} color={warm} position={[6, -1, 0]} rotation-y={-Math.PI / 2} scale={[14, 0.6, 1]} />
      {!soft && <Lightformer form="ring" intensity={4 * intensity} color="#ffffff" position={[2, 3, 6]} scale={2.5} />}
      {soft && <Lightformer form="rect" intensity={0.5 * intensity} color={warm} position={[3, 2, 7]} scale={[5, 5, 1]} />}
      <Lightformer form="rect" intensity={1.4 * intensity} color="#cfe0ff" position={[0, -4, 3]} rotation-x={Math.PI / 2} scale={[8, 2, 1]} />
      {!soft && <Lightformer form="circle" intensity={6 * intensity} color="#fff3d6" position={[-3, 4, 4]} scale={0.9} />}
    </Environment>
  )
}

export function StageLights({ strength = 2.2 }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <spotLight position={[4, 6, 5]} angle={0.45} penumbra={1} intensity={strength * 40} color="#ffe2ad" />
      <pointLight position={[-5, -2, 3]} intensity={18} color="#9fb7ff" />
    </>
  )
}
