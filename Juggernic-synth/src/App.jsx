// src/App.jsx
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import MusicPlayer from './components/MusicPlayer';
import AudioVisualizer from './components/AudioVisualizer';
import AudioGenerator from './components/AudioGenerator';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAudioContext from './hooks/useAudioContext'; // Import the new hook

function App() {
  const { audioContext, analyser, isContextReady } = useAudioContext(); // Use the hook

  const [showApp, setShowApp] = useState(false);
  // analyser is now managed by the hook, no longer a state in App.jsx

  // The audio context resume logic is now inside useAudioContext,
  // so we can remove the useEffect here for user interaction if desired.
  // The hook handles the initial setup and resume.

  return (
    <div className="min-h-screen bg-synth-dark-primary text-synth-text-light font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="bg-synth-dark-secondary text-synth-text-light rounded-lg shadow-synth-glow-sm-blue border border-synth-accent-blue/50"
        bodyClassName="text-synth-text-light"
      />

      <AnimatePresence>
        {!showApp && (
          <LandingPage onStartSynthesizing={() => setShowApp(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showApp && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl p-6 bg-synth-dark-primary rounded-xl shadow-2xl flex flex-col md:flex-row gap-8 z-10 relative"
          >
            {/* Render visualizer only if analyser is ready */}
            {analyser && isContextReady && (
                <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                    <AudioVisualizer analyser={analyser} />
                </div>
            )}

            <div className="md:w-1/2 flex flex-col gap-8 relative z-10">
              {/* Pass analyser and context to generator */}
              <AudioGenerator analyser={analyser} audioContext={audioContext} isContextReady={isContextReady} />
            </div>

            <div className="md:w-1/2 flex flex-col gap-8 relative z-10">
              {/* Pass analyser and context to player */}
              <MusicPlayer analyser={analyser} audioContext={audioContext} isContextReady={isContextReady} />
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-[10%] w-64 h-64 bg-synth-accent-purple rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-[15%] w-48 h-48 bg-synth-accent-magenta rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse-fast"></div>
        <div className="absolute top-[60%] left-[50%] w-72 h-72 bg-synth-accent-blue rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse-normal"></div>
      </div>
    </div>
  );
}

export default App;