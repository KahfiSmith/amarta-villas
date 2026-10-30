"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ESTATE_DETAILS } from "@/data/villa";
import {
  SANCTUARY_EASE,
  SANCTUARY_SPRING,
  mobileDrawerVariants,
  mobileLinkItem,
} from "@/lib/motion-variants";
import { useSmoothScroll } from "./SmoothScrollProvider";

const NAV_LINKS = [
  { name: "Philosophy", href: "#philosophy", id: "philosophy", label: "01. Ethos" },
  { name: "Residences", href: "#villas", id: "villas", label: "02. The Villas" },
  { name: "Sensorial", href: "#experiences", id: "experiences", label: "03. Rituals" },
  { name: "Arrival", href: "#coordinates", id: "coordinates", label: "04. Topography" },
  { name: "Guestbook", href: "#journal", id: "journal", label: "05. Journal" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const { scrollTo } = useSmoothScroll();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      scrollTo(href, { offset: -70, duration: 1.35 });
    }
  };

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      scrollTo(0, { duration: 1.35 });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 24);
      if (scrollY < 180) {
        setActiveSection("");
      }
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionElements = NAV_LINKS.map((l) =>
      document.getElementById(l.id)
    ).filter(Boolean) as HTMLElement[];

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0 }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: SANCTUARY_EASE }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          isScrolled
            ? "bg-[#F7F4EE]/95 backdrop-blur-md border-b border-[#E2DDD3] py-3 shadow-[0_2px_16px_rgba(21,20,18,0.03)]"
            : "bg-[#F7F4EE]/80 backdrop-blur-xs py-4 lg:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between">
            {/* Brand Monogram */}
            <Link
              href="/"
              onClick={handleBrandClick}
              className="group flex flex-col min-h-[44px] justify-center focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden"
              aria-label="AMARTA Sanctuary Home"
            >
              <span className="font-serif text-xl sm:text-2xl tracking-[0.28em] text-[#151412] uppercase font-light transition-colors group-hover:text-[#8D4A33]">
                AMARTA
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.38em] text-[#665F56] uppercase -mt-0.5">
                Sanctuary &bull; Sayan Ubud
              </span>
            </Link>

            {/* Desktop Editorial Navigation with Shared Layout Active Indicator */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`min-h-[44px] inline-flex items-center text-[11px] tracking-[0.22em] uppercase transition-colors relative px-1 group focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden ${
                      isActive
                        ? "text-[#151412] font-medium"
                        : "text-[#5C574F] hover:text-[#151412]"
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive ? (
                      <motion.span
                        layoutId="navbar-active-underline"
                        transition={SANCTUARY_SPRING}
                        className="absolute bottom-2 left-0 right-0 h-[1.5px] bg-[#8D4A33]"
                      />
                    ) : (
                      <span className="absolute bottom-2 left-0 w-0 h-[1px] bg-[#8D4A33]/60 transition-all duration-300 group-hover:w-full" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Right Meta & Action */}
            <div className="hidden lg:flex items-center gap-6">
              <span className="text-[10px] tracking-[0.24em] uppercase text-[#665F56]">
                Sayan Ridge &bull; 240M
              </span>
              <motion.a
                href="#concierge"
                onClick={(e) => handleNavClick(e, "#concierge")}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="group min-h-[44px] inline-flex items-center gap-2 border border-[#151412] text-[#151412] hover:bg-[#151412] hover:text-[#F7F4EE] px-4 py-2.5 text-[10px] tracking-[0.22em] uppercase transition-colors duration-300 font-medium focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden"
              >
                <span>Reserve</span>
                <ArrowUpRight className="w-3 h-3 text-[#8D4A33] group-hover:text-[#C57D65] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
            </div>

            {/* Mobile Menu Trigger with explicit label */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden min-h-[44px] min-w-[44px] px-3 py-2 inline-flex items-center gap-2 text-[#151412] hover:text-[#8D4A33] border border-[#E2DDD3] bg-[#F7F4EE] focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="text-[10px] tracking-[0.2em] uppercase font-medium">
                {isMobileMenuOpen ? "Close" : "Menu"}
              </span>
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Scroll Progress Line */}
        <div
          ref={progressBarRef}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8D4A33] origin-left scale-x-0 transition-transform duration-150 ease-out pointer-events-none"
        />
      </motion.header>

      {/* Animated Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            variants={mobileDrawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-[#F7F4EE] pt-24 px-6 pb-10 flex flex-col justify-between md:hidden overflow-y-auto"
          >
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-[#E2DDD3] pb-3">
                <span className="text-[9px] tracking-[0.3em] uppercase text-[#665F56]">
                  Sanctuary Index
                </span>
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#8D4A33]">
                  Ayung Valley
                </span>
              </div>

              <nav className="flex flex-col space-y-3">
                {NAV_LINKS.map((link) => (
                  <motion.a
                    key={link.name}
                    variants={mobileLinkItem}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="group min-h-[48px] flex items-center justify-between py-2 border-b border-[#E2DDD3]/60 focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden"
                  >
                    <span className="font-serif text-2xl text-[#151412] group-hover:text-[#8D4A33] transition-colors">
                      {link.name}
                    </span>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#665F56]">
                      {link.label}
                    </span>
                  </motion.a>
                ))}
              </nav>
            </div>

            <motion.div
              variants={mobileLinkItem}
              className="space-y-4 pt-6 border-t border-[#E2DDD3]"
            >
              <div className="flex items-center gap-2 text-xs text-[#5C574F]">
                <Phone className="w-3.5 h-3.5 text-[#8D4A33]" />
                <span className="tracking-wide">
                  Direct Estate Butler: {ESTATE_DETAILS.phoneDisplay}
                </span>
              </div>
              <a
                href="#concierge"
                onClick={(e) => handleNavClick(e, "#concierge")}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-[#151412] text-[#F7F4EE] py-3.5 text-[11px] tracking-[0.22em] uppercase focus-visible:ring-2 focus-visible:ring-[#8D4A33] focus:outline-hidden"
              >
                <span>Reserve Sanctuary Residence</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C57D65]" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
