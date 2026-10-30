"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SENSORIAL_EXPERIENCES } from "@/data/villa";

gsap.registerPlugin(ScrollTrigger);

export default function SensorialExperiences() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const timelineWrapRef = useRef<HTMLDivElement | null>(null);
  const timelineFillRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      gsap.from(".ritual-header-item", {
        opacity: 0,
        y: 26,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(".ritual-header-rule", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.05,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
        },
      });

      if (timelineFillRef.current && timelineWrapRef.current) {
        gsap.fromTo(
          timelineFillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: timelineWrapRef.current,
              start: "top 65%",
              end: "bottom 70%",
              scrub: true,
            },
          }
        );
      }

      const rows = gsap.utils.toArray<HTMLElement>(".ritual-row");
      rows.forEach((row) => {
        const imgMask = row.querySelector(".ritual-img-mask");
        const imgInner = row.querySelector(".ritual-img-parallax");
        const details = row.querySelector(".ritual-narrative");

        if (imgMask) {
          gsap.fromTo(
            imgMask,
            { clipPath: "inset(10% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.0,
              ease: "power3.out",
              scrollTrigger: {
                trigger: row,
                start: "top 84%",
              },
            }
          );
        }

        if (details) {
          gsap.from(details, {
            opacity: 0,
            y: 28,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 82%",
            },
          });
        }

        if (imgInner) {
          gsap.fromTo(
            imgInner,
            { scale: 1.09, yPercent: -5 },
            {
              scale: 1,
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="experiences"
      className="py-16 sm:py-28 lg:py-36 bg-[#EFECE4] border-t border-b border-[#E2DDD3]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="relative pb-6 mb-14 sm:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 ritual-header-item">
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#8D4A33] font-medium block">
                03 &bull; Sensorial Itinerary &bull; Circadian Chronology
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#151412] leading-[1.08] font-light max-w-2xl">
                Rituals synchronized to the valley circadian pulse.
              </h2>
            </div>
            <p className="ritual-header-item text-xs sm:text-sm text-[#5C574F] max-w-md font-light leading-relaxed">
              From the dawn mist hovering above the river rapids to nightfall
              embers over our woodfire hearth, every sensory encounter is
              curated for restoration.
            </p>
          </div>
          <div className="ritual-header-rule absolute bottom-0 left-0 right-0 h-[1px] bg-[#E2DDD3]" />
        </div>

        <div ref={timelineWrapRef} className="relative space-y-16 lg:space-y-24">
          <div
            aria-hidden="true"
            className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-[1px] -translate-x-1/2 bg-[#E2DDD3] pointer-events-none"
          >
            <div
              ref={timelineFillRef}
              className="w-full h-full bg-[#8D4A33] origin-top scale-y-0"
            />
          </div>

          {SENSORIAL_EXPERIENCES.map((exp, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={exp.id}
                className="ritual-row relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center group"
              >
                <div
                  className={`lg:col-span-6 ${
                    isEven ? "lg:order-1 lg:pr-4" : "lg:order-2 lg:pl-4"
                  }`}
                >
                  <div className="ritual-img-mask relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden border border-[#E2DDD3] bg-[#151412]">
                    <div className="ritual-img-parallax relative w-full h-full">
                      <Image
                        src={exp.image}
                        alt={exp.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151412]/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-4 left-4 bg-[#151412]/90 text-[#F7F4EE] px-3 py-1 text-[9px] tracking-[0.26em] uppercase border border-white/15">
                      {exp.tag}
                    </div>

                    <div className="absolute bottom-4 left-4 bg-[#151412]/85 px-3 py-1 text-[#F7F4EE] text-[10px] tracking-wider uppercase border border-white/15">
                      {exp.location}
                    </div>
                  </div>
                </div>

                <div
                  className={`ritual-narrative lg:col-span-6 space-y-6 ${
                    isEven ? "lg:order-2 lg:pl-4" : "lg:order-1 lg:pr-4"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-[9px] sm:text-[10px] tracking-[0.26em] uppercase text-[#8D4A33] font-medium">
                      <span>Ritual 0{index + 1}</span>
                      <span>&bull;</span>
                      <span>{exp.duration}</span>
                      <span>&bull;</span>
                      <span className="text-[#665F56]">{exp.timing}</span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#151412] font-light leading-tight">
                      {exp.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#665F56] font-light tracking-wide uppercase">
                      {exp.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5C574F] font-light leading-relaxed max-w-xl">
                    {exp.description}
                  </p>

                  <div className="pt-4 border-t border-[#E2DDD3] flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-[9px] tracking-[0.24em] uppercase text-[#665F56] block">
                        Sanctuary Provision
                      </span>
                      <span className="font-serif text-base sm:text-lg text-[#151412] font-light">
                        {exp.priceNote}
                      </span>
                    </div>

                    <motion.a
                      href="#concierge"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                      className="min-h-[44px] inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-[#151412] hover:text-[#8D4A33] font-medium border-b border-[#151412] hover:border-[#8D4A33] pb-0.5 transition-colors focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden"
                    >
                      <span>Arrange Ritual With Butler</span>
                    </motion.a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
