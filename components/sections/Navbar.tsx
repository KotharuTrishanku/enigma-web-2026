"use client";

import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  activeSection?: string;
}

const navItems = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Domains", href: "#domains", id: "domains" },
  { label: "RSVP", href: "#rsvp", id: "rsvp" },
  { label: "Events", href: "#events", id: "events" },
  { label: "Team", href: "#team", id: "team" },
  { label: "Socials", href: "#socials", id: "socials" },
];

export default function Navbar({ activeSection = "home" }: NavbarProps) {
  return (
    <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-auto">
      <nav className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-300">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <a
              key={item.label}
              href={item.href}
              className={`relative px-3.5 py-1.5 rounded-full text-xs sm:text-sm md:text-base font-semibold tracking-wide transition-colors duration-300 ${
                isActive ? "text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 24,
                    }}
                    className="absolute inset-0 bg-white/15 border border-white/25 rounded-full z-0"
                  />
                )}
              </AnimatePresence>

              <span className="relative z-10">{item.label}</span>
            </a>
          );
        })}

        <a
          href="#signup"
          className="ml-2 px-4 sm:px-6 py-1.5 text-xs sm:text-sm md:text-base font-semibold text-white rounded-full border border-lime-200/40 bg-lime-700/20 hover:bg-lime-500/20 hover:border-lime-300 transition-all duration-200 shadow-[0_0_12px_rgba(16,185,129,0.15)] shrink-0"
        >
          Sign Up
        </a>
      </nav>
    </header>
  );
}