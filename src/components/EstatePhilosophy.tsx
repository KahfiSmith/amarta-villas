"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Sparkles, Compass, ShieldCheck } from "lucide-react";
import { ESTATE_PHILOSOPHY } from "@/data/villa";
import { SANCTUARY_EASE, SANCTUARY_SPRING } from "@/lib/motion-variants";
import BreezeStreamCanvas from "./BreezeStreamCanvas";

gsap.registerPlugin(ScrollTrigger);

interface MaterialSpecimen {
  id: string;
  index: string;
  name: string;
  origin: string;
  application: string;
  thermalProperty: string;
  acousticDampening: string;
  image: string;
  caption: string;
}

const SPECIMENS: MaterialSpecimen[] = [
  {
    id: "basalt",
    index: "01",
    name: "Volcanic River Basalt",
    origin: "Mount Agung Lahars (<48km)",
    application: "Foundation footings & carved outdoor soaking baths",
    thermalProperty: "High thermal inertia / passive cooling",
    acousticDampening: "-18 dB valley acoustic absorption",
    image:
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1200&q=80",
    caption: "Basalt plinths anchored directly to Ayung gorge bedrock",
  },
  {
    id: "ironwood",
    index: "02",
    name: "Reclaimed Ulin (Ironwood)",
    origin: "Salvaged Archipelago Schooners",
    application: "Suspended cantilever decks & structural gorge pylons",
    thermalProperty: "Class I density / natural weathering barrier",
    acousticDampening: "Subdued footfall resonance",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    caption: "Cantilevered ironwood deck floating 18m over jungle floor",
  },
  {
    id: "rattan",
    index: "03",
    name: "Gianyar Handwoven Rattan",
    origin: "Local Gianyar Guilds (<14km)",
    application: "Continuous airflow screens & solar brise-soleil",
    thermalProperty: "68% open permeability / zero mechanical AC",
    acousticDampening: "Natural windbreak & cicada harmony",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    caption: "Breathable screens allowing natural valley mist to circulate",
  },
];

