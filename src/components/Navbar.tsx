"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Compass, Phone } from "lucide-react";
import { ESTATE_DETAILS } from "@/data/villa";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Philosophy", href: "#philosophy" },
    { name: "Residences", href: "#villas" },
    { name: "Sensorial", href: "#experiences" },
    { name: "Arrival Guide", href: "#coordinates" },
    { name: "Guest Journal", href: "#journal" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#F7F4EE]/95 backdrop-blur-md border-b border-[#E2DDD3] py-3.5 shadow-xs"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group flex flex-col focus:outline-hidden"
            >
              <span className="font-serif text-2xl tracking-[0.25em] text-[#151412] uppercase group-hover:text-[#A2583E] transition-colors">
                AMARTA
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#8A847A] uppercase -mt-0.5">
                Sanctuary &bull; Sayan Ubud
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-xs tracking-[0.18em] uppercase text-[#5C574F] hover:text-[#A2583E] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#A2583E] hover:after:w-full after:transition-all"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-5">
              <div className="flex items-center gap-2 text-[11px] text-[#5C574F] border-r border-[#E2DDD3] pr-4">
                <Compass className="w-3.5 h-3.5 text-[#A2583E]" />
                <span className="tracking-wider">Ayung Valley &bull; 24&deg;C</span>
              </div>
              <a
                href="#concierge"
                className="inline-flex items-center gap-2 bg-[#151412] hover:bg-[#A2583E] text-[#F7F4EE] px-5 py-2.5 text-xs tracking-[0.18em] uppercase transition-colors rounded-none"
              >
                <span>Reserve Residence</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#151412] hover:text-[#A2583E] focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#F7F4EE] pt-24 px-6 pb-8 flex flex-col justify-between md:hidden">
          <div className="space-y-6">
            <div className="border-b border-[#E2DDD3] pb-4">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A847A]">
                Navigation Index
              </span>
            </div>
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-serif text-2xl text-[#151412] hover:text-[#A2583E] transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-[#E2DDD3]">
            <div className="flex items-center gap-2 text-xs text-[#5C574F]">
              <Phone className="w-4 h-4 text-[#A2583E]" />
              <span>Direct Butler: {ESTATE_DETAILS.phoneDisplay}</span>
            </div>
            <a
              href="#concierge"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#151412] text-[#F7F4EE] py-3.5 text-xs tracking-[0.2em] uppercase"
            >
              <span>Reserve Residence</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
