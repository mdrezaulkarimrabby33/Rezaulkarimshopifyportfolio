import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

/* =========================================================
   1. SECTION SETTINGS — শুধু এই অংশ edit করো
   public/img/bg.jpg ফাইলের URL হবে /img/bg.jpg
========================================================= */
const sliderContent = {
  sectionId: "projects",
  label: "Selected work / Portfolio",
  heading: "Featured projects",
  accent: ".",
  description: "Drag or swipe to explore. Hover to hide the text.",
  projectLinkText: "View live site ↗",
  backgroundImage: "/img/bgred.jpg",
};

/* =========================================================
   2. PROJECTS — ছবি, লেখা ও live link এখান থেকে বদলাও

   id: প্রতিটি project-এর আলাদা পরিচয়; duplicate দেবে না।
   title: project-এর নাম
   category: Shopify / WordPress / SEO ইত্যাদি
   description: project-এর সংক্ষিপ্ত বিবরণ
   image: /img/filename.png (public লিখবে না)
   imagePosition: "top", "center", অথবা "50% 30%"
   href: আসল live URL, যেমন https://example.com
   newTab: true = বাইরের URL নতুন tab-এ খুলবে

   নতুন project: একটি সম্পূর্ণ { ... } block copy করে
   array-এর শেষে যোগ করো; আলাদা id দাও।
   project সরাতে তার সম্পূর্ণ block মুছে দাও।
   Slider-এর জন্য অন্তত 3টি project রাখলে ভালো দেখাবে।
========================================================= */
const projects = [
  {
    id: "project-1",
    newTab: true,
    imagePosition: "top",
    title: "Shopify Store",
    category: "SHOPIFY",
    description: "A thoughtful shopping experience built for growth.",
    image: "/img/Golden-Hour Lakeside Dock Portrait.png",
    href: "#contact",
  },
  {
    id: "project-2",
    newTab: true,
    imagePosition: "top",
    title: "Business Website",
    category: "WORDPRESS",
    description: "A fast, responsive website with a clear content system.",
    image: "/img/imagehero.png",
    href: "#contact",
  },
  {
    id: "project-3",
    newTab: true,
    imagePosition: "top",
    title: "Creative Portfolio",
    category: "REACT",
    description: "Fluid interactions and a distinctive visual identity.",
    image: "/img/about-portrait.png",
    href: "#contact",
  },
  {
    id: "project-4",
    newTab: true,
    imagePosition: "top",
    title: "Digital Studio",
    category: "REACT",
    description: "A considered digital presence for a modern studio.",
    image: "/img/imagehero.png",
    href: "#contact",
  },
  {
    id: "project-5",
    newTab: true,
    imagePosition: "top",
    title: "Brand Experience",
    category: "DEVELOPMENT",
    description: "A memorable interface designed around the brand.",
    image: "/img/Golden-Hour Lakeside Dock Portrait.png",
    href: "#contact",
  },
  {
    id: "project-6",
    newTab: true,
    imagePosition: "top",
    title: "Editorial Website",
    category: "WORDPRESS",
    description: "Clean typography and a flexible editorial foundation.",
    image: "/img/about-portrait.png",
    href: "#contact",
  },
  {
    id: "project-7",
    newTab: true,
    imagePosition: "top",
    title: "Online Store",
    category: "SHOPIFY",
    description: "Product-focused pages with a seamless shopping journey.",
    image: "/img/imagehero.png",
    href: "#contact",
  },
];

/* ===== নিচে animation ও layout — content edit করতে হবে না ===== */

const wrap = (value, count) => ((value % count) + count) % count;

