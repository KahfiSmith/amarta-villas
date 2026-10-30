"use client";

import { useEffect, createContext, useContext, useCallback, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollContextType {
  getLenis: () => Lenis | null;
  scrollTo: (
    target: string | HTMLElement | number,
    options?: { offset?: number; duration?: number }
  ) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  getLenis: () => null,
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const rafTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafTicker);
    gsap.ticker.lagSmoothing(0);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl as HTMLElement, {
            offset: -10,
            duration: 1.4,
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(rafTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const getLenis = useCallback(() => lenisRef.current, []);

  const scrollTo = useCallback(
    (
      target: string | HTMLElement | number,
      options?: { offset?: number; duration?: number }
    ) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, {
          offset: options?.offset ?? (typeof target === "string" ? -70 : 0),
          duration: options?.duration ?? 1.35,
        });
      } else {
        if (typeof target === "number") {
          window.scrollTo({ top: target, behavior: "smooth" });
        } else {
          const el = typeof target === "string" ? document.querySelector(target) : target;
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    },
    []
  );

  return (
    <SmoothScrollContext.Provider value={{ getLenis, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
