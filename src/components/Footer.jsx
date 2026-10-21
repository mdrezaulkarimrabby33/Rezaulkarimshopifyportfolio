import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";

/* =========================================
   CONTENT — এখানে পরিবর্তন করো
========================================= */

// LOGO SETTINGS — font ও automatic animation speed এখান থেকে বদলাও।
const logoSettings = {
  fontUrl: "https://fonts.gstatic.com/s/geist/v5/gyBhhwUxId8gMGYQMKR3pzfaWI_RruM4mJPby1QNtA.woff2",
  fontFamily: "FooterGeist",
  fontWeight: 500,
  cycleSeconds: 9, // কমালে দ্রুত, বাড়ালে ধীরে animate করবে।
};

const footerContent = {
  heading: "Have a project in mind?",
  email: "maktech@gmail.com",
  brand: "REZAUL MAKTECH",
  copyrightName: "Rabby Maktech",
  credit: "Crafted by Rabby Maktech",
};

const menuLinks = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { label: "LinkedIn", short: "in", href: "" },
  { label: "GitHub", short: "GH", href: "" },
  { label: "Instagram", short: "IG", href: "" },
  { label: "Facebook", short: "f", href: "" },
];

const legalLinks = [
  // { label: "Privacy Policy", href: "/privacy-policy" },
  // { label: "Terms of Service", href: "/terms" },
];

const ease = [0.22, 1, 0.36, 1];

/* =========================================
   ROLLING LINKS
========================================= */

function RollingLink({ label, href, large = false }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      aria-label={label}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      className={`inline-flex min-h-11 items-center ${large ? "text-white font-semibold" : "text-[#AAA69F]"} outline-none transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500`}
    >
      <span
        aria-hidden="true"
        className={`flex overflow-hidden font-mono uppercase ${large ? "text-[18px] leading-7 sm:text-[20px]" : "text-[10px] leading-5"}`}
      >
        {Array.from(label).map((character, index) => (
          <span key={index} className="relative block">
            <motion.span
              variants={{
                rest: { y: "0%" },
                hover: {
                  y: reduceMotion ? "0%" : "-100%",
                },
              }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : index * 0.018,
                ease,
              }}
              className="relative block whitespace-pre"
            >
              {character}

              <span className="absolute left-0 top-full">
                {character}
              </span>
            </motion.span>
          </span>
        ))}
      </span>
    </motion.a>
  );
}

/* =========================================
   GLOSSY REFLECTION WORDMARK
========================================= */

