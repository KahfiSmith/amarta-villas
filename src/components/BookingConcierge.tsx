"use client";

import { useState, useId, useRef, useCallback } from "react";
import {
  Calendar,
  Users,
  CheckCircle2,
  MessageCircle,
  Phone,
  Mail,
  User,
  Plane,
  Flower2,
  UtensilsCrossed,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ESTATE_DETAILS, VILLA_RESIDENCES } from "@/data/villa";
import AnimatedNumber from "./AnimatedNumber";
import { SANCTUARY_EASE, panelCrossfade } from "@/lib/motion-variants";

gsap.registerPlugin(ScrollTrigger);

interface BookingConciergeProps {
  selectedVillaId?: string;
}

export default function BookingConcierge({
  selectedVillaId = VILLA_RESIDENCES[0].id,
}: BookingConciergeProps) {
  const [villaId, setVillaId] = useState(selectedVillaId);
  const [prevSelectedVillaId, setPrevSelectedVillaId] =
    useState(selectedVillaId);

  if (selectedVillaId !== prevSelectedVillaId) {
    setPrevSelectedVillaId(selectedVillaId);
    setVillaId(selectedVillaId);
  }

  const [checkIn, setCheckIn] = useState("2026-11-12");
  const [checkOut, setCheckOut] = useState("2026-11-15");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const [airportEscort, setAirportEscort] = useState(false);
  const [wellnessRitual, setWellnessRitual] = useState(false);
  const [woodfireDining, setWoodfireDining] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const formId = useId();
  const sectionRef = useRef<HTMLElement | null>(null);

  const selectedVilla =
    VILLA_RESIDENCES.find((v) => v.id === villaId) || VILLA_RESIDENCES[0];

  const rawDayDiff = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const diffDays = rawDayDiff();
  const isDateRangeValid = diffDays >= 2;
  const nights = isDateRangeValid ? diffDays : 2;
  const villaSubtotal = selectedVilla.pricePerNightIdr * nights;

  const airportPrice = airportEscort ? 1200000 : 0;
  const wellnessPrice = wellnessRitual ? 1450000 * adults : 0;
  const diningPrice = woodfireDining ? 1850000 * adults : 0;
  const addOnsTotal = airportPrice + wellnessPrice + diningPrice;

  const totalEstimateIdr = villaSubtotal + addOnsTotal;
  const totalEstimateUsd = Math.round(totalEstimateIdr / 15300);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      gsap.from(".concierge-reveal", {
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
    },
    { scope: sectionRef }
  );

  const formatIdr = useCallback((num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Math.round(num));
  }, []);

  const generateWhatsAppUrl = () => {
    const lines = [
      "Om Swastyastu / Greetings Amarta Estate Butler,",
      "",
      "I would like to request a private residence reservation at AMARTA Sanctuary & Private Villas, Sayan, Ubud.",
      "",
      "RESIDENCE DETAILS:",
      `* Residence: ${selectedVilla.name} (${selectedVilla.balineseName})`,
      `* Check-in: ${checkIn}`,
      `* Check-out: ${checkOut} (${nights} Nights)`,
      `* Party: ${adults} Adults${children > 0 ? `, ${children} Children` : ""}`,
      "",
      "BESPOKE ADDITIONS:",
      airportEscort ? "* Private Luxury Airport Escort (DPS)" : null,
      wellnessRitual
        ? `* Ayung Botanical Apothecary Ritual (${adults} Guests)`
        : null,
      woodfireDining
        ? `* Hearth & Soil Woodfire Tasting Atelier (${adults} Guests)`
        : null,
      !airportEscort && !wellnessRitual && !woodfireDining
        ? "* None selected"
        : null,
      "",
      "GUEST INFORMATION:",
      `* Full Name: ${guestName || "Pending"}`,
      `* Phone / WA: ${guestPhone || "Pending"}`,
      `* Email: ${guestEmail || "Pending"}`,
      specialRequests ? `* Notes / Occasion: ${specialRequests}` : null,
      "",
      `* Estimated Total: ${formatIdr(totalEstimateIdr)} (~USD $${totalEstimateUsd})`,
      "",
      "Kindly advise residence availability and reservation arrangement. Suksma.",
    ].filter(Boolean);

    const message = lines.join("\n");
    return `https://wa.me/${ESTATE_DETAILS.phoneRaw}?text=${encodeURIComponent(
      message
    )}`;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDateRangeValid) {
      setValidationError(
        "Check-out date must be at least 2 nights after your check-in date. Please adjust your itinerary dates."
      );
      return;
    }
    setValidationError(null);
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setBookingRef(`AMR-2026-${randomCode}`);
    setIsSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      id="concierge"
      className="py-16 sm:py-28 lg:py-36 bg-[#F7F4EE]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E2DDD3] pb-6 mb-12 sm:mb-16 gap-6">
          <div className="space-y-3 concierge-reveal">
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#8D4A33] font-medium block">
              04 &bull; Reservation Atelier &bull; Direct Butler Desk
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#151412] leading-[1.08] font-light">
              Curate your sanctuary stay.
            </h2>
          </div>
          <p className="concierge-reveal text-xs sm:text-sm text-[#5C574F] max-w-md font-light leading-relaxed">
            Direct estate reservations receive dedicated 24-hour butler
            assistance, flexible date alteration up to 14 days prior, and
            bespoke arrival elixirs.
          </p>
        </div>

        {/* Atelier Grid Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Folio Form with AnimatePresence State Transitions */}
          <div className="concierge-reveal lg:col-span-7 bg-[#FFFFFF] border border-[#E2DDD3] p-6 sm:p-10 lg:p-12 shadow-[0_4px_24px_rgba(21,20,18,0.02)]">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="docket-submitted"
                  variants={panelCrossfade}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="py-8 space-y-8 text-center"
                >
                  <div className="w-16 h-16 mx-auto bg-[#EFECE4] border border-[#8D4A33] flex items-center justify-center text-[#8D4A33]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] tracking-[0.28em] uppercase text-[#8D4A33] font-medium block">
                      Sanctuary Docket Registered
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl text-[#151412] font-light">
                      Matur Suksma, {guestName || "Honored Guest"}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C574F] max-w-md mx-auto font-light leading-relaxed pt-1">
                      Your reservation inquiry for{" "}
                      <span className="font-medium text-[#151412]">
                        {selectedVilla.name}
                      </span>{" "}
                      has been archived under docket reference{" "}
                      <span className="text-[#8D4A33] font-medium">
                        {bookingRef}
                      </span>
                      .
                    </p>
                  </div>

                  <div className="p-6 bg-[#F7F4EE] border border-[#E2DDD3] max-w-md mx-auto text-left text-xs space-y-3 text-[#5C574F]">
                    <div className="flex justify-between border-b border-[#E2DDD3] pb-2">
                      <span>Stay Itinerary:</span>
                      <span className="text-[#151412] font-medium">
                        {checkIn} to {checkOut} ({nights} Nights)
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-[#E2DDD3] pb-2">
                      <span>Resident Guests:</span>
                      <span className="text-[#151412] font-medium">
                        {adults} Adults{" "}
                        {children > 0 && `+ ${children} Children`}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span>Estimated Folio Tariff:</span>
                      <span className="text-[#151412] font-semibold">
                        {formatIdr(totalEstimateIdr)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.a
                      href={generateWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="min-h-[48px] inline-flex items-center justify-center gap-2 bg-[#151412] hover:bg-[#8D4A33] text-[#F7F4EE] px-7 py-4 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 font-medium focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Proceed to WhatsApp Butler</span>
                    </motion.a>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsSubmitted(false)}
                      className="min-h-[48px] inline-flex items-center justify-center border border-[#E2DDD3] hover:border-[#151412] text-[#5C574F] hover:text-[#151412] px-6 py-4 text-[11px] tracking-[0.22em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden"
                    >
                      Modify Docket
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="docket-form"
                  variants={panelCrossfade}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onSubmit={handleSubmitForm}
                  className="space-y-10"
                >
                  {/* 01. Residence Selection */}
                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between border-b border-[#E2DDD3] pb-2">
                      <span className="text-[9px] tracking-[0.28em] uppercase text-[#665F56] font-semibold">
                        01 &bull; Sanctuary Compound
                      </span>
                      <span className="text-[9px] tracking-[0.2em] uppercase text-[#8D4A33]">
                        Select Residence
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {VILLA_RESIDENCES.map((villa, idx) => {
                        const isChosen = villaId === villa.id;
                        return (
                          <motion.button
                            type="button"
                            key={villa.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setVillaId(villa.id)}
                            className={`min-h-[64px] p-4 text-left border transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden ${
                              isChosen
                                ? "border-[#151412] bg-[#151412] text-[#F7F4EE]"
                                : "border-[#E2DDD3] hover:border-[#665F56] bg-[#FFFFFF] text-[#151412]"
                            }`}
                          >
                            <div
                              className={`text-[8px] tracking-[0.22em] uppercase ${
                                isChosen ? "text-[#C57D65]" : "text-[#665F56]"
                              }`}
                            >
                              0{idx + 1} &bull; {villa.bedrooms} Bed
                            </div>
                            <div className="font-serif text-sm sm:text-base mt-1 font-light leading-snug">
                              {villa.name}
                            </div>
                            <div
                              className={`text-[10px] mt-2 font-medium ${
                                isChosen ? "text-[#E2DDD3]" : "text-[#8D4A33]"
                              }`}
                            >
                              {formatIdr(villa.pricePerNightIdr)}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 02. Itinerary Dates & Party Size */}
                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between border-b border-[#E2DDD3] pb-2">
                      <span className="text-[9px] tracking-[0.28em] uppercase text-[#665F56] font-semibold">
                        02 &bull; Itinerary Dates &amp; Party Size
                      </span>
                      <span className="text-[9px] tracking-[0.2em] uppercase text-[#5C574F]">
                        Min. 2 Nights
                      </span>
                    </div>

                    <AnimatePresence>
                      {(!isDateRangeValid || validationError) && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.25, ease: SANCTUARY_EASE }}
                          role="alert"
                          className="p-3.5 bg-[#EFECE4] border border-[#8D4A33] text-xs text-[#151412] flex items-start gap-2.5"
                        >
                          <AlertCircle className="w-4 h-4 text-[#8D4A33] shrink-0 mt-0.5" />
                          <span>
                            {validationError ||
                              "Minimum stay is 2 nights. Please select a check-out date at least 2 days after check-in."}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label
                          htmlFor={`${formId}-checkin`}
                          className="flex items-center gap-1.5 text-xs text-[#151412] font-medium"
                        >
                          <Calendar className="w-3.5 h-3.5 text-[#8D4A33]" />
                          Check-In Date
                        </label>
                        <input
                          id={`${formId}-checkin`}
                          type="date"
                          value={checkIn}
                          onChange={(e) => {
                            setCheckIn(e.target.value);
                            setValidationError(null);
                          }}
                          className="w-full min-h-[44px] bg-[#F7F4EE] border border-[#E2DDD3] px-3.5 py-2.5 text-xs text-[#151412] focus:border-[#151412] focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden transition-colors"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor={`${formId}-checkout`}
                          className="flex items-center gap-1.5 text-xs text-[#151412] font-medium"
                        >
                          <Calendar className="w-3.5 h-3.5 text-[#8D4A33]" />
                          Check-Out Date
                        </label>
                        <input
                          id={`${formId}-checkout`}
                          type="date"
                          value={checkOut}
                          onChange={(e) => {
                            setCheckOut(e.target.value);
                            setValidationError(null);
                          }}
                          className="w-full min-h-[44px] bg-[#F7F4EE] border border-[#E2DDD3] px-3.5 py-2.5 text-xs text-[#151412] focus:border-[#151412] focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                      <div className="space-y-1.5">
                        <label
                          htmlFor={`${formId}-adults`}
                          className="flex items-center gap-1.5 text-xs text-[#151412] font-medium"
                        >
                          <Users className="w-3.5 h-3.5 text-[#8D4A33]" />
                          Adult Resident Guests
                        </label>
                        <select
                          id={`${formId}-adults`}
                          value={adults}
                          onChange={(e) => setAdults(Number(e.target.value))}
                          className="w-full min-h-[44px] bg-[#F7F4EE] border border-[#E2DDD3] px-3.5 py-2.5 text-xs text-[#151412] focus:border-[#151412] focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden transition-colors"
                        >
                          <option value={1}>1 Adult</option>
                          <option value={2}>2 Adults</option>
                          <option value={3}>3 Adults</option>
                          <option value={4}>4 Adults</option>
                          <option value={6}>6 Adults</option>
                          <option value={8}>8 Adults (Grand Ridge Estate)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor={`${formId}-children`}
                          className="flex items-center gap-1.5 text-xs text-[#151412] font-medium"
                        >
                          <Users className="w-3.5 h-3.5 text-[#8D4A33]" />
                          Children (Under 12)
                        </label>
                        <select
                          id={`${formId}-children`}
                          value={children}
                          onChange={(e) => setChildren(Number(e.target.value))}
                          className="w-full min-h-[44px] bg-[#F7F4EE] border border-[#E2DDD3] px-3.5 py-2.5 text-xs text-[#151412] focus:border-[#151412] focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden transition-colors"
                        >
                          <option value={0}>No Children</option>
                          <option value={1}>1 Child</option>
                          <option value={2}>2 Children</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 03. Bespoke Additions */}
                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between border-b border-[#E2DDD3] pb-2">
                      <span className="text-[9px] tracking-[0.28em] uppercase text-[#665F56] font-semibold">
                        03 &bull; Bespoke Estate Additions
                      </span>
                      <span className="text-[9px] tracking-[0.2em] uppercase text-[#8D4A33]">
                        Optional Curation
                      </span>
                    </div>

                    <div className="space-y-3">
                      <label
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-4 border transition-colors cursor-pointer ${
                          airportEscort
                            ? "border-[#8D4A33] bg-[#EFECE4]"
                            : "border-[#E2DDD3] bg-[#F7F4EE] hover:border-[#665F56]"
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <input
                            type="checkbox"
                            checked={airportEscort}
                            onChange={(e) => setAirportEscort(e.target.checked)}
                            className="mt-0.5 w-4 h-4 accent-[#8D4A33] cursor-pointer shrink-0"
                          />
                          <div className="text-xs space-y-0.5">
                            <span className="font-medium text-[#151412] flex items-center gap-2">
                              <Plane className="w-3.5 h-3.5 text-[#8D4A33] shrink-0" />
                              Private Fast-Track DPS Airport Escort
                            </span>
                            <span className="text-[#5C574F] text-[11px] font-light block">
                              Chauffeured luxury SUV with cold pandan towels and
                              valley herbal elixirs
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-[#151412] shrink-0 pl-7 sm:pl-3">
                          +IDR 1,200,000
                        </span>
                      </label>

                      <label
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-4 border transition-colors cursor-pointer ${
                          wellnessRitual
                            ? "border-[#8D4A33] bg-[#EFECE4]"
                            : "border-[#E2DDD3] bg-[#F7F4EE] hover:border-[#665F56]"
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <input
                            type="checkbox"
                            checked={wellnessRitual}
                            onChange={(e) =>
                              setWellnessRitual(e.target.checked)
                            }
                            className="mt-0.5 w-4 h-4 accent-[#8D4A33] cursor-pointer shrink-0"
                          />
                          <div className="text-xs space-y-0.5">
                            <span className="font-medium text-[#151412] flex items-center gap-2">
                              <Flower2 className="w-3.5 h-3.5 text-[#8D4A33] shrink-0" />
                              Ayung Botanical Apothecary Ritual
                            </span>
                            <span className="text-[#5C574F] text-[11px] font-light block">
                              90-min handcrafted virgin coconut oil &amp;
                              volcanic silt restorative massage
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-[#151412] shrink-0 pl-7 sm:pl-3">
                          +IDR 1,450,000 / guest
                        </span>
                      </label>

                      <label
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-4 border transition-colors cursor-pointer ${
                          woodfireDining
                            ? "border-[#8D4A33] bg-[#EFECE4]"
                            : "border-[#E2DDD3] bg-[#F7F4EE] hover:border-[#665F56]"
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <input
                            type="checkbox"
                            checked={woodfireDining}
                            onChange={(e) =>
                              setWoodfireDining(e.target.checked)
                            }
                            className="mt-0.5 w-4 h-4 accent-[#8D4A33] cursor-pointer shrink-0"
                          />
                          <div className="text-xs space-y-0.5">
                            <span className="font-medium text-[#151412] flex items-center gap-2">
                              <UtensilsCrossed className="w-3.5 h-3.5 text-[#8D4A33] shrink-0" />
                              Hearth &amp; Soil Woodfire Atelier Tasting
                            </span>
                            <span className="text-[#5C574F] text-[11px] font-light block">
                              6-course archipelagic tasting menu over rambutan
                              embers at Restoran Bumi
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-[#151412] shrink-0 pl-7 sm:pl-3">
                          +IDR 1,850,000 / guest
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* 04. Guest Dossier */}
                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between border-b border-[#E2DDD3] pb-2">
                      <span className="text-[9px] tracking-[0.28em] uppercase text-[#665F56] font-semibold">
                        04 &bull; Guest Dossier &amp; Preferences
                      </span>
                      <span className="text-[9px] tracking-[0.2em] uppercase text-[#5C574F]">
                        Confidential
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor={`${formId}-guestname`}
                          className="flex items-center gap-1.5 text-xs text-[#151412] font-medium"
                        >
                          <User className="w-3.5 h-3.5 text-[#8D4A33]" />
                          Full Name
                        </label>
                        <input
                          id={`${formId}-guestname`}
                          type="text"
                          placeholder="Your Full Name"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full min-h-[44px] bg-[#F7F4EE] border border-[#E2DDD3] px-3.5 py-2.5 text-xs text-[#151412] placeholder-[#665F56] focus:border-[#151412] focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden transition-colors"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor={`${formId}-guestphone`}
                          className="flex items-center gap-1.5 text-xs text-[#151412] font-medium"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#8D4A33]" />
                          WhatsApp / Phone
                        </label>
                        <input
                          id={`${formId}-guestphone`}
                          type="tel"
                          placeholder="Your Phone Number"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full min-h-[44px] bg-[#F7F4EE] border border-[#E2DDD3] px-3.5 py-2.5 text-xs text-[#151412] placeholder-[#665F56] focus:border-[#151412] focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden transition-colors"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor={`${formId}-guestemail`}
                          className="flex items-center gap-1.5 text-xs text-[#151412] font-medium"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#8D4A33]" />
                          Email Address
                        </label>
                        <input
                          id={`${formId}-guestemail`}
                          type="email"
                          placeholder="email@example.com"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="w-full min-h-[44px] bg-[#F7F4EE] border border-[#E2DDD3] px-3.5 py-2.5 text-xs text-[#151412] placeholder-[#665F56] focus:border-[#151412] focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <label
                        htmlFor={`${formId}-notes`}
                        className="text-xs text-[#151412] font-medium"
                      >
                        Special Requests / Dietary Nuances / Celebration Notes
                      </label>
                      <textarea
                        id={`${formId}-notes`}
                        rows={2}
                        placeholder="Share dietary preferences, arrival flight number, or special requests..."
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="w-full bg-[#F7F4EE] border border-[#E2DDD3] p-3 text-xs text-[#151412] placeholder-[#665F56] focus:border-[#151412] focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden transition-colors"
                      />
                    </div>
                  </div>

                  {/* Action Gateways */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-4">
                    <motion.a
                      href={generateWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.985 }}
                      transition={{ duration: 0.2 }}
                      className="group flex-1 min-h-[48px] inline-flex items-center justify-center gap-2.5 bg-[#151412] hover:bg-[#8D4A33] text-[#F7F4EE] py-4 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 font-medium focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Inquire Via WhatsApp Butler</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C57D65] transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.a>

                    <motion.button
                      type="submit"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.985 }}
                      transition={{ duration: 0.2 }}
                      className="min-h-[48px] inline-flex items-center justify-center border border-[#151412] hover:bg-[#151412] hover:text-[#F7F4EE] text-[#151412] px-8 py-4 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 font-medium focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden"
                    >
                      Register Docket
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Architectural Investment Ledger */}
          <div className="concierge-reveal lg:col-span-5 space-y-6">
            <div className="bg-[#EFECE4] border border-[#E2DDD3] p-6 sm:p-8 space-y-6">
              <div className="border-b border-[#E2DDD3] pb-4">
                <span className="text-[9px] tracking-[0.28em] uppercase text-[#665F56] font-semibold block mb-1">
                  Residence Investment Ledger
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#151412] font-light">
                  {selectedVilla.name}
                </h3>
                <span className="text-xs text-[#5C574F] font-light">
                  {selectedVilla.bedrooms} Bedroom &bull;{" "}
                  {selectedVilla.sizeSqm} m&sup2; &bull;{" "}
                  {selectedVilla.viewType}
                </span>
              </div>

              {/* Ledger Lines with Animated Numbers & AnimatePresence Add-Ons */}
              <div className="space-y-3.5 text-xs text-[#5C574F] font-light">
                <div className="flex justify-between">
                  <span>Itinerary Duration</span>
                  <span className="text-[#151412] font-medium">
                    <AnimatedNumber value={nights} /> Nights
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Nightly Tariff</span>
                  <span className="text-[#151412] font-medium">
                    <AnimatedNumber
                      value={selectedVilla.pricePerNightIdr}
                      formatter={formatIdr}
                    />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Compound Subtotal</span>
                  <span className="text-[#151412] font-medium">
                    <AnimatedNumber
                      value={villaSubtotal}
                      formatter={formatIdr}
                    />
                  </span>
                </div>

                <AnimatePresence initial={false}>
                  {airportEscort && (
                    <motion.div
                      key="addon-airport"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: SANCTUARY_EASE }}
                      className="flex justify-between text-[#8D4A33] font-medium overflow-hidden"
                    >
                      <span>VIP Airport Escort</span>
                      <span>+{formatIdr(airportPrice)}</span>
                    </motion.div>
                  )}

                  {wellnessRitual && (
                    <motion.div
                      key="addon-wellness"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: SANCTUARY_EASE }}
                      className="flex justify-between text-[#8D4A33] font-medium overflow-hidden"
                    >
                      <span>Apothecary Ritual ({adults}x)</span>
                      <span>+{formatIdr(wellnessPrice)}</span>
                    </motion.div>
                  )}

                  {woodfireDining && (
                    <motion.div
                      key="addon-dining"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: SANCTUARY_EASE }}
                      className="flex justify-between text-[#8D4A33] font-medium overflow-hidden"
                    >
                      <span>Woodfire Tasting ({adults}x)</span>
                      <span>+{formatIdr(diningPrice)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4 border-t border-[#E2DDD3] flex items-baseline justify-between text-[#151412]">
                  <div>
                    <span className="text-[9px] tracking-[0.24em] uppercase text-[#665F56] block mb-0.5">
                      Estimated Total Investment
                    </span>
                    <span className="inline-block font-serif text-2xl sm:text-3xl font-light text-[#151412]">
                      <AnimatedNumber
                        value={totalEstimateIdr}
                        formatter={formatIdr}
                      />
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-[#665F56] uppercase tracking-wider block">
                      approx. USD
                    </span>
                    <span className="text-sm font-light text-[#5C574F]">
                      $<AnimatedNumber value={totalEstimateUsd} /> USD
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FFFFFF] border border-[#E2DDD3] text-[11px] text-[#5C574F] space-y-1.5 font-light">
                <span className="font-semibold text-[#151412] uppercase tracking-wider text-[9px] block">
                  Complimentary With Every Residence
                </span>
                <p>&bull; Daily organic breakfast cooked to order in-villa</p>
                <p>
                  &bull; Sunset botanical tea with traditional Balinese
                  delicacies
                </p>
                <p>&bull; 24-Hour dedicated private resident estate host</p>
                <p>
                  &bull; Scheduled private car transport within Ubud central
                  valley
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[10px] text-[#5C574F]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8D4A33] shrink-0" />
                <span>
                  Zero reservation fee. Flexible alteration up to 14 days prior
                  to arrival.
                </span>
              </div>
            </div>

            {/* Direct Contact Monograph Box */}
            <div className="p-6 bg-[#FFFFFF] border border-[#E2DDD3] space-y-3">
              <span className="text-[9px] tracking-[0.26em] uppercase text-[#665F56] block font-semibold">
                Direct Estate Concierge
              </span>
              <div className="flex items-center gap-3 text-xs text-[#151412]">
                <Phone className="w-3.5 h-3.5 text-[#8D4A33]" />
                <span className="font-medium">
                  {ESTATE_DETAILS.phoneDisplay}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#151412]">
                <Mail className="w-3.5 h-3.5 text-[#8D4A33]" />
                <span>{ESTATE_DETAILS.email}</span>
              </div>
              <p className="text-[11px] text-[#5C574F] pt-1 font-light">
                Our estate concierge is stationed on the Sayan Ridge 24 hours
                daily. Inquiries receive personalized response within 15
                minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
