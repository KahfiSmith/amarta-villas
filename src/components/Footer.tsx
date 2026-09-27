"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight, Check } from "lucide-react";
import { ESTATE_DETAILS } from "@/data/villa";

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
    <footer className="bg-[#151412] text-[#F7F4EE] pt-20 pb-12 border-t border-[#2B2724]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#2B2724]">
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.25em] text-[#F7F4EE] uppercase block">
                AMARTA
              </span>
              <span className="text-[10px] tracking-[0.35em] text-[#A2583E] uppercase block mt-1">
                Sanctuary &bull; Sayan Ubud
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-[#A8A299] font-light leading-relaxed max-w-sm">
              An architectural slow-living estate anchored along the verdant limestone ridges of the Ayung River gorge. Three monolithic pool sanctuaries sculpted in volcanic stone and reclaimed teak.
            </p>

            <div className="pt-2 text-[10px] tracking-[0.2em] uppercase text-[#736C63]">
              Coordinates: {ESTATE_DETAILS.coordinates} &bull; 240m Elevation
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#A2583E] font-medium block">
              Navigation
            </span>
            <ul className="space-y-2.5 text-xs text-[#A8A299]">
              <li>
                <a href="#philosophy" className="hover:text-[#F7F4EE] transition-colors">
                  Estate Philosophy
                </a>
              </li>
              <li>
                <a href="#villas" className="hover:text-[#F7F4EE] transition-colors">
                  The 3 Residences
                </a>
              </li>
              <li>
                <a href="#experiences" className="hover:text-[#F7F4EE] transition-colors">
                  Sensorial Rituals
                </a>
              </li>
              <li>
                <a href="#coordinates" className="hover:text-[#F7F4EE] transition-colors">
                  Arrival &amp; Coordinates
                </a>
              </li>
              <li>
                <a href="#journal" className="hover:text-[#F7F4EE] transition-colors">
                  Resident Journal
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#A2583E] font-medium block">
              Direct Contact
            </span>
            <ul className="space-y-3 text-xs text-[#A8A299]">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#A2583E] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-[#736C63] uppercase block">Direct WhatsApp Desk</span>
                  <a href={`https://wa.me/${ESTATE_DETAILS.phoneRaw}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#F7F4EE] font-medium text-[#F7F4EE]">
                    {ESTATE_DETAILS.phoneDisplay}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#A2583E] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-[#736C63] uppercase block">Estate Inquiries</span>
                  <a href={`mailto:${ESTATE_DETAILS.email}`} className="hover:text-[#F7F4EE]">
                    {ESTATE_DETAILS.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#A2583E] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-[#736C63] uppercase block">Sanctuary Address</span>
                  <span>{ESTATE_DETAILS.location}</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#A2583E] font-medium block">
              The Valley Gazette
            </span>
            <p className="text-xs text-[#A8A299] leading-relaxed">
              Seasonal notes on harvest at Bumi Farm, moonlit ceremonies, and private resident privileges.
            </p>

            {isSubscribed ? (
              <div className="p-3 bg-[#24211E] border border-[#A2583E] text-xs text-[#F7F4EE] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#A2583E]" />
                <span>Matur Suksma. Your address is archived.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="bg-[#211F1D] border border-[#3A3530] text-xs px-3.5 py-2.5 text-[#F7F4EE] placeholder-[#736C63] w-full focus:outline-hidden focus:border-[#A2583E]"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to Gazette"
                    className="bg-[#A2583E] hover:bg-[#C57D65] px-3.5 py-2.5 text-white transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] text-[#736C63] block">
                  Dispatched four times annually. Strictly private.
                </span>
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#736C63] gap-4">
          <div>
            &copy; 2026 AMARTA Sanctuary &amp; Private Villas. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Sayan Ridge &bull; Ubud &bull; Bali</span>
            <span>Regenerative Vernacular Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
