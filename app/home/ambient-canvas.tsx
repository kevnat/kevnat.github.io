"use client";

import { useEffect, useRef } from "react";

const VERT = `attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const FRAG = `precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_glow;
uniform vec3 u_bg;
uniform vec3 u_accent;
uniform float u_overlay;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 g = vec2(u_glow.x * aspect, u_glow.y);

  // Slow drifting haze.
  float haze = fbm(p * 1.6 + vec2(u_time * 0.02, -u_time * 0.015));

  // Warm lamp pool, slightly breathing.
  float d = distance(p, g);
  float pool = exp(-d * d * 2.4) * (0.85 + 0.15 * sin(u_time * 0.4));
  pool *= 0.6 + 0.8 * haze;

  if (u_overlay > 0.5) {
    // Additive light for compositing over photo layers (screen blend).
    float pool2 = exp(-d * d * 5.0) * (0.85 + 0.15 * sin(u_time * 0.4));
    pool2 *= 0.6 + 0.8 * haze;
    vec3 add = u_accent * pool2 * 0.34 + u_accent * haze * 0.015;
    add += abs(hash(gl_FragCoord.xy + fract(u_time) * 100.0) - 0.5) * 0.04;
    gl_FragColor = vec4(add, 1.0);
    return;
  }

  vec3 col = vec3(0.09, 0.075, 0.06);
  col += u_accent * pool * 0.55;
  col += u_accent * haze * 0.05;

  // Vignette.
  vec2 vq = uv - 0.5;
  col *= 1.0 - dot(vq, vq) * 0.9;

  // Film grain.
  float grain = hash(gl_FragCoord.xy + fract(u_time) * 100.0) - 0.5;
  col += grain * 0.03;

  gl_FragColor = vec4(col, 1.0);
}`;

function parseColor(value: string, fallback: [number, number, number]) {
  const m = value.trim().match(/^#([0-9a-f]{6})$/i);
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255] as [
    number,
    number,
    number,
  ];
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

type Props = {
  // Normalized horizontal target (0..1) for the lamp glow.
  glowX: number;
  // Normalized vertical target (0 = bottom, 1 = top).
  glowY?: number;
  // Additive output for screen-blending over other layers.
  overlay?: boolean;
  // Stops drawing without tearing down the GL context.
  paused?: boolean;
};

export default function AmbientCanvas({
  glowX,
  glowY = 0.38,
  overlay = false,
  paused = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetRef = useRef(glowX);
  const targetYRef = useRef(glowY);
  const pausedRef = useRef(paused);

  useEffect(() => {
    targetRef.current = glowX;
    targetYRef.current = glowY;
    pausedRef.current = paused;
  }, [glowX, glowY, paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // One full-screen triangle.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uGlow = gl.getUniformLocation(program, "u_glow");
    const uBg = gl.getUniformLocation(program, "u_bg");
    const uAccent = gl.getUniformLocation(program, "u_accent");
    const uOverlay = gl.getUniformLocation(program, "u_overlay");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let glow = targetRef.current;
    let glowYNow = targetYRef.current;
    let raf = 0;
    let visible = true;
    let running = false;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const scale = window.innerWidth < 768 ? 0.6 : 1;
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr * scale));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (now: number) => {
      const styles = getComputedStyle(document.documentElement);
      const bg = parseColor(styles.getPropertyValue("--background"), [
        0.24, 0.24, 0.16,
      ]);
      const accent = parseColor(styles.getPropertyValue("--accent"), [
        0.79, 0.64, 0.47,
      ]);
      glow += (targetRef.current - glow) * 0.04;
      glowYNow += (targetYRef.current - glowYNow) * 0.04;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reducedMotion ? 8 : (now - start) / 1000);
      gl.uniform2f(uGlow, glow, glowYNow);
      gl.uniform1f(uOverlay, overlay ? 1 : 0);
      gl.uniform3f(uBg, bg[0], bg[1], bg[2]);
      gl.uniform3f(uAccent, accent[0], accent[1], accent[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      if (!pausedRef.current) draw(now);
      raf = requestAnimationFrame(loop);
    };

    const play = () => {
      if (reducedMotion || running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw(performance.now());
    play();

    const onVisibility = () => (document.hidden ? pause() : play());
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);

    // Reduced motion: no loop, so redraw once the target moves.
    let staticRaf = 0;
    const staticTick = () => {
      draw(performance.now());
      if (
        Math.abs(targetRef.current - glow) > 0.002 ||
        Math.abs(targetYRef.current - glowYNow) > 0.002
      ) {
        staticRaf = requestAnimationFrame(staticTick);
      }
    };
    const staticTimer = reducedMotion
      ? window.setInterval(() => {
          cancelAnimationFrame(staticRaf);
          staticRaf = requestAnimationFrame(staticTick);
        }, 250)
      : 0;

    return () => {
      pause();
      cancelAnimationFrame(staticRaf);
      window.clearInterval(staticTimer);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="home-canvas fixed inset-0 h-full w-full"
    />
  );
}
