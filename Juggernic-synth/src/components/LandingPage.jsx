// src/components/LandingPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from './landing/HeroSection';
import FeaturesSection from './landing/FeaturesSection';
import HowItWorksSection from './landing/HowItWorksSection';
import CallToActionSection from './landing/CallToActionSection';

/**
 * Landing page component that serves as the entry point for the application.
 * It introduces Juggernic Synth and prompts the user to start.
 * @param {object} props
 * @param {function} props.onStartSynthesizing - Callback to transition to the main application.
 */
const LandingPage = ({ onStartSynthesizing }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="w-full min-h-screen bg-synth-dark-primary flex flex-col items-center justify-center"
    >
      {/* Hero Section - Pass the onStartSynthesizing prop */}
      <HeroSection onStartSynthesizing={onStartSynthesizing} />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Call To Action Section - Pass the onStartSynthesizing prop */}
      <CallToActionSection onStartSynthesizing={onStartSynthesizing} />
    </motion.div>
  );
};

export default LandingPage;