import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spring = {
    stiffness: 500,
    damping: 35,
    mass: 0.5,
  };

  const x = useSpring(mouseX, spring);
  const y = useSpring(mouseY, spring);

  useEffect(() => {
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );

    const update = () => setEnabled(media.matches);

    update();
    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let entered = false;

    const updateHover = (clientX, clientY) => {
      const target = document.elementFromPoint(clientX, clientY);

      if (!target) {
        setHovered(false);
        return;
      }

      // যেকোনো element-এ চাইলে effect বন্ধ করা যাবে।
      if (target.closest('[data-cursor="default"]')) {
        setHovered(false);
        return;
      }

      // পুরো Header-এ (logo, menu, theme button, Enquire button)
      // এবং footer navigation-এ বড় cursor হবে না।
      const noZone = target.closest(
        "header, footer nav, " +
          'footer [role="navigation"]'
      );

      if (noZone) {
        setHovered(false);
        return;
      }

      // Image, portrait, button এবং অন্য links-এ arrow দেখাবে।
      setHovered(
        Boolean(
          target.closest(
            'img, picture, ' +
              '#home [data-cursor="image"], ' +
              'a, button:not(:disabled), [role="button"], ' +
              '[data-cursor="hover"], [data-cursor="image"]'
          )
        )
      );
    };

    const move = (event) => {
      if (event.pointerType !== "mouse") return;

      mouseX.set(event.clientX);
      mouseY.set(event.clientY);

      if (!entered) {
        x.jump(event.clientX);
        y.jump(event.clientY);
        entered = true;
      }

      setVisible(true);
      updateHover(event.clientX, event.clientY);
    };

    const hide = () => {
      entered = false;
      setVisible(false);
      setHovered(false);
    };

    const handleScroll = () => {
      if (entered) {
        updateHover(mouseX.get(), mouseY.get());
      }
    };

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);

    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [enabled, mouseX, mouseY, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[2147483647] h-0 w-0"
      style={{ x, y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className="absolute flex items-center justify-center overflow-hidden rounded-full bg-red-500"
        style={{
          x: "-50%",
          y: "-50%",
        }}
        initial={false}
        animate={{
          width: hovered ? 56 : 16,
          height: hovered ? 56 : 16,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 shrink-0 text-white"
          initial={false}
          animate={{
            opacity: hovered ? 1 : 0,
            scale: hovered ? 1 : 0.5,
          }}
          transition={{ duration: 0.18 }}
        >
          <path d="M7 17 17 7M7 7h10v10" />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
}
