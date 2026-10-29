"use client";

import { useState } from "react";
import { MotionConfig } from "motion/react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EstatePhilosophy from "@/components/EstatePhilosophy";
import VillaCollection from "@/components/VillaCollection";
import SensorialExperiences from "@/components/SensorialExperiences";
import BookingConcierge from "@/components/BookingConcierge";
import GuestJournal from "@/components/GuestJournal";
import EstateCoordinates from "@/components/EstateCoordinates";
import Footer from "@/components/Footer";
import { VILLA_RESIDENCES } from "@/data/villa";

export default function Home() {
  const [selectedVillaId, setSelectedVillaId] = useState(
    VILLA_RESIDENCES[0].id
  );

  const handleVillaSelect = (villaId: string) => {
    setSelectedVillaId(villaId);
    const conciergeSection = document.getElementById("concierge");
    if (conciergeSection) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      conciergeSection.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#F7F4EE] text-[#151412] selection:bg-[#8D4A33] selection:text-white">
        <Navbar />
        <main>
          <Hero onQuickSelect={handleVillaSelect} />
          <EstatePhilosophy />
          <VillaCollection onSelectVilla={handleVillaSelect} />
          <SensorialExperiences />
          <BookingConcierge selectedVillaId={selectedVillaId} />
          <GuestJournal />
          <EstateCoordinates />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
