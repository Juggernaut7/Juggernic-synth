// src/components/landing/FeaturesSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaMicrophoneAlt, FaFileAudio, FaChartBar } from 'react-icons/fa'; // Icons for features

const featureVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <FaMicrophoneAlt className="text-5xl text-synth-accent-blue mb-4" />,
      title: "AI-Powered Generation",
      description: "Transform text descriptions into unique, high-fidelity audio tracks using advanced AI models. Your imagination, materialized as sound."
    },
    {
      icon: <FaFileAudio className="text-5xl text-synth-accent-purple mb-4" />,
      title: "Seamless Local Playback",
      description: "Load and play your existing audio files with intuitive controls. From your personal library to new AI creations, experience it all."
    },
    {
      icon: <FaChartBar className="text-5xl text-synth-accent-green mb-4" />,
      title: "Dynamic Visualizer",
      description: "Witness your sound come alive with a mesmerizing, real-time audio visualization. See the rhythm, feel the frequency."
    }
  ];

  return (
    <section className="py-20 px-4 text-center bg-synth-dark-secondary text-synth-text-light relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-synth-accent-orange rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse-slow pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-synth-accent-blue rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse-fast pointer-events-none transform translate-x-1/2 translate-y-1/2"></div>

      <motion.h2
        className="text-4xl md:text-5xl font-extrabold mb-12 text-synth-text-light relative z-10 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        Unleash the Power of Sound
        <span className="block w-24 h-1 bg-synth-accent-blue mx-auto mt-4 rounded-full"></span>
      </motion.h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="p-8 rounded-xl bg-synth-dark-primary shadow-xl border border-synth-gray/20 flex flex-col items-center hover:shadow-synth-glow-md transition-all duration-300 transform hover:-translate-y-2"
            variants={featureVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.2 }}
          >
            {feature.icon}
            <h3 className="text-2xl font-semibold text-synth-text-light mb-3">{feature.title}</h3>
            <p className="text-synth-text-muted leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;