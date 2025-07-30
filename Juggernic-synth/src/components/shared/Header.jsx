// src/components/shared/Header.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaCog, FaInfoCircle } from 'react-icons/fa'; // Example icons
import Button from './Button'; // Import our Button component

/**
 * Global Header Component for Juggernic Synth.
 * Contains branding, and potentially navigation or utility links.
 * @param {object} props
 * @param {function} [props.onOpenSettings] - Callback for opening settings.
 * @param {function} [props.onOpenAbout] - Callback for opening about/info.
 */
const Header = ({ onOpenSettings, onOpenAbout }) => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.2 }}
      className="w-full bg-synth-dark-primary/80 backdrop-blur-sm p-4 md:p-6 flex justify-between items-center z-40 fixed top-0 left-0 right-0 shadow-lg border-b border-synth-gray/20"
    >
      <div className="flex items-center gap-4">
        {/* Your App Logo/Icon */}
        <div className="text-synth-accent-blue text-4xl font-extrabold tracking-tight">
          JS
        </div>
        <h1 className="text-3xl font-extrabold text-synth-text-light drop-shadow-lg leading-none">
          Juggernic Synth
        </h1>
      </div>

      <nav className="flex items-center gap-4">
        {/* Example Nav Buttons */}
        <Button variant="text" size="sm" onClick={onOpenAbout} className="hidden md:flex">
          <FaInfoCircle /> About
        </Button>
        <Button variant="text" size="sm" onClick={onOpenSettings} className="hidden md:flex">
          <FaCog /> Settings
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open('https://github.com/your-github/juggernic-synth', '_blank')}
          className="hidden sm:flex"
        >
          <FaGithub /> GitHub
        </Button>
      </nav>
    </motion.header>
  );
};

export default Header;