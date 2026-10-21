"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "framer-motion";


/* ==================================================
   EDIT HERE — শুধু এই অংশ পরিবর্তন করলেই হবে
================================================== */

const headerConfig = {
  /* ---------- LOGO ---------- */
  logo: {
    // ছবি থাকবে public/img ফোল্ডারে।
    // এখানে /img/filename.png লিখবে; public লিখবে না।
    image: "/img/MRHK coral-charcoal editorial monogram.png",

    alt: "MRHK",
    link: "#home",
    accessibleLabel: "MRHK home",

    // Logo width
    mobileWidth: "90px",
    desktopWidth: "110px",
  },

  /* ---------- MENU ---------- */
  menu: {
    defaultActiveLink: "#home",

    // নাম, link ও order এখান থেকে বদলাও।
    // বাইরের website link-ও দেওয়া যাবে।
    items: [
      { label: "Home", href: "#home", newTab: false },
      {
        label: "Experiences",
        href: "#experiences",
        newTab: false,
      },
      {
        label: "Education",
        href: "#education",
        newTab: false,
      },
      { label: "Skill", href: "#skill", newTab: false },
      {
        label: "Projects",
        href: "#projects",
        newTab: false,
      },

      // নতুন menu যোগ করার উদাহরণ:
      // {
      //   label: "GitHub",
      //   href: "https://github.com/your-username",
      //   newTab: true,
      // },
    ],

    // Tailwind font classes
    desktopFont:
      "font-sans text-[12px] font-bold uppercase tracking-[1.4px] xl:text-[14px]",

    mobileFont:
      "font-sans text-sm font-bold uppercase tracking-wider",

    // Menu items-এর মাঝের gap
    desktopGap: "gap-5 xl:gap-8",
  },

  /* ---------- RIGHT BUTTON ---------- */
  button: {
    show: true,
    text: "Enquire",
    href: "#contact",
    newTab: false,

    font: "text-xs font-semibold md:text-sm",
    padding: "px-4 py-2 md:px-7",
  },

  /* ---------- HEADER WIDTH / POSITION ---------- */
  layout: {
    maxWidth: "1400px",
    mobileWidth: "94%",
    desktopWidth: "85%",
    mobileTop: "12px",
    desktopTop: "24px",

    // Header-এর ভেতরের padding
    padding: "px-4 py-3 md:px-7 md:py-4",
  },

  /* ---------- COLORS ---------- */
  colors: {
    background: "#F2EFE9",
    text: "#000000",
    accent: "#EF4444",
    buttonBackground: "#5C0B1A",
    buttonText: "#FFFFFF",
  },

  /* ---------- BEHAVIOR ---------- */
  behavior: {
    hideOnScrollDown: true,
    hideAfter: 80,
    scrollThreshold: 8,
  },

  /* ---------- ACCESSIBILITY TEXT ---------- */
  labels: {
    desktopNavigation: "Main navigation",
    mobileNavigation: "Mobile navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
};

/* ==================================================
   COMPONENT — সাধারণ content edit করতে নিচে যেতে হবে না
================================================== */

export default function Header() {
  const [active, setActive] = useState(
    headerConfig.menu.defaultActiveLink
  );
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let previousY = Math.max(0, window.scrollY);

    function handleScroll() {
      const currentY = Math.max(0, window.scrollY);
      const settings = headerConfig.behavior;

      if (
        !settings.hideOnScrollDown ||
        currentY < settings.hideAfter
      ) {
        setHidden(false);
        previousY = currentY;
        return;
      }

      if (
        Math.abs(currentY - previousY) <
        settings.scrollThreshold
      ) {
        return;
      }

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
      if (event.matches) {
        setMenuOpen(false);
      }
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

  function selectItem(href, newTab = false) {
    if (!newTab) {
      setActive(href);
    }

    setMenuOpen(false);
    setHidden(false);
  }

  const hoverShadow =
    `inset 0 0 16px ${headerConfig.colors.accent}80, ` +
    `0 0 22px ${headerConfig.colors.accent}59`;

  return (
    <MotionConfig reducedMotion="user">
      <header
        inert={hidden ? true : undefined}
        style={{
          maxWidth: headerConfig.layout.maxWidth,

          "--header-mobile-width":
            headerConfig.layout.mobileWidth,
          "--header-desktop-width":
            headerConfig.layout.desktopWidth,
          "--header-mobile-top":
            headerConfig.layout.mobileTop,
          "--header-desktop-top":
            headerConfig.layout.desktopTop,

          "--logo-mobile-width":
            headerConfig.logo.mobileWidth,
          "--logo-desktop-width":
            headerConfig.logo.desktopWidth,

          "--header-bg":
            headerConfig.colors.background,
          "--header-text":
            headerConfig.colors.text,
          "--header-accent":
            headerConfig.colors.accent,

          "--header-button-bg":
            headerConfig.colors.buttonBackground,
          "--header-button-text":
            headerConfig.colors.buttonText,
        }}
        className={`fixed left-1/2 top-[var(--header-mobile-top)] z-50 w-[var(--header-mobile-width)] -translate-x-1/2 md:top-[var(--header-desktop-top)] md:w-[var(--header-desktop-width)] ${
          hidden ? "pointer-events-none" : ""
        }`}
      >
        <motion.div
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: -24 }
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
          {/* Existing animated border */}
          <div className="header-moving-border relative rounded-full p-[2px] shadow-[0_0_35px_rgba(239,68,68,0.16)]">
            <div
              className={`relative z-[1] overflow-hidden rounded-full bg-[var(--header-bg)] ${headerConfig.layout.padding}`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 left-12 h-12 w-44 rounded-full bg-[var(--header-accent)] opacity-25 blur-2xl"
              />

              <div className="relative flex items-center justify-between gap-3">
                {/* Logo */}
                <motion.a
                  href={headerConfig.logo.link}
                  onClick={() =>
                    selectItem(headerConfig.logo.link)
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label={
                    headerConfig.logo.accessibleLabel
                  }
                  className="block shrink-0 focus-visible:outline-[var(--header-accent)]"
                >
                  <img
                    src={headerConfig.logo.image}
                    alt={headerConfig.logo.alt}
                    draggable={false}
                    className="block h-auto w-[var(--logo-mobile-width)] object-contain sm:w-[var(--logo-desktop-width)]"
                  />
                </motion.a>

                {/* Desktop menu */}
                <nav
                  aria-label={
                    headerConfig.labels.desktopNavigation
                  }
                  className="hidden lg:block"
                >
                  <ul
                    className={`flex items-center ${headerConfig.menu.desktopGap}`}
                  >
                    {headerConfig.menu.items.map(
                      ({ label, href, newTab }) => (
                        <li key={href}>
                          <motion.a
                            href={href}
                            target={
                              newTab ? "_blank" : undefined
                            }
                            rel={
                              newTab
                                ? "noopener noreferrer"
                                : undefined
                            }
                            onClick={() =>
                              selectItem(href, newTab)
                            }
                            aria-current={
                              active === href
                                ? "location"
                                : undefined
                            }
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`block transition-colors focus-visible:outline-[var(--header-accent)] ${
                              headerConfig.menu.desktopFont
                            } ${
                              active === href
                                ? "text-[var(--header-accent)]"
                                : "text-[var(--header-text)] hover:text-[var(--header-accent)]"
                            }`}
                          >
                            {label}
                          </motion.a>
                        </li>
                      )
                    )}
                  </ul>
                </nav>

                <div className="flex shrink-0 items-center gap-3">
                  {/* Contact button */}
                  {headerConfig.button.show && (
                    <motion.a
                      href={headerConfig.button.href}
                      target={
                        headerConfig.button.newTab
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        headerConfig.button.newTab
                          ? "noopener noreferrer"
                          : undefined
                      }
                      onClick={() => setMenuOpen(false)}
                      whileHover={{
                        scale: 1.04,
                        boxShadow: hoverShadow,
                      }}
                      whileTap={{ scale: 0.96 }}
                      className={`rounded-full border border-[var(--header-button-bg)] bg-[var(--header-button-bg)] text-[var(--header-button-text)] shadow-[inset_0_0_12px_rgba(239,68,68,0.35),0_0_10px_rgba(239,68,68,0.2)] focus-visible:outline-[var(--header-accent)] ${headerConfig.button.font} ${headerConfig.button.padding}`}
                    >
                      {headerConfig.button.text}
                    </motion.a>
                  )}

                  {/* Mobile toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      setMenuOpen((open) => !open)
                    }
                    aria-label={
                      menuOpen
                        ? headerConfig.labels.closeMenu
                        : headerConfig.labels.openMenu
                    }
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--header-accent)] text-[var(--header-text)] focus-visible:outline-[var(--header-accent)] lg:hidden"
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

          {/* Mobile menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                id="mobile-navigation"
                aria-label={
                  headerConfig.labels.mobileNavigation
                }
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
                className="mt-3 max-h-[65vh] overflow-y-auto rounded-3xl border border-[var(--header-accent)] bg-[var(--header-bg)] p-3 shadow-lg lg:hidden"
              >
                <ul className="space-y-1">
                  {headerConfig.menu.items.map(
                    ({ label, href, newTab }) => (
                      <li key={href}>
                        <a
                          href={href}
                          target={
                            newTab ? "_blank" : undefined
                          }
                          rel={
                            newTab
                              ? "noopener noreferrer"
                              : undefined
                          }
                          onClick={() =>
                            selectItem(href, newTab)
                          }
                          aria-current={
                            active === href
                              ? "location"
                              : undefined
                          }
                          className={`block rounded-xl px-4 py-3 transition-colors focus-visible:outline-[var(--header-accent)] ${
                            headerConfig.menu.mobileFont
                          } ${
                            active === href
                              ? "bg-black/5 text-[var(--header-accent)]"
                              : "text-[var(--header-text)] hover:bg-black/5 hover:text-[var(--header-accent)]"
                          }`}
                        >
                          {label}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>
        
      </header>
    </MotionConfig>
  );
}