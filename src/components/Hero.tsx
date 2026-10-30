"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ArrowDownRight, Sparkles, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ESTATE_DETAILS, VILLA_RESIDENCES } from "@/data/villa";
import AnimatedNumber from "./AnimatedNumber";
import {
  SANCTUARY_EASE,
  SANCTUARY_SPRING,
  staggerContainer,
  editorialFadeUp,
} from "@/lib/motion-variants";

gsap.registerPlugin(ScrollTrigger);

interface ArchitecturalHotspot {
  id: string;
  top: string;
  left: string;
  label: string;
  detail: string;
}

const VILLA_HOTSPOTS: Record<string, ArchitecturalHotspot[]> = {
  "canopy-pool-villa": [
    {
      id: "h1",
      top: "38%",
      left: "42%",
      label: "Suspended Master Suite",
      detail: "Cantilevered 18m above gorge floor with ironwood trusses",
    },
    {
      id: "h2",
      top: "68%",
      left: "62%",
      label: "14m Mineral Plunge Pool",
      detail: "Volcanic artisan spring water naturally heated to 29°C",
    },
    {
      id: "h3",
      top: "52%",
      left: "22%",
      label: "Outdoor Terrazzo Tub",
      detail: "Monolithic hand-carved stone bath open to valley canopy",
    },
  ],
  "riverbank-sanctuary": [
    {
      id: "h1",
      top: "42%",
      left: "32%",
      label: "Twin Vernacular Pavilions",
      detail: "Century-old salvaged Ulin timber connected by open breezeway",
    },
    {
      id: "h2",
      top: "70%",
      left: "58%",
      label: "18m Waterfront Lap Pool",
      detail: "Infinity edge kissing the Ayung River limestone rapids",
    },
    {
      id: "h3",
      top: "58%",
      left: "78%",
      label: "Riverside Meditation Shala",
      detail: "Private bamboo pavilion positioned directly on the water",
    },
  ],
  "grand-ridge-estate": [
    {
      id: "h1",
      top: "34%",
      left: "48%",
      label: "Curved Lumbung Canopy",
      detail: "Sweeping architectural roofline inspired by Balinese granaries",
    },
    {
      id: "h2",
      top: "66%",
      left: "68%",
      label: "22m Springboard Lap Pool",
      detail: "Dramatic cantilevered pool projected over the sunset ridge axis",
    },
    {
      id: "h3",
      top: "54%",
      left: "24%",
      label: "Sunken Fire Pit Lounge",
      detail: "Circular basalt stone lounge with evening woodfire hearth",
    },
  ],
};

interface HeroProps {
  onQuickSelect?: (villaId: string, guests?: number) => void;
}

