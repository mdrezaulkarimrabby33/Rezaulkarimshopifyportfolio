"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "framer-motion";

/* ==================================================
   HEADER SETTINGS — এখানে edit করো
================================================== */

const headerSettings = {
  // Header width ও position
  box: {
    maxWidth: "1400px",
    mobileWidth: "94%",
    desktopWidth: "85%",
    mobileTop: "12px",
    desktopTop: "24px",
  },

  // Logo image
  // ফাইল: public/img/logo.png
  // Path: /img/logo.png
  logo: {
    href: "#home",
    ariaLabel: "MRHK home",
    image: "public/img/MRHK coral-charcoal editorial monogram.png",
    imageAlt: "MRHK",
    imageClassName:
      "block h-auto w-[90px] object-contain sm:w-[110px]",
  },

  // Menu font ও size
  menu: {
    desktopFontClassName:
      "text-[12px] font-bold uppercase tracking-[1.4px] xl:text-[14px]",
    mobileFontClassName:
      "text-sm font-bold uppercase tracking-wider",
  },

  // ডান পাশের button
  button: {
    text: "Enquire",
    href: "#contact",
    fontClassName: "text-xs font-semibold md:text-sm",
  },

  defaultActiveHref: "#home",
};

/* ==================================================
   MENU CONTENT — নাম ও link বদলাও
================================================== */

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Experiences", href: "#experiences" },
  { label: "Education", href: "#education" },
  { label: "Skill", href: "#skill" },
  { label: "Projects", href: "#projects" },
];

/* ==================================================
   HEADER
================================================== */

export default function Header() {
  const [active, setActive] = useState(
    headerSettings.defaultActiveHref
  );
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

      if (Math.abs(currentY - previousY) < 8) return;

      const scrollingDown = currentY > previousY;

      setHidden(scrollingDown);

      if (scrollingDown) {
        setMenuOpen(false);
      }

      previousY = currentY;
    }

    const desktopQuery = window.matchMedia(
      "(min-width: 1024px)"
    );

    function closeDesktopMenu(event) {
      if (event.matches) setMenuOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    window.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", closeDesktopMenu);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener(
        "change",
        closeDesktopMenu
      );
    };
  }, []);

  function selectItem(href) {
    setActive(href);
    setMenuOpen(false);
    setHidden(false);
  }

  return (
    <MotionConfig reducedMotion="user">
      <header
        inert={hidden ? true : undefined}
        style={{
          maxWidth: headerSettings.box.maxWidth,
          "--header-mobile-width":
            headerSettings.box.mobileWidth,
          "--header-desktop-width":
            headerSettings.box.desktopWidth,
          "--header-mobile-top":
            headerSettings.box.mobileTop,
          "--header-desktop-top":
            headerSettings.box.desktopTop,
        }}
        className={`fixed left-1/2 top-[var(--header-mobile-top)] z-50 w-[var(--header-mobile-width)] -translate-x-1/2 md:top-[var(--header-desktop-top)] md:w-[var(--header-desktop-width)] ${
          hidden ? "pointer-events-none" : ""
        }`}
      >
        <motion.div
          initial={
            reduceMotion ? false : { opacity: 0, y: -24 }
          }
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
                {/* Image logo */}
                <motion.a
                  href={headerSettings.logo.href}
                  onClick={() =>
                    selectItem(headerSettings.logo.href)
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label={headerSettings.logo.ariaLabel}
                  className="block shrink-0 focus-visible:outline-red-500"
                >
                  <img
                    src={headerSettings.logo.image}
                    alt={headerSettings.logo.imageAlt}
                    draggable={false}
                    className={
                      headerSettings.logo.imageClassName
                    }
                  />
                </motion.a>

                {/* Desktop navigation */}
                <nav
                  aria-label="Main navigation"
                  className="hidden lg:block"
                >
                  <ul className="flex items-center gap-5 xl:gap-8">
                    {navItems.map(({ label, href }) => (
                      <li key={href}>
                        <motion.a
                          href={href}
                          onClick={() => selectItem(href)}
                          aria-current={
                            active === href
                              ? "location"
                              : undefined
                          }
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className={`block transition-colors focus-visible:outline-red-500 ${
                            headerSettings.menu.desktopFontClassName
                          } ${
                            active === href
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
                  {/* Enquire button */}
                  <motion.a
                    href={headerSettings.button.href}
                    onClick={() => setMenuOpen(false)}
                    whileHover={{
                      scale: 1.04,
                      boxShadow:
                        "inset 0 0 16px rgba(239,68,68,0.5), 0 0 22px rgba(239,68,68,0.35)",
                    }}
                    whileTap={{ scale: 0.96 }}
                    className={`rounded-full border border-[#5C0B1A] bg-[#5C0B1A] px-4 py-2 text-white shadow-[inset_0_0_12px_rgba(239,68,68,0.35),0_0_10px_rgba(239,68,68,0.2)] focus-visible:outline-red-500 md:px-7 ${headerSettings.button.fontClassName}`}
                  >
                    {headerSettings.button.text}
                  </motion.a>

                  {/* Mobile menu button */}
                  <button
                    type="button"
                    onClick={() =>
                      setMenuOpen((open) => !open)
                    }
                    aria-label={
                      menuOpen ? "Close menu" : "Open menu"
                    }
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

          {/* Mobile navigation */}
          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                id="mobile-navigation"
                aria-label="Mobile navigation"
                initial={{
                  opacity: 0,
                  y: reduceMotion ? 0 : -10,
                }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: reduceMotion ? 0 : -10,
                }}
                transition={{
                  duration: reduceMotion ? 0 : 0.2,
                }}
                className="mt-3 max-h-[65vh] overflow-y-auto rounded-3xl border border-red-500/50 bg-[#F2EFE9] p-3 shadow-lg lg:hidden"
              >
                <ul className="space-y-1">
                  {navItems.map(({ label, href }) => (
                    <li key={href}>
                      <a
                        href={href}
                        onClick={() => selectItem(href)}
                        aria-current={
                          active === href
                            ? "location"
                            : undefined
                        }
                        className={`block rounded-xl px-4 py-3 transition-colors focus-visible:outline-red-500 ${
                          headerSettings.menu.mobileFontClassName
                        } ${
                          active === href
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