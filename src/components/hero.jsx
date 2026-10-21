"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const portraitSrc = "/img/imagehero.png";

function StarIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="currentColor"
      aria-hidden="true"
      className="h-full w-full"
    >
      <path d="M20 0C22.5 12 28 17.5 40 20C28 22.5 22.5 28 20 40C17.5 28 12 22.5 0 20C12 17.5 17.5 12 20 0Z" />
    </svg>
  );
}

function Portrait() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spring = {
    stiffness: 80,
    damping: 25,
  };

  const x = useSpring(mouseX, spring);
  const pointerY = useSpring(mouseY, spring);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scrollY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 45]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 0.97]
  );

  const y = useTransform(
    [pointerY, scrollY],
    ([pointer, scroll]) => pointer + scroll
  );

  function handleMove(event) {
    if (reduceMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();

    mouseX.set(
      ((event.clientX - bounds.left) / bounds.width - 0.5) * 14
    );

    mouseY.set(
      ((event.clientY - bounds.top) / bounds.height - 0.5) * 14
    );
  }

  function resetPosition() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={resetPosition}
      onPointerCancel={resetPosition}
      className="relative pb-12 md:border-l md:border-[#e5e0d8] md:px-6 md:pt-7"
    >
      <motion.div
        style={reduceMotion ? {} : { x, y, scale }}
        className="mx-auto w-full max-w-[500px]"
      >
        {/* Original top label */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 1,
            delay: reduceMotion ? 0 : 2.3,
          }}
          className="mb-7 flex justify-between font-mono text-[10px] text-[#756f68]"
        >
          <span>[01]</span>
          <span>PORTRAIT</span>
        </motion.div>

        <div className="relative">
          {/* Animated outline behind portrait */}
          <motion.div
            aria-hidden="true"
            initial={false}
            animate={
              reduceMotion
                ? { rotate: -3, x: 8, y: 8 }
                : {
                    rotate: [-3, -1.5, -3],
                    x: [8, 13, 8],
                    y: [8, 3, 8],
                  }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            className="pointer-events-none absolute inset-0 border border-red-500/40"
          />

          {/* Original image reveal */}
          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    clipPath: "inset(0% 0% 100% 0%)",
                    scale: 1.08,
                  }
            }
            animate={{
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
            }}
            transition={{
              duration: reduceMotion ? 0 : 1.7,
              delay: reduceMotion ? 0 : 1.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative"
          >
            <motion.div
              data-cursor="image"
              initial="rest"
              animate="rest"
              whileHover="hover"
              variants={{
                rest: { scale: 1 },
                hover: { scale: reduceMotion ? 1 : 1.025 },
              }}
              transition={{
                duration: reduceMotion ? 0 : 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative aspect-[0.755/1] overflow-hidden border border-[#cac4ba] bg-[#ded9cd]"
            >
              <img
                src={portraitSrc}
                alt="Rabby Maktech"
                draggable={false}
                className="block h-full w-full object-cover"
              />

              {/* Original hover overlay */}
              <motion.div
                aria-hidden="true"
                variants={{
                  rest: { opacity: 0 },
                  hover: { opacity: 0.025 },
                }}
                transition={{
                  duration: reduceMotion ? 0 : 0.5,
                }}
                className="pointer-events-none absolute inset-0 bg-[#201e1b]"
              />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-3 h-[15px] w-[15px] border-l border-t border-[#81796e]"
              />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3 right-3 h-[15px] w-[15px] border-b border-r border-[#81796e]"
              />

              {/* Original hover badge */}
              <motion.span
                aria-hidden="true"
                variants={{
                  rest: {
                    opacity: 0,
                    y: reduceMotion ? 0 : 10,
                  },
                  hover: { opacity: 1, y: 0 },
                }}
                transition={{
                  duration: reduceMotion ? 0 : 0.3,
                }}
                className="pointer-events-none absolute bottom-[25px] right-[25px] z-10 hidden h-[74px] w-[74px] items-center justify-center gap-1 rounded-full border border-white bg-black/20 font-mono text-[10px] text-white md:flex"
              >
                HELLO
                <span className="text-lg">↗</span>
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Top-right rotating icon */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-3 -top-4 z-20 h-12 w-12 sm:-right-5 sm:-top-5 sm:h-16 sm:w-16"
          >
            <motion.div
              animate={{ rotate: reduceMotion ? 0 : 360 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 24,
                      repeat: Infinity,
                      ease: "linear",
                    }
              }
              className="h-full w-full text-red-500"
            >
              <StarIcon />
            </motion.div>
          </div>
        </div>

        {/* Original bottom label */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 1,
            delay: reduceMotion ? 0 : 2.3,
          }}
          className="mt-1 flex justify-between font-mono text-[10px] text-[#756f68]"
        >
          <span>RABBY MAKTECH</span>
          <span>© {new Date().getFullYear()}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

function HeroBackground() {
  const pointer = useRef({ x: -1000, y: -1000, active: false });
  const reduced = useReducedMotion();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let width = 0, height = 0, columns = 0, points = [];
    let frame = 0, previous = 0;
    const spacing = 42;

    function resize() {
      ({ width, height } = canvas.getBoundingClientRect());
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      points = Array.from({ length: columns * rows }, (_, index) => {
        const x = (index % columns) * spacing;
        const y = Math.floor(index / columns) * spacing;
        return { x, y, homeX: x, homeY: y, vx: 0, vy: 0 };
      });
      requestDraw();
    }

    function requestDraw() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function draw(time) {
      frame = 0;
      const step = previous ? Math.min((time - previous) / 16.667, 2) : 1;
      previous = time;
      const mouse = pointer.current;
      let moving = false;
      context.clearRect(0, 0, width, height);
      for (const p of points) {
        let tx = p.homeX, ty = p.homeY;
        if (mouse.active && !reduced) {
          const dx = p.homeX - mouse.x, dy = p.homeY - mouse.y;
          const distance = Math.hypot(dx, dy);
          const influence = Math.max(0, 1 - distance / 240);
          const force = influence * influence * 52;
          tx += (dx / (distance || 1)) * force;
          ty += (dy / (distance || 1)) * force;
        }
        p.vx = (p.vx + (tx - p.x) * 0.055 * step) * Math.pow(0.77, step);
        p.vy = (p.vy + (ty - p.y) * 0.055 * step) * Math.pow(0.77, step);
        p.x += p.vx * step;
        p.y += p.vy * step;
        if (Math.abs(tx - p.x) + Math.abs(ty - p.y) + Math.abs(p.vx) + Math.abs(p.vy) > 0.08) moving = true;
      }
      context.lineWidth = 0.65;
      function edge(a, b) {
        const distance = Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y);
        const glow = mouse.active && !reduced ? Math.max(0, 1 - distance / 280) : 0;
        // Warm neutral lines at rest, muted burgundy/red around the pointer.
        const red = Math.round(117 + glow * 70);
        const green = Math.round(111 - glow * 57);
        const blue = Math.round(104 - glow * 38);
        context.strokeStyle = `rgba(${red},${green},${blue},${0.045 + glow * 0.19})`;
        context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
      }
      points.forEach((p, index) => {
        const col = index % columns;
        const right = points[index + 1], below = points[index + columns];
        if (col < columns - 1 && right) edge(p, right);
        if (below) edge(p, below);
        if (col < columns - 1 && points[index + columns + 1]) edge(p, points[index + columns + 1]);
        if (col > 0 && points[index + columns - 1]) edge(p, points[index + columns - 1]);
      });
      if (moving) requestDraw();
      else previous = 0;
    }
    function wake(event) {
      if (reduced || event.pointerType !== "mouse") return;
      const bounds = canvas.getBoundingClientRect();
      pointer.current = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
        active: true,
      };
      requestDraw();
    }
    function reset() {
      pointer.current.active = false;
      requestDraw();
    }
    const host = canvas.parentElement;
    host.addEventListener("pointermove", wake);
    host.addEventListener("pointerleave", reset);
    host.addEventListener("pointercancel", reset);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", wake);
      host.removeEventListener("pointerleave", reset);
      host.removeEventListener("pointercancel", reset);
    };
  }, [pointer, reduced]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full" />;
}

function HoverWords() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const host = canvas.parentElement;
    const words = [
      "ACTIVATE", "STIMULATE", "INNOVATE", "RESONATE", "ILLUMINATE",
      "CAPTIVATE", "ELEVATE", "PARTICIPATE", "COLLABORATE", "ORCHESTRATE",
    ];

    // Reference behavior: one label, 0.08 interpolation each animation frame,
    // next word after 20 CSS px of smoothed movement; no floating/fading trail.
    const trailDelay = 0.3;
    const follow = Math.min(trailDelay * 1.5, 0.2) * 0.4;
    const overscan = 120;
    const target = { x: 0, y: 0 };
    const label = { x: 0, y: 0 };
    const lastChange = { x: 0, y: 0 };
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let width = 0, height = 0, dpr = 1;
    let wordIndex = 0, frame = 0, leaveTimer = null, active = false;

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const safari = /Safari/i.test(navigator.userAgent) &&
        !/Chrome|CriOS|Chromium|Edg/i.test(navigator.userAgent);
      dpr = Math.min(window.devicePixelRatio || 1, safari ? 1.5 : 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Resting color matches the hero's muted warm-gray labels.
      context.font = "600 13px monospace";
      context.textBaseline = "alphabetic";
      context.fillStyle = "#756f68";
      context.shadowColor = "transparent";
      context.shadowBlur = 0;
    }

    function draw() {
      frame = 0;
      context.clearRect(0, 0, width, height);
      if (!active) return;
      label.x += (target.x - label.x) * follow;
      label.y += (target.y - label.y) * follow;
      const dx = label.x - lastChange.x;
      const dy = label.y - lastChange.y;
      if (dx * dx + dy * dy > 20 * 20) {
        wordIndex = (wordIndex + 1) % words.length;
        lastChange.x = label.x;
        lastChange.y = label.y;
      }
      // While the pointer is active, use Tailwind red-500 for a crisp accent.
      context.globalAlpha = 1;
      context.fillStyle = "#ef4444";
      context.shadowColor = "rgba(239, 68, 68, 0.18)";
      context.shadowBlur = 5;
      // Reference uses a 12-device-pixel offset on an overscanned canvas.
      context.fillText(words[wordIndex], label.x - overscan + 12 / dpr, label.y - overscan);
      context.globalAlpha = 1;
      context.shadowBlur = 0;
      // Keep drawing while hovered, including when the pointer stops.
      frame = requestAnimationFrame(draw);
    }

    function enter(event) {
      if (event.pointerType !== "mouse" || !finePointer.matches) return;
      if (leaveTimer !== null) {
        clearTimeout(leaveTimer);
        leaveTimer = null;
      }
      active = true;
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function move(event) {
      if (event.pointerType !== "mouse" || !finePointer.matches) return;
      const bounds = canvas.getBoundingClientRect();
      target.x = event.clientX - bounds.left + overscan;
      target.y = event.clientY - bounds.top + overscan;
      enter(event);
    }

    function stop() {
      if (leaveTimer !== null) clearTimeout(leaveTimer);
      leaveTimer = null;
      active = false;
      cancelAnimationFrame(frame);
      frame = 0;
      context.clearRect(0, 0, width, height);
    }

    function leave() {
      if (leaveTimer !== null || !active) return;
      leaveTimer = setTimeout(stop, 150);
    }

    function visibility() {
      if (document.hidden) stop();
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointercancel", stop);
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      stop();
      observer.disconnect();
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointercancel", stop);
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full" />;
}

export default function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="home"
        className="relative isolate min-h-screen bg-[#f2efe9] px-6 pb-6 pt-36 text-[#201e1b] md:px-[6%]"
      >
        <HeroBackground />
        <HoverWords />
        <div className="relative z-10 mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[1.2fr_1fr] md:gap-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="pb-8 md:pb-20 md:pr-14"
          >
            <div className="mb-8 flex items-center gap-5 font-mono text-[10px] text-[#77716a]">
              <span>01 / HELLO, I'M</span>
              <span className="h-px w-12 bg-[#cec9c1]" />
            </div>

            <h1 className="font-display text-[clamp(72px,8.5vw,116px)] font-extrabold leading-[0.96] tracking-[-2px]">
              <span className="mb-4 block text-[0.65em]">
                HI, I'M
              </span>
              <span className="block">REZAUL KARIM</span>
              <span className="block">
               RABBY<span className="text-red-500">.</span>
              </span>
            </h1>

            <p className="font-display my-8 text-[28px] font-semibold leading-tight">
              SHOPIFY DEVELOPER FROM MAKTECH.
              <br />
              WORDPRESS DEVELOPER.
              <br />
              SEO SPECIALIST.
            </p>

            <p className="max-w-[350px] text-sm leading-7 text-[#756f68]">
              I build fast, thoughtful and high-performing
              websites for the modern web.
            </p>

            <div className="my-8 flex flex-wrap items-center gap-4 font-mono text-[9px]">
              <span>BASED IN BANGLADESH</span>
              <span className="text-lg text-red-500">✦</span>
              <span>WORKING WORLDWIDE</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 font-mono text-[10px]">
              <a
                href="#projects"
                className="flex items-center gap-7 border bg-black px-5 py-3 text-white transition-colors hover:border-red-500 hover:bg-transparent hover:text-red-500"
              >
                VIEW MY WORK
                <span className="text-xl">↓</span>
              </a>

              <a
                href="/resume.pdf"
                download
                className="flex items-center gap-7 border border-red-500 px-4 py-3 text-red-500 transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                GET MY RESUME
                <span className="text-xl">↗</span>
              </a>
            </div>
          </motion.div>

          <Portrait />
        </div>

        <div className="relative z-10 mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 border-t border-[#c9c3b9] pt-6 font-mono text-[8px] text-[#827a70]">
          <span>THOUGHTFUL CODE. MEANINGFUL EXPERIENCES.</span>
          <span className="text-lg text-red-500">✦</span>
          <span>DESIGNED WITH INTENTION ↗</span>
        </div>
      </section>
    </MotionConfig>
  );
}