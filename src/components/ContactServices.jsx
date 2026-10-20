import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/* ==================================================
   SECTION CONTENT — এখান থেকে লেখা ও link বদলাও
================================================== */

const sectionContent = {
  id: "featured-services",
  label: "06 / Featured Services",
  eyebrow: "Development / Design / Growth",

  headingLineOne: "Built to impress.",
  headingLineTwo: "Designed to",
  headingHighlight: "grow.",

  description:
    "Shopify, WordPress, and SEO — thoughtful websites backed by a clear strategy.",

  bottomLineOne: "A website, an idea, or just a hello.",
  bottomLineTwo: "Let’s see where the conversation takes us.",

  buttonText: "Let’s talk",
  contactLink: "#contact",
};

/* ==================================================
   CARDS — ছবি, লেখা ও link এখান থেকে বদলাও

   ছবি রাখবে: public/img/your-image.png
   এখানে লিখবে: /img/your-image.png

   imagePosition:
   "center" / "top" / "bottom" / "50% 30%"
================================================== */

const services = [
  {
    id: "shopify",
    number: "01",
    title: "Shopify",
    category: "ECOMMERCE DEVELOPMENT",
    description:
      "Custom storefronts built for a smooth shopping experience.",
    image: "img/Shopify Bag on Oxblood Pedestal.png",
    imageAlt: "Shopify development service",
    imagePosition: "center",
    href: "#contact",
  },
  {
    id: "wordpress",
    number: "02",
    title: "WordPress",
    category: "WEBSITE DEVELOPMENT",
    description:
      "Flexible, fast websites that are easy to manage and grow.",
    image: "img/Blue WordPress Medallion on Burgundy Cylinder.png",
    imageAlt: "WordPress development service",
    imagePosition: "center",
    href: "#contact",
  },
  {
    id: "seo",
    number: "03",
    title: "SEO",
    category: "SEARCH & STRATEGY",
    description:
      "Technical improvements and content that help you get found.",
    image: "/img/seo 4.png",
    imageAlt: "Search engine optimization service",
    imagePosition: "center",
    href: "#contact",
  },
];

/* ==================================================
   ANIMATION SETTINGS
================================================== */

const smooth = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1],
};

/* ==================================================
   ARROW ICON
================================================== */

function ArrowUpRight({ className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 19 19 5M5 5h14v14" />
    </svg>
  );
}

/* ==================================================
   SERVICE CARD
================================================== */

function ServiceCard({ service, index }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["-8%", "8%"]
  );

  const transition = reduceMotion
    ? { duration: 0 }
    : smooth;

  return (
    <motion.div
      ref={ref}
      className="h-full min-w-0"
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: 32 }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        ...transition,
        delay: reduceMotion ? 0 : index * 0.08,
      }}
    >
      <motion.a
        href={service.href}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileFocus="hover"
        variants={{
          rest: { y: 0 },
          hover: { y: reduceMotion ? 0 : -6 },
        }}
        transition={transition}
        className="group flex h-full min-w-0 flex-col rounded-[24px] bg-[#1C1B18] p-1 text-[#F2EFE9] outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-4 focus-visible:ring-offset-[#F2EFE9]"
      >
        {/* Image */}
        <div
          data-cursor="image"
          className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[20px] bg-[#DDD8CF]"
        >
          {/* Scroll parallax */}
          <motion.div
            style={{
              y: reduceMotion ? 0 : imageY,
            }}
            className="absolute -top-[15%] left-0 h-[130%] w-full"
          >
            {/* Hover zoom */}
            <motion.img
              src={service.image}
              alt={service.imageAlt}
              loading="lazy"
              decoding="async"
              draggable={false}
              style={{
                objectPosition: service.imagePosition,
              }}
              variants={{
                rest: { scale: 1 },
                hover: {
                  scale: reduceMotion ? 1 : 1.065,
                },
              }}
              transition={transition}
              className="block h-full w-full select-none object-cover"
            />
          </motion.div>

          {/* Hover overlay */}
          <motion.div
            aria-hidden="true"
            variants={{
              rest: { opacity: 0 },
              hover: { opacity: 0.12 },
            }}
            transition={transition}
            className="pointer-events-none absolute inset-0 bg-black"
          />

          {/* Card number */}
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 font-mono text-[10px] text-[#211F1C] sm:left-4 sm:top-4">
            [{service.number}]
          </span>
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col px-4 pb-5 pt-4 lg:px-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="min-w-0 break-words text-xl font-medium leading-tight tracking-tight transition-colors duration-300 group-hover:text-red-500 group-focus-visible:text-red-500 motion-reduce:transition-none lg:text-2xl">
              {service.title}
            </h3>

            <span className="mt-1 shrink-0 text-red-500 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>

          <p className="mb-5 mt-3 break-words text-[13px] leading-6 text-[#AAA69F] lg:text-sm lg:leading-7">
            {service.description}
          </p>

          <div className="mt-auto flex items-start justify-between gap-3 border-t border-white/15 pt-3 font-mono text-[9px] uppercase leading-5 text-[#AAA69F]">
            <span className="min-w-0 break-words">
              {service.category}
            </span>

            <span
              aria-hidden="true"
              className="shrink-0 text-red-500"
            >
              ↗
            </span>
          </div>
        </div>
      </motion.a>
    </motion.div>
  );
}

