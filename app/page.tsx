import AboutSection from "@/components/sections/AboutUs";
import HeroSection from "@/components/sections/HeroSection";
import InteractiveGridCanvas from "@/components/layout/InteractiveGridCanvas";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import DomainsSection from "@/components/sections/Domains";

export default function Home() {
  return (
    <>
      <InteractiveGridCanvas />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <DomainsSection />
      <Footer />
    </>
  );
}