'use client';

import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { SocialProofBar } from '../components/landing/SocialProofBar';
import { InteractiveDemoSection } from '../components/landing/InteractiveDemoSection';
import { PillarsGrid } from '../components/landing/PillarsGrid';
import { ComparisonSection } from '../components/landing/ComparisonSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { PricingSection } from '../components/landing/PricingSection';
import { FaqSection } from '../components/landing/FaqSection';
import { CtaBanner } from '../components/landing/CtaBanner';
import { LandingFooter } from '../components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="relative min-h-screen p-4 sm:p-8 max-w-6xl mx-auto space-y-16 sm:space-y-20">
      {/* 1. Hero & Value Proposition */}
      <HeroSection />

      {/* 2. Live Social Proof & Engineering Stats */}
      <SocialProofBar />

      {/* 3. Interactive Workflow Demos */}
      <InteractiveDemoSection />

      {/* 4. Core Architecture Pillars */}
      <PillarsGrid />

      {/* 5. Legacy Resume vs Karma Comparison Matrix */}
      <ComparisonSection />

      {/* 6. Wall of Proof & Testimonials */}
      <TestimonialsSection />

      {/* 7. Transparent One-Time Pricing Model */}
      <PricingSection />

      {/* 8. Frequently Asked Questions Accordion */}
      <FaqSection />

      {/* 9. Final Call To Action Banner */}
      <CtaBanner />

      {/* 10. Footer */}
      <LandingFooter />
    </div>
  );
}
