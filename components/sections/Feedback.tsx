"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";

export default function FeedbackSection() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedMessage = formData.message.trim();

    if (!formData.subject) {
      setErrorMsg("Please select what this feedback is regarding.");
      return;
    }

    if (!trimmedMessage) {
      setErrorMsg("Please write your message.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ subject: "", message: "" });

      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 800);
  };

  return (
    <section id="feedback" className="relative max-w-7xl mx-auto px-4 py-16 z-10 flex justify-center">
      <motion.div
        id="feedback-card"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-lg rounded-3xl bg-neutral-950/90 border border-white/15 p-6 sm:p-8 relative overflow-hidden group hover:border-lime-500/40 transition-colors duration-300 shadow-2xl space-y-6"
      >
        {/* Compact Header */}
        <div className="space-y-1">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            feedback
          </h2>
          <p className="text-xs sm:text-sm text-lime-200 font-mono">
            Help us improve Enigma by your graceful criticism!
          </p>
        </div>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-lime-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Feedback Received!</h3>
            <p className="text-xs text-neutral-300 font-mono">
              Thank you for helping us improve.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Subject Dropdown */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-300 uppercase tracking-wider">
                SUBJECT
              </label>
              <select
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-white/15 text-white focus:outline-none focus:border-lime-500 text-xs font-mono cursor-pointer"
              >
                <option value="" disabled>What is this regarding?</option>
                <option value="upcoming-the-bomb-lab" className="bg-neutral-900 text-white">
                  The Bomb Lab (Upcoming Event)
                </option>
                <option value="past-dev-null" className="bg-neutral-900 text-white">
                  /dev/null (Last Event)
                </option>
                <option value="general" className="bg-neutral-900 text-white">
                  General CLub Feedback
                </option>
                <option value="website" className="bg-neutral-900 text-white">
                  About Website
                </option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-300 uppercase tracking-wider">
                YOUR Thoughts...
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Be as specific as possible..."
                className="w-full px-3.5 py-3 rounded-xl bg-neutral-900/90 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500 text-xs font-mono resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold tracking-wider uppercase transition-colors duration-200 cursor-pointer shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Submitting..." : "Submit Feedback"}</span>
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}