"use client";

import { useState, useRef } from "react";
import { MapPin, ArrowUpRight, Compass, Navigation } from "lucide-react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ESTATE_DETAILS, ARRIVAL_EXPERIENCE } from "@/data/villa";
import { SANCTUARY_SPRING } from "@/lib/motion-variants";
import ArrivalElevationMap from "./ArrivalElevationMap";

gsap.registerPlugin(ScrollTrigger);

export default function EstateCoordinates() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  const nearbyPoints = [
    {
      destination: "Ngurah Rai International Airport (DPS)",
      time: "70-80 Min",
      note: "Direct private airport escort included in Grand Ridge or upon request",
    },
    {
      destination: "Ubud Royal Palace & Traditional Art Market",
      time: "12 Min",
      note: "Complimentary on-demand estate car shuttle",
    },
    {
      destination: "Campuhan Ridge Scenic Walking Trail",
      time: "10 Min",
      note: "Morning walking trail with private guide",
    },
    {
      destination: "Tirta Empul Holy Water Temple (Tampak Siring)",
      time: "35 Min",
      note: "Curated spiritual purification pilgrimage",
    },
  ];

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      gsap.from(".coords-rule", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.05,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
        },
      });

      gsap.from(".coords-reveal", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="coordinates"
      className="py-16 sm:py-28 lg:py-36 bg-[#F7F4EE]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="relative pb-6 mb-14 sm:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 coords-reveal">
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#8D4A33] font-medium block">
                06 &bull; Topography &bull; Arrival Protocol
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#151412] leading-[1.08] font-light max-w-2xl">
                Arriving at the edge of the Sayan gorge.
              </h2>
            </div>
            <p className="coords-reveal text-xs sm:text-sm text-[#5C574F] max-w-md font-light leading-relaxed">
              Perched 240 meters above sea level where the Ayung River bends,
              AMARTA is secluded from traffic yet effortlessly connected to Bali.
            </p>
          </div>
          <div
            aria-hidden="true"
            className="coords-rule absolute inset-x-0 bottom-0 h-px bg-[#E2DDD3]"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-6 space-y-8 coords-reveal">
            <div className="space-y-3 border-b border-[#E2DDD3] pb-6">
              <span className="text-[9px] tracking-[0.28em] uppercase text-[#8D4A33] font-semibold block">
                Estate Coordinates &amp; Location
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#151412] font-light">
                AMARTA Sanctuary &bull; Sayan Ubud
              </h3>
              <p className="text-xs sm:text-sm text-[#5C574F] font-light leading-relaxed">
                {ESTATE_DETAILS.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 py-2 border-b border-[#E2DDD3] pb-6">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[9px] tracking-[0.22em] uppercase text-[#665F56]">
                  <Compass className="w-3.5 h-3.5 text-[#8D4A33]" />
                  Geographic Coordinates
                </span>
                <p className="font-serif text-lg text-[#151412] font-light">
                  {ESTATE_DETAILS.coordinates}
                </p>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[9px] tracking-[0.22em] uppercase text-[#665F56]">
                  <Navigation className="w-3.5 h-3.5 text-[#8D4A33]" />
                  Valley Elevation
                </span>
                <p className="font-serif text-lg text-[#151412] font-light">
                  {ESTATE_DETAILS.elevation}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[9px] tracking-[0.26em] uppercase text-[#665F56] font-semibold block">
                Accessibility &amp; Transit Estimates
              </span>
              <div className="divide-y divide-[#E2DDD3]">
                {nearbyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="py-3.5 flex items-baseline justify-between gap-4 first:pt-0"
                  >
                    <div className="space-y-0.5 max-w-sm">
                      <div className="text-xs font-medium text-[#151412]">
                        {point.destination}
                      </div>
                      <div className="text-[11px] text-[#5C574F] font-light">
                        {point.note}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#8D4A33] shrink-0 font-serif">
                      {point.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <motion.a
                href="https://maps.google.com/?q=-8.50394,115.24522"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.99 }}
                transition={SANCTUARY_SPRING}
                className="min-h-[44px] inline-flex items-center gap-2.5 text-[11px] tracking-[0.22em] uppercase text-[#151412] hover:text-[#8D4A33] font-medium border-b border-[#151412] hover:border-[#8D4A33] pb-0.5 transition-colors focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden"
              >
                <MapPin className="w-3.5 h-3.5 text-[#8D4A33]" />
                <span>Open Satellite Coordinates in Google Maps</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.a>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-8 lg:border-l lg:border-[#E2DDD3] lg:pl-12 coords-reveal">
            <ArrivalElevationMap
              activeStepIndex={activeStepIndex}
              onSelectStep={setActiveStepIndex}
            />

            <div className="border-b border-[#E2DDD3] pb-2 flex items-center justify-between">
              <span className="text-[9px] tracking-[0.28em] uppercase text-[#665F56] font-semibold block">
                The Welcoming Sequence
              </span>
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#8D4A33]">
                Select Step to Inspect Elevation
              </span>
            </div>

            <div className="space-y-4">
              {ARRIVAL_EXPERIENCE.map((item, idx) => {
                const isSelected = idx === activeStepIndex;
                return (
                  <motion.button
                    key={item.step}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setActiveStepIndex(idx)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.992 }}
                    transition={SANCTUARY_SPRING}
                    className={`relative w-full text-left p-4 border transition-colors flex gap-5 group focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden ${
                      isSelected
                        ? "border-transparent"
                        : "border-[#E2DDD3] bg-transparent hover:bg-[#EFECE4]/50"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="welcoming-step-frame"
                        aria-hidden="true"
                        transition={SANCTUARY_SPRING}
                        className="absolute inset-0 bg-[#EFECE4] border border-[#8D4A33]"
                      />
                    )}
                    <div className="relative z-10 font-serif text-2xl sm:text-3xl text-[#8D4A33] font-light shrink-0">
                      {item.step}
                    </div>
                    <div className="relative z-10 space-y-1.5 pt-0.5">
                      <h3 className="font-serif text-xl sm:text-2xl text-[#151412] font-light group-hover:text-[#8D4A33] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5C574F] font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-[#E2DDD3] space-y-1.5">
              <span className="text-[9px] tracking-[0.24em] uppercase text-[#8D4A33] font-medium block">
                Estate Mobility Provision
              </span>
              <p className="text-xs sm:text-sm text-[#5C574F] font-light leading-relaxed">
                Resident guests enjoy private on-demand round-trip transport to
                Ubud Center daily between 08:00 and 21:00 WITA.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
