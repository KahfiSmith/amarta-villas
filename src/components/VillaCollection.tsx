"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ArrowUpRight, Maximize2, Waves, Bed, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { VILLA_RESIDENCES } from "@/data/villa";
import AnimatedNumber from "./AnimatedNumber";
import {
  SANCTUARY_EASE,
  SANCTUARY_SPRING,
  panelCrossfade,
} from "@/lib/motion-variants";

gsap.registerPlugin(ScrollTrigger);

interface VillaCollectionProps {
  onSelectVilla?: (villaId: string) => void;
}

export default function VillaCollection({
  onSelectVilla,
}: VillaCollectionProps) {
  const [activeVillaId, setActiveVillaId] = useState(VILLA_RESIDENCES[0].id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  const activeVilla =
    VILLA_RESIDENCES.find((v) => v.id === activeVillaId) || VILLA_RESIDENCES[0];

  const handleVillaTabChange = (id: string) => {
    setActiveVillaId(id);
    setSelectedImageIndex(0);
  };

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      gsap.from(".villa-section-intro", {
        opacity: 0,
        y: 26,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(".villa-header-rule", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.05,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
        },
      });
    },
    { scope: sectionRef }
  );

  const formatIdr = useCallback((num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Math.round(num));
  }, []);

  const currentImageUrl =
    activeVilla.galleryImages[selectedImageIndex] || activeVilla.heroImage;

  return (
    <section
      ref={sectionRef}
      id="villas"
      className="py-16 sm:py-28 lg:py-36 bg-[#F7F4EE]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="relative pb-6 mb-12 sm:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 villa-section-intro">
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#8D4A33] font-medium block">
                02 &bull; The Residences &bull; Private Compounds
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#151412] leading-[1.08] font-light">
                Three singular architectural sanctuaries.
              </h2>
            </div>
            <p className="villa-section-intro text-xs sm:text-sm text-[#5C574F] max-w-md font-light leading-relaxed">
              Each villa is an isolated private estate compound featuring
              volcanic mineral plunge pools, dedicated 24/7 resident butler
              service, and unblocked vistas into the Ayung River valley.
            </p>
          </div>
          <div className="villa-header-rule absolute bottom-0 left-0 right-0 h-[1px] bg-[#E2DDD3]" />
        </div>

        <div className="villa-section-intro grid grid-cols-1 md:grid-cols-3 border-b border-[#E2DDD3] mb-12 sm:mb-16 gap-0">
          {VILLA_RESIDENCES.map((villa, idx) => {
            const isActive = villa.id === activeVillaId;
            return (
              <button
                key={villa.id}
                type="button"
                onClick={() => handleVillaTabChange(villa.id)}
                className={`min-h-[68px] py-5 px-6 text-left transition-colors relative border-t md:border-t-0 md:border-r last:border-r-0 border-[#E2DDD3] focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden ${
                  isActive
                    ? "bg-[#EFECE4] text-[#151412]"
                    : "bg-transparent text-[#5C574F] hover:text-[#151412] hover:bg-[#F2EFE8]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="villa-compound-indicator"
                    transition={SANCTUARY_SPRING}
                    className="absolute top-0 left-0 right-0 h-[2px] bg-[#8D4A33]"
                  />
                )}
                <div className="flex items-center justify-between text-[9px] tracking-[0.24em] uppercase text-[#665F56] mb-1">
                  <span>Compound 0{idx + 1}</span>
                  <span className="text-[#8D4A33] font-medium">
                    {villa.bedrooms} Master Suite
                  </span>
                </div>
                <div className="font-serif text-xl sm:text-2xl text-[#151412] font-light">
                  {villa.name}
                </div>
                <div className="text-[11px] text-[#5C574F] font-light mt-1">
                  {villa.balineseName} &bull; {villa.sizeSqm} m&sup2; &bull;{" "}
                  {villa.poolLengthMeters}m Pool
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[16/11] overflow-hidden border border-[#E2DDD3] bg-[#181614]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeVilla.id}-${selectedImageIndex}`}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: SANCTUARY_EASE }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentImageUrl}
                    alt={`${activeVilla.name} at Amarta Sayan Ubud`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-[#151412]/85 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-4 left-4 bg-[#151412]/90 text-[#F7F4EE] px-3.5 py-1 text-[9px] tracking-[0.26em] uppercase border border-white/15">
                {activeVilla.viewType}
              </div>

              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-[#F7F4EE]">
                <div className="bg-[#151412]/80 px-3.5 py-2 border border-white/15">
                  <span className="text-[9px] tracking-[0.28em] uppercase text-[#C57D65] block">
                    {activeVilla.balineseName}
                  </span>
                  <p className="font-serif text-xl sm:text-2xl text-white font-light">
                    {activeVilla.name}
                  </p>
                </div>
                <span className="text-[9px] tracking-widest uppercase bg-[#151412]/90 px-2.5 py-1.5 border border-white/20 text-[#E2DDD3]">
                  0{selectedImageIndex + 1} / 0
                  {activeVilla.galleryImages.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {activeVilla.galleryImages.map((imgUrl, i) => (
                <motion.button
                  key={`${activeVilla.id}-thumb-${i}`}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedImageIndex(i)}
                  aria-label={`View ${activeVilla.name} photograph ${i + 1}`}
                  className={`relative aspect-[16/10] min-h-[56px] overflow-hidden border transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden ${
                    selectedImageIndex === i
                      ? "border-[#8D4A33] ring-1 ring-[#8D4A33] opacity-100"
                      : "border-[#E2DDD3] opacity-65 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${activeVilla.name} perspective ${i + 1}`}
                    fill
                    sizes="(max-width: 1024px) 33vw, 19vw"
                    className="object-cover"
                  />
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`note-${activeVilla.id}`}
                variants={panelCrossfade}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-5 sm:p-6 bg-[#EFECE4] border border-[#E2DDD3] space-y-1.5"
              >
                <span className="text-[9px] tracking-[0.26em] uppercase text-[#8D4A33] font-medium block">
                  Vernacular Blueprint &bull; Architectural Concept
                </span>
                <p className="text-xs sm:text-sm text-[#5C574F] font-light leading-relaxed">
                  {activeVilla.architecturalNote}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`title-${activeVilla.id}`}
                variants={panelCrossfade}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-2 border-b border-[#E2DDD3] pb-6"
              >
                <div className="flex items-center gap-2 text-[9px] tracking-[0.26em] uppercase text-[#8D4A33]">
                  <span>{activeVilla.balineseName}</span>
                  <span>&bull;</span>
                  <span>Private Valley Compound</span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#151412] font-light leading-tight">
                  {activeVilla.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C574F] font-light italic leading-relaxed pt-1">
                  &ldquo;{activeVilla.tagline}&rdquo;
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-[#665F56]">
                  <Maximize2 className="w-3 h-3 text-[#8D4A33]" />
                  Total Footprint
                </span>
                <p className="font-serif text-xl text-[#151412] font-light">
                  <AnimatedNumber value={activeVilla.sizeSqm} /> m&sup2;
                </p>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-[#665F56]">
                  <Waves className="w-3 h-3 text-[#8D4A33]" />
                  Springwater Pool
                </span>
                <p className="font-serif text-xl text-[#151412] font-light">
                  <AnimatedNumber value={activeVilla.poolLengthMeters} />m Private
                </p>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-[#665F56]">
                  <Bed className="w-3 h-3 text-[#8D4A33]" />
                  Master Pavilions
                </span>
                <p className="font-serif text-xl text-[#151412] font-light">
                  <AnimatedNumber value={activeVilla.bedrooms} /> King Bed
                </p>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-[#665F56]">
                  <Users className="w-3 h-3 text-[#8D4A33]" />
                  Resident Capacity
                </span>
                <p className="font-serif text-xl text-[#151412] font-light">
                  {activeVilla.capacity}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`desc-${activeVilla.id}`}
                variants={panelCrossfade}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <p className="text-xs sm:text-sm text-[#5C574F] font-light leading-relaxed">
                  {activeVilla.description}
                </p>

                <div className="space-y-3 pt-2">
                  <span className="text-[9px] tracking-[0.25em] uppercase text-[#665F56] font-semibold block">
                    Sanctuary Inclusions &bull; Highlights
                  </span>
                  <ul className="space-y-2">
                    {activeVilla.highlights.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-baseline gap-3 text-xs text-[#151412] font-light"
                      >
                        <span className="w-1.5 h-1.5 bg-[#8D4A33] shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-6 border-t border-[#E2DDD3] space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[9px] tracking-[0.24em] uppercase text-[#665F56] block mb-1">
                    Nightly Residence Tariff
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl text-[#151412] font-light">
                    <AnimatedNumber
                      value={activeVilla.pricePerNightIdr}
                      formatter={formatIdr}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#665F56] uppercase tracking-wider block">
                    approx. USD
                  </span>
                  <span className="text-base text-[#5C574F] font-light">
                    $<AnimatedNumber value={activeVilla.priceUsdEstimate} /> /
                    night
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#5C574F] font-light">
                Includes daily estate breakfast cooked to order, sunset
                botanical tea, scheduled Ubud shuttle, and 24-hour dedicated
                butler service.
              </p>

              <div className="pt-2">
                <motion.a
                  href="#concierge"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    if (onSelectVilla) {
                      onSelectVilla(activeVilla.id);
                    }
                  }}
                  className="group w-full min-h-[48px] flex items-center justify-center gap-3 bg-[#151412] hover:bg-[#8D4A33] text-[#F7F4EE] py-4 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 font-medium focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden"
                >
                  <span>Reserve {activeVilla.name}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C57D65] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
