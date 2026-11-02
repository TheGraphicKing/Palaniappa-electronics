/* Hero 3D: the dotted vortex from the catalogue cover, rebuilt as an
   interactive WebGL particle field. Lazy-loaded only on the home page. */
import * as THREE from "../vendor/three.module.min.js";

export default function init(host) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  host.prepend(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  // ---- geometry: concentric, offset ellipses of dots (like the cover art) ----
  const rings = 64;
  const pos = [], seed = [], size = [], col = [];
  const cA = new THREE.Color("#4FB3BF"), cB = new THREE.Color("#E9F7F8"), cC = new THREE.Color("#F2B544");
  for (let r = 0; r < rings; r++) {
    const t = r / rings;
    const radius = 0.6 + t * 7.5;
    const count = Math.floor(40 + t * 210);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + r * 0.13;
      // ellipse squashed in Y and shifted, then twisted -> swirl
      const x = Math.cos(a) * radius * 1.35 + t * 1.6;
      const y = Math.sin(a) * radius * 0.42 - t * 0.9;
      const z = Math.sin(a + t * 4.0) * (0.25 + t * 1.1);
      pos.push(x, y, z);
      seed.push(Math.random() * 100, t, a);
      // dots get bigger toward the outside, as in the print
      size.push((0.25 + t * t * 2.2) * (0.75 + Math.random() * 0.5));
      const c = Math.random() < 0.03 ? cC : cA.clone().lerp(cB, Math.pow(1 - t, 1.6) * 0.9);
      col.push(c.r, c.g, c.b);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("aSeed", new THREE.Float32BufferAttribute(seed, 3));
  geo.setAttribute("aSize", new THREE.Float32BufferAttribute(size, 1));
  geo.setAttribute("aColor", new THREE.Float32BufferAttribute(col, 3));

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uScroll: { value: 0 },
    uPR: { value: renderer.getPixelRatio() },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute vec3 aSeed; attribute float aSize; attribute vec3 aColor;
      uniform float uTime; uniform vec2 uMouse; uniform float uScroll; uniform float uPR;
      varying vec3 vColor; varying float vAlpha;
      void main(){
        vec3 p = position;
        float t = aSeed.y;
        // slow differential rotation: inner rings spin faster -> vortex
        float ang = uTime * (0.12 + (1.0 - t) * 0.35);
        float cs = cos(ang), sn = sin(ang);
        vec2 c = vec2(t * 1.6, -t * 0.9);
        vec2 q = p.xy - c;
        q = vec2(q.x * cs - q.y * sn * 3.2, q.x * sn / 3.2 + q.y * cs);
        p.xy = q + c;
        p.z += sin(uTime * 0.8 + aSeed.x) * 0.12 + uScroll * (1.0 - t) * 3.0;
        // mouse repulsion in screen-ish space
        vec2 m = uMouse * vec2(7.0, 3.6);
        vec2 d = p.xy - m;
        float f = exp(-dot(d, d) * 0.35);
        p.xy += normalize(d + 0.0001) * f * 0.9;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uPR * (26.0 / -mv.z) * (1.0 + f * 1.4);
        vColor = mix(aColor, vec3(0.95, 0.71, 0.27), f * 0.8);
        vAlpha = 0.35 + 0.65 * smoothstep(0.0, 0.25, t);
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vColor; varying float vAlpha;
      void main(){
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float a = smoothstep(0.5, 0.32, d);
        if (a < 0.01) discard;
        gl_FragColor = vec4(vColor, a * vAlpha);
      }`,
  });
  const points = new THREE.Points(geo, mat);
  points.rotation.set(-0.45, 0.28, -0.32);
  points.position.set(1.2, -0.4, 0);
  scene.add(points);

  // ---- sizing ----
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w < 700 ? 12 : 9;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  // ---- input ----
  const target = new THREE.Vector2(), cur = new THREE.Vector2();
  host.addEventListener("pointermove", (e) => {
    const r = host.getBoundingClientRect();
    target.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
  });
  host.addEventListener("pointerleave", () => target.set(0, 0));

  // ---- loop (paused when offscreen / tab hidden) ----
  let visible = true, raf = 0;
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf) loop(); });
  io.observe(host);
  const clock = new THREE.Clock();
  function loop() {
    if (!visible || document.hidden) { raf = 0; return; }
    raf = requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    cur.lerp(target, 0.06);
    uniforms.uTime.value = t;
    uniforms.uMouse.value.copy(cur);
    const sc = Math.min(1, window.scrollY / (host.clientHeight || 1));
    uniforms.uScroll.value += (sc - uniforms.uScroll.value) * 0.1;
    points.rotation.y = 0.28 + cur.x * 0.18;
    points.rotation.x = -0.45 + cur.y * 0.12;
    renderer.render(scene, camera);
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden && !raf) loop(); });
  loop();
  host.classList.add("has-3d");
}
