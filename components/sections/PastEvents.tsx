"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  poster: string;
  repoUrl: string;
  gallery: string[];
}

const pastEvents: EventItem[] = [
  {
    id: "server-surfers",
    title: "Server Surfers",
    poster: "https://www.enigma-iiits.in/assets/img/portfolio/ctf1.png",
    repoUrl: "https://github.com/Enigma-IIITS",
    gallery: [
      "https://www.enigma-iiits.in/assets/img/gallary/g2.JPG",
      "https://www.enigma-iiits.in/assets/img/gallary/g3.JPG",
      "https://www.enigma-iiits.in/assets/img/gallary/g4.JPG",
    ],
  },
  {
    id: "maze-of-osiris",
    title: "The Maze of Osiris",
    poster: "https://www.enigma-iiits.in/assets/img/portfolio/ctf2.png",
    repoUrl: "https://github.com/Enigma-IIITS/TheMazeOfOsiris",
    gallery: [
      "https://www.enigma-iiits.in/assets/img/gallary/g5.JPG",
      "https://www.enigma-iiits.in/assets/img/gallary/g6.JPG",
    ],
  },
  {
    id: "jean-colas",
    title: "Jean-Colas Prunier",
    poster: "https://www.enigma-iiits.in/assets/img/portfolio/graphics.png",
    repoUrl: "https://www.linkedin.com/posts/enigmaiiits_presenting-jean-colas-prunier-activity-7165313738907009024-T8Ds/",
    gallery: [
      "https://www.enigma-iiits.in/assets/img/gallary/g8.JPG",
      "https://www.enigma-iiits.in/assets/img/gallary/g9.JPG",
      "https://www.enigma-iiits.in/assets/img/gallary/g1.JPG",
    ],
  },
  {
    id: "distributed-systems",
    title: "Distributed Systems",
    poster: "https://www.enigma-iiits.in/assets/img/portfolio/dissys.png",
    repoUrl: "https://www.enigma-iiits.in/distributed-system.html",
    gallery: [
      "https://www.enigma-iiits.in/assets/img/gallary/g1.JPG",
      "https://www.enigma-iiits.in/assets/img/gallary/g8.JPG",
    ],
  },
  {
    id: "cracking-the-code",
    title: "Cracking The Code",
    poster: "https://www.enigma-iiits.in/assets/img/portfolio/crackcode.png",
    repoUrl: "https://github.com/Enigma-IIITS",
    gallery: [
      "https://www.enigma-iiits.in/assets/img/gallary/g2.JPG",
      "https://www.enigma-iiits.in/assets/img/gallary/g5.JPG",
    ],
  },
  {
    id: "dev-null",
    title: "/dev/null",
    poster: "https://www.enigma-iiits.in/assets/img/portfolio/ctf3.png",
    repoUrl: "https://github.com/Enigma-IIITS/dev-null",
    gallery: [
      "https://www.enigma-iiits.in/assets/img/gallary/g3.JPG",
      "https://www.enigma-iiits.in/assets/img/gallary/g9.JPG",
    ],
  },
];

export default function EventsSection() {
  const [activeModalGallery, setActiveModalGallery] = useState<string[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openGallery = (gallery: string[]) => {
    setActiveModalGallery(gallery);
    setCurrentImageIndex(0);
  };

  const closeGallery = () => {
    setActiveModalGallery(null);
  };

  const nextImage = () => {
    if (!activeModalGallery) return;
    setCurrentImageIndex((prev) => (prev + 1) % activeModalGallery.length);
  };

  const prevImage = () => {
    if (!activeModalGallery) return;
    setCurrentImageIndex((prev) => (prev - 1 + activeModalGallery.length) % activeModalGallery.length);
  };

  return (
    <section id="events" className="relative max-w-7xl mx-auto px-2 sm:px-8 py-16 z-10">
      <motion.div
        id="events-card"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full rounded-3xl bg-neutral-950/90 border border-white/15 p-8 sm:p-12 md:p-16 relative overflow-hidden group hover:border-lime-500/40 transition-colors duration-300 shadow-2xl space-y-12"
      >
        <div className="text-center space-y-2">
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase">
            Past Events
          </h2>
          <p className="text-sm sm:text-base text-lime-200 font-mono">
            A Glimpse Of Our Journey
          </p>
        </div>

        {/*evnt cards*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl bg-black/60 border border-white/15 overflow-hidden flex flex-col justify-between group/item hover:border-white/30 transition-all duration-300 shadow-lg"
            >
              <div className="relative h-[480px] w-full overflow-hidden bg-neutral-900">
                <img
                  src={event.poster}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 sm:p-5 flex items-center justify-between border-t border-white/10 bg-neutral-950">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                  {event.title}
                </h3>

                <div className="flex items-center gap-2">
                  <a
                    href={event.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View Repository"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors border border-white/10"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => openGallery(event.gallery)}
                    aria-label="Open Image Gallery"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors border border-white/10 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

     <AnimatePresence>
        {activeModalGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={closeGallery}
          >
            <div
              className="relative w-full max-w-4xl aspect-[16/10] bg-neutral-950 border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeGallery}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-white/20 transition-colors border border-white/25 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {activeModalGallery.length > 1 && (
                <button
                  onClick={prevImage}
                  className="absolute left-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-white/20 transition-colors border border-white/25 cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <div className="w-full h-full flex items-center justify-center p-8">
                <img
                  src={activeModalGallery[currentImageIndex]}
                  alt="Event photo"
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              </div>

              {activeModalGallery.length > 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-white/20 transition-colors border border-white/25 cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 border border-white/15 text-xs text-neutral-300 font-mono">
                {currentImageIndex + 1} / {activeModalGallery.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}