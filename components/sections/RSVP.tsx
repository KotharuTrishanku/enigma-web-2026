"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, CheckCircle2, X, Ticket, AlertCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, query } from "firebase/firestore";
import { useAuth } from "@/app/context/authcntxt";

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl?: string;
}

export default function UpcomingEventsSection() {
  const { user, profile } = useAuth();
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", branch: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch events live from Firestore on load
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, "events")));
        const fetchedEvents: UpcomingEvent[] = [];
        querySnapshot.forEach((docSnap) => {
          fetchedEvents.push({ id: docSnap.id, ...docSnap.data() } as UpcomingEvent);
        });
        setEvents(fetchedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedEvent]);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!user || !selectedEvent) {
      setErrorMsg("You must be logged in to RSVP.");
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!["UG1", "UG2", "UG3", "UG4"].includes(formData.branch)) {
      setErrorMsg("Please select a valid batch (UG1, UG2, UG3, or UG4).");
      return;
    }

    setIsSubmitting(true);

    try {
      const rsvpDocId = `${user.uid}_${selectedEvent.id}`;
      const rsvpRef = doc(db, "rsvps", rsvpDocId);

      await setDoc(rsvpRef, {
        id: rsvpDocId,
        userId: user.uid,
        userName: trimmedName,
        userEmail: trimmedEmail,
        branch: formData.branch,
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title,
        eventDate: selectedEvent.date,
        timestamp: new Date().toISOString(),
      });

      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedEvent(null);
        setFormData({ name: "", email: "", branch: "" });
        setErrorMsg("");
      }, 1500);
    } catch (err: any) {
      setIsSubmitting(false);
      console.error("RSVP error:", err);
      setErrorMsg("Failed to save RSVP. Please try again.");
    }
  };

  return (
    <section id="rsvp" className="relative max-w-7xl mx-auto px-2 sm:px-8 py-16 z-10">
      <motion.div
        id="upcoming-card"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full rounded-3xl bg-neutral-950/90 border border-white/15 p-8 sm:p-12 md:p-16 relative overflow-hidden group hover:border-lime-500/40 transition-colors duration-300 shadow-2xl space-y-12"
      >
        <div className="text-center space-y-2">
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase">
            Upcoming Events &
            <span className="text-transparent tracking-tight"> </span>
            <span className="text-transparent [-webkit-text-stroke:1.5px_white] sm:[-webkit-text-stroke:2px_white]">
              RSVP
            </span>
          </h2>
          <p className="text-sm sm:text-base text-lime-200 font-mono">
            Secure Your Spot For Our Next Sessions
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loadingEvents ? (
            <p className="text-xs font-mono text-neutral-400 col-span-full text-center py-8">
              Loading events from database...
            </p>
          ) : events.length === 0 ? (
            <p className="text-xs font-mono text-neutral-400 col-span-full text-center py-8">
              No upcoming events currently scheduled. Check back soon!
            </p>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl bg-black/60 border border-white/15 overflow-hidden flex flex-col justify-between group/item hover:border-white/30 transition-all duration-300 shadow-lg"
              >
                {/* Tall Poster Image Container matching Past Events */}
                <div className="relative h-[480px] w-full overflow-hidden bg-neutral-900">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500 font-mono text-xs">
                      No Poster Available
                    </div>
                  )}
                </div>

                {/* Event Details & RSVP Button */}
                <div className="p-6 flex flex-col justify-between space-y-6 flex-grow bg-neutral-950 border-t border-white/10">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {event.title}
                    </h3>

                    <p className="text-sm text-neutral-300 leading-relaxed line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-white/10 font-mono text-xs text-neutral-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!user) {
                        alert("Please log in or sign up first using the top navigation bar to RSVP!");
                        return;
                      }
                      setSelectedEvent(event);
                      setErrorMsg("");
                      setFormData({
                        name: profile?.name || user.displayName || "",
                        email: user.email || "",
                        branch: "",
                      });
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold tracking-wide transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-lime-500/10"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>{user ? "RSVP Now" : "Login to RSVP"}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* RSVP Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-neutral-950/95 border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 text-white hover:bg-white/20 transition-colors border border-white/25 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-lime-400 mx-auto animate-bounce" />
                  <h3 className="text-2xl font-bold text-white">RSVP Confirmed!</h3>
                  <p className="text-sm text-neutral-300 font-mono">
                    See you at {selectedEvent.title}. Registration saved to database.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-lime-400 uppercase tracking-widest">
                      Event Registration
                    </span>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {selectedEvent.title}
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono">
                      {selectedEvent.date} • {selectedEvent.time} • {selectedEvent.location}
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-xs font-mono">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-neutral-300 uppercase">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500 text-sm font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-neutral-300 uppercase">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500 text-sm font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-neutral-300 uppercase">Batch / Year</label>
                      <select
                        required
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white focus:outline-none focus:border-lime-500 text-sm font-mono cursor-pointer"
                      >
                        <option value="" disabled>Select your batch</option>
                        <option value="UG1" className="bg-neutral-900 text-white">UG1</option>
                        <option value="UG2" className="bg-neutral-900 text-white">UG2</option>
                        <option value="UG3" className="bg-neutral-900 text-white">UG3</option>
                        <option value="UG4" className="bg-neutral-900 text-white">UG4</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold tracking-wide transition-colors duration-200 cursor-pointer shadow-lg shadow-lime-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Registration"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}