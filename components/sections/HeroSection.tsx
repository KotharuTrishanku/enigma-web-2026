"use client";

import { useState, useEffect } from "react";

export default function HeroSection() {
  const [typedText, setTypedText] = useState("");
  const [showHeading, setShowHeading] = useState(false);

  const fullText = "Where code meets curiosity.";
  const highlightStart = "Where code meets ".length; 

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setShowHeading(true);
    }, 100);

    let charIndex = 0;
    const startTypewriter = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (charIndex <= fullText.length) {
          setTypedText(fullText.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 70);

      return () => clearInterval(typeInterval);
    }, 800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(startTypewriter);
    };
  }, []);

  const mainPart = typedText.slice(0, highlightStart);
  const bluePart = typedText.slice(highlightStart);

  return (
    <section
      id="home"
      data-no-grid="true"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center select-none overflow-hidden z-10"
    >
      <div
        className={`flex flex-col items-center gap-2 sm:gap-4 transition-all duration-1000 ${
          showHeading
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3"
        }`}
      >
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
          Welcome To
        </h2>

        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-transparent tracking-wider uppercase my-1 sm:my-2 drop-shadow-[0_0_35px_rgba(255,255,255,0.6)] [-webkit-text-stroke:2px_white] sm:[-webkit-text-stroke:3px_white] md:[-webkit-text-stroke:4px_white]">
          ENIGMA
        </h1>

        <div className="mt-4 sm:mt-6 text-xl sm:text-3xl md:text-4xl font-bold tracking-wide min-h-[2.5rem] flex items-center justify-center">
          <span className="text-white whitespace-pre">{mainPart}</span>
          <span className="text-lime-200">{bluePart}</span>
          <span className="inline-block w-[3px] h-[1.1em] bg-lime-200 ml-1.5 align-middle animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </div>
      </div>
    </section>
  );
}