"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MASCOT_CONFIG: Record<
  string,
  { pose: string; snowmanText: string; penguinText: string }
> = {
  home: {
    pose: "/mascot/start.svg",
    snowmanText: "Ah, welcome to ENIGMA's Stronghold, traveler!",
    penguinText: "Let's show them around — Woahh look at the magnificent engineering in the background!",
  },
  about: {
    pose: "/mascot/talk.svg",
    snowmanText: "So Enigma is a Technical Club at IIIT Sricity known for its-",
    penguinText: "So blah blah blah... They can read man! Let them...",
  },
  domains: {
    pose: "/mascot/look.svg",
    snowmanText: "So currently, this Enormous club offers Unparalleled-",
    penguinText: "-3 domains man. Just three. But hey, They're the BIG Three!",
  },
  rsvp: {
    pose: "/mascot/talk.svg",
    snowmanText: "Make certain you register in time-",
    penguinText: "I wanna go too man, why do only humans get these",
  },
  events: {
    pose: "/mascot/look.svg",
    snowmanText: "These are some of the good 'ol major events from the past",
    penguinText: "Hey don't forget the classic events like The Bomb-Lab Session, Linux Sessions, Web-dev Sessions, Creative Competetive sport events and so on.. done every year",
  },
  team: {
    pose: "/mascot/start.svg",
    penguinText: "So these are the juicy brains behind the club.",
    snowmanText: "Click on any member to peek at their Stats!",
  },
  feedback: {
    pose: "/mascot/start.svg",
    snowmanText: "Got any constructive suggestions for us or our events?",
    penguinText: "Spill the tea! Just enter whatever you felt. You'll be Anonymous to the team",
  },
  socials: {
    pose: "/mascot/talk.svg",
    snowmanText: "Connect with us on Discord, LinkedIn, and GitHub to-",
    penguinText: "-Woah man that's kinda deep and enlightening about humans. Well good for us we're not!",
  },
};

interface PenguinMascotProps {
  activeSection: string;
}

export default function PenguinMascot({ activeSection }: PenguinMascotProps) {
  const [isOpen, setIsOpen] = useState(true);
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateMascotPosition = () => {
      if (!mascotRef.current) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollPos = window.scrollY + window.innerHeight;
      const distanceFromBottom = scrollHeight - scrollPos;
      //for last social icons prob
      const lift = distanceFromBottom < 140 ? 140 - distanceFromBottom : 0;

      mascotRef.current.style.transform = `translate3d(0, -${lift}px, 0)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateMascotPosition);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateMascotPosition();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const currentMascot = MASCOT_CONFIG[activeSection] || {
    pose: "/mascot/start.svg",
    snowmanText: "Navigating the digital unknown...",
    penguinText: "Waddle waddle... exploring further!",
  };

  return (
    <div
      ref={mascotRef}
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2.5 pointer-events-none select-none transform-gpu will-change-transform"
    >
      <AnimatePresence mode="wait">
        {isOpen && (
          <div className="flex flex-col gap-2 items-end pointer-events-auto mr-2 sm:mr-4">

            <motion.div
              key={`snowman-${activeSection}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="relative bg-neutral-950/95 border border-white/20 text-neutral-200 font-mono text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-2xl backdrop-blur-md max-w-[220px] sm:max-w-[260px] transform-gpu"
            >
              <span className="text-[10px] text-lime-400 font-bold block mb-0.5">
                Snowman:
              </span>
              <p className="leading-snug">{currentMascot.snowmanText}</p>
            </motion.div>

            <motion.div
              key={`penguin-${activeSection}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="relative bg-neutral-950/95 border border-white/20 text-neutral-200 font-mono text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-2xl backdrop-blur-md max-w-[220px] sm:max-w-[260px] transform-gpu"
            >
              <span className="text-[10px] text-sky-400 font-bold block mb-0.5">
                Penguin:
              </span>
              <p className="leading-snug">{currentMascot.penguinText}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="pointer-events-auto relative cursor-pointer w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95 transform-gpu"
        aria-label="Toggle Mascot Dialogues"
      >
        <img
          src={currentMascot.pose}
          alt="ENIGMA Mascot Duo"
          className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)]"
        />
      </div>
    </div>
  );
}