function WaterBackground({ src }) {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    const container = canvas.parentElement;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    });

    if (!gl) return;

    const vertexSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;

      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision mediump float;

      varying vec2 v_uv;
      uniform sampler2D u_image;
      uniform vec2 u_resolution;
      uniform vec2 u_imageSize;
      uniform float u_time;
      uniform vec3 u_ripples[12];

      void main() {
        float aspect = u_resolution.x / u_resolution.y;
        vec2 distortion = vec2(0.0);

        for (int i = 0; i < 12; i++) {
          vec3 ripple = u_ripples[i];
          float age = u_time - ripple.z;

          if (age > 0.0 && age < 2.4) {
            vec2 delta = v_uv - ripple.xy;
            delta.x *= aspect;

            float dist = length(delta);
            float band = dist - age * 0.24;
            float envelope = exp(-band * band * 650.0);
            float fade = exp(-age * 1.6);
            float wave = sin(band * 110.0) * envelope * fade;

            vec2 direction = delta / max(dist, 0.001);
            direction.x /= aspect;

            distortion += direction * wave * 0.009;
          }
        }

        float imageAspect = u_imageSize.x / u_imageSize.y;
        vec2 cover = vec2(1.0);

        if (aspect > imageAspect) {
          cover.y = imageAspect / aspect;
        } else {
          cover.x = aspect / imageAspect;
        }

        vec2 uv = (v_uv - 0.5 + distortion) * cover + 0.5;
        uv = clamp(uv, vec2(0.001), vec2(0.999));

        gl_FragColor = vec4(texture2D(u_image, uv).rgb, 1.0);
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
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1,
      ]),
      gl.STATIC_DRAW
    );

    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      image: gl.getUniformLocation(program, "u_image"),
      resolution: gl.getUniformLocation(program, "u_resolution"),
      imageSize: gl.getUniformLocation(program, "u_imageSize"),
      time: gl.getUniformLocation(program, "u_time"),
      ripples: gl.getUniformLocation(program, "u_ripples[0]"),
    };

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(uniforms.image, 0);

    const ripples = new Float32Array(36);

    for (let i = 0; i < 12; i++) {
      ripples[i * 3 + 2] = -100;
    }

    let rippleIndex = 0;
    let lastPointerTime = -100;
    let lastRippleTime = -100;
    let frameId = 0;
    let disposed = false;
    let ready = false;
    let visible = true;
    let imageWidth = 1;
    let imageHeight = 1;

    const startedAt = performance.now();
    const getTime = () => (performance.now() - startedAt) / 1000;

    function startDrawing() {
      if (
        !frameId &&
        !disposed &&
        ready &&
        visible &&
        !document.hidden
      ) {
        frameId = requestAnimationFrame(draw);
      }
    }

    function resize() {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));

      gl.viewport(0, 0, canvas.width, canvas.height);
      startDrawing();
    }

    function draw() {
      frameId = 0;

      if (
        disposed ||
        !ready ||
        !visible ||
        document.hidden ||
        gl.isContextLost()
      ) {
        return;
      }

      const time = getTime();

      gl.useProgram(program);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform2f(uniforms.imageSize, imageWidth, imageHeight);
      gl.uniform1f(uniforms.time, time);
      gl.uniform3fv(uniforms.ripples, ripples);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (time - lastRippleTime < 2.5) {
        frameId = requestAnimationFrame(draw);
      }
    }

    function addRipple(event) {
      if (
        event.type === "pointermove" &&
        event.pointerType !== "mouse"
      ) {
        return;
      }

      const time = getTime();

      if (
        event.type === "pointermove" &&
        time - lastPointerTime < 0.055
      ) {
        return;
      }

      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const offset = rippleIndex * 3;

      ripples[offset] = (event.clientX - rect.left) / rect.width;
      ripples[offset + 1] =
        1 - (event.clientY - rect.top) / rect.height;
      ripples[offset + 2] = time;

      rippleIndex = (rippleIndex + 1) % 12;
      lastPointerTime = time;
      lastRippleTime = time;

      startDrawing();
    }

    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      if (disposed || gl.isContextLost()) return;

      imageWidth = image.naturalWidth;
      imageHeight = image.naturalHeight;

      try {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image
        );

        ready = true;
        resize();
      } catch {
        ready = false;
      }
    };

    image.src = src;

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) startDrawing();
      }
    );

    intersectionObserver.observe(container);

    function handleVisibility() {
      if (!document.hidden) startDrawing();
    }

    container.addEventListener("pointermove", addRipple);
    container.addEventListener("pointerdown", addRipple);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      image.onload = null;

      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      container.removeEventListener("pointermove", addRipple);
      container.removeEventListener("pointerdown", addRipple);
      document.removeEventListener("visibilitychange", handleVisibility);

      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [src, reduceMotion]);

  return (
    <>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </>
  );
}

