import { MapPin, Navigation, Car, Compass, ArrowUpRight } from "lucide-react";
import { ESTATE_DETAILS, ARRIVAL_EXPERIENCE } from "@/data/villa";

export default function EstateCoordinates() {
  const nearbyPoints = [
    { destination: "Ngurah Rai International Airport (DPS)", time: "70-80 Min", note: "Direct private airport escort included in Grand Ridge or upon request" },
    { destination: "Ubud Royal Palace & Traditional Art Market", time: "12 Min", note: "Complimentary on-demand estate car shuttle" },
    { destination: "Campuhan Ridge Scenic Walking Trail", time: "10 Min", note: "Morning walking trail with private guide" },
    { destination: "Tirta Empul Holy Water Temple (Tampak Siring)", time: "35 Min", note: "Curated spiritual purification pilgrimage" },
  ];

  return (
    <section id="coordinates" className="py-20 lg:py-32 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E2DDD3] pb-6 mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#A2583E] font-medium">
              Geography &bull; Valley Coordinates
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#151412] leading-tight">
              Arriving at the edge of the Sayan gorge.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5C574F] max-w-md">
            Perched 240 meters above sea level where the Ayung River bends, AMARTA is removed from traffic yet effortlessly connected to Bali.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E2DDD3] p-7 sm:p-9 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#A2583E] font-semibold block">
                Estate Address &amp; Coordinates
              </span>
              <h3 className="font-serif text-2xl text-[#151412]">
                AMARTA Sanctuary &bull; Sayan Ubud
              </h3>
              <p className="text-xs text-[#5C574F] leading-relaxed">
                {ESTATE_DETAILS.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-[#E2DDD3]">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase text-[#8A847A]">
                  <Compass className="w-3 h-3 text-[#A2583E]" />
                  Coordinates
                </span>
                <p className="text-xs font-medium text-[#151412]">{ESTATE_DETAILS.coordinates}</p>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase text-[#8A847A]">
                  <Navigation className="w-3 h-3 text-[#A2583E]" />
                  Elevation
                </span>
                <p className="text-xs font-medium text-[#151412]">{ESTATE_DETAILS.elevation}</p>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A847A] font-medium block">
                Accessibility &amp; Valley Proximity
              </span>
              <div className="space-y-3">
                {nearbyPoints.map((point, idx) => (
                  <div key={idx} className="p-3 bg-[#F7F4EE] border border-[#E2DDD3] flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-[#151412]">
                        {point.destination}
                      </div>
                      <div className="text-[10px] text-[#8A847A]">
                        {point.note}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#A2583E] shrink-0">
                      {point.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=-8.50394,115.24522"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#151412] hover:bg-[#A2583E] text-[#F7F4EE] py-3.5 text-xs tracking-[0.2em] uppercase transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#A2583E]" />
                <span>Open Google Maps Navigation</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="border-b border-[#E2DDD3] pb-3">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A847A] font-semibold">
                The Curated Arrival Sequence
              </span>
            </div>

            <div className="space-y-4">
              {ARRIVAL_EXPERIENCE.map((item) => (
                <div
                  key={item.step}
                  className="bg-[#FFFFFF] border border-[#E2DDD3] p-6 flex gap-5 hover:border-[#A2583E] transition-colors"
                >
                  <div className="font-serif text-2xl text-[#A2583E] shrink-0 font-medium">
                    {item.step}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg text-[#151412]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5C574F] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 bg-[#EFECE4] border border-[#E2DDD3] flex items-center gap-4">
              <div className="p-3 bg-[#FFFFFF] border border-[#E2DDD3] text-[#A2583E]">
                <Car className="w-5 h-5" />
              </div>
              <div className="text-xs text-[#5C574F] space-y-1">
                <span className="font-semibold text-[#151412] block">
                  Complimentary Private Ubud Shuttle
                </span>
                Resident guests enjoy private on-demand round-trip transport to Ubud Center between 08:00 and 21:00 WITA.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
