import Image from "next/image";
import { SENSORIAL_EXPERIENCES } from "@/data/villa";
import { Clock, MapPin, ArrowUpRight } from "lucide-react";

export default function SensorialExperiences() {
  return (
    <section id="experiences" className="py-20 lg:py-32 bg-[#EFECE4] border-t border-b border-[#E2DDD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E2DDD3] pb-6 mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#A2583E] font-medium">
              Sensorial Itinerary &bull; Sayan Slow Living
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#151412] leading-tight">
              Rituals synchronized to the valley circadian pulse.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5C574F] max-w-md">
            From the dawn mist hovering above the river rapids to nightfall embers over our woodfire hearth, every sensory experience is curated for deep restoration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {SENSORIAL_EXPERIENCES.map((exp, index) => (
            <div
              key={exp.id}
              className="bg-[#FFFFFF] border border-[#E2DDD3] overflow-hidden flex flex-col justify-between group hover:border-[#A2583E] transition-colors"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#EFECE4]">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-[#151412]/80 backdrop-blur-xs text-[#F7F4EE] px-3 py-1 text-[10px] tracking-[0.2em] uppercase">
                  {exp.tag}
                </div>
                <div className="absolute top-4 right-4 bg-[#F7F4EE]/90 backdrop-blur-xs text-[#151412] px-3 py-1 text-[10px] tracking-wider uppercase font-medium">
                  {exp.priceNote}
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#8A847A]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#A2583E]" />
                      {exp.duration} &bull; {exp.timing}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#A2583E]" />
                      {exp.location}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-[#151412] group-hover:text-[#A2583E] transition-colors">
                    {exp.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5C574F] leading-relaxed">
                    {exp.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E2DDD3] flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A847A]">
                    Curated Experience 0{index + 1}
                  </span>
                  <a
                    href="#concierge"
                    className="inline-flex items-center gap-1 text-xs tracking-[0.15em] uppercase text-[#151412] hover:text-[#A2583E] font-medium transition-colors"
                  >
                    <span>Reserve With Butler</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
