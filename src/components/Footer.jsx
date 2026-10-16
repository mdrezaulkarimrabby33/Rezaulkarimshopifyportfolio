import { useEffect, useId, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

/* =========================================
   CONTENT — এখানে পরিবর্তন করো
========================================= */

const footerContent = {
  heading: "Have a project in mind?",
  email: "YOUR_EMAIL@gmail.com",
  brand: "RABBY",
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

function RollingLink({ label, href }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      aria-label={label}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      className="inline-flex min-h-11 items-center text-[#AAA69F] outline-none transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500"
    >
      <span
        aria-hidden="true"
        className="flex overflow-hidden font-mono text-[10px] uppercase leading-5"
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

function FooterWordmark() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const visible = useInView(ref, { margin: "100px" });

  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const animateLight = visible && !reduceMotion;

  const mouseX = useMotionValue(600);
  const mouseY = useMotionValue(100);

  const lightX = useSpring(mouseX, {
    stiffness: 75,
    damping: 24,
  });

  const lightY = useSpring(mouseY, {
    stiffness: 75,
    damping: 24,
  });

  const reflectionX = useTransform(
    lightX,
    (value) => `${(value / 1200) * 100}%`
  );

  const reflectionY = useTransform(
    lightY,
    (value) => `${(value / 320) * 100}%`
  );

  function handleMove(event) {
    if (reduceMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();

    mouseX.set(
      ((event.clientX - bounds.left) / bounds.width) * 1200
    );

    mouseY.set(
      ((event.clientY - bounds.top) / bounds.height) * 320
    );
  }

  function resetLight() {
    mouseX.set(600);
    mouseY.set(100);
  }

  const textProps = {
    x: 15,
    y: 270,
    textLength: 1170,
    lengthAdjust: "spacingAndGlyphs",
    fontFamily: "Oswald, sans-serif",
    fontSize: 300,
    fontWeight: 600,
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={resetLight}
      onPointerCancel={resetLight}
      className="relative mt-8 overflow-hidden border-t border-white/15 pt-5 sm:mt-10 sm:pt-8"
    >
      <svg
        viewBox="0 0 1200 320"
        role="img"
        aria-label={footerContent.brand}
        className="block h-auto w-full select-none"
      >
        <defs>
          {/* Fixed letter shape */}
          <clipPath id={`${id}-letters`}>
            <text {...textProps}>
              {footerContent.brand}
            </text>
          </clipPath>

          {/* Dark red to pearl reflection */}
          <linearGradient
            id={`${id}-metal`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="20%"
            spreadMethod="reflect"
          >
            <stop offset="0%" stopColor="#160407" />
            <stop offset="20%" stopColor="#42080F" />
            <stop offset="37%" stopColor="#EF263E" />
            <stop offset="47%" stopColor="#FF8D99" />
            <stop offset="54%" stopColor="#FFF0EA" />
            <stop offset="70%" stopColor="#FFE0DA" />
            <stop offset="86%" stopColor="#FF485C" />
            <stop offset="100%" stopColor="#3A070D" />
          </linearGradient>

          {/* Broad moving light */}
          <radialGradient id={`${id}-sweep`}>
            <stop
              offset="0%"
              stopColor="#FFF6F0"
              stopOpacity="0.95"
            />
            <stop
              offset="35%"
              stopColor="#FFD8D4"
              stopOpacity="0.65"
            />
            <stop
              offset="70%"
              stopColor="#FF4F65"
              stopOpacity="0.2"
            />
            <stop
              offset="100%"
              stopColor="#FF4F65"
              stopOpacity="0"
            />
          </radialGradient>

          {/* Cursor reflection */}
          <motion.radialGradient
            id={`${id}-pointer`}
            cx={reflectionX}
            cy={reflectionY}
            r="45%"
          >
            <stop
              offset="0%"
              stopColor="#FFFFFF"
              stopOpacity="0.7"
            />
            <stop
              offset="45%"
              stopColor="#FFB9BF"
              stopOpacity="0.2"
            />
            <stop
              offset="100%"
              stopColor="#FFFFFF"
              stopOpacity="0"
            />
          </motion.radialGradient>

          {/* Rounded reflective bevel along letter edges */}
          <filter
            id={`${id}-bevel`}
            x="-5%"
            y="-15%"
            width="110%"
            height="130%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur
              in="SourceAlpha"
              stdDeviation="5"
              result="height"
            />

            <feSpecularLighting
              in="height"
              surfaceScale="9"
              specularConstant="1.2"
              specularExponent="25"
              lightingColor="#FFE5E0"
              result="shine"
            >
              <motion.fePointLight
                x={lightX}
                y={lightY}
                z="160"
              />
            </feSpecularLighting>

            <feComposite
              in="shine"
              in2="SourceAlpha"
              operator="in"
              result="clippedShine"
            />

            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="clippedShine" />
            </feMerge>
          </filter>
        </defs>

        {/* Red outer edge */}
        <text
          {...textProps}
          fill="#B6162B"
          stroke="#FF354F"
          strokeWidth="3"
          strokeLinejoin="round"
          paintOrder="stroke fill"
          filter={`url(#${id}-bevel)`}
        >
          {footerContent.brand}
        </text>

        {/* Reflections move inside the fixed letters */}
        <g clipPath={`url(#${id}-letters)`}>
          <motion.rect
            x="-1200"
            y="-200"
            width="3600"
            height="800"
            fill={`url(#${id}-metal)`}
            animate={{
              x: animateLight
                ? [-1200, -350, -1200]
                : -900,
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.ellipse
            cx="600"
            cy="110"
            rx="650"
            ry="230"
            fill={`url(#${id}-sweep)`}
            animate={
              animateLight
                ? {
                    cx: [100, 1050, 100],
                    cy: [40, 230, 40],
                  }
                : { cx: 650, cy: 100 }
            }
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <rect
            width="1200"
            height="320"
            fill={`url(#${id}-pointer)`}
          />
        </g>

        {/* Persistent edge shine */}
        <text
          {...textProps}
          aria-hidden="true"
          fill="none"
          stroke="#FF7583"
          strokeWidth="1.6"
          filter={`url(#${id}-bevel)`}
        >
          {footerContent.brand}
        </text>
      </svg>
    </div>
  );
}

/* =========================================
   FOOTER
========================================= */

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
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Heading */}
        <h2
          id="footer-heading"
          className="font-['Oswald',sans-serif] text-[clamp(2rem,4.5vw,4.5rem)] font-medium uppercase leading-[1.12] tracking-tight text-[#AAA69F]"
        >
          {footerContent.heading}
        </h2>

        {/* Email */}
        <a
          href={`mailto:${footerContent.email}`}
          className="group mt-3 inline-flex max-w-full items-start gap-3 text-[#F2EFE9] outline-none transition-colors duration-300 hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500 sm:gap-5"
        >
          <span className="min-w-0 break-all font-['Oswald',sans-serif] text-[clamp(1.6rem,4.5vw,4.5rem)] font-medium leading-[1.2] tracking-tight">
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
                  <RollingLink {...link} />
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