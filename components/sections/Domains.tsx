"use client";

import { motion } from "framer-motion";
import { Cpu, Globe, ShieldCheck, Megaphone } from "lucide-react";

const domains = [
  {
    title: "System Software",
    description:
      "Engineering the backbone of computing ~ Operating Systems, low-level tools, and performance-critical software that everything else runs on.",
    icon: Cpu,
  },
  {
    title: "Web Engineering & GenAI",
    description:
      "Designing and building fast, scalable, and user-centric web applications that seamlessly connect ideas to real users with integration of Generative AI and its tools.",
    icon: Globe,
  },
  {
    title: "Cyber Security",
    description:
      "Uncovering system vulnerabilities, analyzing attack vectors, and building resilient defenses through hands-on penetration testing, reverse engineering, and CTF Sessions.",
    icon: ShieldCheck,
  },
  {
    title: "Public Relations",
    description:
      "Crafting narratives, managing perception, and building strong public identities through clear communication and strategic outreach.",
    icon: Megaphone,
  },
];

export default function DomainsSection() {
  return (
    <section
      id="domains"
      className="relative min-h-screen flex items-center justify-center px-2 sm:px-8 max-w-7xl mx-auto z-10 py-16"
    >
      <motion.div
        id="domains-card"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full rounded-3xl bg-neutral-950/90 border border-white/15 p-8 sm:p-12 md:p-16 relative overflow-hidden group hover:border-lime-500/40 transition-colors duration-300 transform-gpu shadow-2xl"
      >
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight uppercase mb-3 flex items-center justify-center gap-3">
            <span className="text-transparent [-webkit-text-stroke:1.5px_white] sm:[-webkit-text-stroke:2px_white]">
              our
            </span>
            <span className="text-white">domains</span>
          </h2>
          <p className="text-sm sm:text-base font-semibold tracking-wider text-lime-200 uppercase">
            Exploring the Core of Technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative z-10">
          {domains.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <motion.div
                key={domain.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                className="group/card relative rounded-2xl bg-black/50 border border-white/15 p-6 sm:p-8 hover:border-white-500/40 transition-all duration-100 hover:shadow-[0_0_25px_rgba(163,230,53,0.12)] flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400 group-hover/card:scale-110 group-hover/card:bg-lime-500/20 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-lime-200 tracking-tight">
                      {domain.title}
                    </h3>
                  </div>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
                    {domain.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}