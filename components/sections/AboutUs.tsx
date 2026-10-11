"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const carouselImages = [
  {
    src: "https://www.enigma-iiits.in/assets/img/about.jpg",
    alt: "Enigma Event",
    caption: "Enigma",
  },
  {
    src: "https://res.cloudinary.com/qkvtxvth/image/upload/v1791294993/DSC_0372.jpg",
    alt: "Enigma xMolab.Marimo" ,
    caption: "Enigma xMolab.Marimo",
  },
  {
    src: "https://res.cloudinary.com/qkvtxvth/image/upload/v1791283470/DSC_9530.jpg",
    alt: "Snakes and Coders",
    caption: "Snakes and Coders",
  },
];

export default function AboutSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center px-2 sm:px-8 max-w-7xl mx-auto z-10 py-16"
    >
      <motion.div
        id="about-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full rounded-3xl bg-neutral-950/90 border border-white/15 p-8 sm:p-12 md:p-16 relative overflow-hidden group hover:border-lime-500/40 transition-colors duration-300 transform-gpu shadow-2xl"
      >
        {/* cntnt grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight uppercase mb-2 flex items-center gap-3">
                <span className="text-white">ABOUT</span>
                <span className="text-transparent [-webkit-text-stroke:1.5px_white] sm:[-webkit-text-stroke:2px_white]">
                  US
                </span>
              </h2>
              <p className="text-sm sm:text-base font-semibold tracking-wider text-lime-200 uppercase">
                The Legacy of Enigma
              </p>
            </div>

            <p className="text-gray-200 text-base sm:text-lg leading-relaxed font-normal">
              <strong className="text-white font-bold">&quot;ENIGMA&quot;</strong> stands as the preeminent technical club at the esteemed{" "}
              <span className="text-white font-semibold">Indian Institute of Information Technology Sricity</span>, committed to advancing technology through tangible, hands-on projects. Within ENIGMA, we believe in the transformative potential of practical application.
            </p>

            <div className="p-6 rounded-2xl bg-black/50 border-l-4 border-lime-500 border-y border-r border-white/15 relative overflow-hidden">
              <p className="text-lime-50 text-sm sm:text-base leading-relaxed italic">
                Our core philosophy centers on the synergy of theoretical understanding and hands-on innovation. As a nurturing ground for expertise, we cultivate a culture deeply rooted in continuous exploration, focusing on Cybersecurity, System Software, Web Engineering &amp; GenAI.
              </p>
            </div>
          </div>

          <div 
            className="lg:col-span-5 relative flex flex-col items-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 bg-black/60 shadow-lg">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={carouselImages[currentIndex].src}
                    alt={carouselImages[currentIndex].alt}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none flex items-end p-4">
                    <p className="text-xs sm:text-sm font-medium text-lime-100 tracking-wide uppercase drop-shadow-md">
                      {carouselImages[currentIndex].caption}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>

            <div className="flex items-center gap-2 mt-4">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "w-8 bg-lime-600 "
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

          </div>

        </div>
      </motion.div>
    </section>
  );
}