/* ==================================================
   MAIN SECTION
================================================== */

export default function FeaturedServices() {
  const reduceMotion = useReducedMotion();
  const headingId = `${sectionContent.id}-heading`;

  return (
    <section
      id={sectionContent.id}
      aria-labelledby={headingId}
      className="bg-[#F2EFE9] px-4 py-10 text-[#211F1C] sm:px-6 sm:py-14 lg:px-8 lg:py-16 xl:py-20"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Section label */}
        <div className="flex items-start justify-between gap-4 border-t border-black/20 pt-4 sm:pt-5">
          <p className="min-w-0 break-words font-mono text-[9px] uppercase leading-5 tracking-wide sm:text-[10px]">
            {sectionContent.label}
          </p>

          <span
            aria-hidden="true"
            className="shrink-0 text-xl font-light leading-5 text-red-500"
          >
            +
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8 mt-8 flex items-end justify-between gap-4 sm:mb-10 sm:mt-10 lg:mb-12 lg:mt-12 lg:gap-8">
          <motion.div
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 24 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : smooth
            }
            className="min-w-0 flex-1"
          >
            <p className="mb-4 flex items-start gap-3 font-mono text-[9px] uppercase leading-5 tracking-[0.12em] text-[#756F68] sm:text-[10px] sm:tracking-[0.18em]">
              <span
                aria-hidden="true"
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500"
              />

              <span className="min-w-0 break-words">
                {sectionContent.eyebrow}
              </span>
            </p>

            <h2
              id={headingId}
              className="break-words font-['Oswald',sans-serif] text-[clamp(2.1rem,6.5vw,6.5rem)] font-semibold uppercase leading-[1.08] tracking-tight"
            >
              <span className="block">
                {sectionContent.headingLineOne}
              </span>

              <span className="block">
                {sectionContent.headingLineTwo}{" "}
                <span className="text-red-500">
                  {sectionContent.headingHighlight}
                </span>
              </span>
            </h2>

            <p className="mt-4 max-w-md break-words text-[13px] leading-6 text-[#756F68] sm:mt-5 sm:text-sm sm:leading-7">
              {sectionContent.description}
            </p>
          </motion.div>

          {/* Desktop contact arrow */}
          <a
            href={sectionContent.contactLink}
            aria-label="Discuss your project"
            className="group mb-2 hidden h-20 w-20 shrink-0 items-center justify-center rounded-full border border-red-500 text-red-500 transition-colors duration-300 hover:bg-red-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500 motion-reduce:transition-none lg:flex xl:h-28 xl:w-28"
          >
            <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none">
              <ArrowUpRight className="h-8 w-8 xl:h-10 xl:w-10" />
            </span>
          </a>
        </div>

        {/* Mobile: 1 / Tablet: 2 / Desktop: 3 */}
        <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
            />
          ))}
        </div>

        {/* Bottom content */}
        <div className="mt-7 flex flex-col items-start justify-between gap-5 sm:mt-9 sm:flex-row sm:items-center sm:gap-8">
          <p className="min-w-0 break-words text-[13px] leading-7 text-[#756F68] sm:text-sm">
            {sectionContent.bottomLineOne}
            <br />
            {sectionContent.bottomLineTwo}
          </p>

          <a
            href={sectionContent.contactLink}
            className="inline-flex min-h-11 max-w-full shrink-0 items-center justify-center gap-8 border border-black/30 px-5 py-3.5 font-mono text-[10px] uppercase transition-colors duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500 motion-reduce:transition-none"
          >
            <span>{sectionContent.buttonText}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0" />
          </a>
        </div>
      </div>
    </section>
  );
}