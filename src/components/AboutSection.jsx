import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

// Reference portrait — নিজের ছবি দিতে এই URL বদলাও।
const portrait =
  "public/img/about-portrait.png";

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

function ParallaxPortrait() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["-12%", "12%"]
  );

  return (
    <div>
      <div
        ref={ref}
        data-cursor="hover"
        className="relative isolate aspect-[4/5] w-full overflow-hidden rounded-[22px] bg-[#350607]"
      >
        <motion.img
          src={portrait}
          alt="Portrait lit with red light"
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{ y: reduceMotion ? 0 : y }}
          className="absolute -top-[20%] left-0 h-[140%] w-full max-w-none object-cover object-center"
        />
      </div>

      <div className="mt-5 flex items-start justify-between gap-4 font-mono text-[10px] uppercase leading-5 text-[#AAA69F]">
        <p>
          Bangladesh
          <br />
          Connected to the world
        </p>

        <span className="text-red-500">✦</span>
      </div>
    </div>
  );
}

export default function AboutSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-[#1C1B18] px-5 py-12 text-[#F2EFE9] sm:px-8 sm:py-16 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-[1512px]">
        {/* Section label */}
        <div className="flex items-center justify-between gap-4 border-t border-white/20 pt-5">
          <p className="font-mono text-[10px] uppercase tracking-wide sm:text-xs">
            03 / The person behind the pixels
          </p>

          <span
            aria-hidden="true"
            className="text-xl font-light text-red-500"
          >
            +
          </span>
        </div>

        <div className="mt-10 grid grid-cols-1 items-center gap-10 sm:mt-14 md:grid-cols-[0.9fr_1.1fr] md:gap-12 lg:gap-24 xl:gap-32">
          {/* Left portrait */}
          <div className="w-full max-w-[520px]">
            <ParallaxPortrait />
          </div>

          {/* Right content */}
          <motion.div
            initial={
              reduceMotion ? false : { opacity: 0, y: 35 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="max-w-[640px]"
          >
            <h2
              id="about-heading"
              className="font-['Oswald',sans-serif] text-[clamp(2.3rem,4.8vw,5rem)] font-semibold uppercase leading-[1.12] tracking-tight"
            >
              A developer.
              <br />
              A thinker.
              <br />
              Always curious
              <span className="text-red-500">.</span>
            </h2>

            <div className="mt-7 space-y-4 text-sm leading-7 text-[#AAA69F] sm:mt-8 sm:text-base sm:leading-8">
              <p>
                I'm Rabby Maktech, a Shopify developer,
                WordPress developer, and SEO specialist
                based in Bangladesh.
              </p>

              <p>
                I care about how a website feels as much as
                how it works. The small details, the clarity
                of the content, and the experience on every
                screen all belong to the same conversation.
              </p>
            </div>

            <a
              href="/about"
              className="group mt-8 inline-flex items-center justify-between gap-8 border border-white/20 px-5 py-4 font-mono text-[10px] uppercase tracking-wide transition-colors duration-300 hover:border-red-500 hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500 sm:mt-9"
            >
              More about me

              <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <ArrowUpRight />
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}