"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ESTATE_DETAILS } from "@/data/villa";
import { panelCrossfade, SANCTUARY_SPRING } from "@/lib/motion-variants";

export default function Footer() {
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribed(true);
      setEmailInput("");
    }
  };

  return (
    <footer className="bg-[#151412] text-[#F7F4EE] pt-16 sm:pt-24 pb-12 border-t border-[#2B2724]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-14 pb-16 border-b border-[#2B2724]">
          <div className="lg:col-span-5 space-y-6">
            <Link
              href="/"
              className="inline-block group focus-visible:ring-2 focus-visible:ring-[#C57D65] focus:outline-hidden"
            >
              <span className="font-serif text-3xl sm:text-4xl tracking-[0.25em] text-[#F7F4EE] uppercase font-light block group-hover:text-[#C57D65] transition-colors">
                AMARTA
              </span>
              <span className="text-[9px] tracking-[0.38em] text-[#C57D65] uppercase block mt-1.5 font-medium">
                Sanctuary &bull; Sayan Ubud
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-[#A8A299] font-light leading-relaxed max-w-sm">
              An architectural slow-living sanctuary anchored along the verdant
              limestone ridges of the Ayung River gorge. Three monolithic pool
              residences sculpted from volcanic basalt and reclaimed ironwood.
            </p>

            <div className="pt-2 text-[9px] tracking-[0.24em] uppercase text-[#A8A299]">
              {ESTATE_DETAILS.coordinates} &bull; 240m Elevation
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <span className="text-[9px] tracking-[0.28em] uppercase text-[#C57D65] font-medium block">
              Sanctuary Index
            </span>
            <ul className="space-y-2 text-xs text-[#A8A299] font-light">
              {[
                { href: "#philosophy", label: "01. Estate Philosophy" },
                { href: "#villas", label: "02. The 3 Residences" },
                { href: "#experiences", label: "03. Sensorial Rituals" },
                { href: "#concierge", label: "04. Direct Concierge" },
                { href: "#journal", label: "05. Resident Journal" },
                { href: "#coordinates", label: "06. Arrival & Geography" },
              ].map((item) => (
                <li key={item.href}>
                  <motion.a
                    href={item.href}
                    whileHover={{ x: 3 }}
                    transition={SANCTUARY_SPRING}
                    className="min-h-[44px] inline-flex items-center hover:text-[#F7F4EE] transition-colors focus-visible:ring-2 focus-visible:ring-[#C57D65] focus:outline-hidden"
                  >
                    {item.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <span className="text-[9px] tracking-[0.28em] uppercase text-[#C57D65] font-medium block">
              Butler Desk
            </span>
            <ul className="space-y-4 text-xs text-[#A8A299] font-light">
              <li className="space-y-1">
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#A8A299] block">
                  WhatsApp Concierge
                </span>
                <a
                  href={`https://wa.me/${ESTATE_DETAILS.phoneRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] hover:text-[#F7F4EE] text-white inline-flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-[#C57D65] focus:outline-hidden"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C57D65]" />
                  <span>{ESTATE_DETAILS.phoneDisplay}</span>
                </a>
              </li>

              <li className="space-y-1">
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#A8A299] block">
                  Inquiries
                </span>
                <a
                  href={`mailto:${ESTATE_DETAILS.email}`}
                  className="min-h-[44px] hover:text-[#F7F4EE] inline-flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-[#C57D65] focus:outline-hidden"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C57D65]" />
                  <span>{ESTATE_DETAILS.email}</span>
                </a>
              </li>

              <li className="space-y-1">
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#A8A299] block">
                  Location
                </span>
                <span className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                  <MapPin className="w-3.5 h-3.5 text-[#C57D65] shrink-0 mt-0.5" />
                  <span>Sayan, Ubud, Gianyar, Bali</span>
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <span className="text-[9px] tracking-[0.28em] uppercase text-[#C57D65] font-medium block">
              The Valley Gazette
            </span>
            <p className="text-xs text-[#A8A299] font-light leading-relaxed">
              Seasonal notes on harvest at Bumi Farm, moonlit water rites, and
              resident privileges.
            </p>

            <AnimatePresence mode="wait">
              {isSubscribed ? (
                <motion.div
                  key="subscribed"
                  role="status"
                  aria-live="polite"
                  variants={panelCrossfade}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="p-3.5 bg-[#24211E] border border-[#C57D65] text-xs text-[#F7F4EE] flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-[#C57D65] shrink-0" />
                  <span>Matur Suksma. Your address is archived.</span>
                </motion.div>
              ) : (
                <motion.form
                  key="subscribe-form"
                  variants={panelCrossfade}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onSubmit={handleSubscribe}
                  className="space-y-2"
                >
                  <div className="flex">
                    <input
                      type="email"
                      required
                      aria-label="Email address for The Valley Gazette"
                      placeholder="email@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="min-h-[44px] bg-[#211F1D] border border-[#3A3530] text-xs px-3.5 py-2.5 text-[#F7F4EE] placeholder-[#A8A299] w-full focus:border-[#C57D65] focus-visible:ring-2 focus-visible:ring-[#C57D65] focus:outline-hidden transition-colors"
                    />
                    <motion.button
                      type="submit"
                      aria-label="Subscribe to Gazette"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      transition={SANCTUARY_SPRING}
                      className="min-h-[44px] min-w-[44px] bg-[#8D4A33] hover:bg-[#733B28] px-4 py-2.5 text-white transition-colors shrink-0 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#C57D65] focus:outline-hidden"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <span className="text-[9px] text-[#A8A299] block font-light">
                    Dispatched four times annually. Strictly private.
                  </span>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#A8A299] gap-4 font-light">
          <div>
            &copy; 2026 AMARTA Sanctuary &amp; Private Villas. All rights
            reserved.
          </div>
          <div className="flex items-center gap-6 tracking-wider uppercase">
            <span>Sayan Ridge &bull; Ubud &bull; Bali</span>
            <span className="hidden sm:inline">&bull;</span>
            <span>Archipelagic Vernacular Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
