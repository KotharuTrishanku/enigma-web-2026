"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface EventItem {
  id: string;
  title: string;
  poster: string;
  repoUrl: string;
  gallery: string[];
  order?: number;
}

export default function EventsSection() {
  const [pastEvents, setPastEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [activeModalGallery, setActiveModalGallery] = useState<string[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  //fetch by order
  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        const q = query(collection(db, "pastEvents"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const fetchedEvents: EventItem[] = [];
        querySnapshot.forEach((docSnap) => {
          fetchedEvents.push({ id: docSnap.id, ...docSnap.data() } as EventItem);
        });
        setPastEvents(fetchedEvents);
      } catch (err) {
        console.error("Error fetching past events:", err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchPastEvents();
  }, []);

  const openGallery = (gallery: string[]) => {
    if (!gallery || gallery.length === 0) return;
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loadingEvents ? (
            <p className="text-xs font-mono text-neutral-400 col-span-full text-center py-8">
              Loading past events from database...
            </p>
          ) : pastEvents.length === 0 ? (
            <p className="text-xs font-mono text-neutral-400 col-span-full text-center py-8">
              No past events found in database.
            </p>
          ) : (
            pastEvents.map((event) => (
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
                    {event.repoUrl && (
                      <a
                        href={event.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View Repository"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors border border-white/10"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {event.gallery && event.gallery.length > 0 && (
                      <button
                        onClick={() => openGallery(event.gallery)}
                        aria-label="Open Image Gallery"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors border border-white/10 cursor-pointer"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
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