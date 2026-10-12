"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Member {
  id: string;
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  bio?: string;
}

interface Domain {
  id: string;
  name: string;
  executive: Member;
  coreMembers: Member[];
}

interface TeamData {
  coordinator: Member;
  domains: Domain[];
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.49 1.49 0 1 0 0 2.98 1.49 1.49 0 0 0 0-2.98z" />
    </svg>
  );
}


const teamData: TeamData = {
  coordinator: {
    id: "coord-1",
    name: "Mohammed Kamran",
    role: "Club Coordinator",
    image: "https://res.cloudinary.com/qkvtxvth/image/upload/v1791825109/Kamran.jpg",
    linkedin: "https://linkedin.com",
    bio:  "-Building Production Grade Intelligent Systems-  Club Coordinator of Amazing Club 🙃",
  },
  domains: [
    {
      id: "system-sw",
      name: "System Software",
      executive: {
        id: "sys-exec",
        name: "Ramakrishnan",
        role: "Executive Member",
        image: "https://res.cloudinary.com/qkvtxvth/image/upload/v1791691790/Ramakrishnan.jpg",
        linkedin: "https://linkedin.com",
        bio: "I use Artix btw-",
      },
      coreMembers: [
        { id: "sys-c1", name: "Ritish", role: "Core Member", image: "https://res.cloudinary.com/qkvtxvth/image/upload/v1791691790/Rithish_S.jpg", linkedin: "https://linkedin.com",bio: "system.curiosity = true;", },
        { id: "sys-c2", name: "Aadithya", role: "Core Member", image: "https://res.cloudinary.com/qkvtxvth/image/upload/v1791691795/Aadhithya.jpg", linkedin: "https://linkedin.com",bio: "I am that penguin", },
      ],
    },
    {
      id: "web-genai",
      name: "Web Engineering & GenAI",
      executive: {
        id: "web-exec",
        name: "Mohammed Kamran",
        role: "Executive Member",
        image: "https://res.cloudinary.com/qkvtxvth/image/upload/v1791825109/Kamran.jpg",
        linkedin: "https://linkedin.com",
        bio: "Building Production Grade Intelligent Systems-  Club Coordinator of Amazing Club 🙃",
      },
      coreMembers: [
        {
          id: "web-c1",
          name: "Trishanku",
          role: "Core Member",
          image:"https://res.cloudinary.com/qkvtxvth/image/upload/v1791691791/Trishanku.jpg",
          linkedin: "https://linkedin.com",
          bio: "If you love something, Set it free. Unless it's a tiger.",
        },
        { id: "web-c2", name: "Akanksha", role: "Core Member", image: "https://res.cloudinary.com/qkvtxvth/image/upload/v1791692405/Akanksha.jpg", linkedin: "https://linkedin.com",bio: "Debugging my life :|", },
        { id: "web-c3", name: "Kartik", role: "Core Member", image: "https://res.cloudinary.com/qkvtxvth/image/upload/v1791691790/Karthik.jpg", linkedin: "https://linkedin.com",bio: "It's Hero Time", },
      ],
    },
    {
      id: "cyber-sec",
      name: "Cyber Security",
      executive: {
        id: "cyber-exec",
        name: "Pranjal",
        role: "Executive Member",
        image: "https://res.cloudinary.com/qkvtxvth/image/upload/v1791827227/Pranjal.jpg",
        linkedin: "https://linkedin.com",
        bio: "Procaffeinating",
      },
      coreMembers: [
        { id: "cyber-c1", name: "Hemanth", role: "Core Member", image: "https://res.cloudinary.com/qkvtxvth/image/upload/v1791714980/Hemanth.jpg", linkedin: "https://linkedin.com",bio: "Wake up to reality! Nothing ever goes as planned in this accursed world", },
        { id: "cyber-c2", name: "Prajwal", role: "Core Member", image: "https://res.cloudinary.com/qkvtxvth/image/upload/v1791691790/Prajwal.jpg", linkedin: "https://linkedin.com",bio: "The most dangerous exploit is the one nobody suspects.", },
        { id: "cyber-c3", name: "Hanvitha", role: "Core Member", image: "https://res.cloudinary.com/qkvtxvth/image/upload/v1791691789/Hanvitha.jpg", linkedin: "https://linkedin.com",bio: "Uhmm ntgg ://", },
        { id: "cyber-c4", name: "Pardhu", role: "Core Member", image:"https://res.cloudinary.com/qkvtxvth/image/upload/v1791691790/Pardhu.jpg", linkedin: "https://linkedin.com",bio: "Flaws are inevitable. -R.Pardhu", },
        { id: "cyber-c5", name: "Naveen", role: "Core Member", image: "https://res.cloudinary.com/qkvtxvth/image/upload/v1791691789/Adwaith_Naveen.jpg", linkedin: "https://linkedin.com",bio: "Did I tell you that I use Arch?", },
      ],
    },
    {
      id: "pr-domain",
      name: "Public Relations",
      executive: {
        id: "pr-exec",
        name: "Hetanshu",
        role: "Executive Member",
        image:"https://res.cloudinary.com/qkvtxvth/image/upload/v1791691789/Hetanshu.jpg",
        linkedin: "https://linkedin.com",
        bio: "Sleeping :)",
      },
      coreMembers: [],
    },
    {
      id: "events-domain",
      name: "Events",
      executive: {
        id: "ev-exec",
        name: "Aryaman",
        role: "Executive Member",
        image: "https://res.cloudinary.com/qkvtxvth/image/upload/v1791691941/AryamanSaraf.jpg",
        linkedin: "https://linkedin.com",
        bio: "It's TOXIC GAMER",
      },
      coreMembers: [
        { id: "events-c1", name: "Bhooshen", role: "Core Member", image: "https://res.cloudinary.com/qkvtxvth/image/upload/v1791692808/Bhooshen.jpg", linkedin: "https://linkedin.com" ,bio: "Let them write my downfall. I want to see how they explain my comeback",},
      ],
    },
  ],
};

