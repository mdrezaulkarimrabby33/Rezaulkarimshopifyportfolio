import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

const scrollOptions = {
  autoRaf: true,
  smoothWheel: true,
  lerp: 0.08,
  wheelMultiplier: 0.9,
  syncTouch: false,
  anchors: true,
};

export default function SmoothScroll() {
  return <ReactLenis root options={scrollOptions} />;
}