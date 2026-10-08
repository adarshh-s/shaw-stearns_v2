import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../theme.jsx'

// Site-wide background: twisting glass ribbons sweeping diagonally from the
// bottom-left and thinning into fine lines toward the top-right, over a faint
// drafting grid. Ribbons near the pointer turn toward the light; the grid
// brightens softly around it. Ribbons are strongest in the page header and
// fade back as you scroll so content stays calm.

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uPx;
uniform float uTime;
uniform float uDark;
uniform vec2 uMouse;
uniform float uHover;
uniform float uScroll;
uniform float uFade;
uniform float uMirror;
out vec4 o;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 res = uRes / uPx;
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uPx;
  float t = uTime;

  vec3 bg = mix(vec3(0.955, 0.965, 0.988), vec3(0.016, 0.027, 0.06), uDark);
  vec3 col = bg;

  // ---- Drafting grid: scrolls with the page, brightens near the pointer ----
  const float C = 64.0;
  vec2 gp = vec2(p.x - res.x * 0.5, p.y + uScroll);
  vec2 gd = abs(fract(gp / C - 0.5) - 0.5) * C;
  float line = 1.0 - smoothstep(0.0, 1.0, min(gd.x, gd.y));
  vec2 md = abs(fract(gp / (C * 4.0) - 0.5) - 0.5) * C * 4.0;
  float cross = (1.0 - smoothstep(0.0, 1.0, min(md.x, md.y))) * step(max(md.x, md.y), 5.0);
  vec2 mp = p - uMouse;
  float spot = exp(-dot(mp, mp) / (230.0 * 230.0)) * uHover;
  vec2 vq = (p / res - 0.5) * vec2(1.0, 1.25);
  float vign = smoothstep(0.95, 0.15, length(vq));
  float gA = line * (mix(0.07, 0.055, uDark) * vign + 0.2 * spot) + cross * mix(0.28, 0.32, uDark) * (0.5 + 0.5 * vign);
  vec3 gridCol = mix(vec3(0.1, 0.2, 0.45), vec3(0.55, 0.68, 1.0), uDark);
  col = mix(col, gridCol, gA);

  // ---- Ribbons ----
  vec2 dir = normalize(vec2(1.0, 0.82));
  vec2 nrm = vec2(-dir.y, dir.x);
  float u = dot(p, dir);
  float v = dot(p, nrm);
  const float P = 118.0;
  float idx = floor(v / P);
  float f = fract(v / P);

  // Envelope: full ribbons bottom-left, thinning to hairlines toward top-right.
  vec2 q = p / res;
  // Inner pages mirror the sweep so left-aligned headings stay clear.
  float ex = mix(q.x, 1.0 - q.x, uMirror);
  float env = smoothstep(0.32, 1.05, q.y * 1.2 - ex * 0.38 - uMirror * 0.12) * uFade;

  // Twist along each ribbon; the pointer turns nearby ribbons toward the light.
  float near = exp(-dot(mp, mp) / (320.0 * 320.0)) * uHover;
  float ph = u * 0.0042 - t * 0.32 + idx * 0.62 + sin(u * 0.0013 + t * 0.18 + idx) * 0.6 + near * 1.6;
  float c = cos(ph);
  float face = abs(c);
  float w = (0.006 + 0.42 * env) * (0.22 + 0.78 * face);
  float x = (f - 0.5) / w;
  float aa = fwidth(v / P) / w;
  float inside = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, abs(x));

  // Shading: bright where the ribbon faces us, deep blue in the folds, with a
  // curved cross-section and a lit rim on the leading edge.
  float side = x * sign(sin(ph));

  float curve = clamp(1.0 - x * x, 0.0, 1.0);
  side = clamp(side, -1.0, 1.0);
  vec3 hi = mix(vec3(0.5, 0.66, 1.0), vec3(0.68, 0.82, 1.0), uDark);
  vec3 mid = mix(vec3(0.15, 0.36, 0.95), vec3(0.24, 0.5, 1.0), uDark);
  vec3 fold = mix(vec3(0.05, 0.13, 0.46), vec3(0.04, 0.12, 0.45), uDark);
  vec3 rc = mix(fold, mid, smoothstep(0.08, 0.55, face));
  rc = mix(rc, hi, smoothstep(0.5, 0.97, face) * (0.55 + 0.45 * curve));
  rc *= 0.72 + 0.28 * curve;
  rc = mix(rc, fold, smoothstep(0.2, 1.0, side) * (1.0 - face) * 0.8);
  float rim = smoothstep(0.78, 1.0, -side) * (1.0 - face * 0.5);
  rc += vec3(0.5, 0.75, 1.0) * rim * 0.22;
  rc += vec3(0.35, 0.55, 1.0) * near * 0.12;

  rc = clamp(rc, 0.0, 1.0);
  float alpha = inside * mix(0.22, 1.0, smoothstep(0.0, 0.22, env));
  col = mix(col, rc, alpha);

  // A faint atmosphere under the ribbons in dark mode.
  col += mid * 0.06 * env * uDark;

  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0 * 2.0;
  o = vec4(col, 1.0);
}`

function compile(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(s))
    return null
  }
  return s
}

export default function Ribbons({ className = '' }) {
  const canvasRef = useRef(null)
  const { theme } = useTheme()
  const darkTarget = useRef(theme === 'dark' ? 1 : 0)
  const redraw = useRef(null)
  const { pathname } = useLocation()
  const mirror = useRef(pathname === '/' ? 0 : 1)

  useEffect(() => {
    mirror.current = pathname === '/' ? 0 : 1
    redraw.current?.()
  }, [pathname])

  useEffect(() => {
    darkTarget.current = theme === 'dark' ? 1 : 0
    redraw.current?.()
  }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, powerPreference: 'low-power' })
    const vs = gl && compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = gl && compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!gl || !vs || !fs) {
      canvas.classList.add('bg-off')
      return
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.bindAttribLocation(prog, 0, 'aPos')
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    const u = Object.fromEntries(
      ['uRes', 'uPx', 'uTime', 'uDark', 'uMouse', 'uHover', 'uScroll', 'uFade', 'uMirror'].map((n) => [n, gl.getUniformLocation(prog, n)]),
    )

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.7, sx: 0, sy: 0, hover: 0, target: 0 }
    mouse.sx = mouse.x
    mouse.sy = mouse.y
    const state = { dark: darkTarget.current }
    const start = performance.now()
    let raf = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(window.innerWidth * dpr))
      canvas.height = Math.max(1, Math.round(window.innerHeight * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      if (reduced) render(12)
    }

    function render(time) {
      gl.uniform2f(u.uRes, canvas.width, canvas.height)
      gl.uniform1f(u.uPx, canvas.width / window.innerWidth)
      gl.uniform1f(u.uTime, time)
      gl.uniform1f(u.uDark, state.dark)
      gl.uniform2f(u.uMouse, mouse.sx, mouse.sy)
      gl.uniform1f(u.uHover, mouse.hover)
      gl.uniform1f(u.uScroll, window.scrollY)
      const fold = Math.min(1, window.scrollY / (window.innerHeight * 0.9))
      gl.uniform1f(u.uFade, 1 - fold * 0.93)
      gl.uniform1f(u.uMirror, mirror.current)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    function frame(now) {
      // Slow easing keeps the twist silky rather than twitchy.
      mouse.sx += (mouse.x - mouse.sx) * 0.07
      mouse.sy += (mouse.y - mouse.sy) * 0.07
      mouse.hover += (mouse.target - mouse.hover) * 0.05
      state.dark += (darkTarget.current - state.dark) * 0.08
      render((now - start) / 1000)
      if (!document.hidden) raf = requestAnimationFrame(frame)
    }

    redraw.current = () => {
      if (!reduced) return
      state.dark = darkTarget.current
      render(12)
    }

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.target = 1
      if (reduced) {
        mouse.sx = mouse.x
        mouse.sy = mouse.y
        mouse.hover = 1
        render(12)
      }
    }
    const onLeave = () => (mouse.target = 0)
    const onScroll = () => reduced && render(12)
    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && !reduced) raf = requestAnimationFrame(frame)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchend', onLeave, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    resize()
    if (reduced) render(12)
    else raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchend', onLeave)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      redraw.current = null
    }
  }, [])

  return <canvas ref={canvasRef} className={`bg-canvas ${className}`} aria-hidden="true" />
}