// Automatic glossy lighting — mouse/hover ছাড়াই চলতে থাকবে।
function FooterWordmark() {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const vertexSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0., 1.);
      }
    `;
    const fragmentSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_mask;
      uniform vec2 u_texel;
      uniform vec2 u_mouse;
      uniform float u_aspect;
      float heightAt(vec2 uv) { return texture2D(u_mask, uv).g; }
      void main() {
        vec4 mask = texture2D(u_mask, v_uv);
        float alpha = mask.r;
        if (alpha < 0.01) { gl_FragColor = vec4(0.); return; }

        // Rounded bevel generated from the blurred letter silhouette.
        float h = mask.g;
        float dx = heightAt(v_uv + vec2(u_texel.x * 2.,0.))
                 - heightAt(v_uv - vec2(u_texel.x * 2.,0.));
        float dy = heightAt(v_uv + vec2(0.,u_texel.y * 2.))
                 - heightAt(v_uv - vec2(0.,u_texel.y * 2.));
        vec3 normal = normalize(vec3(-dx * 14., -dy * 14., 1.));
        vec2 p = vec2(v_uv.x * u_aspect, v_uv.y);
        vec2 mouse = vec2(u_mouse.x * u_aspect, u_mouse.y);
        vec2 delta = mouse - p;
        vec3 light = normalize(vec3(delta, 0.42));
        vec3 halfway = normalize(light + vec3(0., 0., 1.));
        float distanceToLight = length(delta);
        float proximity = exp(-distanceToLight * distanceToLight * 0.10);
        float diffuse = max(dot(normal, light), 0.);
        float specular = pow(max(dot(normal, halfway), 0.), 22.);
        float bevel = 1. - smoothstep(0.55, 0.99, h);
        float rim = pow(1. - normal.z, 0.65);

        // Broad reflection across several letters, not a small round spotlight.
        float sweep = (v_uv.x - u_mouse.x) * 2.4
                    + (v_uv.y - u_mouse.y) * 0.45;
        float band = exp(-pow(sweep + 0.35, 2.) * 1.3);
        float reflection = clamp(band * proximity, 0., 1.);
        vec3 darkRed = vec3(0.045, 0.001, 0.005);
        vec3 red = vec3(1., 0.015, 0.10);
        vec3 pearl = vec3(1., 0.88, 0.86);
        vec3 color = mix(darkRed, red, smoothstep(0.08, 0.65, reflection));
        color = mix(color, pearl, smoothstep(0.30, 0.92, reflection));
        // The bevel keeps strong red outlines with moving white edge highlights.
        color = mix(color, red * (0.28 + diffuse * 0.72), bevel * 0.7);
        color += red * rim * proximity * 0.6;
        color += vec3(1.,0.72,0.72) * specular * bevel * proximity * 1.25;
        color += red * bevel * 0.08;
        gl_FragColor = vec4(clamp(color,0.,1.),alpha);
      }
    `;

    function compile(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return;
    }
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1,
    ]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const uniforms = Object.fromEntries(
      ["mask", "texel", "mouse", "aspect"].map(name =>
        [name, gl.getUniformLocation(program, `u_${name}`)]
      )
    );
    gl.uniform1i(uniforms.mask, 0);

    let disposed = false;
    let loaded = false;
    let visible = true;
    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;
    let revealed = false;

    function schedule() {
      if (!disposed && loaded && visible && !document.hidden && !frame) {
        frame = requestAnimationFrame(draw);
      }
    }
    function draw(time) {
      frame = 0;
      if (disposed || !loaded || !visible || document.hidden || gl.isContextLost()) return;
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.06) : 0.016;
      lastTime = time;
      // Continuous closed orbit: no hover listener or pointer position.
      if (!reduceMotion) elapsed += dt;
      const phase = elapsed * Math.PI * 2 / Math.max(logoSettings.cycleSeconds, 1);
      const lightX = reduceMotion ? 0.6 : 0.5 + Math.sin(phase) * 0.95;
      const lightY = reduceMotion ? 0.65 : 0.5 + Math.cos(phase) * 0.7;
      gl.useProgram(program);
      gl.uniform2f(uniforms.mouse, lightX, lightY);
      gl.uniform1f(uniforms.aspect, canvas.width / canvas.height);
      gl.clearColor(0,0,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!revealed) {
        revealed = true;
        setReady(true);
      }
      // Request the next frame while visible, even with a stationary mouse.
      if (!reduceMotion) schedule();
    }
    function resize() {
      const bounds = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(bounds.width * dpr));
      canvas.height = Math.max(1, Math.round(bounds.height * dpr));
      gl.viewport(0,0,canvas.width,canvas.height);
      schedule();
    }
    function visibilityChange() { lastTime = 0; schedule(); }
    function contextLost() { loaded = false; setReady(false); }

    async function createMask() {
      // Wait for the SAME font used by the rest of the website.
      try {
        const font = new FontFace(
          logoSettings.fontFamily,
          `url("${logoSettings.fontUrl}")`,
          { weight: String(logoSettings.fontWeight), style: "normal" }
        );
        await font.load();
        document.fonts.add(font);
        await document.fonts.load(`${logoSettings.fontWeight} 360px "${logoSettings.fontFamily}"`);
      } catch {
        // Keep a readable sans-serif fallback if the font request fails.
      }
      if (disposed) return;
      const width = 1600;
      const height = 430;
      const sharp = document.createElement("canvas");
      sharp.width = width; sharp.height = height;
      const ctx = sharp.getContext("2d");
      if (!ctx) return;
      ctx.font = `${logoSettings.fontWeight} 360px "${logoSettings.fontFamily}", Arial, sans-serif`;
      const text = footerContent.brand.toUpperCase();
      const metrics = ctx.measureText(text);
      const left = metrics.actualBoundingBoxLeft || 0;
      const right = metrics.actualBoundingBoxRight || metrics.width;
      const ascent = metrics.actualBoundingBoxAscent || 260;
      const descent = metrics.actualBoundingBoxDescent || 5;
      ctx.save();
      // Uniform scale keeps the original font proportions intact.
      const glyphWidth = Math.max(left + right, 1);
      const glyphHeight = Math.max(ascent + descent, 1);
      const fit = Math.min((width - 44) / glyphWidth, (height - 48) / glyphHeight);
      ctx.translate((width - glyphWidth * fit) / 2, (height - glyphHeight * fit) / 2);
      ctx.scale(fit, fit);
      ctx.fillStyle = "white";
      ctx.fillText(text, left, ascent);
      ctx.restore();
      const blurred = document.createElement("canvas");
      blurred.width = width; blurred.height = height;
      const blurCtx = blurred.getContext("2d");
      if (!blurCtx) return;
      blurCtx.filter = "blur(8px)";
      blurCtx.drawImage(sharp,0,0);
      const crispPixels = ctx.getImageData(0,0,width,height);
      const blurPixels = blurCtx.getImageData(0,0,width,height);
      // R = crisp coverage; G = rounded height field.
      for (let i=0;i<crispPixels.data.length;i+=4) {
        crispPixels.data[i] = crispPixels.data[i+3];
        crispPixels.data[i+1] = blurPixels.data[i+3];
        crispPixels.data[i+2] = 0;
        crispPixels.data[i+3] = 255;
      }
      ctx.putImageData(crispPixels,0,0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,sharp);
      gl.uniform2f(uniforms.texel,1/width,1/height);
      loaded = true;
      resize();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      lastTime = 0;
      schedule();
    });
    observer.observe(host);
    document.addEventListener("visibilitychange",visibilityChange);
    canvas.addEventListener("webglcontextlost",contextLost);
    createMask();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange",visibilityChange);
      canvas.removeEventListener("webglcontextlost",contextLost);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [reduceMotion]);

  return (
    <div className="relative mt-8 overflow-hidden border-t border-white/15 pt-5 sm:mt-10 sm:pt-8">
      <div ref={hostRef} className="relative aspect-[1600/430] w-full" role="img" aria-label={footerContent.brand}>
        <svg aria-hidden="true" viewBox="0 0 1200 320" className="absolute inset-0 h-full w-full" style={{visibility: ready ? "hidden" : "visible"}}>
          <text x="15" y="270" textLength="1170" lengthAdjust="spacingAndGlyphs" fontFamily="FooterGeist, Arial, sans-serif" fontSize="300" fontWeight="500" fill="#EF4444">{footerContent.brand}</text>
        </svg>
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      </div>
    </div>
  );
}


