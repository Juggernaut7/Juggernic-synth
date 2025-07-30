// src/components/landing/HeroSection.jsx
import React from 'react';
import Lottie from 'lottie-react';
import synthAnimation from '../../assets/animations/your-animation.json'; // Adjust path and filename!
import Button from '../shared/Button'; // Import the Button component we made!

const HeroSection = ({ onStartSynthesizing }) => { // <--- Add onStartSynthesizing prop here
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-center min-h-[70vh] px-4 py-16 bg-synth-dark-primary text-synth-text-light overflow-hidden">
      {/* Lottie Animation Container */}
      <div className="absolute inset-0 z-0 opacity-20 flex items-center justify-center">
        <Lottie
          animationData={synthAnimation}
          loop={true}      // Set to true for looping animation
          autoplay={true}  // Set to true for automatic playback
          style={{ width: '100%', height: '100%', maxWidth: '800px', maxHeight: '800px' }} // Adjust size as needed
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center md:text-left md:w-1/2 p-6 bg-synth-dark-secondary bg-opacity-70 rounded-xl shadow-lg backdrop-blur-sm">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-synth-accent-blue leading-tight tracking-wide drop-shadow-lg">
          Juggernic Synth
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-synth-text-muted">
          Forge unique audio realities. Generate, play, and visualize sound with cutting-edge AI.
        </p>
        {/* Use our shared Button component and pass the onClick handler */}
        <Button
          variant="primary" // or whatever variant you prefer
          size="lg"
          onClick={onStartSynthesizing} // <--- Pass the prop here!
          className="shadow-synth-glow-md-blue"
          motionProps={{
            whileHover: { scale: 1.08 },
            whileTap: { scale: 0.98 }
          }}
        >
          Start Synthesizing
        </Button>
      </div>

      {/* Placeholder for potential other content on the right for md+ screens */}
      <div className="md:w-1/2 flex items-center justify-center p-6 hidden md:block">
        {/* You could add another static image or a different visual element here if desired */}
      </div>
    </section>
  );
};

export default HeroSection;