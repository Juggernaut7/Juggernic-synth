// src/components/shared/Footer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaTwitter, FaDiscord, FaGithub } from 'react-icons/fa'; // Example social icons

/**
 * Global Footer Component for Juggernic Synth.
 * Contains copyright, social links, etc.
 */
const Footer = () => {
  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.3 }}
      className="w-full bg-synth-dark-primary/80 backdrop-blur-sm p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center text-synth-text-muted text-sm z-40 fixed bottom-0 left-0 right-0 shadow-lg border-t border-synth-gray/20"
    >
      <div className="mb-2 sm:mb-0 text-center sm:text-left">
        Juggernic Synth &copy; {new Date().getFullYear()}. All rights reserved.
      </div>
      <div className="flex gap-4">
        <a href="https://twitter.com/your-twitter" target="_blank" rel="noopener noreferrer" className="text-synth-accent-blue hover:text-synth-accent-magenta transition-colors">
          <FaTwitter className="text-xl" />
        </a>
        <a href="https://discord.gg/your-discord" target="_blank" rel="noopener noreferrer" className="text-synth-accent-blue hover:text-synth-accent-magenta transition-colors">
          <FaDiscord className="text-xl" />
        </a>
        <a href="https://github.com/your-github/juggernic-synth" target="_blank" rel="noopener noreferrer" className="text-synth-accent-blue hover:text-synth-accent-magenta transition-colors">
          <FaGithub className="text-xl" />
        </a>
      </div>
    </motion.footer>
  );
};

export default Footer;