"use client";

import { useState, useId } from "react";
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
  ArrowRight 
} from "lucide-react";
import { ESTATE_DETAILS, VILLA_RESIDENCES } from "@/data/villa";

interface BookingConciergeProps {
  selectedVillaId?: string;
}

export default function BookingConcierge({ selectedVillaId = VILLA_RESIDENCES[0].id }: BookingConciergeProps) {
  const [villaId, setVillaId] = useState(selectedVillaId);
  const [checkIn, setCheckIn] = useState("2026-10-15");
  const [checkOut, setCheckOut] = useState("2026-10-18");
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

  const formId = useId();

  const selectedVilla = VILLA_RESIDENCES.find((v) => v.id === villaId) || VILLA_RESIDENCES[0];

  const calculateNights = () => {
    try {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 2;
    } catch {
      return 3;
    }
  };

  const nights = calculateNights();
  const villaSubtotal = selectedVilla.pricePerNightIdr * nights;

  const airportPrice = airportEscort ? 1200000 : 0;
  const wellnessPrice = wellnessRitual ? 1450000 * adults : 0;
  const diningPrice = woodfireDining ? 1850000 * adults : 0;
  const addOnsTotal = airportPrice + wellnessPrice + diningPrice;

  const totalEstimateIdr = villaSubtotal + addOnsTotal;
  const totalEstimateUsd = Math.round(totalEstimateIdr / 15300);

  const formatIdr = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

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
      wellnessRitual ? `* Ayung Botanical Apothecary Ritual (${adults} Guests)` : null,
      woodfireDining ? `* Hearth & Soil Woodfire Tasting Atelier (${adults} Guests)` : null,
      !airportEscort && !wellnessRitual && !woodfireDining ? "* None selected" : null,
      "",
      "GUEST INFORMATION:",
      `* Full Name: ${guestName || "Pending"}` ,
      `* Phone / WA: ${guestPhone || "Pending"}`,
      `* Email: ${guestEmail || "Pending"}`,
      specialRequests ? `* Notes / Occasion: ${specialRequests}` : null,
      "",
      `* Estimated Total: ${formatIdr(totalEstimateIdr)} (~USD $${totalEstimateUsd})`,
      "",
      "Kindly advise residence availability and reservation arrangement. Suksma.",
    ].filter(Boolean);

    const message = lines.join("\n");
    return `https://wa.me/${ESTATE_DETAILS.phoneRaw}?text=${encodeURIComponent(message)}`;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setBookingRef(`AMR-2026-${randomCode}`);
    setIsSubmitted(true);
  };

  return (
    <section id="concierge" className="py-20 lg:py-32 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E2DDD3] pb-6 mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#A2583E] font-medium">
              Reservation Concierge &bull; Direct Butler Desk
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#151412] leading-tight">
              Curate your sanctuary stay.
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-[#5C574F] max-w-md">
            Direct estate bookings receive personalized butler attention, flexible rescheduling, and complimentary arrival refreshments.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2DDD3] p-6 sm:p-10 shadow-xs">
            {isSubmitted ? (
              <div className="py-8 space-y-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#EFECE4] border border-[#A2583E] flex items-center justify-center text-[#A2583E]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#A2583E] font-medium">
                    Sanctuary Request Registered
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#151412]">
                    Matur Suksma, {guestName || "Honored Guest"}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C574F] max-w-md mx-auto leading-relaxed">
                    Your inquiry for <span className="font-semibold text-[#151412]">{selectedVilla.name}</span> has been logged under docket <span className="font-mono text-[#A2583E] font-semibold">{bookingRef}</span>.
                  </p>
                </div>

                <div className="p-5 bg-[#F7F4EE] border border-[#E2DDD3] max-w-md mx-auto text-left text-xs space-y-2 text-[#5C574F]">
                  <div className="flex justify-between border-b border-[#E2DDD3] pb-2">
                    <span>Stay Dates:</span>
                    <span className="text-[#151412] font-medium">{checkIn} to {checkOut} ({nights} Nights)</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E2DDD3] pb-2">
                    <span>Party:</span>
                    <span className="text-[#151412] font-medium">{adults} Adults {children > 0 && `+ ${children} Children`}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Total Estimated Tariff:</span>
                    <span className="text-[#151412] font-bold">{formatIdr(totalEstimateIdr)}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={generateWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#151412] hover:bg-[#A2583E] text-[#F7F4EE] px-6 py-3.5 text-xs tracking-[0.2em] uppercase transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Open WhatsApp Butler Chat</span>
                  </a>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="inline-flex items-center justify-center border border-[#E2DDD3] hover:border-[#151412] text-[#5C574F] hover:text-[#151412] px-6 py-3.5 text-xs tracking-[0.2em] uppercase transition-colors"
                  >
                    Modify Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitForm} className="space-y-8">
                <div className="space-y-4">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A847A] font-semibold block">
                    01. Select Residence &amp; Itinerary
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {VILLA_RESIDENCES.map((villa) => (
                      <button
                        type="button"
                        key={villa.id}
                        onClick={() => setVillaId(villa.id)}
                        className={`p-3.5 text-left border transition-all ${
                          villaId === villa.id
                            ? "border-[#A2583E] bg-[#EFECE4] ring-1 ring-[#A2583E]"
                            : "border-[#E2DDD3] hover:border-[#8A847A] bg-[#FFFFFF]"
                        }`}
                      >
                        <div className="text-[9px] tracking-wider uppercase text-[#8A847A]">
                          {villa.bedrooms} Bedroom
                        </div>
                        <div className="font-serif text-sm text-[#151412] mt-0.5">
                          {villa.name}
                        </div>
                        <div className="text-[10px] text-[#A2583E] mt-1 font-medium">
                          {formatIdr(villa.pricePerNightIdr)} / night
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor={`${formId}-checkin`} className="flex items-center gap-1.5 text-xs font-medium text-[#151412]">
                      <Calendar className="w-3.5 h-3.5 text-[#A2583E]" />
                      Check-In Date
                    </label>
                    <input
                      id={`${formId}-checkin`}
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-[#F7F4EE] border border-[#E2DDD3] px-3.5 py-2.5 text-xs text-[#151412] focus:border-[#A2583E] focus:outline-hidden"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor={`${formId}-checkout`} className="flex items-center gap-1.5 text-xs font-medium text-[#151412]">
                      <Calendar className="w-3.5 h-3.5 text-[#A2583E]" />
                      Check-Out Date
                    </label>
                    <input
                      id={`${formId}-checkout`}
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-[#F7F4EE] border border-[#E2DDD3] px-3.5 py-2.5 text-xs text-[#151412] focus:border-[#A2583E] focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor={`${formId}-adults`} className="flex items-center gap-1.5 text-xs font-medium text-[#151412]">
                      <Users className="w-3.5 h-3.5 text-[#A2583E]" />
                      Adult Guests
                    </label>
                    <select
                      id={`${formId}-adults`}
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full bg-[#F7F4EE] border border-[#E2DDD3] px-3.5 py-2.5 text-xs text-[#151412] focus:border-[#A2583E] focus:outline-hidden"
                    >
                      <option value={1}>1 Adult</option>
                      <option value={2}>2 Adults</option>
                      <option value={3}>3 Adults</option>
                      <option value={4}>4 Adults</option>
                      <option value={6}>6 Adults</option>
                      <option value={8}>8 Adults (Grand Ridge)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor={`${formId}-children`} className="flex items-center gap-1.5 text-xs font-medium text-[#151412]">
                      <Users className="w-3.5 h-3.5 text-[#A2583E]" />
                      Children (Under 12)
                    </label>
                    <select
                      id={`${formId}-children`}
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="w-full bg-[#F7F4EE] border border-[#E2DDD3] px-3.5 py-2.5 text-xs text-[#151412] focus:border-[#A2583E] focus:outline-hidden"
                    >
                      <option value={0}>No Children</option>
                      <option value={1}>1 Child</option>
                      <option value={2}>2 Children</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A847A] font-semibold block">
                    02. Bespoke Estate Additions (Optional)
                  </span>

                  <div className="space-y-2.5">
                    <label className="flex items-center justify-between p-3 border border-[#E2DDD3] bg-[#F7F4EE] cursor-pointer hover:border-[#A2583E] transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={airportEscort}
                          onChange={(e) => setAirportEscort(e.target.checked)}
                          className="w-4 h-4 text-[#A2583E] rounded-none focus:ring-0"
                        />
                        <div className="text-xs">
                          <span className="font-medium text-[#151412] flex items-center gap-1.5">
                            <Plane className="w-3.5 h-3.5 text-[#A2583E]" />
                            Private Fast-Track DPS Airport Escort
                          </span>
                          <span className="text-[#8A847A] text-[11px] block">
                            Luxury SUV transfer with cold pandan towels &amp; herbal refreshment
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[#151412] shrink-0">
                        +IDR 1,200,000
                      </span>
                    </label>

                    <label className="flex items-center justify-between p-3 border border-[#E2DDD3] bg-[#F7F4EE] cursor-pointer hover:border-[#A2583E] transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={wellnessRitual}
                          onChange={(e) => setWellnessRitual(e.target.checked)}
                          className="w-4 h-4 text-[#A2583E] rounded-none focus:ring-0"
                        />
                        <div className="text-xs">
                          <span className="font-medium text-[#151412] flex items-center gap-1.5">
                            <Flower2 className="w-3.5 h-3.5 text-[#A2583E]" />
                            Ayung Botanical Apothecary Ritual
                          </span>
                          <span className="text-[#8A847A] text-[11px] block">
                            90-min handcrafted virgin coconut oil &amp; volcanic silt massage
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[#151412] shrink-0">
                        +IDR 1,450,000 / guest
                      </span>
                    </label>

                    <label className="flex items-center justify-between p-3 border border-[#E2DDD3] bg-[#F7F4EE] cursor-pointer hover:border-[#A2583E] transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={woodfireDining}
                          onChange={(e) => setWoodfireDining(e.target.checked)}
                          className="w-4 h-4 text-[#A2583E] rounded-none focus:ring-0"
                        />
                        <div className="text-xs">
                          <span className="font-medium text-[#151412] flex items-center gap-1.5">
                            <UtensilsCrossed className="w-3.5 h-3.5 text-[#A2583E]" />
                            Hearth &amp; Soil Woodfire Atelier Dinner
                          </span>
                          <span className="text-[#8A847A] text-[11px] block">
                            6-course archipelagic heirloom tasting menu at Restoran Bumi
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[#151412] shrink-0">
                        +IDR 1,850,000 / guest
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A847A] font-semibold block">
                    03. Guest Details &amp; Contact
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor={`${formId}-guestname`} className="flex items-center gap-1.5 text-xs text-[#151412]">
                        <User className="w-3.5 h-3.5 text-[#A2583E]" />
                        Full Name
                      </label>
                      <input
                        id={`${formId}-guestname`}
                        type="text"
                        placeholder="e.g. Helena Lindqvist"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-[#F7F4EE] border border-[#E2DDD3] px-3.5 py-2.5 text-xs text-[#151412] focus:border-[#A2583E] focus:outline-hidden"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor={`${formId}-guestphone`} className="flex items-center gap-1.5 text-xs text-[#151412]">
                        <Phone className="w-3.5 h-3.5 text-[#A2583E]" />
                        WhatsApp / Phone
                      </label>
                      <input
                        id={`${formId}-guestphone`}
                        type="tel"
                        placeholder="+62 8..."
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full bg-[#F7F4EE] border border-[#E2DDD3] px-3.5 py-2.5 text-xs text-[#151412] focus:border-[#A2583E] focus:outline-hidden"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor={`${formId}-guestemail`} className="flex items-center gap-1.5 text-xs text-[#151412]">
                        <Mail className="w-3.5 h-3.5 text-[#A2583E]" />
                        Email Address
                      </label>
                      <input
                        id={`${formId}-guestemail`}
                        type="email"
                        placeholder="guest@domain.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full bg-[#F7F4EE] border border-[#E2DDD3] px-3.5 py-2.5 text-xs text-[#151412] focus:border-[#A2583E] focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor={`${formId}-notes`} className="text-xs text-[#151412]">
                      Special Requests / Dietary Preferences / Occasion
                    </label>
                    <textarea
                      id={`${formId}-notes`}
                      rows={2}
                      placeholder="e.g. Honeymoon setup, vegan dietary requirement, quietest pavilion..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full bg-[#F7F4EE] border border-[#E2DDD3] p-3 text-xs text-[#151412] focus:border-[#A2583E] focus:outline-hidden"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-4">
                  <a
                    href={generateWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#151412] hover:bg-[#A2583E] text-[#F7F4EE] py-4 text-xs tracking-[0.2em] uppercase transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Inquire Via WhatsApp Butler</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center border border-[#151412] hover:border-[#A2583E] text-[#151412] hover:text-[#A2583E] px-8 py-4 text-xs tracking-[0.2em] uppercase transition-colors"
                  >
                    Submit Booking Form
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#EFECE4] border border-[#E2DDD3] p-6 sm:p-8 space-y-6">
              <div className="border-b border-[#E2DDD3] pb-4">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A847A] font-semibold block mb-1">
                  Reservation Investment Breakdown
                </span>
                <h3 className="font-serif text-2xl text-[#151412]">
                  {selectedVilla.name}
                </h3>
                <span className="text-xs text-[#5C574F]">
                  {selectedVilla.bedrooms} Bedroom &bull; {selectedVilla.sizeSqm} m&sup2; &bull; {selectedVilla.viewType}
                </span>
              </div>

              <div className="space-y-3 text-xs text-[#5C574F]">
                <div className="flex justify-between">
                  <span>Stay Duration</span>
                  <span className="text-[#151412] font-medium">{nights} Nights</span>
                </div>
                <div className="flex justify-between">
                  <span>Nightly Rate</span>
                  <span className="text-[#151412] font-medium">{formatIdr(selectedVilla.pricePerNightIdr)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Villa Subtotal</span>
                  <span className="text-[#151412] font-medium">{formatIdr(villaSubtotal)}</span>
                </div>

                {airportEscort && (
                  <div className="flex justify-between text-[#A2583E]">
                    <span>VIP Airport Escort</span>
                    <span>+{formatIdr(airportPrice)}</span>
                  </div>
                )}

                {wellnessRitual && (
                  <div className="flex justify-between text-[#A2583E]">
                    <span>Apothecary Ritual ({adults}x)</span>
                    <span>+{formatIdr(wellnessPrice)}</span>
                  </div>
                )}

                {woodfireDining && (
                  <div className="flex justify-between text-[#A2583E]">
                    <span>Woodfire Tasting ({adults}x)</span>
                    <span>+{formatIdr(diningPrice)}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-[#E2DDD3] flex items-baseline justify-between text-[#151412]">
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A847A] block">
                      Estimated Total Investment
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl font-semibold">
                      {formatIdr(totalEstimateIdr)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#8A847A] block">approx. USD</span>
                    <span className="text-sm font-semibold text-[#5C574F]">
                      ${totalEstimateUsd.toLocaleString()} USD
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FFFFFF] border border-[#E2DDD3] text-[11px] text-[#5C574F] space-y-1.5">
                <span className="font-semibold text-[#151412] uppercase tracking-wider text-[9px] block">
                  Complimentary With Every Direct Booking
                </span>
                <p>&bull; Daily organic breakfast cooked to order</p>
                <p>&bull; Afternoon tea with traditional Balinese delicacies</p>
                <p>&bull; 24-Hour dedicated resident butler</p>
                <p>&bull; High-speed fiber Wi-Fi throughout estate</p>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11px] text-[#8A847A]">
                <ShieldCheck className="w-4 h-4 text-[#A2583E] shrink-0" />
                <span>Zero reservation fee. Flexible alteration up to 14 days prior to arrival.</span>
              </div>
            </div>

            <div className="p-6 bg-[#FFFFFF] border border-[#E2DDD3] space-y-3">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A847A] block font-semibold">
                Direct Estate Contact
              </span>
              <div className="flex items-center gap-3 text-xs text-[#151412]">
                <Phone className="w-4 h-4 text-[#A2583E]" />
                <span className="font-medium">{ESTATE_DETAILS.phoneDisplay}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#151412]">
                <Mail className="w-4 h-4 text-[#A2583E]" />
                <span>{ESTATE_DETAILS.email}</span>
              </div>
              <p className="text-[11px] text-[#8A847A] pt-1">
                Our estate concierge is stationed on the Sayan Ridge 24 hours daily. Inquiries receive responses within 15 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
