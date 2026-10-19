import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three'
import { LOGO_WORLD_WIDTH, loadLogoFont, sampleLogo } from './logo'
import { portal } from './portal'
import { THEME_EVENT, getTheme } from './theme'

/** Dark: glowing additive points. Light: ink-colored points with normal blending. */
const PALETTE = {
  dark: { a: '#22e6ff', b: '#7a6bff', whiten: 0.25, blending: AdditiveBlending },
  light: { a: '#0e7490', b: '#5b4bdb', whiten: 0, blending: NormalBlending },
} as const

const VERT = /* glsl */ `
  uniform float uU;
  uniform float uTime;
  uniform float uScale;
  uniform float uLogoScale;
  uniform float uLogoShift;
  uniform vec2 uPointer;
  uniform vec3 uColA;
  uniform vec3 uColB;
  uniform float uWhiten;
  attribute vec3 aField;
  attribute vec4 aRand;   // x: stagger, y: size, z: phase, w: color mix
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float ph = aRand.z * 6.2831853;

    // closed: the logo, breathing a tiny bit
    vec3 closedP = position;
    closedP.xy *= uLogoScale;
    closedP.y += uLogoShift;
    closedP += vec3(sin(uTime * .7 + ph), cos(uTime * .6 + ph * 1.3), sin(uTime * .5 + ph * .7)) * 0.012;

    // per-particle stagger: the opening ripples outward from the centre
    float s = clamp((uU - aRand.x * 0.5) / 0.5, 0., 1.);
    float e = s * s * (3. - 2. * s);

    // open: a deep tunnel of drifting points
    // (the tunnel never stops: a slow swirl around the axis + a forward flow that
    // wraps behind the camera, so after the intro the dots keep travelling)
    vec3 openP = aField;
    float dirSign = aRand.w > 0.5 ? 1.0 : -0.6;
    float swirl = uTime * (0.03 + aRand.y * 0.05) * dirSign;
    float cs = cos(swirl);
    float sn = sin(swirl);
    openP.xy = vec2(cs * openP.x - sn * openP.y, sn * openP.x + cs * openP.y);
    openP.z = -62.0 + mod(openP.z + 62.0 + uTime * (0.9 + aRand.y * 1.8), 48.0);
    openP.xy += vec2(sin(uTime * .12 + ph), cos(uTime * .1 + ph * 1.7)) * 0.4;

    vec3 p = mix(closedP, openP, e);

    // burst outward mid-transition
    float bulge = sin(e * 3.1415927);
    vec2 dir = closedP.xy;
    dir /= length(dir) + 0.001;
    p.xy += dir * bulge * (0.8 + aRand.y * 2.5);
    p.z += (aRand.w - .5) * bulge * 4.0;

    // pointer parallax, stronger once the field is open
    p.xy += uPointer * (0.1 + 0.6 * e) * (0.3 + aRand.y);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;

    float w = 0.028 + aRand.y * 0.05;
    w *= mix(1.0, 1.6, e) * (1.0 + bulge * 0.6);
    gl_PointSize = clamp(w * uScale / max(depth, 0.1), 1.2, 48.0);

    float fadeFar = 1.0 - smoothstep(16.0, 44.0, depth);
    float fadeNear = smoothstep(0.4, 2.5, depth);
    vAlpha = fadeFar * fadeNear * mix(1.0, 0.75, e);

    vColor = mix(uColA, uColB, aRand.w * (0.3 + 0.7 * e));
    vColor = mix(vColor, vec3(1.0), (1.0 - e) * uWhiten);
  }
`

const FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = pow(smoothstep(0.5, 0.0, d), 1.5);
    gl_FragColor = vec4(vColor, a * vAlpha);
    #include <colorspace_fragment>
  }
