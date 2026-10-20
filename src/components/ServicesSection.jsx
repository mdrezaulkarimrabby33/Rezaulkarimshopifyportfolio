import { useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

// নিজের ছবি public/img ফোল্ডারে রাখো।
// শুধু এই ৩টা path বদলালেই হবে।
const serviceImages = {
  shopify: "img/shopify1.jpg",
  wordpress: "img/thedigitalartist-wordpress-2173519_1920.jpg",
  seo: "img/seo 3.jpg",
};

const services = [
  {
    number: "01",
    type: "shop",
    title: "Shopify Development",
    description:
      "Thoughtful storefronts that put the product first. Clean interfaces, considered shopping journeys, and room for a brand to grow.",
    tags: "Custom themes / Liquid / Storefronts",
    image: serviceImages.shopify,
  },
  {
    number: "02",
    type: "code",
    title: "WordPress Development",
    description:
      "Flexible websites with a strong editorial foundation. Built around your content, with a straightforward experience on both sides of the screen.",
    tags: "Custom websites / CMS / Performance",
    image: serviceImages.wordpress,
  },
  {
    number: "03",
    type: "search",
    title: "Search Engine Optimization",
    description:
      "Search starts with the fundamentals. A clear site structure, useful content, and technical details that make a website easier to discover.",
    tags: "Technical SEO / On-page / Site structure",
    image: serviceImages.seo,
  },
];

const revealTransition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1],
};

function ServiceIcon({ type }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5 shrink-0 text-red-500 sm:h-6 sm:w-6"
    >
      {type === "shop" && (
        <>
          <path d="M5 3h14l2 5v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8l2-5Z" />
          <path d="M3 8h18M8 11a4 4 0 0 0 8 0" />
        </>
      )}

      {type === "code" && (
        <path d="m7 7-5 5 5 5M17 7l5 5-5 5M14 3l-4 18" />
      )}

      {type === "search" && (
        <>
          <circle cx="10.5" cy="10.5" r="7.5" />
          <path d="m16 16 6 6" />
        </>
      )}
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M5 19 19 5M5 5h14v14" />
    </svg>
  );
}

