"use client";

import { useEffect, useRef, useState } from "react";
import { Wind } from "lucide-react";

interface BreezeStreamCanvasProps {
  className?: string;
  intensity?: number;
}

interface StreamlineParticle {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  thickness: number;
  waveFreq: number;
  waveAmp: number;
  phase: number;
}

export default function BreezeStreamCanvas({
  className = "",
  intensity = 1,
}: BreezeStreamCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(true);
  const pointerPosRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -999,
    y: -999,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = (canvas.width = container.clientWidth || 400);
    let height = (canvas.height = container.clientHeight || 260);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth || 400;
      height = canvas.height = container.clientHeight || 260;
    };
    window.addEventListener("resize", handleResize);

    // Generate streamline particles
    const particleCount = 28;
    const particles: StreamlineParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 30 + Math.random() * 55,
        speed: (0.75 + Math.random() * 1.1) * intensity,
        opacity: 0.18 + Math.random() * 0.45,
        thickness: 0.8 + Math.random() * 1.4,
        waveFreq: 0.015 + Math.random() * 0.02,
        waveAmp: 4 + Math.random() * 9,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let animationId: number;
    let t = 0;

    const render = () => {
      animationId = requestAnimationFrame(render);
      if (!isVisible || !isActive) return;

      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.speed;
          if (p.x - p.length > width) {
            p.x = -p.length;
            p.y = Math.random() * height;
          }
        }

        // Deflect gently around cursor if active
        let targetY = p.y + Math.sin(t * 1.2 + p.phase) * p.waveAmp;
        if (pointerPosRef.current.active) {
          const dx = p.x - pointerPosRef.current.x;
          const dy = p.y - pointerPosRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const push = (1 - dist / 80) * 16;
            targetY += dy > 0 ? push : -push;
          }
        }

        // Draw soft glowing streamline
        const grad = ctx.createLinearGradient(
          p.x - p.length,
          targetY,
          p.x,
          targetY
        );
        grad.addColorStop(0, "rgba(247, 244, 238, 0)");
        grad.addColorStop(
          0.6,
          `rgba(215, 208, 196, ${p.opacity * 0.75})`
        );
        grad.addColorStop(1, `rgba(197, 125, 101, ${p.opacity})`);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = p.thickness;
        ctx.lineCap = "round";

        const startX = Math.max(0, p.x - p.length);
        const endX = Math.min(width, p.x);
        const startY =
          p.y +
          Math.sin((startX * p.waveFreq + t * 0.8) + p.phase) * p.waveAmp;

        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(
          startX + (endX - startX) * 0.5,
          targetY,
          endX,
          targetY
        );
        ctx.stroke();

        // Subtle leading mist particle
        ctx.fillStyle = `rgba(247, 244, 238, ${p.opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(endX, targetY, p.thickness * 0.75, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    render();

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerPosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      pointerPosRef.current.active = false;
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [isActive, intensity]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full pointer-events-auto overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-hidden="true"
      />
      {/* Breeze Telemetry Indicator & Toggle */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 pointer-events-auto z-10">
        <button
          type="button"
          onClick={() => setIsActive((prev) => !prev)}
          className="min-h-[32px] px-2 py-1 bg-[#151412]/85 hover:bg-[#8D4A33] text-[#F7F4EE] border border-white/15 text-[8px] tracking-[0.2em] uppercase flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden"
          aria-label={
            isActive
              ? "Pause passive breeze airflow animation"
              : "Resume passive breeze airflow animation"
          }
        >
          <Wind
            className={`w-3 h-3 text-[#C57D65] ${isActive ? "animate-pulse" : "opacity-40"}`}
          />
          <span className="hidden sm:inline">
            {isActive ? "Valley Breeze 1.8 m/s" : "Airflow Paused"}
          </span>
        </button>
      </div>
    </div>
  );
}
