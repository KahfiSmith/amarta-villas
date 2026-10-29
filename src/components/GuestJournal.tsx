"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GUEST_JOURNALS } from "@/data/villa";
import { panelCrossfade, SANCTUARY_SPRING } from "@/lib/motion-variants";

gsap.registerPlugin(ScrollTrigger);

export default function GuestJournal() {
  const [selectedJournalId, setSelectedJournalId] = useState(
    GUEST_JOURNALS[0]?.id ?? ""
  );
  const featuredReview =
    GUEST_JOURNALS.find((entry) => entry.id === selectedJournalId) ??
    GUEST_JOURNALS[0];
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      gsap.from(".journal-rule", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.05,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
        },
      });

      gsap.from(".journal-reveal", {
        opacity: 0,
        y: 26,
        duration: 0.85,
        stagger: 0.14,
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
      id="journal"
      className="py-16 sm:py-28 lg:py-36 bg-[#EFECE4] border-t border-b border-[#E2DDD3]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="relative pb-6 mb-14 sm:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 journal-reveal">
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#8D4A33] font-medium block">
                05 &bull; Estate Archive &bull; Resident Chronicles
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#151412] leading-[1.08] font-light max-w-2xl">
                Words left behind in our valley guestbook.
              </h2>
            </div>
            <p className="journal-reveal text-xs sm:text-sm text-[#5C574F] max-w-md font-light leading-relaxed">
              Unhurried reflections from travelers who sought seclusion, silence,
              and archipelagic hospitality along the Ayung gorge.
            </p>
          </div>
          <div
            aria-hidden="true"
            className="journal-rule absolute inset-x-0 bottom-0 h-px bg-[#E2DDD3]"
          />
        </div>

        {/* Archival Guestbook Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Featured Lead Chronicle */}
          {featuredReview && (
            <div className="journal-reveal lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredReview.id}
                  variants={panelCrossfade}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6 sm:space-y-8 bg-[#F7F4EE] border border-[#E2DDD3] p-6 sm:p-10"
                >
                  <div className="flex flex-wrap items-center gap-3 text-[9px] sm:text-[10px] tracking-[0.26em] uppercase text-[#8D4A33]">
                    <span>Featured Chronicle</span>
                    <span>&bull;</span>
                    <span>{featuredReview.villaStayed}</span>
                    <span>&bull;</span>
                    <span className="text-[#665F56]">
                      {featuredReview.stayDuration}
                    </span>
                  </div>

                  <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#151412] leading-[1.28] font-light italic">
                    &ldquo;{featuredReview.quote}&rdquo;
                  </blockquote>

                  <div className="pt-5 border-t border-[#E2DDD3] flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-lg text-[#151412] font-normal">
                        {featuredReview.guestName}
                      </h3>
                      <span className="text-xs text-[#5C574F] font-light">
                        {featuredReview.origin} &bull; {featuredReview.date}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[9px] tracking-[0.2em] uppercase text-[#665F56] block">
                        Memorable Highlight
                      </span>
                      <span className="text-xs text-[#8D4A33] font-medium">
                        {featuredReview.highlight}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Archival Ledger Entries Selector */}
          <div className="journal-reveal lg:col-span-5 space-y-6 lg:border-l lg:border-[#E2DDD3] lg:pl-12">
            <div className="flex items-center justify-between border-b border-[#E2DDD3] pb-2">
              <span className="text-[9px] tracking-[0.28em] uppercase text-[#665F56] font-semibold block">
                Archival Ledger Entries
              </span>
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#8D4A33]">
                Select Entry to Read Folio
              </span>
            </div>

            <div className="space-y-3">
              {GUEST_JOURNALS.map((journal, idx) => {
                const isSelected = journal.id === featuredReview?.id;
                return (
                  <motion.button
                    key={journal.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedJournalId(journal.id)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.992 }}
                    transition={SANCTUARY_SPRING}
                    className={`relative w-full text-left p-4 border transition-colors space-y-3 focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden ${
                      isSelected
                        ? "border-transparent"
                        : "border-[#E2DDD3] bg-transparent hover:bg-[#F7F4EE]/60"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="journal-active-frame"
                        aria-hidden="true"
                        transition={SANCTUARY_SPRING}
                        className="absolute inset-0 bg-[#F7F4EE] border border-[#8D4A33]"
                      />
                    )}

                    <div className="relative z-10 flex items-center justify-between text-[9px] tracking-[0.22em] uppercase text-[#665F56]">
                      <span className="text-[#8D4A33] font-medium">
                        0{idx + 1} &bull; {journal.villaStayed}
                      </span>
                      <span>{journal.stayDuration}</span>
                    </div>

                    <p className="relative z-10 font-serif text-base sm:text-lg text-[#151412] font-light italic leading-relaxed line-clamp-3">
                      &ldquo;{journal.quote}&rdquo;
                    </p>

                    <div className="relative z-10 flex items-baseline justify-between text-xs pt-1">
                      <div>
                        <span className="font-medium text-[#151412]">
                          {journal.guestName}
                        </span>
                        <span className="text-[#5C574F] font-light ml-2">
                          &bull; {journal.origin}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#665F56]">
                        {journal.date}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#E2DDD3]">
              <span className="text-[10px] tracking-wider text-[#5C574F] font-light block">
                Resident entries are inscribed by hand into our pressed-leaf
                archive upon departure.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
