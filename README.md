# AURELIA — Cinematic 3D Jewellery Experience

React + Vite + Tailwind v4 + Three.js (React Three Fiber / Drei) + GSAP ScrollTrigger + Framer Motion + Lenis.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Add `?skipintro` to the URL to bypass the loading screen while developing.

## Structure
- `src/App.jsx`: one shared WebGL canvas; each section draws into it through a Drei `<View>`
- `src/sections/`: Hero, Story, Collections (with 3D product viewer modal), Craftsmanship, Signature, WhyUs, FinalCTA
- `src/components/three/`: procedural jewellery (`Jewels.jsx`), materials and studio lighting, gold particles, per-section scenes
- `src/components/ui/`: loader, custom cursor, magnetic buttons, text reveals, header, footer
- `src/lib/`: Lenis + ScrollTrigger wiring, shared scroll store, device / reduced-motion helpers

All jewellery is generated in code (brilliant-cut diamonds, chain, ring, earrings, bracelet), so there are no external model or image files.
Swap in GLTF models from Blender through `useGLTF` in `Jewels.jsx` if needed.
