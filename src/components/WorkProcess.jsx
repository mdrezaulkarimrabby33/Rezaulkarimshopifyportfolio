import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const images = [
  "/img/Golden-Hour Lakeside Dock Portrait.png",
  "/img/imagehero.png",
  "/img/Red-Lit Editorial Portrait.png",
  "/img/Golden-Hour Lakeside Dock Portrait.png",
  "/img/imagehero.png",
  "/img/Red-Lit Editorial Portrait.png",
  "/img/Golden-Hour Lakeside Dock Portrait.png",
  "/img/imagehero.png",
];

const steps = [
  {
    number: "01",
    title: "Understand",
    description:
      "Start with the people, the purpose, and the details that matter. A good website begins with the right questions.",
  },
  {
    number: "02",
    title: "Build",
    description:
      "Translate the direction into a considered, working experience. Keep the design intentional and the code clear.",
  },
  {
    number: "03",
    title: "Refine",
    description:
      "Test the experience, simplify the rough edges, and make the small improvements that bring everything together.",
  },
];

function ArrowDown() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5 text-red-500"
    >
      <path d="M12 3v18M4 13l8 8 8-8" />
    </svg>
  );
}

function RotatingImages() {
  const reduceMotion = useReducedMotion();
  const angleStep = 360 / Math.max(images.length, 1);

  if (images.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="relative isolate flex h-[340px] items-center justify-center overflow-hidden sm:h-[460px] lg:h-[560px]"
    >
      <div className="relative h-[520px] w-[700px] shrink-0 scale-[0.42] sm:scale-[0.62] lg:scale-[0.8]">
        <div
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={{
            transform:
              "perspective(1200px) rotateZ(24deg) rotateX(-40deg) rotateY(-40deg)",
          }}
        >
          <motion.div
            className="absolute inset-0 [transform-style:preserve-3d]"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: reduceMotion ? 0 : -360 }}
            transition={{
              duration: reduceMotion ? 0 : 22,
              ease: "linear",
              repeat: reduceMotion ? 0 : Infinity,
              repeatType: "loop",
            }}
          >
            {images.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="absolute left-1/2 top-1/2 h-[420px] w-[280px] origin-left [transform-style:preserve-3d]"
                style={{
                  transform: `translateY(-50%) rotateY(${
                    index * angleStep
                  }deg)`,
                }}
              >
                <div className="h-full w-full overflow-hidden rounded-2xl bg-[#D8D4CC] [transform:rotateY(45deg)]">
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full select-none object-cover"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function CardContent({ step }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-[#706C65]">
          {step.number}
        </span>

        <ArrowDown />
      </div>

      <h3 className="mt-7 font-['Oswald',sans-serif] text-2xl font-medium uppercase sm:mt-9 sm:text-3xl">
        {step.title}
      </h3>

      <p className="mt-4 max-w-lg text-sm leading-7 text-[#706C65]">
        {step.description}
      </p>
    </>
  );
}

function DesktopCard({ step, index, progress }) {
  // Three consecutive stages across the shortened scroll distance.
  const start = index / steps.length;
  const end = (index + 1) / steps.length;

  const y = useTransform(
    progress,
    [start, end],
    ["25vh", "0vh"]
  );

  return (
    <motion.article
      style={{ y }}
      className="min-w-0 border-t border-black/15 pt-5"
    >
      <CardContent step={step} />
    </motion.article>
  );
}

function ProcessCards() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Finish exactly when the 260px sticky area releases.
    offset: ["start start", "end 260px"],
  });

  return (
    <>
      {/* Desktop: shorter scroll area */}
      <div
        ref={ref}
        className={`relative hidden md:block ${
          reduceMotion ? "" : "h-[calc(55vh+260px)]"
        }`}
      >
        <div
          className={
            reduceMotion
              ? "py-6"
              : "sticky top-0 flex h-[260px] items-start pt-6 lg:pt-8"
          }
        >
          <div className="grid w-full grid-cols-3 items-start gap-8 lg:gap-11">
            {steps.map((step, index) =>
              reduceMotion ? (
                <article
                  key={step.number}
                  className="min-w-0 border-t border-black/15 pt-5"
                >
                  <CardContent step={step} />
                </article>
              ) : (
                <DesktopCard
                  key={step.number}
                  step={step}
                  index={index}
                  progress={scrollYProgress}
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="grid grid-cols-1 gap-10 py-6 md:hidden">
        {steps.map((step) => (
          <motion.article
            key={step.number}
            initial={
              reduceMotion ? false : { opacity: 0, y: 50 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="border-t border-black/15 pt-5"
          >
            <CardContent step={step} />
          </motion.article>
        ))}
      </div>
    </>
  );
}

export default function WorkProcess() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="work-process-heading"
      className="bg-[#E7E3DA] px-5 pb-3 pt-12 text-[#211F1C] sm:px-8 sm:pb-4 sm:pt-16 lg:px-12 lg:pb-5 lg:pt-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center justify-between border-t border-black/15 pt-5">
          <p className="font-mono text-[10px] uppercase tracking-wide sm:text-xs">
            05 / How I think about the work
          </p>

          <span
            aria-hidden="true"
            className="text-xl font-light text-red-500"
          >
            +
          </span>
        </div>

        <motion.h2
          id="work-process-heading"
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mt-10 max-w-4xl font-['Oswald',sans-serif] text-[clamp(2.5rem,5.5vw,5.25rem)] font-semibold uppercase leading-[1.08] tracking-tight sm:mt-14"
        >
          Good work is
          <br />
          never an accident
          <span className="text-red-500">.</span>
        </motion.h2>

        <div
          className={
            reduceMotion
              ? "relative"
              : "relative md:translate-y-[12.5vh]"
          }
        >
          <RotatingImages />
        </div>

        <ProcessCards />
      </div>
    </section>
  );
}