export default function EstatePhilosophy() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeSpecimenId, setActiveSpecimenId] = useState<string>("basalt");
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  const activeSpecimen =
    SPECIMENS.find((s) => s.id === activeSpecimenId) || SPECIMENS[0];

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      gsap.from(".philosophy-header-reveal", {
        opacity: 0,
        y: 24,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
        },
      });

      gsap.from(".philosophy-rule-draw", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.05,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
        },
      });

      gsap.from(".philosophy-pillar-row", {
        opacity: 0,
        y: 20,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".philosophy-pillar-list",
          start: "top 82%",
        },
      });
    },
    { scope: sectionRef }
  );

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setCardTilt({ x: -py * 7, y: px * 7 });
  };

  const handleCardPointerLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="py-16 sm:py-26 lg:py-32 bg-[#EFECE4] border-t border-b border-[#E2DDD3]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="relative pb-6 mb-12 sm:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 philosophy-header-reveal">
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#8D4A33] font-medium block">
                01 &bull; Sanctuary Ethos &bull; Sayan Ridge
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#151412] leading-[1.08] font-light max-w-2xl">
                Architecture that surrenders to the wild valley contour.
              </h2>
            </div>
            <p className="philosophy-header-reveal text-xs sm:text-sm text-[#5C574F] max-w-md font-light leading-relaxed">
              True quietude cannot be fabricated in concrete monoliths. AMARTA
              was shaped around the centuries-old root structures of native
              breadfruit trees and the sacred Ayung River fault line.
            </p>
          </div>
          <div className="philosophy-rule-draw absolute bottom-0 left-0 right-0 h-[1px] bg-[#E2DDD3]" />
        </div>

        {/* Monograph Split Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Interactive Material & Passive Microclimate Anatomy */}
          <div className="lg:col-span-6 space-y-6">
            {/* Interactive Material Specimen Selector Tabs */}
            <div className="border border-[#E2DDD3] bg-[#F7F4EE] p-1.5 flex flex-wrap gap-1">
              {SPECIMENS.map((specimen) => {
                const isSelected = specimen.id === activeSpecimenId;
                return (
                  <button
                    key={specimen.id}
                    type="button"
                    onClick={() => setActiveSpecimenId(specimen.id)}
                    className={`relative flex-1 min-h-[44px] px-3 py-2 text-left transition-colors text-[9px] tracking-[0.16em] uppercase focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden ${
                      isSelected
                        ? "text-[#F7F4EE]"
                        : "text-[#5C574F] hover:text-[#151412] hover:bg-[#EFECE4]"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="active-specimen-indicator"
                        transition={SANCTUARY_SPRING}
                        className="absolute inset-0 bg-[#151412]"
                      />
                    )}
                    <span className="relative z-10 block font-mono text-[8px] text-[#C57D65]">
                      {specimen.index}
                    </span>
                    <span className="relative z-10 block font-medium truncate">
                      {specimen.name.split(" ")[0]} {specimen.name.split(" ")[1]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Specimen Photo Frame with 3D Tilt & Natural Breeze Stream Overlay */}
            <div
              onPointerMove={handleCardPointerMove}
              onPointerLeave={handleCardPointerLeave}
              style={{
                transform: `perspective(900px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                transition: "transform 0.18s ease-out",
              }}
              className="relative aspect-[16/11] w-full overflow-hidden border border-[#E2DDD3] bg-[#151412] shadow-sm select-none"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSpecimen.id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: SANCTUARY_EASE }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeSpecimen.image}
                    alt={activeSpecimen.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover opacity-90"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151412]/85 via-transparent to-[#151412]/30 pointer-events-none" />
                </motion.div>
              </AnimatePresence>

              {/* Natural Mountain Breeze & Valley Mist Stream Canvas */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <BreezeStreamCanvas className="w-full h-full" intensity={1.1} />
              </div>

              {/* Bottom Specimen Legend Overlay */}
              <div className="absolute bottom-3 left-3 right-3 z-20 flex items-end justify-between gap-3 pointer-events-none">
                <div className="bg-[#151412]/90 backdrop-blur-xs px-3 py-2 border border-white/15 max-w-[80%]">
                  <div className="flex items-center gap-1.5 text-[8px] tracking-[0.24em] uppercase text-[#C57D65]">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>{activeSpecimen.name}</span>
                  </div>
                  <p className="text-[9.5px] text-[#F7F4EE] font-light mt-0.5 truncate">
                    {activeSpecimen.caption}
                  </p>
                </div>

                <div className="bg-[#151412]/90 backdrop-blur-xs px-2.5 py-2 border border-white/15 text-right hidden sm:block">
                  <span className="text-[7.5px] tracking-[0.2em] uppercase text-[#C57D65] block font-mono">
                    PASSIVE DRAFT
                  </span>
                  <span className="text-[9px] text-white font-mono">
                    ZERO AC
                  </span>
                </div>
              </div>
            </div>

            {/* Tactile Architectural Telemetry Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 bg-[#F7F4EE] border border-[#E2DDD3]">
                <div className="flex items-center gap-1.5 text-[8px] tracking-[0.2em] uppercase text-[#8D4A33] font-medium">
                  <Compass className="w-3 h-3 text-[#C57D65]" />
                  <span>Provenance</span>
                </div>
                <p className="text-[11px] text-[#151412] font-medium mt-1">
                  {activeSpecimen.origin}
                </p>
              </div>

              <div className="p-3 bg-[#F7F4EE] border border-[#E2DDD3]">
                <div className="flex items-center gap-1.5 text-[8px] tracking-[0.2em] uppercase text-[#8D4A33] font-medium">
                  <ShieldCheck className="w-3 h-3 text-[#C57D65]" />
                  <span>Thermal Mass</span>
                </div>
                <p className="text-[11px] text-[#151412] font-medium mt-1">
                  {activeSpecimen.thermalProperty}
                </p>
              </div>

              <div className="p-3 bg-[#F7F4EE] border border-[#E2DDD3]">
                <div className="flex items-center gap-1.5 text-[8px] tracking-[0.2em] uppercase text-[#8D4A33] font-medium">
                  <Sparkles className="w-3 h-3 text-[#C57D65]" />
                  <span>Acoustics</span>
                </div>
                <p className="text-[11px] text-[#151412] font-medium mt-1">
                  {activeSpecimen.acousticDampening}
                </p>
              </div>
            </div>

            {/* Architectural Pull-Quote framed by horizontal rules */}
            <div className="border-y border-[#E2DDD3] py-5">
              <blockquote className="font-serif italic text-base sm:text-lg text-[#151412] leading-snug font-light">
                &ldquo;We did not level the hillside; we sculpted living
                pavilions that bow to the existing trees and the voice of the
                Ayung River.&rdquo;
              </blockquote>
              <footer className="text-[9.5px] tracking-[0.22em] text-[#665F56] uppercase mt-2">
                Ketut Ardana &bull; Lead Vernacular Architect
              </footer>
            </div>
          </div>

          {/* Right Column: The Four Disciplines */}
          <div className="lg:col-span-6 space-y-6">
            <div className="border-b border-[#E2DDD3] pb-3 flex items-center justify-between">
              <span className="text-[9px] tracking-[0.28em] uppercase text-[#665F56] font-semibold">
                The Four Foundational Disciplines
              </span>
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#8D4A33]">
                Volcanic Matter &bull; Slow Living
              </span>
            </div>

            {/* Open Editorial List */}
            <div className="philosophy-pillar-list divide-y divide-[#E2DDD3]">
              {ESTATE_PHILOSOPHY.map((pillar) => (
                <div
                  key={pillar.number}
                  className="philosophy-pillar-row py-6 group first:pt-1"
                >
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.28, ease: SANCTUARY_EASE }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 mb-1.5">
                      <div className="flex items-baseline gap-3">
                        <span className="font-serif text-lg sm:text-xl text-[#8D4A33] font-light">
                          {pillar.number}
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl text-[#151412] font-light group-hover:text-[#8D4A33] transition-colors">
                          {pillar.title}
                        </h3>
                      </div>

                      <span className="text-[8.5px] tracking-[0.2em] uppercase text-[#665F56] sm:text-right">
                        {pillar.material}
                      </span>
                    </div>

                    <p className="text-xs text-[#5C574F] font-light leading-relaxed pl-0 sm:pl-7 mt-0.5">
                      {pillar.detail}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Bottom Monograph Footer */}
            <div className="pt-5 border-t border-[#E2DDD3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-[#5C574F] font-light">
                Private estate monograph and botanical study available upon
                inquiry.
              </p>
              <motion.a
                href="#concierge"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
                className="min-h-[44px] inline-flex items-center text-[10px] tracking-[0.22em] uppercase text-[#8D4A33] hover:text-[#151412] font-medium border-b border-[#8D4A33] pb-0.5 transition-colors focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden"
              >
                Inquire With Butler
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
