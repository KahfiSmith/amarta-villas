"use client";

import { useState } from "react";
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
  const [selectedVillaId, setSelectedVillaId] = useState(VILLA_RESIDENCES[0].id);

  const handleVillaSelect = (villaId: string) => {
    setSelectedVillaId(villaId);
    const conciergeSection = document.getElementById("concierge");
    if (conciergeSection) {
      conciergeSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#151412] selection:bg-[#A2583E] selection:text-white">
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
  );
}