`

/** No WebGL: drop the intro/outro and show a regular page. */
function flatten() {
  portal.reduced = true
  document.documentElement.dataset.gl = 'off'
  dispatchEvent(new Event('portal:flat'))
}

const CAMERA_Z_CLOSED = 7
const CAMERA_Z_OPEN = -18
const FOV = 50

/**
 * Builds the particle stage on `canvas` and returns a cleanup function.
 * Three.js is imported only by this module, so Vite code-splits it and it
 * loads after the first paint.
 */
export async function createParticleScene(
  canvas: HTMLCanvasElement,
  cancelled: () => boolean = () => false,
): Promise<() => void> {
  const coarse = matchMedia('(pointer: coarse)').matches || innerWidth < 768
  const lowEnd = (navigator.hardwareConcurrency ?? 8) <= 4
  const count = Math.round((coarse ? 3200 : 9000) * (lowEnd ? 0.7 : 1))

  // visitors who asked to save data (or on very low-memory devices) get the flat page
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number }
  if (nav.connection?.saveData || (nav.deviceMemory !== undefined && nav.deviceMemory <= 2)) {
    flatten()
    return () => {}
  }

  await loadLogoFont()
  // (React StrictMode mounts twice in dev; never create two renderers on one canvas)
  if (cancelled()) return () => {}
  const { positions, radial } = sampleLogo(count)

  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    })
  } catch {
    flatten()
    return () => {}
  }

  const field = new Float32Array(count * 3)
  const rand = new Float32Array(count * 4)
  for (let i = 0; i < count; i++) {
    const r = 1.5 + Math.pow(Math.random(), 0.6) * 20
    const a = Math.random() * Math.PI * 2
    field[i * 3] = Math.cos(a) * r
    field[i * 3 + 1] = Math.sin(a) * r * 0.7
    field[i * 3 + 2] = -60 + Math.random() * 64
    rand[i * 4] = Math.min(1, radial[i] * 0.75 + Math.random() * 0.25)
    rand[i * 4 + 1] = Math.random()
    rand[i * 4 + 2] = Math.random()
    rand[i * 4 + 3] = Math.random()
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('aField', new BufferAttribute(field, 3))
  geometry.setAttribute('aRand', new BufferAttribute(rand, 4))

  const uniforms = {
    uU: { value: 0 },
    uTime: { value: 0 },
    uScale: { value: 1 },
    uLogoScale: { value: 1 },
    uLogoShift: { value: 0 },
    uPointer: { value: new Vector2() },
    uColA: { value: new Color(PALETTE.dark.a) },
    uColB: { value: new Color(PALETTE.dark.b) },
    uWhiten: { value: PALETTE.dark.whiten as number },
  }

  const material = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  })

  const points = new Points(geometry, material)
  points.frustumCulled = false
  const scene = new Scene()
  scene.add(points)
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 200)

  const pointerTarget = new Vector2()
  let raf = 0
  let last = performance.now()
  let u = portal.reduced ? 1 : portal.target

  function resize() {
    const w = innerWidth
    const h = innerHeight
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2))
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    const visH = 2 * CAMERA_Z_CLOSED * Math.tan((FOV * Math.PI) / 360)
    const visW = visH * camera.aspect
    // leave room under the logo for the cue (intro) and the closing copy (outro)
    const widthShare = camera.aspect < 1 ? 0.88 : 0.72
    uniforms.uLogoScale.value = Math.min(1.1, Math.min(visW * widthShare, visH * 0.54) / LOGO_WORLD_WIDTH)
    uniforms.uLogoShift.value = visH * 0.07
    draw(0)
  }

  function draw(dt: number) {
    const target = portal.reduced ? 1 : portal.target
    u += (target - u) * (1 - Math.exp(-dt * 7))
    if (Math.abs(target - u) < 0.0005) u = target
    const e = u * u * (3 - 2 * u)

    camera.position.z = CAMERA_Z_CLOSED + (CAMERA_Z_OPEN - CAMERA_Z_CLOSED) * e
    camera.fov = FOV + 16 * Math.sin(Math.PI * u)
    camera.updateProjectionMatrix()

    uniforms.uU.value = u
    if (!portal.reduced) uniforms.uTime.value += dt
    uniforms.uScale.value = renderer.domElement.height / (2 * Math.tan((camera.fov * Math.PI) / 360))
    uniforms.uPointer.value.lerp(pointerTarget, 1 - Math.exp(-dt * 4))

    renderer.render(scene, camera)
  }

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    draw(dt)
    raf = requestAnimationFrame(frame)
  }

  function start() {
    if (portal.reduced || raf) return
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }

  function stop() {
    cancelAnimationFrame(raf)
    raf = 0
  }

  function applyTheme() {
    const p = PALETTE[getTheme()]
    uniforms.uColA.value.set(p.a)
    uniforms.uColB.value.set(p.b)
    uniforms.uWhiten.value = p.whiten
    material.blending = p.blending
    material.needsUpdate = true
    if (portal.reduced) draw(0) // static scene: repaint once
  }

  const onPointer = (e: PointerEvent) => {
    pointerTarget.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1))
  }
  const onVisibility = () => (document.hidden ? stop() : start())

  addEventListener('resize', resize)
  addEventListener('pointermove', onPointer, { passive: true })
  addEventListener(THEME_EVENT, applyTheme)
  document.addEventListener('visibilitychange', onVisibility)

  applyTheme()
  resize()
  canvas.dataset.ready = 'true'
  start()

  return () => {
    stop()
    removeEventListener('resize', resize)
    removeEventListener('pointermove', onPointer)
    removeEventListener(THEME_EVENT, applyTheme)
    document.removeEventListener('visibilitychange', onVisibility)
    geometry.dispose()
    material.dispose()
    renderer.dispose()
  }
}
