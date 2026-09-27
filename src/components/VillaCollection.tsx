"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Bed, Maximize2, Waves, Eye, Check, CalendarCheck } from "lucide-react";
import { VILLA_RESIDENCES } from "@/data/villa";

interface VillaCollectionProps {
  onSelectVilla?: (villaId: string) => void;
}

export default function VillaCollection({ onSelectVilla }: VillaCollectionProps) {
  const [activeVillaId, setActiveVillaId] = useState(VILLA_RESIDENCES[0].id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const activeVilla = VILLA_RESIDENCES.find((v) => v.id === activeVillaId) || VILLA_RESIDENCES[0];

  const handleVillaChange = (id: string) => {
    setActiveVillaId(id);
    setSelectedImageIndex(0);
    if (onSelectVilla) {
      onSelectVilla(id);
    }
  };

  const formatIdr = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <section id="villas" className="py-20 lg:py-32 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E2DDD3] pb-6 mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#A2583E] font-medium">
              The Residences &bull; Sanctuary Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#151412] leading-tight">
              Three singular architectural sanctuaries.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5C574F] max-w-md">
            Each villa is a standalone sanctuary compound featuring private mineral plunge pools, 24/7 dedicated butler service, and unblocked forest or river views.
          </p>
        </div>

        <div className="flex flex-wrap border-b border-[#E2DDD3] mb-10 gap-2">
          {VILLA_RESIDENCES.map((villa, idx) => {
            const isActive = villa.id === activeVillaId;
            return (
              <button
                key={villa.id}
                onClick={() => handleVillaChange(villa.id)}
                className={`py-4 px-6 text-left transition-all border-b-2 -mb-[2px] ${
                  isActive
                    ? "border-[#A2583E] bg-[#EFECE4] text-[#151412]"
                    : "border-transparent text-[#5C574F] hover:text-[#151412] hover:bg-[#F2EFE8]"
                }`}
              >
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#8A847A]">
                  Residence 0{idx + 1}
                </div>
                <div className="font-serif text-lg text-[#151412]">
                  {villa.name}
                </div>
                <div className="text-[11px] text-[#A2583E]">
                  {villa.balineseName} &bull; {villa.bedrooms} Bedroom
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden border border-[#E2DDD3] bg-[#EFECE4]">
              <Image
                src={activeVilla.galleryImages[selectedImageIndex] || activeVilla.heroImage}
                alt={`${activeVilla.name} at Amarta Sayan Ubud`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-opacity duration-500"
              />
              <div className="absolute top-4 left-4 bg-[#151412]/80 backdrop-blur-xs text-[#F7F4EE] px-3 py-1 text-[10px] tracking-[0.2em] uppercase">
                {activeVilla.viewType}
              </div>
              <div className="absolute bottom-4 right-4 bg-[#151412]/80 backdrop-blur-xs text-[#F7F4EE] px-3 py-1 text-[10px] tracking-[0.15em] uppercase">
                Photo {selectedImageIndex + 1} of {activeVilla.galleryImages.length}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {activeVilla.galleryImages.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative aspect-[16/10] overflow-hidden border transition-all ${
                    selectedImageIndex === i
                      ? "border-[#A2583E] ring-1 ring-[#A2583E]"
                      : "border-[#E2DDD3] opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${activeVilla.name} preview view ${i + 1}`}
                    fill
                    sizes="(max-width: 1024px) 33vw, 20vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="p-4 bg-[#EFECE4] border border-[#E2DDD3] text-xs text-[#5C574F]">
              <span className="font-semibold text-[#151412] uppercase tracking-wider text-[10px] block mb-1">
                Architectural Concept
              </span>
              {activeVilla.architecturalNote}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#A2583E]">
                {activeVilla.tagline}
              </span>
              <h3 className="font-serif text-3xl text-[#151412]">
                {activeVilla.name}
              </h3>
              <p className="text-xs text-[#8A847A] tracking-wider uppercase">
                Balinese Vernacular: {activeVilla.balineseName}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-t border-b border-[#E2DDD3]">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase text-[#8A847A]">
                  <Maximize2 className="w-3 h-3 text-[#A2583E]" />
                  Footprint
                </span>
                <p className="text-sm font-medium text-[#151412]">{activeVilla.sizeSqm} m&sup2;</p>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase text-[#8A847A]">
                  <Waves className="w-3 h-3 text-[#A2583E]" />
                  Pool Length
                </span>
                <p className="text-sm font-medium text-[#151412]">{activeVilla.poolLengthMeters}m Private</p>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase text-[#8A847A]">
                  <Bed className="w-3 h-3 text-[#A2583E]" />
                  Suites
                </span>
                <p className="text-sm font-medium text-[#151412]">{activeVilla.bedrooms} King Bed</p>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase text-[#8A847A]">
                  <Eye className="w-3 h-3 text-[#A2583E]" />
                  Capacity
                </span>
                <p className="text-sm font-medium text-[#151412]">{activeVilla.capacity}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#5C574F] leading-relaxed">
              {activeVilla.description}
            </p>

            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A847A] font-medium block">
                Sanctuary Inclusions &amp; Highlights
              </span>
              <ul className="space-y-2">
                {activeVilla.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[#151412]">
                    <Check className="w-3.5 h-3.5 text-[#A2583E] mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-[#FFFFFF] border border-[#E2DDD3] space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A847A] block">
                    Nightly Residence Tariff
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl text-[#151412]">
                    {formatIdr(activeVilla.pricePerNightIdr)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#8A847A]">approx. USD</span>
                  <p className="text-base font-medium text-[#5C574F]">
                    ${activeVilla.priceUsdEstimate} / night
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-[#5C574F] border-t border-[#E2DDD3] pt-3">
                Includes daily artisan breakfast, afternoon botanical tea, high-speed fiber internet, and 24/7 dedicated butler service.
              </div>

              <div className="pt-2">
                <a
                  href="#concierge"
                  onClick={() => {
                    if (onSelectVilla) {
                      onSelectVilla(activeVilla.id);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#151412] hover:bg-[#A2583E] text-[#F7F4EE] py-4 text-xs tracking-[0.2em] uppercase transition-colors"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Reserve {activeVilla.name}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
