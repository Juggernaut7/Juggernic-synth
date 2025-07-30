// src/components/landing/HowItWorksSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaHeadphones, FaDownload, FaMagic } from 'react-icons/fa';

const stepVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      icon: <FaLaptopCode className="text-4xl text-synth-accent-green mb-3" />,
      title: "Input Your Prompt",
      description: "Describe the sound you envision – from 'futuristic synthwave' to 'ambient forest at night'."
    },
    {
      number: 2,
      icon: <FaMagic className="text-4xl text-synth-accent-magenta mb-3" />,
      title: "Juggernize!",
      description: "Hit the 'Juggernize!' button and watch our AI forge your text into a unique audio track."
    },
    {
      number: 3,
      icon: <FaHeadphones className="text-4xl text-synth-accent-blue mb-3" />,
      title: "Listen & Visualize",
      description: "Play your generated audio and see its waves dance in the real-time visualizer."
    },
    {
      number: 4,
      icon: <FaDownload className="text-4xl text-synth-accent-orange mb-3" />,
      title: "Download & Share",
      description: "Download your sonic creation and share it with the world or integrate into your projects."
    }
  ];

  return (
    <section className="py-20 px-4 bg-synth-dark-primary text-synth-text-light">
      <motion.h2
        className="text-4xl md:text-5xl font-extrabold mb-12 text-center text-synth-text-light drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        How It Works
        <span className="block w-24 h-1 bg-synth-accent-magenta mx-auto mt-4 rounded-full"></span>
      </motion.h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center p-6 rounded-xl bg-synth-dark-secondary shadow-lg border border-synth-gray/20 transform hover:scale-105 transition-transform duration-300"
            variants={stepVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.15 }}
          >
            <div className="w-16 h-16 rounded-full bg-synth-gray/10 flex items-center justify-center mb-4 text-synth-text-light font-bold text-3xl border-2 border-synth-gray/30">
              {step.number}
            </div>
            {step.icon}
            <h3 className="text-xl font-semibold text-synth-text-light mb-2">{step.title}</h3>
            <p className="text-synth-text-muted">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;