"use client";
import EventsSection from "@/components/sections/PastEvents";
import { useActiveSection } from "./hooks/useActiveSection";
import InteractiveGridCanvas from "@/components/layout/InteractiveGridCanvas";
import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutUs";
import DomainsSection from "@/components/sections/Domains";
import TeamSection from "@/components/sections/Team";
import Footer from "@/components/sections/Footer";
import PenguinMascot from "@/components/layout/PenguinMascot";
import UpcomingEventsSection from "@/components/sections/RSVP";
import FeedbackSection from "@/components/sections/Feedback";

export default function Home() {
  const activeSection = useActiveSection();

  return (
    <>
      <InteractiveGridCanvas />
      <Navbar activeSection={activeSection} />
      <HeroSection />
      <AboutSection />
      <DomainsSection />
      <UpcomingEventsSection />
      <EventsSection />
      <TeamSection />
      <FeedbackSection />
      <Footer />
      <PenguinMascot activeSection={activeSection} />
    </>
  );
}