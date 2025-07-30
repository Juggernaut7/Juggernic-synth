// src/components/landing/CallToActionSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button'; // Import our Button component
import { FaPlay } from 'react-icons/fa';

const CallToActionSection = ({ onStartSynthesizing }) => {
  return (
    <section className="py-20 px-4 text-center bg-synth-dark-secondary text-synth-text-light relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-synth-accent-blue/10 to-synth-accent-magenta/10 mix-blend-screen opacity-50 z-0"></div>
      <motion.div
        className="max-w-4xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-synth-text-light drop-shadow-lg">
          Ready to Juggernize Your Sound?
        </h2>
        <p className="text-xl text-synth-text-muted mb-10 leading-relaxed">
          Dive into the world of AI-generated audio and limitless sonic possibilities. Your next masterpiece awaits.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={onStartSynthesizing}
          className="shadow-synth-glow-md-blue"
          motionProps={{
            whileHover: { scale: 1.08 },
            whileTap: { scale: 0.98 }
          }}
        >
          <FaPlay className="text-xl" /> Start Synthesizing Now!
        </Button>
      </motion.div>
    </section>
  );
};

export default CallToActionSection;