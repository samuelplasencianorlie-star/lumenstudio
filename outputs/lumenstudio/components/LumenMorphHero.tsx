"use client";

import type { CSSProperties, RefObject } from "react";
import { useEffect, useRef, useState } from "react";

type LumenMorphHeroProps = {
  orbSrc?: string;
  ribbonSrc?: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  headline?: string;
  subheadline?: string;
};

type MorphState = {
  progress: number;
  staticMode: boolean;
};

type MorphRenderer = {
  render: (progress: number) => void;
  destroy: () => void;
};

const IMAGE_ASSETS = {
  orb: "/images/lumen-orb.png",
  ribbon: "/images/lumen-ribbon.png",
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const x = clamp((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
};

const mix = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

function useScrollMorphProgress(sectionRef: RefObject<HTMLElement | null>) {
  const [state, setState] = useState<MorphState>({
    progress: 0,
    staticMode: false,
  });

  useEffect(() => {
    const staticQuery = window.matchMedia(
      "(max-width: 820px), (prefers-reduced-motion: reduce)",
    );
    let frame = 0;

    const updateProgress = () => {
      frame = 0;

      if (staticQuery.matches) {
        setState({ progress: 0.68, staticMode: true });
        return;
      }

      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollableDistance = Math.max(rect.height - window.innerHeight, 1);
      const progress = clamp(-rect.top / scrollableDistance);

      setState({ progress, staticMode: false });
    };

    const requestUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    staticQuery.addEventListener("change", requestUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      staticQuery.removeEventListener("change", requestUpdate);
    };
  }, [sectionRef]);

  return state;
}

function usePremiumMorphCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  orbSrc: string,
  ribbonSrc: string,
  progress: number,
) {
  const [ready, setReady] = useState(false);
  const rendererRef = useRef<MorphRenderer | null>(null);
  const latestProgressRef = useRef(progress);

  useEffect(() => {
    latestProgressRef.current = progress;
    rendererRef.current?.render(progress);
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });

    if (!gl) {
      setReady(false);
      return;
    }

    let disposed = false;
    let frame = 0;
    let removeResizeListener: (() => void) | null = null;
    const textures: WebGLTexture[] = [];

    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;

      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;

      uniform sampler2D u_orb;
      uniform sampler2D u_ribbon;
      uniform float u_progress;

      varying vec2 v_uv;

      const float PI = 3.14159265359;

      mat2 rotate2d(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat2(c, -s, s, c);
      }

      float softEllipse(vec2 uv, vec2 center, vec2 radius, float softness) {
        vec2 q = (uv - center) / radius;
        float d = dot(q, q);
        return 1.0 - smoothstep(1.0, 1.0 + softness, d);
      }

      float revealFromCenter(vec2 uv, vec2 center, vec2 radius, float amount) {
        vec2 q = (uv - center) / radius;
        float d = length(q);
        float edge = mix(0.22, 0.12, amount);
        float reach = mix(0.02, 1.0, amount);
        return 1.0 - smoothstep(reach, reach + edge, d);
      }

      void main() {
        vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y);
        vec2 center = vec2(0.5);
        vec2 d = uv - center;
        float p = clamp(u_progress, 0.0, 1.0);
        float orbExit = smoothstep(0.08, 0.82, p);
        float ribbonEnter = smoothstep(0.18, 0.94, p);
        float energy = sin(p * PI);
        float radius = length(d);
        float angle = atan(d.y, d.x);

        float innerFalloff = 1.0 - smoothstep(0.05, 0.66, radius);
        float swirl = energy * innerFalloff * 0.56;
        float ripple = sin(angle * 3.0 + radius * 22.0 - p * 9.0) * energy;
        float horizontalWave = sin((uv.y - 0.5) * 18.0 + p * 8.0) * energy;
        vec2 direction = normalize(d + vec2(0.0001));
        vec2 displacement = direction * ripple * 0.018 + vec2(horizontalWave * 0.008, -horizontalWave * 0.003);

        vec2 orbD = rotate2d(swirl * 0.35 - orbExit * 0.13) * d;
        vec2 ribbonD = rotate2d(-swirl * 0.18 + (1.0 - ribbonEnter) * 0.18) * d;

        vec2 orbScale = vec2(mix(1.0, 1.2, orbExit), mix(1.0, 0.56, orbExit));
        vec2 ribbonScale = vec2(mix(0.42, 1.0, ribbonEnter), mix(0.36, 1.0, ribbonEnter));

        vec2 orbUv = center + orbD / orbScale + displacement * 1.15;
        vec2 ribbonUv = center + ribbonD / ribbonScale - displacement * 0.85;

        vec3 orb = texture2D(u_orb, orbUv).rgb;
        vec3 ribbon = texture2D(u_ribbon, ribbonUv).rgb;

        float orbMask = softEllipse(
          uv,
          center,
          mix(vec2(0.38, 0.39), vec2(0.54, 0.24), orbExit),
          0.2
        );
        float ribbonMask = softEllipse(
          uv,
          center,
          mix(vec2(0.12, 0.09), vec2(0.56, 0.36), ribbonEnter),
          0.24
        );
        float centerReveal = revealFromCenter(uv, center, vec2(0.92, 0.62), ribbonEnter);

        float orbWeight = (1.0 - smoothstep(0.45, 1.0, orbExit)) * orbMask;
        float ribbonWeight = ribbonEnter * centerReveal * ribbonMask;

        float ringDistance = length((uv - center) / vec2(0.92, 0.55));
        float ring = exp(-pow((ringDistance - mix(0.13, 0.58, p)) * 13.0, 2.0)) * energy;
        float seam = exp(-pow((uv.y - (0.5 + sin(uv.x * 9.0 + p * 5.0) * 0.025)) * 34.0, 2.0));
        seam *= energy * (1.0 - smoothstep(0.18, 0.62, abs(uv.x - 0.5)));

        vec3 mixedObject = (orb * orbWeight + ribbon * ribbonWeight) / max(orbWeight + ribbonWeight, 0.001);
        vec3 refracted = mix(orb, ribbon, 0.52 + ripple * 0.06);
        mixedObject = mix(mixedObject, refracted, energy * 0.1);

        vec3 electricBlue = vec3(0.08, 0.42, 1.0);
        vec3 iceBlue = vec3(0.54, 0.86, 1.0);
        vec3 glow = electricBlue * ring * 0.74 + iceBlue * seam * 0.18;

        float alpha = max(orbWeight, ribbonWeight);
        alpha = max(alpha, ring * 0.58 + seam * 0.3);
        alpha = clamp(alpha, 0.0, 1.0);

        vec3 color = mixedObject + glow;
        color = pow(max(color, 0.0), vec3(0.92));

        gl_FragColor = vec4(color, alpha);
      }
    `;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);

      if (!shader) {
        throw new Error("Unable to create shader.");
      }

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader) || "Unknown shader error.";
        gl.deleteShader(shader);
        throw new Error(error);
      }

      return shader;
    };

    const createProgram = () => {
      const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = compileShader(
        gl.FRAGMENT_SHADER,
        fragmentShaderSource,
      );
      const program = gl.createProgram();

      if (!program) {
        throw new Error("Unable to create shader program.");
      }

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const error = gl.getProgramInfoLog(program) || "Unknown program error.";
        gl.deleteProgram(program);
        throw new Error(error);
      }

      return program;
    };

    const loadTexture = (src: string) =>
      new Promise<WebGLTexture>((resolve, reject) => {
        const image = new Image();

        image.onload = () => {
          if (disposed) {
            return;
          }

          const texture = gl.createTexture();

          if (!texture) {
            reject(new Error("Unable to create texture."));
            return;
          }

          textures.push(texture);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image,
          );

          resolve(texture);
        };

        image.onerror = () => reject(new Error(`Unable to load ${src}`));
        image.decoding = "async";
        image.src = src;
      });

    try {
      const program = createProgram();
      const positionLocation = gl.getAttribLocation(program, "a_position");
      const progressLocation = gl.getUniformLocation(program, "u_progress");
      const orbLocation = gl.getUniformLocation(program, "u_orb");
      const ribbonLocation = gl.getUniformLocation(program, "u_ribbon");
      const positionBuffer = gl.createBuffer();

      if (!positionBuffer || !progressLocation || !orbLocation || !ribbonLocation) {
        throw new Error("Unable to prepare morph shader.");
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);

      Promise.all([loadTexture(orbSrc), loadTexture(ribbonSrc)])
        .then(([orbTexture, ribbonTexture]) => {
          if (disposed) {
            return;
          }

          const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const width = Math.max(Math.round(rect.width * dpr), 1);
            const height = Math.max(Math.round(rect.height * dpr), 1);

            if (canvas.width !== width || canvas.height !== height) {
              canvas.width = width;
              canvas.height = height;
              gl.viewport(0, 0, width, height);
            }
          };

          const render = (currentProgress: number) => {
            if (disposed) {
              return;
            }

            if (frame) {
              window.cancelAnimationFrame(frame);
            }

            frame = window.requestAnimationFrame(() => {
              resize();
              gl.clear(gl.COLOR_BUFFER_BIT);
              gl.useProgram(program);
              gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
              gl.enableVertexAttribArray(positionLocation);
              gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

              gl.activeTexture(gl.TEXTURE0);
              gl.bindTexture(gl.TEXTURE_2D, orbTexture);
              gl.uniform1i(orbLocation, 0);

              gl.activeTexture(gl.TEXTURE1);
              gl.bindTexture(gl.TEXTURE_2D, ribbonTexture);
              gl.uniform1i(ribbonLocation, 1);

              gl.uniform1f(progressLocation, currentProgress);
              gl.drawArrays(gl.TRIANGLES, 0, 6);
              frame = 0;
            });
          };

          const handleResize = () => render(latestProgressRef.current);

          removeResizeListener = () => {
            window.removeEventListener("resize", handleResize);
          };

          rendererRef.current = {
            render,
            destroy: () => {
              removeResizeListener?.();

              if (frame) {
                window.cancelAnimationFrame(frame);
              }

              gl.deleteProgram(program);
              gl.deleteBuffer(positionBuffer);
              textures.forEach((texture) => gl.deleteTexture(texture));
            },
          };

          window.addEventListener("resize", handleResize);
          setReady(true);
          render(latestProgressRef.current);
        })
        .catch(() => setReady(false));
    } catch {
      setReady(false);
    }

    return () => {
      disposed = true;
      rendererRef.current?.destroy();
      rendererRef.current = null;
    };
  }, [canvasRef, orbSrc, ribbonSrc]);

  return ready;
}

export function LumenMorphHero({
  orbSrc = IMAGE_ASSETS.orb,
  ribbonSrc = IMAGE_ASSETS.ribbon,
  ctaHref = "#audit",
  ctaLabel = "Talk on WhatsApp",
  secondaryCtaHref,
  secondaryCtaLabel,
  headline = "We build digital presence that feels premium.",
  subheadline = "Websites, social content and visual systems for brands that want the next level.",
}: LumenMorphHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { progress, staticMode } = useScrollMorphProgress(sectionRef);
  const canvasReady = usePremiumMorphCanvas(
    canvasRef,
    orbSrc,
    ribbonSrc,
    progress,
  );

  const orbExit = smoothstep(0.08, 0.82, progress);
  const ribbonEnter = smoothstep(0.18, 0.94, progress);
  const morphPulse = Math.sin(progress * Math.PI);

  const orbOpacity = mix(1, 0.04, orbExit);
  const ribbonOpacity = mix(0.02, 1, ribbonEnter);

  const stageStyle = {
    "--lumen-progress": progress,
    "--lumen-pulse": morphPulse,
    "--orb-opacity": orbOpacity,
    "--ribbon-opacity": ribbonOpacity,
  } as CSSProperties;

  const orbMask = `radial-gradient(ellipse ${mix(48, 42, orbExit)}% ${mix(
    45,
    38,
    orbExit,
  )}% at ${mix(50, 56, progress)}% ${mix(
    48,
    44,
    progress,
  )}%, #000 0%, #000 ${mix(72, 54, orbExit)}%, transparent 100%)`;

  const ribbonMask = `radial-gradient(ellipse ${mix(
    30,
    54,
    ribbonEnter,
  )}% ${mix(28, 45, ribbonEnter)}% at ${mix(
    54,
    50,
    ribbonEnter,
  )}% ${mix(52, 49, ribbonEnter)}%, #000 0%, #000 ${mix(
    42,
    78,
    ribbonEnter,
  )}%, transparent 100%)`;

  const veilMask = `linear-gradient(${mix(
    118,
    94,
    ribbonEnter,
  )}deg, transparent 0%, transparent ${mix(30, 4, ribbonEnter)}%, #000 ${mix(
    48,
    18,
    ribbonEnter,
  )}%, #000 88%, transparent 100%)`;

  const imageGlow = `drop-shadow(0 0 ${mix(
    22,
    34,
    morphPulse,
  )}px rgba(31, 109, 255, ${mix(0.16, 0.24, morphPulse)}))`;

  const orbStyle: CSSProperties = {
    opacity: orbOpacity,
    transform: `translate3d(-50%, -50%, 0) scale(${mix(
      1,
      1.2,
      orbExit,
    )}, ${mix(1, 0.56, orbExit)}) rotate(${mix(
      0,
      -8,
      orbExit,
    )}deg)`,
    filter: `blur(${mix(0, 5, orbExit)}px) saturate(${mix(
      1.08,
      1.34,
      morphPulse,
    )}) brightness(${mix(1.04, 0.9, orbExit)}) ${imageGlow}`,
    WebkitMaskImage: orbMask,
    maskImage: orbMask,
  };

  const ribbonStyle: CSSProperties = {
    opacity: ribbonOpacity,
    transform: `translate3d(-50%, -50%, 0) scale(${mix(
      0.42,
      1,
      ribbonEnter,
    )}, ${mix(0.36, 1, ribbonEnter)}) rotate(${mix(
      11,
      0,
      ribbonEnter,
    )}deg)`,
    filter: `blur(${mix(5, 0, ribbonEnter)}px) saturate(${mix(
      1.36,
      1.14,
      ribbonEnter,
    )}) brightness(${mix(0.84, 1.08, ribbonEnter)}) ${imageGlow}`,
    WebkitMaskImage: ribbonMask,
    maskImage: ribbonMask,
  };

  const veilStyle: CSSProperties = {
    opacity: morphPulse * 0.58,
    transform: `translate3d(-50%, -50%, 0) scale(${mix(
      0.72,
      1.24,
      morphPulse,
    )}) rotate(${mix(
      -18,
      10,
      progress,
    )}deg)`,
    WebkitMaskImage: veilMask,
    maskImage: veilMask,
  };

  const energyRingStyle: CSSProperties = {
    opacity: morphPulse * 0.72,
    transform: `translate3d(-50%, -50%, 0) scale(${mix(
      0.62,
      1.12,
      morphPulse,
    )}) rotate(${mix(-12, 12, progress)}deg)`,
  };

  const energyCoreStyle: CSSProperties = {
    opacity: morphPulse * 0.54,
    transform: `translate3d(-50%, -50%, 0) scale(${mix(
      0.54,
      1.04,
      ribbonEnter,
    )}, ${mix(0.18, 0.62, morphPulse)}) rotate(${mix(
      -6,
      4,
      progress,
    )}deg)`,
  };

  return (
    <section
      ref={sectionRef}
      className={`lumen-hero${staticMode ? " lumen-hero--static" : ""}`}
      style={stageStyle}
    >
      <div className="lumen-hero__sticky">
        <div className="lumen-hero__stage" aria-hidden="true">
          <div
            className={`lumen-hero__object-field${
              canvasReady ? " lumen-hero__object-field--canvas-ready" : ""
            }`}
          >
            <div className="lumen-hero__aura lumen-hero__aura--orb" />
            <div className="lumen-hero__aura lumen-hero__aura--ribbon" />
            <div
              className="lumen-hero__energy-ring"
              style={energyRingStyle}
            />
            <div
              className="lumen-hero__energy-core"
              style={energyCoreStyle}
            />
            <div className="lumen-hero__morph-veil" style={veilStyle} />
            <canvas ref={canvasRef} className="lumen-hero__morph-canvas" />

            <img
              className="lumen-hero__object lumen-hero__object--orb"
              src={orbSrc}
              alt=""
              decoding="async"
              fetchPriority="high"
              style={orbStyle}
            />
            <img
              className="lumen-hero__object lumen-hero__object--ribbon"
              src={ribbonSrc}
              alt=""
              decoding="async"
              fetchPriority="high"
              style={ribbonStyle}
            />
          </div>
        </div>

        <div className="lumen-hero__copy">
          <h1>{headline}</h1>
          <p className="lumen-hero__subheadline">{subheadline}</p>
          <div className="lumen-hero__actions">
            <a className="lumen-hero__cta" href={ctaHref}>
              {ctaLabel}
            </a>
            {secondaryCtaHref && secondaryCtaLabel ? (
              <a className="lumen-hero__secondary-cta" href={secondaryCtaHref}>
                {secondaryCtaLabel}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

