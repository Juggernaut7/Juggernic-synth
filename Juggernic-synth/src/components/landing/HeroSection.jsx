// src/components/landing/HeroSection.jsx
import React from 'react';
import Lottie from 'lottie-react';
import synthAnimation from '../../assets/animations/your-animation.json'; // Adjust path and filename!
import Button from '../shared/Button'; // Import the Button component we made!

const HeroSection = ({ onStartSynthesizing }) => {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-center min-h-[70vh] px-4 py-16 bg-synth-dark-primary text-synth-text-light overflow-hidden">
      {/* Wrapper for consistent content width and centering */}
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-center gap-8"> {/* Added max-w-6xl and mx-auto here */}

        {/* Hero Content (left side) */}
        <div className="relative z-10 text-center md:text-left w-full md:w-1/2 p-6 bg-synth-dark-secondary bg-opacity-70 rounded-xl shadow-lg backdrop-blur-sm">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-synth-accent-blue leading-tight tracking-wide drop-shadow-lg">
            Juggernic Synth
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-synth-text-muted">
            Forge unique audio realities. Generate, play, and visualize sound with cutting-edge AI.
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
            Start Synthesizing
          </Button>
        </div>

        {/* Lottie Animation (right side, as a flex item) */}
        <div className="relative z-10 flex items-center justify-center w-full md:w-1/2 p-6">
          <Lottie
            animationData={synthAnimation}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%', maxWidth: '500px', maxHeight: '500px' }}
          />
        </div>

      </div> {/* End of max-w-6xl mx-auto wrapper */}
    </section>
  );
};

export default HeroSection;