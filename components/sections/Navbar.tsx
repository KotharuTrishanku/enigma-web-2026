"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AuthModal from "@/components/modals/Authmodal";
import { useAuth } from "@/app/context/authcntxt";
import { User as UserIcon, LogOut, KeyRound, ChevronDown, Calendar, MessageSquare } from "lucide-react";

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
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "change">("signup");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, profile, logout } = useAuth();

  const openAuth = (mode: "login" | "signup" | "change") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
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

          {user ? (
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-500/10 border border-lime-400/30 text-lime-300 text-xs font-mono cursor-pointer hover:bg-lime-500/20 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="font-semibold">{profile?.name || user.email?.split("@")[0]}</span>
                <span className="text-[10px] uppercase bg-lime-400/20 text-lime-300 px-1.5 py-0.5 rounded font-bold border border-lime-400/30">
                  {profile?.role || "student"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-52 rounded-2xl bg-neutral-950 border border-white/15 shadow-2xl overflow-hidden z-50 p-1.5 font-mono"
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs text-white font-bold truncate">{user.email}</p>
                    </div>

                    {profile?.role === "admin" && (
                      <Link
                        href="/attendance"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                      >
                        <Calendar className="w-3.5 h-3.5 text-lime-400" />
                        <span>Attendance Management</span>
                      </Link>
                    )}

                    {(profile?.role === "admin" || profile?.role === "core") && (
                      <Link
                        href="/feedbacks"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-lime-400" />
                        <span>Feedbacks</span>
                      </Link>
                    )}

                    <button
                      onClick={() => openAuth("change")}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-lime-400" />
                      <span>Change Password</span>
                    </button>

                    <div className="border-t border-white/10 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => openAuth("signup")}
              className="ml-2 px-4 sm:px-6 py-1.5 text-xs sm:text-sm md:text-base font-semibold text-white rounded-full border border-lime-200/40 bg-lime-700/20 hover:bg-lime-500/20 hover:border-lime-300 transition-all duration-200 shadow-[0_0_12px_rgba(16,185,129,0.15)] shrink-0 cursor-pointer"
            >
              Sign Up
            </button>
          )}
        </nav>
      </header>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