/* =========================================
   FOOTER
========================================= */

/* =========================================
   RED LIGHT RAYS — FRAMER MOTION
========================================= */

// Existing charcoal stays visible beneath soft, slowly sweeping red rays.
function FooterRedRays() {
  const reduceMotion = useReducedMotion();
  const layerRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    let inView = false;
    const update = () => setActive(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(layer);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  const animateRays = active && !reduceMotion;
  const rays = [
    { left: "-52%", top: "-105%", angle: -24, duration: 16, strength: 0.56 },
    { left: "0%", top: "-115%", angle: 18, duration: 21, strength: 0.4 },
    { left: "-25%", top: "-70%", angle: -8, duration: 25, strength: 0.28 },
  ];

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0, contain: "paint" }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 15% 15%, rgba(150, 12, 25, 0.27), transparent 65%)" }}
      />
      {rays.map((ray, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: ray.left,
            top: ray.top,
            width: "180%",
            height: "230%",
            transformOrigin: "50% 0%",
            background: "conic-gradient(from 155deg at 50% 0%, transparent 0deg, rgba(239, 30, 50, 0.03) 8deg, rgba(239, 30, 50, 0.48) 15deg, rgba(255, 65, 75, 0.16) 20deg, transparent 28deg, transparent 35deg, rgba(220, 18, 35, 0.32) 40deg, transparent 48deg, transparent 360deg)",
            filter: "blur(12px)",
          }}
          initial={false}
          animate={animateRays ? {
            rotate: [ray.angle, ray.angle + 18, ray.angle - 8, ray.angle],
            x: ["-3%", "4%", "0%", "-3%"],
            opacity: [ray.strength * 0.65, ray.strength, ray.strength * 0.8, ray.strength * 0.65],
          } : { rotate: ray.angle, x: "0%", opacity: ray.strength * 0.7 }}
          transition={animateRays ? {
            duration: ray.duration,
            ease: "easeInOut",
            repeat: Infinity,
          } : { duration: 0 }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(29,27,24,0.12), rgba(29,27,24,0.2) 55%, rgba(29,27,24,0.7))" }}
      />
    </div>
  );
}

