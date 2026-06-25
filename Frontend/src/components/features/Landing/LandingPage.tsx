"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

import { Hero } from "./Hero";
import { FeaturesGrid } from "./FeaturesGrid";
import { Process } from "./Process";
import { Testimonials } from "./Testimonials";
import { Pricing } from "./Pricing";
import { CTA } from "./CTA";

export function LandingPage() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-background relative min-h-screen overflow-x-hidden font-sans">
      <div
        className="at-aurora-orb"
        style={{
          width: 600,
          height: 600,
          top: -200,
          right: -200,
          background: "rgba(124,92,252,0.10)",
        }}
      />
      <div
        className="at-aurora-orb"
        style={{
          width: 500,
          height: 500,
          top: 400,
          left: -200,
          background: "rgba(168,85,247,0.06)",
          animationDelay: "-4s",
        }}
      />
      <div
        className="at-aurora-orb"
        style={{
          width: 400,
          height: 400,
          bottom: 200,
          right: -100,
          background: "rgba(244,114,182,0.05)",
          animationDelay: "-8s",
        }}
      />

      <div className="relative z-10 overflow-hidden">
        <Navbar />

        <Hero />
        <div className="at-section-divider" />
        <FeaturesGrid />
        <div className="at-section-divider" />
        <Process />
        <div className="at-section-divider" />
        <Testimonials />
        <div className="at-section-divider" />
        <Pricing />
        <div className="at-section-divider" />
        <CTA />
        <div className="at-section-divider" />

        {showTopBtn && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-8 bottom-8 z-90"
          >
            <Button
              variant="outline"
              size="md"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group shadow-elevation-md bg-card/80 hover:bg-card border-border hover:border-primary/50 h-12 w-12 rounded-full p-0 backdrop-blur-md"
            >
              <ArrowUp
                size={18}
                className="group-hover:text-foreground text-(--text-dim) transition-all duration-300 group-hover:-translate-y-1"
              />
            </Button>
          </motion.div>
        )}

        <Footer />
      </div>
    </div>
  );
}
