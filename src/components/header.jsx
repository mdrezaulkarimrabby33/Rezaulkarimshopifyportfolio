"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "framer-motion";

const navItems = [
  { label: "Home", id: "home" },
  { label: "Experiences", id: "experiences" },
  { label: "Education", id: "education" },
  { label: "Skill", id: "skill" },
  { label: "Projects", id: "projects" },
];

export default function Header() {
  const [active, setActive] = useState("Home");
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let previousY = Math.max(0, window.scrollY);

    function handleScroll() {
      const currentY = Math.max(0, window.scrollY);

      if (currentY < 80) {
        setHidden(false);
        previousY = currentY;
        return;
      }

      // Ignore tiny movements to prevent flickering.
      if (Math.abs(currentY - previousY) < 8) return;

      const scrollingDown = currentY > previousY;

      setHidden(scrollingDown);

      if (scrollingDown) {
        setMenuOpen(false);
      }

      previousY = currentY;
    }

    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    function closeDesktopMenu(event) {
      if (event.matches) setMenuOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    window.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", closeDesktopMenu);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", closeDesktopMenu);
    };
  }, []);

  function selectItem(label) {
    setActive(label);
    setMenuOpen(false);
    setHidden(false);
  }

  return (
    <MotionConfig reducedMotion="user">
      <header
        inert={hidden ? true : undefined}
        className={`fixed left-1/2 top-3 z-50 w-[94%] max-w-[1250px] -translate-x-1/2 md:top-6 md:w-[85%] ${
          hidden ? "pointer-events-none" : ""
        }`}
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -24 }}
          animate={{
            opacity: hidden ? 0 : 1,
            y: hidden ? "-150%" : 0,
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.3,
            ease: "easeOut",
          }}
        >
          <div className="header-moving-border relative rounded-full p-[2px] shadow-[0_0_35px_rgba(239,68,68,0.16)]">
            <div className="relative z-[1] overflow-hidden rounded-full bg-[#F2EFE9] px-4 py-3 md:px-7 md:py-4">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 left-12 h-12 w-44 rounded-full bg-red-500/25 blur-2xl"
              />

              <div className="relative flex items-center justify-between gap-3">
                <motion.a
                  href="#home"
                  onClick={() => selectItem("Home")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label="MRHK home"
                  className="shrink-0 font-serif text-2xl font-bold italic tracking-[-2px] text-white focus-visible:outline-red-500"
                >
                  <span className="text-red-500">MR</span>HK
                </motion.a>

                {/* Desktop navigation */}
                <nav
                  aria-label="Main navigation"
                  className="hidden lg:block"
                >
                  <ul className="flex items-center gap-5 xl:gap-8">
                    {navItems.map(({ label, id }) => (
                      <li key={id}>
                        <motion.a
                          href={`#${id}`}
                          onClick={() => selectItem(label)}
                          aria-current={
                            active === label ? "location" : undefined
                          }
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className={`block text-[12px] font-bold uppercase tracking-[1.4px] transition-colors focus-visible:outline-red-500 xl:text-[14px] ${
                            active === label
                              ? "text-red-500"
                              : "text-black hover:text-red-500"
                          }`}
                        >
                          {label}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="flex shrink-0 items-center gap-3">
                  <motion.a
                    href="#contact"
                    onClick={() => setMenuOpen(false)}
                    whileHover={{
                      scale: 1.04,
                      boxShadow:
                        "inset 0 0 16px rgba(239,68,68,0.5), 0 0 22px rgba(239,68,68,0.35)",
                    }}
                    whileTap={{ scale: 0.96 }}
                    className="rounded-full border border-[#5C0B1A] bg-[#5C0B1A] px-4 py-2 text-xs font-semibold text-white shadow-[inset_0_0_12px_rgba(239,68,68,0.35),0_0_10px_rgba(239,68,68,0.2)] focus-visible:outline-red-500 md:px-7 md:text-sm"
                  >
                    Enquire
                  </motion.a>

                  {/* Mobile menu button */}
                  <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/40 text-black focus-visible:outline-red-500 lg:hidden"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      {menuOpen ? (
                        <>
                          <path d="M6 6l12 12" />
                          <path d="M18 6L6 18" />
                        </>
                      ) : (
                        <>
                          <path d="M4 6h16" />
                          <path d="M4 12h16" />
                          <path d="M4 18h16" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                id="mobile-navigation"
                aria-label="Mobile navigation"
                initial={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                className="mt-3 max-h-[65vh] overflow-y-auto rounded-3xl border border-red-500/50 bg-[#F2EFE9] p-3 shadow-lg lg:hidden"
              >
                <ul className="space-y-1">
                  {navItems.map(({ label, id }) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        onClick={() => selectItem(label)}
                        aria-current={
                          active === label ? "location" : undefined
                        }
                        className={`block rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors focus-visible:outline-red-500 ${
                          active === label
                            ? "bg-red-500/10 text-red-500"
                            : "text-black hover:bg-red-500/5 hover:text-red-500"
                        }`}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>
      </header>
    </MotionConfig>
  );
}