/* Cursor spotlight reveals a background of code characters. */
function FooterAlphabetHover({ footerRef }) {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const footer = footerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!footer || !canvas || !ctx) return;

    const alphabet = "{% comment %}, shop.name ,% form 'product,assign %, % section 'featured-collection' %} ";
    const pointer = { x: 0, y: 0, inside: false };
    let width = 0, height = 0, frame = 0, lastPaint = 0;
    let opacity = 0, previousTime = 0;
    let cells = [];

    function paint(time) {
      frame = 0;
      if (document.hidden) return;
      const dt = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      const target = pointer.inside ? 1 : 0;
      opacity = reduceMotion ? target : opacity + (target - opacity) * (1 - Math.exp(-dt / 140));
      ctx.clearRect(0, 0, width, height);
      if (opacity > 0.005) {
        const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 240);
        glow.addColorStop(0, `rgba(239,35,55,${0.13 * opacity})`);
        glow.addColorStop(1, "rgba(239,35,55,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
        ctx.font = "13px ui-monospace, SFMono-Regular, Consolas, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const tick = reduceMotion ? 0 : Math.floor(time / 160);
        cells.forEach((cell, index) => {
          const distance = Math.hypot(cell.x - pointer.x, cell.y - pointer.y);
          const light = Math.max(0, 1 - distance / 240);
          if (!light) return;
          const alpha = light * light * opacity * 0.85;
          // A few characters change each tick, rather than flashing the whole grid.
          const shift = (index % 7 === tick % 7) ? tick : Math.floor(tick / 7);
          ctx.fillStyle = `rgba(255,100,115,${alpha})`;
          ctx.fillText(alphabet[(cell.seed + shift) % alphabet.length], cell.x, cell.y);
        });
      }
      const fading = Math.abs(target - opacity) > 0.005;
      if ((pointer.inside && !reduceMotion) || fading) schedule();
      else if (!pointer.inside) ctx.clearRect(0, 0, width, height);
    }
    function schedule() {
      if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
    }
    function tick(time) {
      // Cap decorative canvas updates at about 30fps.
      if (time - lastPaint < 32) { frame = requestAnimationFrame(tick); return; }
      lastPaint = time;
      paint(time);
    }
    function resize() {
      const bounds = footer.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cells = [];
      for (let y = 18, row = 0; y < height; y += 30, row++) {
        for (let x = 18, col = 0; x < width; x += 28, col++) {
          cells.push({ x, y, seed: (row * 17 + col * 31) % alphabet.length });
        }
      }
      schedule();
    }
    function move(event) {
      if (event.pointerType === "touch") return;
      const bounds = footer.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.inside = true;
      schedule();
    }
    function leave() { pointer.inside = false; schedule(); }
    function visibility() {
      previousTime = 0;
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else { pointer.inside = false; schedule(); }
    }
    const observer = new ResizeObserver(resize);
    observer.observe(footer);
    footer.addEventListener("pointermove", move, { passive: true });
    footer.addEventListener("pointerleave", leave);
    footer.addEventListener("pointercancel", leave);
    document.addEventListener("visibilitychange", visibility);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      footer.removeEventListener("pointermove", move);
      footer.removeEventListener("pointerleave", leave);
      footer.removeEventListener("pointercancel", leave);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [footerRef, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 1 }}
    />
  );
}