function ServiceRow({ service }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [opened, setOpened] = useState(false);
  const reduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spring = {
    stiffness: 150,
    damping: 25,
    mass: 0.6,
  };

  const x = useSpring(mouseX, spring);
  const y = useSpring(mouseY, spring);

  const active = hovered || focused || opened;
  const inlineActive = opened || hovered;
  const previewId = `service-preview-${service.number}`;

  const transition = reduceMotion
    ? { duration: 0 }
    : revealTransition;

  function handleMove(event) {
    if (event.pointerType !== "mouse" || reduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();

    mouseX.set(
      ((event.clientX - bounds.left) / bounds.width - 0.5) * 32
    );

    mouseY.set(
      ((event.clientY - bounds.top) / bounds.height - 0.5) * 60
    );
  }

  function handleLeave() {
    setHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <article
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerCancel={handleLeave}
      onFocusCapture={(event) => {
        if (event.target.matches(":focus-visible")) {
          setFocused(true);
        }
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpened(false);
          setFocused(false);
          setHovered(false);
        }
      }}
      className={`relative border-t border-black/20 ${
        active ? "z-20" : "z-0"
      }`}
    >
      <div className="relative grid grid-cols-[24px_minmax(0,1fr)_28px] items-start gap-x-3 py-7 sm:gap-x-5 sm:py-9 md:grid-cols-[32px_minmax(0,1fr)_minmax(0,1fr)_28px] md:gap-x-6 xl:min-h-[210px] xl:grid-cols-[32px_minmax(0,1.1fr)_minmax(0,1fr)_280px_28px] xl:gap-x-6 xl:py-10">
        <span className="pt-1 font-mono text-[10px] text-[#706C65]">
          [{service.number}]
        </span>

        <motion.div
          animate={{ x: active && !reduceMotion ? 6 : 0 }}
          transition={transition}
          className="min-w-0"
        >
          <h3>
            <button
              type="button"
              aria-expanded={opened}
              aria-controls={previewId}
              onClick={() => setOpened((value) => !value)}
              className={`flex w-full min-w-0 items-start gap-3 text-left outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-red-500 sm:gap-4 ${
                active ? "text-red-500" : "text-[#211F1C]"
              }`}
            >
              <span className="shrink-0 pt-1">
                <ServiceIcon type={service.type} />
              </span>

              <span className="min-w-0 break-words font-['Oswald',sans-serif] text-xl font-medium uppercase leading-tight sm:text-2xl xl:text-[27px]">
                {service.title}
              </span>
            </button>
          </h3>
        </motion.div>

        <div className="col-start-2 row-start-2 mt-5 min-w-0 md:col-start-3 md:row-start-1 md:mt-0">
          <p className="max-w-[430px] text-[13px] leading-6 text-[#706C65] sm:text-sm sm:leading-7">
            {service.description}
          </p>

          <p className="mt-4 break-words font-mono text-[8px] uppercase leading-5 text-[#817B73] sm:mt-5">
            {service.tags}
          </p>
        </div>

        {/* Mobile and tablet preview */}
        <motion.div
          initial={false}
          animate={{
            height: inlineActive ? "auto" : 0,
            opacity: inlineActive ? 1 : 0,
          }}
          transition={transition}
          aria-hidden="true"
          className="col-start-2 row-start-3 min-w-0 overflow-hidden md:col-start-3 md:row-start-2 xl:hidden"
        >
          <div className="pt-5">
            <motion.div
              initial={false}
              animate={{
                clipPath: inlineActive
                  ? "inset(0% 0% 0% 0% round 16px)"
                  : "inset(50% 45% 50% 45% round 16px)",
              }}
              transition={transition}
              className="aspect-[13/15] w-full max-w-[260px] overflow-hidden rounded-2xl bg-[#D8D4CC]"
            >
              <img
                src={service.image}
                alt=""
                loading="eager"
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Desktop floating preview */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative hidden self-center xl:col-start-4 xl:row-start-1 xl:block"
        >
          <motion.div
            style={reduceMotion ? {} : { x, y }}
            className="absolute left-1/2 top-0 h-0 w-0"
          >
            <motion.div
              initial={false}
              animate={{
                width: active ? 260 : 24,
                height: active ? 300 : 1,
                opacity: active ? 1 : 0,
              }}
              transition={transition}
              style={{ x: "-50%", y: "-50%" }}
              className="absolute left-0 top-0 flex items-center justify-center overflow-hidden rounded-2xl bg-[#D8D4CC]"
            >
              <img
                src={service.image}
                alt=""
                loading="eager"
                decoding="async"
                draggable={false}
                className="h-[300px] w-[260px] max-w-none shrink-0 object-cover"
              />
            </motion.div>
          </motion.div>
        </div>

        <a
          href="#contact"
          aria-label={`Contact me about ${service.title}`}
          className={`col-start-3 row-start-1 flex min-h-11 min-w-11 -translate-y-2 items-center justify-center justify-self-end outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-red-500 md:col-start-4 xl:col-start-5 ${
            active ? "text-red-500" : "text-[#211F1C]"
          }`}
        >
          <ArrowUpRight />
        </a>
      </div>

      <span id={previewId} className="sr-only">
        {opened ? "Image preview open" : "Image preview closed"}
      </span>
    </article>
  );
}

export default function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="bg-[#F2EFE9] px-4 py-10 text-[#211F1C] sm:px-6 sm:py-14 lg:px-8 lg:py-16 xl:py-20"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="flex items-center justify-between gap-4 border-t border-black/20 pt-5">
          <p className="font-mono text-[10px] uppercase tracking-wide">
            04 / My focus
          </p>

          <span
            aria-hidden="true"
            className="text-xl font-light text-red-500"
          >
            +
          </span>
        </div>

        <div className="mb-8 mt-9 flex flex-col justify-between gap-5 sm:mb-10 sm:mt-12 lg:flex-row lg:items-end lg:gap-8 xl:mb-12 xl:mt-14">
          <h2
            id="services-heading"
            className="min-w-0 font-['Oswald',sans-serif] text-[clamp(1.9rem,4.5vw,4.7rem)] font-semibold uppercase leading-[1.12] tracking-tight"
          >
            Different tools.
            <br />
            One thoughtful approach
            <span className="text-red-500">.</span>
          </h2>

          <p className="max-w-[230px] shrink-0 text-[13px] leading-6 text-[#706C65] sm:text-sm sm:leading-7 lg:pb-2">
            From the first impression to the last technical detail.
          </p>
        </div>

        <div className="border-b border-black/20">
          {services.map((service) => (
            <ServiceRow
              key={service.number}
              service={service}
            />
          ))}
        </div>
      </div>
    </section>
  );
}