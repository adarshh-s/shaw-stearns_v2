import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../theme.jsx'

// Site-wide background: wide fluted glass columns with a soft blue light band
// flowing across them; each column catches the band at its own height. Columns
// near the pointer rise toward it, over a faint drafting grid. The band is
// strongest in the page header and fades back as you scroll.

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

// Height (0 = top, 1 = bottom) of the light band's upper edge at screen x.
float edgeAt(float x, vec2 res, float t, float colW) {
  float h = 0.84
    + 0.09 * sin(x * 0.0032 + t * 0.35)
    + 0.05 * sin(x * 0.0081 - t * 0.55 + 1.3)
    + 0.025 * sin(x * 0.017 + t * 0.9);
  // Inner pages keep the band low so headings stay clear.
  h += uMirror * 0.1;
  // Columns near the pointer rise toward it.
  float d = (x - uMouse.x) / (colW * 2.4);
  float near = exp(-d * d) * uHover;
  float my = uMouse.y / res.y;
  // Never climb above the middle of the screen, so the headline stays clear.
  h -= near * clamp(h - max(my, 0.52) + 0.06, 0.0, 0.3) * 0.85;
  return h;
}

void main() {
  vec2 res = uRes / uPx;
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uPx;
  float t = uTime;
  float y = p.y / res.y;

  vec3 bg = mix(vec3(0.984, 0.984, 0.988), vec3(0.031, 0.035, 0.047), uDark);
  vec3 col = bg;

  // ---- Fluted columns: each one shows the band at its own height (a soft
  // staircase), bent slightly by the curved glass across its width. ----
  float colW = max(res.x / 12.0, 88.0);
  float ci = floor(p.x / colW);
  float fx = fract(p.x / colW);
  float cx = (ci + 0.5) * colW;
  float lens = fx - 0.5;
  float h = mix(edgeAt(cx, res, t, colW), edgeAt(p.x, res, t, colW), 0.3) + lens * lens * 0.05;
  float I = smoothstep(h - 0.2, h + 0.14, y);
  // A hotter rim just under the edge, cooling deeper down.
  I *= 0.42 + 0.12 * exp(-pow((y - h - 0.1) * 6.0, 2.0));
  I *= uFade;

  vec3 d0 = bg;
  vec3 d1 = vec3(0.02, 0.07, 0.26);
  vec3 d2 = vec3(0.08, 0.27, 0.82);
  vec3 d3 = vec3(0.55, 0.78, 1.0);
  vec3 d4 = vec3(0.9, 0.95, 1.0);
  vec3 l1 = vec3(0.8, 0.87, 0.99);
  vec3 l2 = vec3(0.42, 0.6, 0.98);
  vec3 l3 = vec3(0.17, 0.38, 0.93);
  vec3 l4 = vec3(0.1, 0.26, 0.8);
  vec3 c1 = mix(l1, d1, uDark);
  vec3 c2 = mix(l2, d2, uDark);
  vec3 c3 = mix(l3, d3, uDark);
  vec3 c4 = mix(l4, d4, uDark);
  vec3 band = mix(d0, c1, smoothstep(0.0, 0.3, I));
  band = mix(band, c2, smoothstep(0.25, 0.62, I));
  band = mix(band, c3, smoothstep(0.7, 0.95, I) * 0.6);
  col = band;

  // ---- Glass panes ----
  // Each column is a curved pane: darker through its thick middle, catching a
  // faint reflection toward its edges (Fresnel).
  float nx = (fx - 0.5) * 2.0;
  float nz = sqrt(max(0.0, 1.0 - nx * nx * 0.9));
  float fres = pow(1.0 - nz, 2.0);
  vec3 sky = mix(vec3(0.82, 0.88, 0.97), vec3(0.32, 0.42, 0.62), uDark);
  col *= mix(0.97, 0.9, uDark) + 0.06 * nz;
  col = mix(col, sky, fres * mix(0.18, 0.16, uDark));

  // Specular light: a sharp streak and a broad sheen sit left of centre by
  // default and slide across the panes as the pointer moves.
  float lightX = mix(res.x * 0.3, uMouse.x, uHover);
  float hl = 0.5 + clamp((lightX - cx) / 1400.0, -0.32, 0.32);
  float sd = (fx - hl) * colW;
  float streak = exp(-sd * sd / 4.0);
  float sheen = exp(-(fx - hl) * (fx - hl) * 22.0);
  float vfade = 0.55 + 0.45 * (1.0 - y);
  vec3 spec = mix(vec3(1.0), vec3(0.88, 0.94, 1.0), uDark);
  col += spec * (streak * mix(0.35, 0.16 + 0.2 * I, uDark) + sheen * mix(0.08, 0.04 + 0.06 * I, uDark)) * vfade;

  // Bevelled edges: a lit leading edge and a shadowed trailing edge give each
  // pane its thickness.
  float px = fx * colW;
  float bevelHi = 1.0 - smoothstep(0.0, 1.3, px);
  float bevelLo = smoothstep(colW - 2.5, colW, px);
  col = mix(col, spec, bevelHi * mix(0.5, 0.18 + 0.3 * I, uDark));
  col *= 1.0 - bevelLo * mix(0.06, 0.3, uDark);

  // Below the hero everything settles back to the plain page colour.
  col = mix(bg, col, uFade);

  // ---- Faint drafting grid with crosshairs, brighter near the pointer ----
  const float C = 64.0;
  vec2 gp = vec2(p.x - res.x * 0.5, p.y + uScroll);
  vec2 gd = abs(fract(gp / C - 0.5) - 0.5) * C;
  float line = 1.0 - smoothstep(0.0, 1.0, min(gd.x, gd.y));
  vec2 md = abs(fract(gp / (C * 4.0) - 0.5) - 0.5) * C * 4.0;
  float cross = (1.0 - smoothstep(0.0, 1.0, min(md.x, md.y))) * step(max(md.x, md.y), 5.0);
  vec2 mp = p - uMouse;
  float spot = exp(-dot(mp, mp) / (230.0 * 230.0)) * uHover;
  float dim = 1.0 - smoothstep(0.3, 0.9, I);
  float gA = (line * (mix(0.045, 0.035, uDark) + 0.12 * spot) + cross * mix(0.18, 0.2, uDark)) * dim * uFade;
  vec3 gridCol = mix(vec3(0.1, 0.2, 0.45), vec3(0.55, 0.68, 1.0), uDark);
  col = mix(col, gridCol, gA);

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

export default function Columns({ className = '' }) {
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
      // Inner pages keep the light quieter than the home hero.
      gl.uniform1f(u.uFade, (1 - fold) * (mirror.current ? 0.45 : 1))
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
