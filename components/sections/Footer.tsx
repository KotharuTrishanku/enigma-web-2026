"use client";

import { motion } from "framer-motion";

// custom svg icons
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.49 1.49 0 1 0 0 2.98 1.49 1.49 0 0 0 0-2.98z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
    </svg>
  );
}

const socialLinks = [
  {
    name: "Discord",
    href: "https://discord.gg",
    icon: DiscordIcon,
    hoverStyles: "hover:text-[#5865F2]",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/enigmaiiits",
    icon: InstagramIcon,
    hoverStyles: "hover:text-[#E4405F]",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/enigmaiiits/",
    icon: LinkedinIcon,
    hoverStyles: "hover:text-[#0A66C2]",
  },
  {
    name: "GitHub",
    href: "https://github.com/Enigma-IIITS",
    icon: GithubIcon,
    hoverStyles: "hover:text-white ",
  },
];

export default function FooterSection() {
  return (
    <footer id="footer" className="relative max-w-7xl mx-auto px-2 sm:px-8 pt-16 pb-12 z-10">
      {/* Quote text lines allow full grid warping & double-click pulse */}
      <div className="text-center space-y-3 mb-12 sm:mb-16 max-w-3xl mx-auto px-4">
        <p className="text-sm sm:text-base md:text-lg text-lime-600 font-semibold font-mono leading-relaxed tracking-wide">
          Chaos Follows Wherever you stride to...
          Though, <span className="text-lime-400">Time Heals Everything</span>  
        </p>
        <p className="text-sm sm:text-base md:text-lg text-lime-200 font-semibold font-mono leading-relaxed tracking-wide">
          Double-Click for a Pulse to Enact Order.
        </p>
      </div>


      
      <motion.div
        id="footer-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full rounded-3xl bg-neutral-950/90 border border-white/15 p-8 sm:p-12 md:p-16 relative overflow-hidden group hover:border-lime-500/40 transition-colors duration-300 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-white/10">

          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black tracking-widest text-transparent [-webkit-text-stroke:1.5px_white] uppercase">
              ENIGMA
            </h2>
            <p className="text-sm sm:text-base text-gray-400 font-medium">
              Technical Club at IIIT Sricity.
            </p>
          </div>

          <div className="text-center md:text-right space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Connect With Us
            </h3>

            <div className="flex items-center justify-center md:justify-end gap-6 sm:gap-7">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`text-gray-400 hover:scale-115 transition-all duration-300 inline-flex items-center justify-center ${social.hoverStyles}`}
                  >
                    <Icon className="w-8 h-8 sm:w-9 sm:h-9" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-8 text-center">
          <p className="sm:text- text-gray-500 font-mono tracking-wider">
            &copy; 2026 ENIGMA Club. All Rights Reserved.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}