"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ESTATE_PHILOSOPHY } from "@/data/villa";
import { SANCTUARY_EASE } from "@/lib/motion-variants";

gsap.registerPlugin(ScrollTrigger);

export default function EstatePhilosophy() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const photoWrapperRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      gsap.from(".philosophy-header-reveal", {
        opacity: 0,
        y: 26,
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
        y: 22,
        duration: 0.75,
        stagger: 0.13,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".philosophy-pillar-list",
          start: "top 82%",
        },
      });

      if (photoWrapperRef.current) {
        gsap.fromTo(
          photoWrapperRef.current,
          { clipPath: "inset(12% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: photoWrapperRef.current,
              start: "top 85%",
            },
          }
        );
      }

      if (photoRef.current && photoWrapperRef.current) {
        gsap.fromTo(
          photoRef.current,
          { scale: 1.09, yPercent: -5 },
          {
            scale: 1,
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: photoWrapperRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="py-16 sm:py-28 lg:py-36 bg-[#EFECE4] border-t border-b border-[#E2DDD3]"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Architectural Essay & Pull Quote */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-5 text-xs sm:text-sm text-[#5C574F] leading-relaxed font-light">
              <p>
                Each pavilion sits lightly on volcanic stone footings, elevated
                to allow natural mountain breezes and valley mist to circulate
                continuously without relying on mechanical interference.
              </p>
              <p>
                Materials were sourced within a sixty-kilometer radius: porous
                river basalt from Mount Agung&apos;s ancient lahars, reclaimed
                ironwood from retired archipelagic schooners, and hand-woven
                rattan crafted by local Gianyar artisans.
              </p>
            </div>

            {/* Architectural Pull-Quote framed by horizontal rules */}
            <div className="border-y border-[#E2DDD3] py-6">
              <blockquote className="font-serif italic text-lg sm:text-xl text-[#151412] leading-snug font-light">
                &ldquo;We did not level the hillside; we sculpted living
                pavilions that bow to the existing trees and the voice of the
                Ayung River.&rdquo;
              </blockquote>
              <footer className="text-[10px] tracking-[0.2em] text-[#665F56] uppercase mt-3">
                Ketut Ardana &bull; Lead Vernacular Architect
              </footer>
            </div>

            {/* Curated Photographic Study with Clip-Path Mask & GSAP Scroll Parallax */}
            <div
              ref={photoWrapperRef}
              className="relative aspect-[16/10] overflow-hidden border border-[#E2DDD3] bg-[#151412]"
            >
              <div ref={photoRef} className="relative w-full h-full">
                <Image
                  src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1200&q=80"
                  alt="Ayung River Valley jungle canopy and organic stone pavilions"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-3 left-3 bg-[#151412]/90 px-3 py-1 text-[9px] tracking-widest text-[#F7F4EE] uppercase border border-white/15">
                Living Canopy &bull; Ayung Gorge Contours
              </div>
            </div>
          </div>

          {/* Right Column: The Four Disciplines */}
          <div className="lg:col-span-7 space-y-8">
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
                  className="philosophy-pillar-row py-7 group first:pt-2"
                >
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.28, ease: SANCTUARY_EASE }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                      <div className="flex items-baseline gap-4">
                        <span className="font-serif text-xl sm:text-2xl text-[#8D4A33] font-light">
                          {pillar.number}
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl text-[#151412] font-light group-hover:text-[#8D4A33] transition-colors">
                          {pillar.title}
                        </h3>
                      </div>

                      <span className="text-[9px] tracking-[0.22em] uppercase text-[#665F56] sm:text-right">
                        {pillar.material}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#5C574F] font-light leading-relaxed pl-0 sm:pl-9 mt-1">
                      {pillar.detail}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Bottom Monograph Footer */}
            <div className="pt-6 border-t border-[#E2DDD3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