export default function Footer() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const [fitsViewport, setFitsViewport] = useState(false);

  useEffect(() => {
    const footer = ref.current;
    if (!footer) return;

    function measure() {
      setFitsViewport(
        footer.getBoundingClientRect().height <= window.innerHeight
      );
    }

    const observer = new ResizeObserver(measure);
    observer.observe(footer);

    window.addEventListener("resize", measure);
    measure();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <footer
      ref={ref}
      id="contact"
      aria-labelledby="footer-heading"
      style={{
        position:
          fitsViewport && !reduceMotion ? "sticky" : "relative",
        bottom: fitsViewport && !reduceMotion ? 0 : undefined,
      }}
      className="z-0 isolate bg-[#1D1B18] px-5 pb-3 pt-14 text-[#F2EFE9] sm:px-8 sm:pb-5 sm:pt-20 lg:px-12 lg:pt-24"
    >
      <FooterRedRays />
      <FooterAlphabetHover footerRef={ref} />
      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        {/* Heading */}
        <h2
          id="footer-heading"
          className="font-['FooterGeist',Arial,sans-serif] text-[clamp(2rem,4.5vw,4.5rem)] font-medium uppercase leading-[1.12] tracking-tight text-[#AAA69F]"
        >
          {footerContent.heading}
        </h2>

        {/* Email */}
        <a
          href={`mailto:${footerContent.email}`}
          className="group mt-3 inline-flex max-w-full items-start gap-3 text-[#F2EFE9] outline-none transition-colors duration-300 hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500 sm:gap-5"
        >
          <span className="min-w-0 break-all font-['FooterGeist',Arial,sans-serif] text-[clamp(1.6rem,4.5vw,4.5rem)] font-medium leading-[1.2] tracking-tight">
            {footerContent.email}
          </span>

          <span
            aria-hidden="true"
            className="shrink-0 text-[clamp(1.8rem,4vw,4rem)] leading-none transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transform-none"
          >
            ↗
          </span>
        </a>

        {/* Navigation */}
        <div className="mt-9 flex flex-col justify-between gap-3 sm:mt-12 lg:flex-row lg:gap-8">
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 sm:gap-x-7">
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <RollingLink {...link} large />
                </li>
              ))}
            </ul>
          </nav>

          {legalLinks.length > 0 && (
            <nav aria-label="Legal">
              <ul className="flex flex-wrap gap-x-6">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <RollingLink {...link} />
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {/* Social links and credits */}
        <div className="mt-2 flex flex-col justify-between gap-5 sm:mt-3 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-3">
            {socialLinks
              .filter((social) => social.href)
              .map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={
                    reduceMotion ? {} : { y: -3 }
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 font-mono text-xs font-semibold text-[#AAA69F] transition-colors hover:border-red-500 hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
                >
                  {social.short}
                </motion.a>
              ))}
          </div>

          <div className="flex flex-col gap-3 font-mono text-[9px] uppercase leading-5 text-[#AAA69F] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7">
            <p>
              Copyright © {new Date().getFullYear()}{" "}
              {footerContent.copyrightName}
            </p>

            <p>{footerContent.credit}</p>

            <RollingLink
              label="Back to top ↑"
              href="#home"
            />
          </div>
        </div>

        <FooterWordmark />
      </div>
    </footer>
  );
}