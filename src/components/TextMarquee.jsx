import { motion, useReducedMotion } from "framer-motion";

const items = [
  "Development",
  "Design Thinking",
  "Search & Strategy",
];

function StarIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-6 w-6 shrink-0 text-red-500 sm:h-8 sm:w-8"
    >
      <path d="M16 3v26M3 16h26M7 7l18 18M7 25 25 7" />
    </svg>
  );
}

export default function TextMarquee() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Development, Design Thinking, Search and Strategy"
      className="m-0 overflow-hidden bg-[#F2EFE9] py-10 sm:py-14 lg:py-20"
    >
      <motion.div
        aria-hidden="true"
        className="flex w-max items-center"
        initial={{ x: "0%" }}
        animate={{ x: reduceMotion ? "0%" : "-50%" }}
        transition={{
          duration: reduceMotion ? 0 : 24,
          ease: "linear",
          repeat: reduceMotion ? 0 : Infinity,
        }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
          >
            {items.map((text) => (
              <div
                key={text}
                className="flex shrink-0 items-center gap-10 pr-10 sm:gap-20 sm:pr-20 lg:gap-32 lg:pr-32"
              >
                <span className="block whitespace-nowrap font-['Oswald',sans-serif] text-2xl font-semibold uppercase leading-none tracking-tight text-[#62615E] sm:text-4xl lg:text-5xl">
                  {text}
                </span>

                <StarIcon />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  );
}