export default function Hero({ onQuickSelect }: HeroProps) {
  const [activeVillaId, setActiveVillaId] = useState(VILLA_RESIDENCES[0].id);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement | null>(null);
  const parallaxFrameRef = useRef<HTMLDivElement | null>(null);

  const handleSelectAndScroll = (id: string) => {
    setActiveVillaId(id);
    if (onQuickSelect) {
      onQuickSelect(id, 2);
    }
  };

  const handlePreviewVilla = (id: string) => {
    setActiveVillaId(id);
    setActiveHotspotId(null);
  };

  const currentVilla =
    VILLA_RESIDENCES.find((v) => v.id === activeVillaId) || VILLA_RESIDENCES[0];
  const hotspots = VILLA_HOTSPOTS[activeVillaId] || VILLA_HOTSPOTS["canopy-pool-villa"];

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setCardTilt({ x: -py * 8, y: px * 8 });
  };

  const handlePointerLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-telemetry-badge", {
        opacity: 0,
        y: -12,
        duration: 0.7,
        delay: 0.1,
      })
        .from(
          ".hero-editorial-line",
          {
            y: 44,
            opacity: 0,
            duration: 0.95,
            stagger: 0.14,
          },
          "-=0.4"
        )
        .from(
          ".hero-editorial-body",
          {
            opacity: 0,
            y: 18,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          ".hero-cta-cluster",
          {
            opacity: 0,
            y: 16,
            duration: 0.7,
          },
          "-=0.4"
        );

      if (parallaxFrameRef.current) {
        gsap.to(parallaxFrameRef.current, {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[92vh] flex flex-col justify-between pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-10 overflow-hidden bg-[#F7F4EE] border-b border-[#E2DDD3]"
    >
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 xl:col-span-7 space-y-7"
          >
            <div className="hero-telemetry-badge flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8D4A33] animate-pulse" />
              <span className="text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-[#665F56] font-medium font-mono">
                {ESTATE_DETAILS.elevation} &bull; {ESTATE_DETAILS.riverValley}
              </span>
            </div>

            <div className="space-y-1">
              <div className="overflow-hidden">
                <h1 className="hero-editorial-line font-serif text-4xl sm:text-6xl xl:text-7xl text-[#151412] leading-[1.02] font-light tracking-tight">
                  Archipelagic
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="hero-editorial-line font-serif text-4xl sm:text-6xl xl:text-7xl text-[#8D4A33] italic leading-[1.02] font-light">
                  Modernism
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="hero-editorial-line font-serif text-4xl sm:text-6xl xl:text-7xl text-[#151412] leading-[1.02] font-light tracking-tight">
                  In Slow Valley Solitude.
                </h1>
              </div>
            </div>

            <p className="hero-editorial-body text-xs sm:text-sm lg:text-base text-[#5C574F] max-w-xl font-light leading-relaxed">
              Anchored along the ancient limestone ridges of Ubud&apos;s Ayung
              gorge, AMARTA is an unhurried sanctuary of three monolithic
              private pool residences, woven quietly into tropical rainforest
              canopy and artisan volcanic stone terracing.
            </p>

            <div className="space-y-2 pt-1">
              <span className="text-[9px] tracking-[0.26em] uppercase text-[#665F56] font-semibold block">
                Select Residence Monograph:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {VILLA_RESIDENCES.map((residence) => {
                  const isSelected = residence.id === activeVillaId;
                  return (
                    <motion.button
                      key={residence.id}
                      type="button"
                      onClick={() => handlePreviewVilla(residence.id)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={SANCTUARY_SPRING}
                      className={`relative min-h-[48px] p-2.5 text-left border transition-all flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden ${
                        isSelected
                          ? "border-[#8D4A33] bg-[#EFECE4] shadow-xs"
                          : "border-[#E2DDD3] bg-transparent hover:bg-[#EFECE4]/60"
                      }`}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="hero-selected-villa-border"
                          transition={SANCTUARY_SPRING}
                          className="absolute inset-0 border border-[#8D4A33]"
                        />
                      )}
                      <span className="text-[8px] tracking-[0.2em] uppercase text-[#8D4A33] font-mono">
                        {residence.poolLengthMeters}m Pool &bull; {residence.sizeSqm}m&sup2;
                      </span>
                      <span className="font-serif text-xs sm:text-sm text-[#151412] font-light truncate group-hover:text-[#8D4A33] transition-colors mt-0.5">
                        {residence.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <motion.div
              variants={editorialFadeUp}
              className="hero-cta-cluster flex flex-wrap items-center gap-4 pt-2"
            >
              <motion.button
                type="button"
                onClick={() => handleSelectAndScroll(currentVilla.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={SANCTUARY_SPRING}
                className="min-h-[48px] px-6 py-3 bg-[#151412] text-[#F7F4EE] hover:bg-[#8D4A33] text-[10px] tracking-[0.24em] uppercase transition-colors inline-flex items-center gap-2.5 shadow-sm focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden"
              >
                <span>Reserve {currentVilla.name}</span>
                <ArrowDownRight className="w-3.5 h-3.5 text-[#C57D65]" />
              </motion.button>

              <motion.a
                href="#villas"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
                className="min-h-[48px] inline-flex items-center gap-2 text-[#5C574F] hover:text-[#151412] text-[11px] tracking-[0.22em] uppercase transition-colors py-2 border-b border-[#151412]/40 hover:border-[#151412] focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden"
              >
                <span>Inspect The 3 Residences</span>
              </motion.a>
            </motion.div>
          </motion.div>

          <div className="lg:col-span-6 xl:col-span-5">
            <div ref={parallaxFrameRef}>
              <motion.div
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.85, delay: 0.15, ease: SANCTUARY_EASE }}
                className="space-y-2.5"
              >
                <div className="flex items-center justify-between border border-[#E2DDD3] bg-[#EFECE4] px-3.5 py-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8D4A33] animate-pulse" />
                    <span className="text-[9px] tracking-[0.22em] uppercase text-[#5C574F] font-medium">
                      Architectural Monograph
                    </span>
                  </div>
                  <span className="text-[8.5px] tracking-[0.18em] uppercase text-[#8D4A33] font-mono">
                    Hover Hotspots &bull; 3D Tilt
                  </span>
                </div>

                <div
                  onPointerMove={handlePointerMove}
                  onPointerLeave={handlePointerLeave}
                  style={{
                    transform: `perspective(900px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                    transition: "transform 0.16s ease-out",
                  }}
                  className="relative aspect-[4/5] w-full overflow-hidden bg-[#181614] border border-[#E2DDD3] shadow-md select-none group"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`viewport-photo-${currentVilla.id}`}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: SANCTUARY_EASE }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={currentVilla.heroImage}
                        alt={`${currentVilla.name} suspended over Sayan River Valley`}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#151412]/92 via-[#151412]/20 to-transparent pointer-events-none" />

                      <div className="absolute top-4 right-4 bg-[#F7F4EE]/95 px-3 py-1 text-[9px] tracking-[0.26em] uppercase text-[#151412] border border-[#E2DDD3]">
                        {currentVilla.balineseName}
                      </div>

                      {hotspots.map((spot) => {
                        const isHotspotActive = activeHotspotId === spot.id;
                        return (
                          <div
                            key={spot.id}
                            style={{ top: spot.top, left: spot.left }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setActiveHotspotId((prev) =>
                                  prev === spot.id ? null : spot.id
                                )
                              }
                              className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#151412]/90 border border-[#C57D65] text-[#F7F4EE] hover:bg-[#8D4A33] transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#C57D65] focus:outline-hidden"
                              aria-label={`Inspect ${spot.label}`}
                            >
                              <span className="absolute inset-0 rounded-full border border-[#C57D65] animate-ping opacity-60" />
                              <Plus className="w-3.5 h-3.5 text-[#C57D65]" />
                            </button>

                            <AnimatePresence>
                              {isHotspotActive && (
                                <motion.div
                                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                  transition={SANCTUARY_SPRING}
                                  className="absolute bottom-10 left-1/2 -translate-x-1/2 w-52 p-3 bg-[#151412]/95 backdrop-blur-md border border-[#C57D65]/70 text-[#F7F4EE] shadow-2xl z-30"
                                >
                                  <div className="flex items-center gap-1.5 text-[8px] tracking-[0.2em] uppercase text-[#C57D65] font-mono">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    <span>Architectural Detail</span>
                                  </div>
                                  <h4 className="font-serif text-xs text-white font-light mt-1">
                                    {spot.label}
                                  </h4>
                                  <p className="text-[9.5px] text-[#A39E93] font-light leading-snug mt-1">
                                    {spot.detail}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}

                      <div className="absolute bottom-4 left-4 right-4 text-[#F7F4EE] bg-[#151412]/90 backdrop-blur-sm p-4 border border-white/15">
                        <span className="text-[8.5px] tracking-[0.3em] uppercase text-[#C57D65] block mb-1">
                          {currentVilla.balineseName} &bull; {currentVilla.viewType}
                        </span>
                        <p className="font-serif text-xl sm:text-2xl text-white font-light">
                          {currentVilla.name}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-[#E2DDD3] tracking-widest uppercase mt-2 pt-2 border-t border-white/20">
                          <span>
                            <AnimatedNumber value={currentVilla.sizeSqm} />{" "}
                            m&sup2; &bull;{" "}
                            <AnimatedNumber value={currentVilla.poolLengthMeters} />
                            m Spring Pool
                          </span>
                          <span className="text-[#C57D65]">
                            {currentVilla.capacity}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
