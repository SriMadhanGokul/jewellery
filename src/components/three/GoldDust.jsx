import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { quality, prefersReducedMotion } from '../../lib/device'

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uRise;
  attribute float aSeed;
  attribute float aScale;
  varying float vTwinkle;
  void main() {
    vec3 p = position;
    float t = uTime * (0.15 + aSeed * 0.25);
    p.y += mod(t * uRise + aSeed * 20.0, 12.0) - 6.0;
    p.x += sin(t * 1.3 + aSeed * 12.0) * 0.35;
    p.z += cos(t * 0.9 + aSeed * 7.0) * 0.35;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -mv.z);
    vTwinkle = 0.45 + 0.55 * sin(uTime * (1.5 + aSeed * 3.0) + aSeed * 40.0);
  }
`

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vTwinkle;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float core = smoothstep(0.5, 0.0, d);
    float glow = pow(core, 3.0);
    // tiny 4-point star flare
    float star = max(0.0, 1.0 - abs(c.x * c.y) * 120.0) * smoothstep(0.5, 0.1, d) * 0.5;
    float a = (glow + star) * vTwinkle * uOpacity;
    if (a < 0.003) discard;
    gl_FragColor = vec4(uColor * (1.0 + glow), a);
  }
`

export function GoldDust({ count = 900, spread = [14, 12, 8], size = 70, color = '#f1cf86', opacity = 0.9, rise = 1, ...props }) {
  const mat = useRef()
  const dpr = useThree((s) => s.viewport.dpr)
  const n = Math.max(40, Math.round(count * quality.particles))
  const reduced = prefersReducedMotion()

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(n * 3)
    const seed = new Float32Array(n)
    const scale = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread[0]
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread[1]
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread[2]
      seed[i] = Math.random()
      scale[i] = 0.3 + Math.pow(Math.random(), 3) * 1.8
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    g.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
    return g
  }, [n, spread])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: size },
      uPixelRatio: { value: dpr },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uRise: { value: rise },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame((state, dt) => {
    if (!mat.current) return
    if (!reduced) mat.current.uniforms.uTime.value += dt
    mat.current.uniforms.uPixelRatio.value = state.viewport.dpr
    mat.current.uniforms.uOpacity.value = opacity
  })

  return (
    <points geometry={geo} frustumCulled={false} {...props}>
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
