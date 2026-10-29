"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface AnimatedNumberProps {
  value: number;
  formatter?: (val: number) => string;
  duration?: number;
  className?: string;
}

export default function AnimatedNumber({
  value,
  formatter = (v) => Math.round(v).toLocaleString(),
  duration = 0.65,
  className,
}: AnimatedNumberProps) {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const currentObjRef = useRef<{ val: number }>({ val: value });
  const formatterRef = useRef(formatter);
  const [initialDisplay] = useState(() => formatter(value));

  useEffect(() => {
    formatterRef.current = formatter;
  }, [formatter]);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || currentObjRef.current.val === value) {
      currentObjRef.current.val = value;
      el.textContent = formatterRef.current(value);
      return;
    }

    const tween = gsap.to(currentObjRef.current, {
      val: value,
      duration,
      ease: "power3.out",
      onUpdate: () => {
        if (spanRef.current) {
          spanRef.current.textContent = formatterRef.current(
            currentObjRef.current.val
          );
        }
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, duration]);

  return (
    <span ref={spanRef} className={className}>
      {initialDisplay}
    </span>
  );
}
