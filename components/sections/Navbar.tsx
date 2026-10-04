/* components/layout/Navbar.tsx */
"use client";

import { useState } from "react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Domains", href: "#domains"},
  { label: "RSVP", href: "#rsvp" },
  { label: "Events", href: "#events" },
  { label: "Team", href: "#team" },
  { label: "Socials", href: "#socials" },
];

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-auto">
      <nav className="flex items-center gap-6 sm:gap-8 px-8 py-3 rounded-full bg-black/20 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-300">
        
        {navItems.map((item) => (
          <a
                key={item.label}
                href={item.href}
                onClick={() => setActiveTab(item.label)}
                className={`text-base sm:text-lg font-semibold tracking-wide transition-colors duration-200 ${
                  "text-neutral-300 hover:text-white"
                }`}
            >
            {item.label}
          </a>
        ))}

        <a
              href="#signup"
              className="px-7 py-2 text-base sm:text-lg font-semibold text-white rounded-full border border-lime-200/40 bg-lime-700/20 hover:bg-lime-500/20 hover:border-lime-300 transition-all duration-200 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
          >
          Sign Up
        </a>

      </nav>
    </header>
  );
}