function MemberCard({ member }: { member: Member }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-48 h-64 sm:w-56 sm:h-76 md:w-64 md:h-84 [perspective:1000px] cursor-pointer group select-none"
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      <motion.div
        className="relative w-full h-full rounded-2xl hover:-translate-y-1.5 transition-transform duration-200"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl bg-neutral-950 border border-white/10 group-hover:border-white/30 shadow-lg group-hover:shadow-black/70 flex flex-col justify-end ${
            isFlipped ? "pointer-events-none" : "pointer-events-auto"
          }`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-105"
            />
          </div>

          <div className="relative z-10 w-full bg-neutral-950 border-t border-white/10 p-3 sm:p-3.5 text-left rounded-b-2xl">
            <h4 className="text-xs sm:text-sm md:text-base font-bold text-white tracking-wide truncate transition-colors duration-200">
              {member.name}
            </h4>
            <p className="text-[10px] sm:text-xs text-neutral-400 font-mono truncate leading-tight mt-0.5">
              {member.role}
            </p>
          </div>
        </div>

        <div
          className={`absolute inset-0 w-full h-full rounded-2xl bg-neutral-950 border border-white/20 p-4 sm:p-5 flex flex-col justify-between text-left shadow-2xl ${
            isFlipped ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="space-y-3">
            <div className="border-b border-white/10 pb-2.5">
              <span className="text-[10px] sm:text-xs text-neutral-400 font-mono uppercase tracking-wider block">
                {member.role}
              </span>
              <h4 className="text-sm sm:text-base md:text-lg font-extrabold text-white tracking-wide mt-0.5">
                {member.name}
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans line-clamp-4">
              {member.bio}
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-neutral-400 font-mono">
                Connect
              </span>
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="group/btn relative z-30 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white font-mono bg-neutral hover:bg-blue-600/50 px-3.5 py-1.5 rounded-lg border border-blue-400/40 hover:border-blue-400 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                >
                  <LinkedinIcon className="w-4 h-4 text-blue-400 group-hover/btn:text-blue-300 transition-colors" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>

            <div className="text-center">
              <span className="text-[10px] text-neutral-500 font-mono tracking-wider uppercase flex items-center justify-center gap-1">
                <span>↺</span> Click to flip
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function TeamSection() {
  return (
    <section id="team" className="relative max-w-7xl mx-auto px-2 sm:px-8 py-16 z-10">
      <motion.div
        id="team-card"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full rounded-3xl bg-neutral-950/90 border border-white/15 p-8 sm:p-12 md:p-16 relative overflow-hidden group hover:border-white/25 transition-colors duration-300 shadow-2xl space-y-16"
      >
        <div className="text-center space-y-8 relative z-10">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl md:text-9xl font-black text-transparent tracking-wider uppercase my-1 sm:my-2 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] [-webkit-text-stroke:2px_white] sm:[-webkit-text-stroke:3px_white] md:[-webkit-text-stroke:4px_white]">
              Team
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 font-mono">
              Guiding the Enigma vision
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <MemberCard member={teamData.coordinator} />
          </div>
        </div>

        <hr className="border-white/15 my-10 relative z-10" />

        <div className="space-y-16 relative z-10">
          {teamData.domains.map((domain) => (
            <div key={domain.id} className="space-y-8 text-center">
              <div className="space-y-1">
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {domain.name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-mono">
                  Executive & Core Team
                </p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="flex justify-center">
                  <MemberCard member={domain.executive} />
                </div>

                {domain.coreMembers.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-6xl">
                    {domain.coreMembers.map((coreMember) => (
                      <MemberCard key={coreMember.id} member={coreMember} />
                    ))}
                  </div>
                )}
                <hr className="border-white/15 my-10 relative z-10" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}