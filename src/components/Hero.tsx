"use client";

import Image from "next/image";
import { ArrowDownRight, Calendar, Users, Home, ShieldCheck } from "lucide-react";
import { ESTATE_DETAILS, VILLA_RESIDENCES } from "@/data/villa";

interface HeroProps {
  onQuickSelect?: (villaId: string, guests: number) => void;
}

export default function Hero({ onQuickSelect }: HeroProps) {
  return (
    <section className="relative pt-32 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-[#E2DDD3] pb-6 mb-10 gap-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] tracking-[0.25em] text-[#8A847A] uppercase">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A2583E] animate-pulse"></span>
              {ESTATE_DETAILS.riverValley}
            </span>
            <span>&bull;</span>
            <span>{ESTATE_DETAILS.coordinates}</span>
            <span>&bull;</span>
            <span>{ESTATE_DETAILS.elevation}</span>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] tracking-[0.2em] text-[#5C574F] uppercase">
              Sanctuary Status: Tranquil &bull; Limited To 3 Private Estates
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block px-3 py-1 bg-[#EFECE4] border border-[#E2DDD3] text-[#A2583E] text-[11px] tracking-[0.2em] uppercase">
              Archipelagic Tropical Modernism
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#151412] leading-[1.08] tracking-tight">
              Where rainforest mist meets living volcanic stone.
            </h1>
            <p className="text-base sm:text-lg text-[#5C574F] font-light leading-relaxed max-w-xl">
              Suspended along the sacred Ayung River gorge in Sayan, AMARTA is an unhurried sanctuary of three monolithic private pool residences crafted from reclaimed teak, volcanic basalt, and cascading hillside springs.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
              <a
                href="#concierge"
                className="inline-flex items-center gap-3 bg-[#151412] hover:bg-[#A2583E] text-[#F7F4EE] px-7 py-4 text-xs tracking-[0.2em] uppercase transition-colors"
              >
                <span>Inquire With Concierge</span>
                <ArrowDownRight className="w-4 h-4" />
              </a>
              <a
                href="#villas"
                className="inline-flex items-center gap-2 border border-[#151412] hover:border-[#A2583E] hover:text-[#A2583E] text-[#151412] px-6 py-4 text-xs tracking-[0.2em] uppercase transition-colors"
              >
                <span>Explore The 3 Villas</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden border border-[#E2DDD3] bg-[#EFECE4]">
              <Image
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
                alt="Amarta Canopy Pool Villa overlooking Ayung River Valley"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151412]/60 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[#F7F4EE] text-xs">
                <div>
                  <p className="font-serif text-sm tracking-wide">Suita Kanopi &bull; Canopy Pool Villa</p>
                  <p className="text-[10px] text-[#E2DDD3] tracking-widest uppercase">280 SQM &bull; 14M Mineral Plunge Pool</p>
                </div>
                <span className="text-[10px] tracking-widest uppercase bg-[#151412]/80 px-2.5 py-1 border border-white/20">
                  Sayan Ridge
                </span>
              </div>
            </div>

            <div className="hidden sm:block absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-[#A2583E] pointer-events-none"></div>
            <div className="hidden sm:block absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-[#151412] pointer-events-none"></div>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E2DDD3] p-5 sm:p-7 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="border-b md:border-b-0 md:border-r border-[#E2DDD3] pb-3 md:pb-0 md:pr-4">
              <label className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-[#8A847A] uppercase mb-1">
                <Home className="w-3.5 h-3.5 text-[#A2583E]" />
                Selected Residence
              </label>
              <select
                id="hero-residence-select"
                defaultValue={VILLA_RESIDENCES[0].id}
                className="w-full text-xs font-medium text-[#151412] bg-transparent border-0 focus:ring-0 p-0 cursor-pointer"
              >
                {VILLA_RESIDENCES.map((villa) => (
                  <option key={villa.id} value={villa.id}>
                    {villa.name} ({villa.bedrooms} Bed)
                  </option>
                ))}
              </select>
            </div>

            <div className="border-b md:border-b-0 md:border-r border-[#E2DDD3] pb-3 md:pb-0 md:pr-4">
              <label className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-[#8A847A] uppercase mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#A2583E]" />
                Preferred Season / Duration
              </label>
              <div className="text-xs font-medium text-[#151412]">
                Customizable (Minimum 2 Nights)
              </div>
            </div>

            <div className="border-b md:border-b-0 md:border-r border-[#E2DDD3] pb-3 md:pb-0 md:pr-4">
              <label className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-[#8A847A] uppercase mb-1">
                <Users className="w-3.5 h-3.5 text-[#A2583E]" />
                Guests
              </label>
              <div className="text-xs font-medium text-[#151412]">
                2 to 8 Resident Guests
              </div>
            </div>

            <div className="pt-2 md:pt-0">
              <a
                href="#concierge"
                onClick={() => {
                  const selectEl = document.getElementById("hero-residence-select") as HTMLSelectElement | null;
                  if (selectEl && onQuickSelect) {
                    onQuickSelect(selectEl.value, 2);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#A2583E] hover:bg-[#151412] text-white py-3.5 text-xs tracking-[0.2em] uppercase transition-colors"
              >
                <span>Calculate &amp; Reserve</span>
                <ArrowDownRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#E2DDD3] flex flex-wrap items-center justify-between text-[11px] text-[#5C574F] gap-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A2583E]" />
              Guaranteed Direct Butler Contact &bull; No Intermediary Platform Surcharges
            </span>
            <span className="text-[10px] tracking-wider uppercase text-[#8A847A]">
              Exclusive 24/7 WhatsApp Estate Desk: {ESTATE_DETAILS.phoneDisplay}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
