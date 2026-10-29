"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDownRight, Compass, ShieldCheck, Box, Camera } from "lucide-react";
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
  maskLineReveal,
} from "@/lib/motion-variants";

gsap.registerPlugin(ScrollTrigger);

const Sanctuary3DScene = dynamic(() => import("./Sanctuary3DScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#181614] flex flex-col items-center justify-center p-6 text-center">
      <span className="text-[10px] tracking-[0.28em] uppercase text-[#C57D65] block mb-2">
        Initializing Sayan Gorge 3D Relief
      </span>
      <span className="font-serif text-lg text-[#F7F4EE] font-light">
        Sculpting Volcanic Basalt Contours (240m ASL)...
      </span>
    </div>
  ),
});

interface HeroProps {
  onQuickSelect?: (villaId: string, guests?: number) => void;
}

export default function Hero({ onQuickSelect }: HeroProps) {
  const [activeVillaId, setActiveVillaId] = useState(VILLA_RESIDENCES[0].id);
  const [viewMode, setViewMode] = useState<"3d" | "photo">("3d");
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
  };

  const currentVilla =
    VILLA_RESIDENCES.find((v) => v.id === activeVillaId) || VILLA_RESIDENCES[0];

  // GSAP ScrollTrigger handles continuous scroll-scrubbed depth parallax on a dedicated outer wrapper
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion || !parallaxFrameRef.current || !sectionRef.current) {
        return;
      }

      gsap.to(parallaxFrameRef.current, {
        yPercent: 4.5,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  const headlineLines = [
    "Where rainforest",
    "mist meets living",
    "volcanic stone.",
  ];

  return (
    <section
      ref={sectionRef}
      className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-32 overflow-hidden bg-[#F7F4EE]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Top Editorial Index Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: SANCTUARY_EASE }}
          className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2DDD3] pb-4 mb-8 sm:mb-12 gap-3"
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[9px] sm:text-[10px] tracking-[0.28em] text-[#665F56] uppercase">
            <span>{ESTATE_DETAILS.riverValley}</span>
            <span className="text-[#8D4A33]">&bull;</span>
            <span>{ESTATE_DETAILS.coordinates}</span>
            <span className="text-[#8D4A33]">&bull;</span>
            <span>{ESTATE_DETAILS.elevation}</span>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[9px] sm:text-[10px] tracking-[0.24em] text-[#8D4A33] uppercase font-medium">
              Private Sanctuary &bull; 3 Exclusive Estates
            </span>
          </div>
        </motion.div>

        {/* Editorial Magazine Hero Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end mb-14 sm:mb-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 xl:col-span-7 space-y-6 sm:space-y-8"
          >
            {/* Masked Line-by-Line Architectural Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-[4.25rem] text-[#151412] leading-[1.05] tracking-tight font-light">
              {headlineLines.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-1 -mb-1">
                  <motion.span variants={maskLineReveal} className="block">
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              variants={editorialFadeUp}
              className="text-base sm:text-lg text-[#5C574F] font-light leading-relaxed max-w-xl"
            >
              Anchored along the sacred limestone ridges of the Ayung River
              gorge, AMARTA is an unhurried sanctuary of three monolithic
              private pool residences sculpted from reclaimed ironwood, volcanic
              basalt, and hillside artisan springs.
            </motion.p>

            {/* Interactive Residence Quick-Preview Selector */}
            <motion.div variants={editorialFadeUp} className="space-y-2.5 pt-1">
              <span className="text-[10px] tracking-[0.24em] uppercase text-[#665F56] block font-medium">
                Inspect Residence Elevation in 3D Relief:
              </span>
              <div className="flex flex-wrap gap-2">
                {VILLA_RESIDENCES.map((villa, idx) => {
                  const isCurrent = villa.id === activeVillaId;
                  return (
                    <motion.button
                      key={villa.id}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePreviewVilla(villa.id)}
                      className={`relative min-h-[44px] px-3.5 py-2 text-xs tracking-wider uppercase transition-colors border focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden ${
                        isCurrent
                          ? "text-[#F7F4EE] border-[#151412]"
                          : "bg-[#EFECE4] text-[#5C574F] hover:text-[#151412] border-[#E2DDD3]"
                      }`}
                    >
                      {isCurrent && (
                        <motion.span
                          layoutId="hero-preview-pill"
                          transition={SANCTUARY_SPRING}
                          className="absolute inset-0 bg-[#151412]"
                        />
                      )}
                      <span className="relative z-10">
                        0{idx + 1} &bull; {villa.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Primary & Secondary CTAs */}
            <motion.div
              variants={editorialFadeUp}
              className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6"
            >
              <motion.a
                href="#concierge"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleSelectAndScroll(activeVillaId)}
                className="group min-h-[48px] inline-flex items-center gap-3 bg-[#151412] hover:bg-[#8D4A33] text-[#F7F4EE] px-7 py-4 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 font-medium focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden"
              >
                <span>Curate Sanctuary Stay</span>
                <ArrowDownRight className="w-3.5 h-3.5 text-[#C57D65] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </motion.a>

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

          {/* Interactive 3D Topographic Relief & Architectural Photography Frame */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div ref={parallaxFrameRef}>
              <motion.div
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.85, delay: 0.15, ease: SANCTUARY_EASE }}
                className="space-y-2.5"
              >
                {/* Frame Mode Switcher with Shared Layout Indicator */}
                <div className="flex flex-wrap items-center justify-between gap-2 border border-[#E2DDD3] bg-[#EFECE4] p-1.5">
                  <span className="text-[9px] tracking-[0.22em] uppercase text-[#5C574F] pl-2 font-medium">
                    Monograph Viewport
                  </span>
                  <div className="flex items-center gap-1 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setViewMode("3d")}
                      className={`relative flex-1 sm:flex-initial justify-center min-h-[44px] px-2.5 sm:px-3.5 py-2 text-[8.5px] sm:text-[9px] tracking-[0.16em] sm:tracking-[0.2em] uppercase inline-flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden ${
                        viewMode === "3d"
                          ? "text-[#F7F4EE]"
                          : "text-[#5C574F] hover:text-[#151412]"
                      }`}
                    >
                      {viewMode === "3d" && (
                        <motion.span
                          layoutId="hero-viewport-mode"
                          transition={SANCTUARY_SPRING}
                          className="absolute inset-0 bg-[#151412]"
                        />
                      )}
                      <Box className="relative z-10 w-3.5 h-3.5 text-[#C57D65] shrink-0" />
                      <span className="relative z-10">3D Gorge Relief</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewMode("photo")}
                      className={`relative flex-1 sm:flex-initial justify-center min-h-[44px] px-2.5 sm:px-3.5 py-2 text-[8.5px] sm:text-[9px] tracking-[0.16em] sm:tracking-[0.2em] uppercase inline-flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden ${
                        viewMode === "photo"
                          ? "text-[#F7F4EE]"
                          : "text-[#5C574F] hover:text-[#151412]"
                      }`}
                    >
                      {viewMode === "photo" && (
                        <motion.span
                          layoutId="hero-viewport-mode"
                          transition={SANCTUARY_SPRING}
                          className="absolute inset-0 bg-[#151412]"
                        />
                      )}
                      <Camera className="relative z-10 w-3.5 h-3.5 text-[#C57D65] shrink-0" />
                      <span className="relative z-10">Photograph</span>
                    </button>
                  </div>
                </div>

                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#181614] border border-[#E2DDD3]">
                  <AnimatePresence mode="wait">
                    {viewMode === "3d" ? (
                      <motion.div
                        key="viewport-3d"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: SANCTUARY_EASE }}
                        className="w-full h-full"
                      >
                        <Sanctuary3DScene
                          activeVillaId={activeVillaId}
                          onSelectVilla={handlePreviewVilla}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`viewport-photo-${currentVilla.id}`}
                        initial={{ opacity: 0, scale: 1.03 }}
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
                          className="object-cover transition-transform duration-1000 ease-out hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#151412]/90 via-[#151412]/25 to-transparent pointer-events-none" />

                        <div className="absolute top-4 right-4 bg-[#F7F4EE]/95 px-3 py-1 text-[9px] tracking-[0.26em] uppercase text-[#151412] border border-[#E2DDD3]">
                          Monograph 01
                        </div>

                        <div className="absolute bottom-5 left-5 right-5 text-[#F7F4EE] bg-[#151412]/85 p-4 border border-white/15">
                          <span className="text-[9px] tracking-[0.3em] uppercase text-[#C57D65] block mb-1">
                            {currentVilla.balineseName} &bull;{" "}
                            {currentVilla.viewType}
                          </span>
                          <p className="font-serif text-xl sm:text-2xl text-white font-light">
                            {currentVilla.name}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-[#E2DDD3] tracking-widest uppercase mt-2 pt-2 border-t border-white/20">
                            <span>
                              <AnimatedNumber value={currentVilla.sizeSqm} />{" "}
                              m&sup2; &bull;{" "}
                              <AnimatedNumber
                                value={currentVilla.poolLengthMeters}
                              />
                              m Spring Pool
                            </span>
                            <span className="text-[#C57D65]">
                              {currentVilla.capacity}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Quiet Concierge Gateway */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.3, ease: SANCTUARY_EASE }}
          className="border border-[#E2DDD3] bg-[#EFECE4] p-5 sm:p-6 lg:p-7"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="text-[9px] tracking-[0.3em] uppercase text-[#665F56] font-semibold flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#8D4A33]" />
                Direct Estate Atelier &bull; Select Residence
              </span>
              <p className="text-xs text-[#5C574F]">
                Three standalone compounds nestled in the Sayan Gorge with
                dedicated 24-hour resident butler.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {VILLA_RESIDENCES.map((villa, idx) => {
                const isSelected = villa.id === activeVillaId;
                return (
                  <motion.button
                    key={villa.id}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectAndScroll(villa.id)}
                    className={`min-h-[48px] px-3.5 py-2.5 text-left transition-colors border text-xs focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden ${
                      isSelected
                        ? "bg-[#151412] text-[#F7F4EE] border-[#151412]"
                        : "bg-[#FFFFFF] text-[#5C574F] hover:text-[#151412] border-[#E2DDD3] hover:border-[#665F56]"
                    }`}
                  >
                    <div className="text-[8px] tracking-[0.22em] uppercase opacity-80">
                      0{idx + 1} &bull; {villa.bedrooms} Bed
                    </div>
                    <div className="font-serif text-xs font-normal sm:text-sm mt-0.5">
                      {villa.name}
                    </div>
                  </motion.button>
                );
              })}

              <motion.a
                href="#concierge"
                whileHover={{ y: -1.5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleSelectAndScroll(activeVillaId)}
                className="group min-h-[48px] inline-flex items-center justify-center gap-2 bg-[#8D4A33] hover:bg-[#733B28] text-white px-5 py-3 text-[10px] tracking-[0.24em] uppercase transition-colors duration-300 font-medium focus-visible:ring-2 focus-visible:ring-[#151412] focus:outline-hidden"
              >
                <span>Reserve Residence</span>
                <ArrowDownRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </motion.a>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-[#E2DDD3] flex flex-wrap items-center justify-between text-[10px] text-[#5C574F] gap-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8D4A33]" />
              Guaranteed Direct Reservation &bull; Flexible Itinerary
              Modification Up to 14 Days
            </span>
            <span className="tracking-wider uppercase">
              Direct Butler WhatsApp: {ESTATE_DETAILS.phoneDisplay}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
