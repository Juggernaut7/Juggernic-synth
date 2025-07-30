// src/components/MainAppLayout.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Header from './shared/Header'; // Import the Header
import Footer from './shared/Footer'; // Import the Footer
import AudioGenerator from './AudioGenerator';
import MusicPlayer from './MusicPlayer';
import AudioVisualizer from './AudioVisualizer';
import Modal from './shared/Modal'; // Potentially for future settings/about modals
import { useState } from 'react'; // To manage modal state

/**
 * Main application layout component.
 * Orchestrates the header, footer, audio generator, music player, and visualizer.
 * @param {object} props
 * @param {AudioContext} props.audioContext The shared Web Audio API AudioContext.
 * @param {AnalyserNode} props.analyser The shared AnalyserNode for visualization.
 * @param {boolean} props.isContextReady Indicates if the AudioContext is in a 'running' state.
 */
const MainAppLayout = ({ audioContext, analyser, isContextReady }) => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      <Header
        onOpenAbout={() => setShowAboutModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        // Adjusted padding-top and padding-bottom to account for fixed header/footer
        className="w-full max-w-6xl p-6 pb-24 pt-24 bg-synth-dark-primary rounded-xl shadow-2xl flex flex-col md:flex-row gap-8 z-10 relative mt-16 mb-16" // mt/mb for spacing from fixed header/footer
      >
        {/* Audio Visualizer - now integrated into the layout */}
        {analyser && isContextReady && (
          <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
            <AudioVisualizer analyser={analyser} />
          </div>
        )}

        <div className="md:w-1/2 flex flex-col gap-8 relative z-10">
          <AudioGenerator
            analyser={analyser}
            audioContext={audioContext}
            isContextReady={isContextReady}
          />
        </div>

        <div className="md:w-1/2 flex flex-col gap-8 relative z-10">
          <MusicPlayer
            analyser={analyser}
            audioContext={audioContext}
            isContextReady={isContextReady}
          />
        </div>
      </motion.div>

      <Footer />

      {/* About Modal */}
      <Modal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        title="About Juggernic Synth"
        footer={<Button variant="primary" onClick={() => setShowAboutModal(false)}>Got It!</Button>}
      >
        <p className="text-synth-text-muted">
          Juggernic Synth is an experimental web application combining AI-powered text-to-audio generation with local music playback and real-time audio visualization. Unleash your creativity!
        </p>
        <p className="text-synth-text-muted mt-2">
          Developed as a passion project for the Juggernaut Challenge.
        </p>
      </Modal>

      {/* Settings Modal (Placeholder) */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Settings"
        footer={<Button variant="secondary" onClick={() => setShowSettingsModal(false)}>Close</Button>}
      >
        <p className="text-synth-text-muted">
          Settings will go here. (e.g., theme, audio quality options)
        </p>
      </Modal>
    </>
  );
};

export default MainAppLayout;