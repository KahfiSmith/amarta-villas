import Image from "next/image";
import { ESTATE_PHILOSOPHY } from "@/data/villa";
import { Mountain, Droplet, Trees, Flame } from "lucide-react";

export default function EstatePhilosophy() {
  const icons = [
    <Mountain key="mountain" className="w-5 h-5 text-[#A2583E]" />,
    <Trees key="trees" className="w-5 h-5 text-[#A2583E]" />,
    <Droplet key="droplet" className="w-5 h-5 text-[#A2583E]" />,
    <Flame key="flame" className="w-5 h-5 text-[#A2583E]" />,
  ];

  return (
    <section id="philosophy" className="py-20 lg:py-32 bg-[#EFECE4] border-t border-b border-[#E2DDD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#A2583E] font-medium">
                Sanctuary Ethos &bull; Sayan Ridge
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#151412] leading-[1.15]">
                Architecture that surrenders to the wild valley contour.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#5C574F] leading-relaxed">
              True quiet cannot be fabricated in concrete boxes. At AMARTA, every pavilion was laid out following the ancient root systems of native mahogany and breadfruit trees, ensuring that the natural canopy remains completely unbroken.
            </p>

            <blockquote className="border-l-2 border-[#A2583E] pl-6 py-2 my-6">
              <p className="font-serif italic text-base sm:text-lg text-[#151412] leading-snug">
                &ldquo;We did not level the hillside; we sculpted living pavilions that bow to the existing trees and the voice of the Ayung River.&rdquo;
              </p>
              <footer className="text-[11px] tracking-[0.15em] text-[#8A847A] uppercase mt-3">
                Ketut Ardana &bull; Lead Vernacular Architect
              </footer>
            </blockquote>

            <div className="relative aspect-[16/10] overflow-hidden border border-[#E2DDD3] bg-white">
              <Image
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80"
                alt="Ayung River Valley jungle canopy and organic stone pavilions"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-[#151412]/80 px-3 py-1 text-[10px] tracking-widest text-[#F7F4EE] uppercase">
                Living Canopy &bull; Ayung Gorge
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="border-b border-[#E2DDD3] pb-4 flex items-center justify-between">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A847A]">
                The Four Foundational Disciplines
              </span>
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#5C574F]">
                Volcanic Matter &bull; Slow Living
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {ESTATE_PHILOSOPHY.map((pillar, index) => (
                <div
                  key={pillar.number}
                  className="bg-[#FFFFFF] border border-[#E2DDD3] p-6 sm:p-7 flex flex-col justify-between hover:border-[#A2583E] transition-colors group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-2xl text-[#8A847A] group-hover:text-[#A2583E] transition-colors">
                        {pillar.number}
                      </span>
                      <div className="p-2 bg-[#F7F4EE] border border-[#E2DDD3]">
                        {icons[index]}
                      </div>
                    </div>
                    <h3 className="font-serif text-lg text-[#151412] leading-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#5C574F] leading-relaxed">
                      {pillar.detail}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#E2DDD3]">
                    <span className="text-[9px] tracking-[0.2em] uppercase text-[#8A847A] block">
                      Natural Element
                    </span>
                    <span className="text-[11px] font-medium text-[#151412]">
                      {pillar.material}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 bg-[#F7F4EE] border border-[#E2DDD3] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-xs font-medium text-[#151412]">
                  Curious about the architectural blueprint?
                </p>
                <p className="text-[11px] text-[#5C574F]">
                  Request our private estate monograph and material portfolio.
                </p>
              </div>
              <a
                href="#concierge"
                className="inline-flex items-center text-xs tracking-[0.15em] uppercase text-[#A2583E] hover:text-[#151412] font-medium border-b border-[#A2583E] pb-0.5"
              >
                Inquire With Butler &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