function BackgroundDecorations() {
  const reduceMotion = useReducedMotion();

  const decorations = [
    { left: "9%", top: "25%", star: true },
    { left: "36%", top: "23%", star: false },
    { left: "64%", top: "25%", star: true },
    { left: "91%", top: "23%", star: false },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1]"
    >
      {decorations.map((item, i) => (
        <motion.div
          key={i}
          style={{ left: item.left, top: item.top }}
          animate={
            reduceMotion
              ? {}
              : {
                  rotate: item.star ? 360 : -180,
                  y: [0, -5, 0],
                  opacity: [0.65, 1, 0.65],
                }
          }
          transition={{
            rotate: {
              duration: 18 + i * 4,
              repeat: Infinity,
              ease: "linear",
            },
            y: {
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            },
            opacity: {
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className={`absolute text-white ${
            item.star ? "h-[18px] w-[18px]" : "h-[14px] w-[14px]"
          }`}
        >
          <svg viewBox="0 0 32 32" fill="none" className="h-full w-full">
            {item.star ? (
              <path
                d="M16 4v24M4 16h24M7.5 7.5l17 17M7.5 24.5l17-17"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M16 2c1.8 8.5 5.5 12.2 14 14-8.5 1.8-12.2 5.5-14 14C14.2 21.5 10.5 17.8 2 16 10.5 14.2 14.2 10.5 16 2Z"
                fill="currentColor"
              />
            )}
          </svg>
        </motion.div>
      ))}

      <span className="absolute left-5 top-5 h-5 w-5 border-l border-t border-white/35 sm:left-8 sm:top-8" />
      <span className="absolute right-5 top-5 h-5 w-5 border-r border-t border-white/35 sm:right-8 sm:top-8" />
      <span className="absolute bottom-5 left-5 h-5 w-5 border-b border-l border-white/35 sm:bottom-8 sm:left-8" />
      <span className="absolute bottom-5 right-5 h-5 w-5 border-b border-r border-white/35 sm:bottom-8 sm:right-8" />
    </div>
  );
}

function AnimatedBackground({ children }) {
  return (
    <section
      id={sliderContent.sectionId}
      aria-labelledby={`${sliderContent.sectionId}-heading`}
      className="relative isolate overflow-hidden bg-[#5C0B1A] py-12 text-white sm:py-16 lg:py-20"
    >
      <WaterBackground src={sliderContent.backgroundImage} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
      />

      <BackgroundDecorations />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

function ProjectCard({
  project,
  cardIndex,
  position,
  selected,
  onSelect,
  draggedRef,
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduceMotion = useReducedMotion();

  const count = projects.length;

  const offset = useTransform(position, (value) => (
    wrap(cardIndex - value + count / 2, count) - count / 2
  ));

  const x = useTransform(offset, (value) => {
    const distance = Math.abs(value);

    return Math.sign(value) * (
      distance <= 1
        ? distance * 440
        : 440 + (distance - 1) * 272
    );
  });

  const z = useTransform(offset, (value) => -Math.abs(value) * 200);

  const rotateY = useTransform(offset, (value) => (
    Math.sign(value) * Math.min(Math.abs(value) * 35, 68)
  ));

  const scaleX = useTransform(
    offset,
    [-1, 0, 1],
    [0.538462, 1, 0.538462]
  );

  const scaleY = useTransform(
    offset,
    [-1, 0, 1],
    [0.857143, 1, 0.857143]
  );

  const zIndex = useTransform(
    offset,
    (value) => Math.round(100 - Math.abs(value) * 10)
  );

  const opacity = useTransform(offset, (value) => (
    Math.min(1, Math.max(0, count / 2 - Math.abs(value)) * 4)
  ));

  const hideText = hovered || focused;

  return (
    <motion.div
      style={{ x, z, rotateY, scaleX, scaleY, zIndex, opacity }}
      className="absolute left-1/2 top-1/2 -ml-[260px] -mt-[210px] h-[420px] w-[520px] [transform-style:preserve-3d]"
    >
      <a
        href={project.href}
        target={project.newTab && /^https?:\/\//i.test(project.href) ? "_blank" : undefined}
        rel={project.newTab && /^https?:\/\//i.test(project.href) ? "noopener noreferrer" : undefined}
        tabIndex={selected ? 0 : -1}
        aria-label={`View ${project.title}`}
        onDragStart={(event) => event.preventDefault()}
        onClick={(event) => {
          if (draggedRef.current) {
            event.preventDefault();
            return;
          }

          if (!selected) {
            event.preventDefault();
            onSelect();
          }
        }}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="relative block h-full w-full overflow-hidden rounded-[18px] bg-[#0B1220] shadow-2xl outline-none focus-visible:ring-4 focus-visible:ring-red-500"
      >
        <motion.img
          src={project.image}
          alt={project.imageAlt || project.title}
          style={{ objectPosition: project.imagePosition || "top" }}
          draggable={false}
          initial={false}
          animate={{ scale: hideText && !reduceMotion ? 1.04 : 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          className="absolute inset-0 h-full w-full select-none object-cover object-top"
        />

        <motion.div
          initial={false}
          animate={{ opacity: hideText ? 0 : 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.3 }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/30 to-transparent"
        />

        <motion.div
          initial={false}
          animate={{
            opacity: hideText ? 0 : 1,
            y: hideText && !reduceMotion ? 16 : 0,
          }}
          transition={{ duration: reduceMotion ? 0 : 0.3 }}
          className="absolute inset-x-0 bottom-0 bg-[#0B1220]/95 p-5"
        >
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="rounded-full bg-red-500 px-3 py-1 text-[10px] font-bold tracking-wider">
              {project.category}
            </span>

            <span className="text-xs text-white/75">
              {sliderContent.projectLinkText}
            </span>
          </div>

          <h3 className="text-2xl font-semibold">{project.title}</h3>

          <p className="mt-2 text-sm leading-6 text-white/65">
            {project.description}
          </p>
        </motion.div>
      </a>
    </motion.div>
  );
}

export default function ProjectsSlider() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);

  const target = useMotionValue(0);

  const smoothPosition = useSpring(target, {
    stiffness: 180,
    damping: 28,
    mass: 0.85,
    restDelta: 0.001,
    restSpeed: 0.001,
  });

  const position = reduceMotion ? target : smoothPosition;

  const draggedRef = useRef(false);
  const pointerRef = useRef(null);
  const animationRef = useRef(null);
  const wheelTimer = useRef(null);

  const count = projects.length;

  useMotionValueEvent(position, "change", (value) => {
    const selected = wrap(Math.round(value), count);

    setIndex((current) => (
      current === selected ? current : selected
    ));
  });

  useEffect(() => {
    return () => {
      animationRef.current?.stop();
      clearTimeout(wheelTimer.current);
    };
  }, []);

  function stopAnimation() {
    animationRef.current?.stop();
    clearTimeout(wheelTimer.current);
  }

  function moveTo(value) {
    stopAnimation();

    if (reduceMotion) {
      target.set(value);
      return;
    }

    animationRef.current = animate(target, value, {
      type: "spring",
      stiffness: 160,
      damping: 28,
      mass: 0.8,
    });
  }

  function selectCard(cardIndex) {
    const current = position.get();

    const difference =
      wrap(cardIndex - current + count / 2, count) - count / 2;

    moveTo(current + difference);
  }

  function next() {
    moveTo(Math.round(target.get()) + 1);
  }

  function previous() {
    moveTo(Math.round(target.get()) - 1);
  }

  function handlePointerDown(event) {
    if (!event.isPrimary || event.button !== 0) return;

    stopAnimation();
    draggedRef.current = false;

    const current = position.get();
    target.set(current);
    smoothPosition.jump(current);

    const width = event.currentTarget.clientWidth;
    const scale = width < 640 ? 0.52 : width < 1024 ? 0.75 : 1;

    pointerRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: performance.now(),
      startPosition: current,
      distancePerCard: 240 * scale,
      velocity: 0,
      horizontal: false,
      cancelled: false,
    };
  }

  function handlePointerMove(event) {
    const pointer = pointerRef.current;

    if (!pointer || pointer.id !== event.pointerId) return;
    if (pointer.cancelled) return;

    const dx = event.clientX - pointer.startX;
    const dy = event.clientY - pointer.startY;

    if (!pointer.horizontal) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;

      if (Math.abs(dy) > Math.abs(dx)) {
        pointer.cancelled = true;
        return;
      }

      pointer.horizontal = true;
      draggedRef.current = true;
      setDragging(true);

      event.currentTarget.setPointerCapture(event.pointerId);
    }

    const now = performance.now();
    const elapsed = Math.max(8, now - pointer.lastTime);

    const velocity =
      -((event.clientX - pointer.lastX) / elapsed) *
      1000 /
      pointer.distancePerCard;

    pointer.velocity = pointer.velocity * 0.45 + velocity * 0.55;
    pointer.lastX = event.clientX;
    pointer.lastTime = now;

    target.set(
      pointer.startPosition - dx / pointer.distancePerCard
    );
  }

  function finishDrag(event, cancelled = false) {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;

    pointerRef.current = null;
    setDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!pointer.horizontal) return;

    const paused = performance.now() - pointer.lastTime > 100;

    const velocity =
      paused || cancelled
        ? 0
        : Math.max(-12, Math.min(12, pointer.velocity * 1.5));

    if (reduceMotion || cancelled || Math.abs(velocity) < 0.15) {
      moveTo(Math.round(target.get()));
      return;
    }

    animationRef.current = animate(target, target.get(), {
      type: "inertia",
      velocity,
      power: 1.1,
      timeConstant: 850,
      restDelta: 0.001,
      modifyTarget: (value) => Math.round(value),
    });
  }

  return (
    <AnimatedBackground>
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-wider text-white/80">
              {sliderContent.label}
            </p>

            <h2
              id={`${sliderContent.sectionId}-heading`}
              className="font-['Oswald',sans-serif] text-4xl font-semibold uppercase sm:text-5xl lg:text-6xl"
            >
              {sliderContent.heading}
              <span className="text-red-500">{sliderContent.accent}</span>
            </h2>

            <p className="mt-4 text-sm text-white/80">
              {sliderContent.description}
            </p>
          </div>

          <span
            aria-live="polite"
            aria-atomic="true"
            className="shrink-0 font-mono text-xs text-white/80"
          >
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured project slider"
        tabIndex={0}
        onPointerDownCapture={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => finishDrag(event)}
        onPointerCancel={(event) => finishDrag(event, true)}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => {
          if (draggedRef.current) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            next();
          }

          if (event.key === "ArrowLeft") {
            event.preventDefault();
            previous();
          }
        }}
        onWheel={(event) => {
          if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

          stopAnimation();

          const delta = Math.max(-80, Math.min(80, event.deltaX));
          target.set(target.get() + delta / 240);

          wheelTimer.current = setTimeout(() => {
            moveTo(Math.round(target.get()));
          }, 160);
        }}
        className={`relative mt-4 h-[350px] touch-pan-y select-none overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/50 sm:mt-8 sm:h-[470px] lg:h-[540px] ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <div className="absolute left-1/2 top-1/2 h-[540px] w-[1600px] -translate-x-1/2 -translate-y-1/2">
          <div className="h-full w-full scale-[0.52] [perspective:900px] sm:scale-[0.75] lg:scale-100">
            {projects.map((project, cardIndex) => (
              <ProjectCard
                key={project.id}
                project={project}
                cardIndex={cardIndex}
                position={position}
                selected={index === cardIndex}
                onSelect={() => selectCard(cardIndex)}
                draggedRef={draggedRef}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto mt-2 flex max-w-[1400px] items-center justify-center gap-3 px-5 sm:gap-5">
        <button
          type="button"
          onClick={previous}
          aria-label="Previous project"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/50 bg-black/20 text-xl transition-colors hover:border-red-500 hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          ←
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          {projects.map((project, dotIndex) => (
            <button
              key={project.id}
              type="button"
              aria-label={`Show ${project.title}`}
              aria-current={dotIndex === index ? "true" : undefined}
              onClick={() => selectCard(dotIndex)}
              className="flex h-8 w-5 items-center justify-center sm:w-6"
            >
              <span
                className={`h-2 rounded-full transition-all ${
                  dotIndex === index
                    ? "w-5 bg-red-500"
                    : "w-2 bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next project"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/50 bg-black/20 text-xl transition-colors hover:border-red-500 hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          →
        </button>
      </div>
    </AnimatedBackground>
  );
}