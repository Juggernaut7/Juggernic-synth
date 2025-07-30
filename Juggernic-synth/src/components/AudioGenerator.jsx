// src/components/MusicPlayerWithVisualizer.jsx
// (You can keep the file name as AudioGenerator.jsx if you prefer)

import React, { useState, useRef, useEffect, useCallback } from 'react';
// Removed: import { queryHuggingFaceTextToAudio } from '../utils/api';
// Removed: import { getRandomStaticAudioUrl, fetchAudioToArrayBuffer } from '../utils/staticAudio';
import { FaUpload, FaPlay, FaPause, FaDownload, FaSpinner, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'; // Added FaUpload icon
import { toast } from 'react-toastify';
import useAudioPlayback from '../hooks/useAudioPlayback';

const AudioGenerator = ({ audioContext, analyser, isContextReady }) => {
    const {
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        setupAudioSource,
        play,
        pause,
        togglePlayPause,
        stop,
        handleVolumeChange,
        toggleMute
    } = useAudioPlayback({ audioContext, analyser, isContextReady });

    const [isLoading, setIsLoading] = useState(false);
    const [currentPlayingFileName, setCurrentPlayingFileName] = useState('');
    const generatedAudioBlobRef = useRef(null); // Still useful for download
    const canvasRef = useRef(null); // Ref for the visualizer canvas
    const fileInputRef = useRef(null); // Ref for the file input element

    // --- VISUALIZER LOGIC (remains mostly the same) ---
    const drawVisualizer = useCallback(() => {
        if (!analyser || !canvasRef.current || !isPlaying) { // Only draw if playing
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const draw = () => {
            if (!analyser || !isPlaying) {
                return;
            }

            requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i];

                const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
                gradient.addColorStop(0, `rgb(0, 255, 136)`);
                gradient.addColorStop(1, `rgb(102, 0, 255)`);
                ctx.fillStyle = gradient;

                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };
        draw();
    }, [analyser, isPlaying]);

    useEffect(() => {
        if (isContextReady && analyser) {
            drawVisualizer();
        }
    }, [isContextReady, analyser, drawVisualizer]);
    // --- END VISUALIZER LOGIC ---


    // --- NEW: HANDLE USER FILE UPLOAD ---
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            toast.warn("No file selected.");
            return;
        }

        if (!file.type.startsWith('audio/')) {
            toast.error("Please upload an audio file.");
            return;
        }

        if (!isContextReady) {
            toast.warn("Audio system not ready. Please interact with the page first!");
            return;
        }

        setIsLoading(true);
        generatedAudioBlobRef.current = null; // Clear previous audio
        stop(); // Stop any currently playing audio

        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target.result; // Get the ArrayBuffer from the file
                generatedAudioBlobRef.current = new Blob([arrayBuffer], { type: file.type }); // Store Blob for download

                // Set up the source for playback via the hook
                const setupSuccess = await setupAudioSource(arrayBuffer, 'web-audio');
                if (setupSuccess) {
                    play(); // Automatically play after setup
                    setCurrentPlayingFileName(file.name); // Display the uploaded file's name
                    toast.success(`"${file.name}" loaded and playing!`);
                } else {
                    toast.error("Audio loaded but failed to set up for playback.");
                }
            } catch (error) {
                console.error("Failed to load/play uploaded audio:", error);
                toast.error(`Failed to play audio: ${error.message || 'Check console.'}`);
            } finally {
                setIsLoading(false);
            }
        };

        reader.onerror = (error) => {
            setIsLoading(false);
            console.error("FileReader error:", error);
            toast.error("Failed to read the audio file.");
        };

        reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
    };

    const handleDownload = () => {
        if (generatedAudioBlobRef.current && currentPlayingFileName) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(generatedAudioBlobRef.current);
            link.download = `juggernic-synth-${currentPlayingFileName}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            toast.success("Audio downloaded!");
        } else {
            toast.warn("No audio loaded to download.");
        }
    };

    return (
        <div className="bg-synth-dark-secondary p-6 rounded-xl shadow-lg flex flex-col items-center gap-6 w-full h-full">
            <h3 className="text-2xl font-bold text-synth-text-light">Juggernic Audio Visualizer</h3>

            <canvas ref={canvasRef} width="400" height="150" className="bg-synth-dark-primary rounded-lg border border-synth-gray"></canvas>

            {currentPlayingFileName && (
                <p className="text-synth-text-light text-center">Now Playing: {currentPlayingFileName}</p>
            )}

            <div className="flex items-center gap-4 w-full justify-center">
                <button
                    onClick={togglePlayPause}
                    disabled={!currentPlayingFileName || isLoading}
                    className="p-3 bg-synth-accent-green text-synth-dark-primary rounded-full hover:scale-110 transition-transform shadow-md"
                >
                    {isPlaying ? <FaPause className="text-lg" /> : <FaPlay className="text-lg" />}
                </button>
                <button
                    onClick={handleDownload}
                    disabled={!generatedAudioBlobRef.current || isLoading}
                    className="p-3 bg-synth-accent-orange text-synth-dark-primary rounded-full hover:scale-110 transition-transform shadow-md"
                >
                    <FaDownload className="text-lg" />
                </button>
                <button onClick={toggleMute} className="p-2 text-synth-accent-green hover:text-synth-accent-blue transition-colors">
                    {isMuted ? <FaVolumeMute className="text-lg" /> : <FaVolumeUp className="text-lg" />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="flex-grow h-2 rounded-lg appearance-none cursor-pointer bg-synth-dark-primary"
                    style={{
                        background: `linear-gradient(to right, ${'#00FF88'} 0%, ${'#00FF88'} ${volume * 100}%, ${'#1A1A33'} ${volume * 100}%, ${'#1A1A33'} 100%)`,
                    }}
                />
            </div>

            {/* Hidden file input */}
            <input
                type="file"
                accept="audio/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }} // Hide the actual input
            />

            {/* Custom styled button to trigger file input */}
            <button
                onClick={() => fileInputRef.current.click()} // Clicks the hidden file input
                disabled={isLoading}
                className="w-full px-6 py-3 bg-synth-accent-magenta text-synth-dark-primary font-bold rounded-full text-lg flex items-center justify-center gap-2 hover:bg-synth-accent-blue transition-all duration-200 ease-in-out shadow-md hover:shadow-synth-glow-sm-magenta"
            >
                {isLoading ? (
                    <>
                        <FaSpinner className="animate-spin" /> Loading Audio...
                    </>
                ) : (
                    <>
                        <FaUpload /> Upload & Visualize Audio
                    </>
                )}
            </button>

            {/* AI Generation section - now entirely removed as per "that all we have fr now" */}
            {/* If you want to put a "Coming Soon" message, you can add a div here */}
        </div>
    );
};

export default AudioGenerator;