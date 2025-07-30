// src/hooks/useAudioContext.js
import { useRef, useEffect, useState } from 'react';
import { initAudioContext, resumeAudioContext } from '../utils/audioUtils';

/**
 * Custom hook to manage the Web Audio API AudioContext and AnalyserNode.
 * Initializes them once and ensures the context can be resumed after user interaction.
 *
 * @returns {{audioContext: AudioContext | null, analyser: AnalyserNode | null}}
 */
const useAudioContext = () => {
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const [isContextReady, setIsContextReady] = useState(false); // State to confirm context is usable

    useEffect(() => {
        const { audioContext, analyser } = initAudioContext();
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const handleUserInteraction = () => {
            // Resume context on first user interaction
            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume().then(() => {
                    console.log("AudioContext resumed by user interaction.");
                    setIsContextReady(true);
                }).catch(e => console.error("Error resuming AudioContext:", e));
            } else if (audioContextRef.current && audioContextRef.current.state === 'running') {
                setIsContextReady(true);
            }
            // Remove listeners after context is running
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };

        // Add event listeners to resume context on user interaction
        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);

        // Initial check in case context is already running (e.g., development environment)
        if (audioContextRef.current && audioContextRef.current.state === 'running') {
            setIsContextReady(true);
        }

        // Cleanup function for when the component unmounts
        return () => {
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                // Optionally close the audio context on unmount to free resources.
                // However, if the analyser is passed up to App.jsx,
                // App.jsx might need to manage the lifecycle of the *single* context.
                // For now, let's keep it open if App.jsx is managing it.
                // If this hook *owned* the only context, we'd close it here.
            }
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };
    }, []);

    return {
        audioContext: audioContextRef.current,
        analyser: analyserRef.current,
        isContextReady // Useful for conditionally enabling UI elements
    };
};

export default useAudioContext;