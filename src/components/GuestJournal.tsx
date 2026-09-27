import { GUEST_JOURNALS } from "@/data/villa";
import { Quote } from "lucide-react";

export default function GuestJournal() {
  return (
    <section id="journal" className="py-20 lg:py-32 bg-[#EFECE4] border-t border-b border-[#E2DDD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E2DDD3] pb-6 mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#A2583E] font-medium">
              Estate Archive &bull; Resident Chronicles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#151412] leading-tight">
              Words left behind in our valley guestbook.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5C574F] max-w-md">
            Unhurried reflections from travelers who sought seclusion, silence, and archipelagic hospitality along the Ayung gorge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {GUEST_JOURNALS.map((journal) => (
            <div
              key={journal.id}
              className="bg-[#FFFFFF] border border-[#E2DDD3] p-7 sm:p-8 flex flex-col justify-between hover:border-[#A2583E] transition-colors group"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-[#F7F4EE] border border-[#E2DDD3] text-[#A2583E]">
                    <Quote className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] tracking-[0.15em] uppercase text-[#8A847A]">
                    {journal.stayDuration}
                  </span>
                </div>

                <p className="font-serif text-base sm:text-lg text-[#151412] leading-relaxed italic">
                  &ldquo;{journal.quote}&rdquo;
                </p>

                <div className="pt-2">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#A2583E] block mb-1">
                    Memorable Highlight
                  </span>
                  <p className="text-xs font-medium text-[#151412]">
                    {journal.highlight}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E2DDD3] flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-[#151412]">
                    {journal.guestName}
                  </h3>
                  <span className="text-[11px] text-[#8A847A]">
                    {journal.origin}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] tracking-wider uppercase bg-[#F7F4EE] px-2 py-1 text-[#5C574F] border border-[#E2DDD3] block">
                    {journal.villaStayed}
                  </span>
                  <span className="text-[10px] text-[#8A847A] mt-1 block">
                    {journal.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
