// src/components/MusicPlayer.jsx
import React, { useEffect } from 'react';
// REMOVE: initAudioContext, connectAudioSource, disconnectAudioSource, resumeAudioContext
import { disconnectAudioSource } from '../utils/audioUtils'; // Keep only what's needed for cleanup
import { FaPlay, FaPause, FaStop, FaVolumeUp, FaVolumeMute, FaFileAudio } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useAudioPlayback from '../hooks/useAudioPlayback'; // Import the new hook

// Receive audioContext, analyser, isContextReady as props from App.jsx
const MusicPlayer = ({ audioContext, analyser, isContextReady }) => {
    // Use the useAudioPlayback hook
    const {
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        setupAudioSource, // Used for loading HTML audio
        togglePlayPause,
        stop,
        handleSeek,
        handleVolumeChange,
        toggleMute,
        htmlAudioRef // Reference to the actual <audio> element
    } = useAudioPlayback({ audioContext, analyser, isContextReady });

    // Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            if (htmlAudioRef.current) {
                // Set the src of the <audio> element directly via its ref
                htmlAudioRef.current.src = fileURL;
                htmlAudioRef.current.load(); // Load the new audio file
                htmlAudioRef.current.oncanplay = () => {
                    // Pass the HTML audio element to the hook for setup
                    setupAudioSource(htmlAudioRef.current, 'html');
                    // No need to call play immediately, let user press play
                    toast.success(`Loaded: ${file.name}`);
                };
            }
        }
    };

    const formatTime = (time) => {
        if (isNaN(time) || time < 0) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="bg-synth-dark-secondary p-6 rounded-xl shadow-lg flex flex-col items-center gap-6 w-full h-full">
            <h3 className="text-2xl font-bold text-synth-text-light">Local Synthesizer</h3>

            <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="audioFileInput"
            />
            <label htmlFor="audioFileInput" className="cursor-pointer bg-synth-accent-purple text-synth-text-light px-6 py-3 rounded-full font-bold hover:bg-synth-accent-magenta transition-all duration-200 ease-in-out shadow-md hover:shadow-synth-glow-sm-purple flex items-center gap-2">
                <FaFileAudio className="text-xl" /> Load Audio File
            </label>

            {/* Current file name display can be derived from htmlAudioRef.current.src if needed */}
            {htmlAudioRef.current && htmlAudioRef.current.src && (
                <div className="text-synth-text-muted text-sm italic">
                    Loaded: {htmlAudioRef.current.src.split('/').pop()} {/* Simple way to get filename */}
                </div>
            )}

            {/* The actual HTML audio element, managed by the hook */}
            <audio ref={htmlAudioRef} onEnded={stop} onError={(e) => toast.error(`Audio Error: ${e.message || 'Could not play file'}`)}></audio>

            <div className="flex items-center gap-4 w-full justify-center">
                <button onClick={stop} className="p-3 bg-synth-gray text-synth-dark-primary rounded-full hover:scale-110 transition-transform shadow-md">
                    <FaStop className="text-lg" />
                </button>
                <button onClick={togglePlayPause} className="p-4 bg-synth-accent-blue text-synth-dark-primary rounded-full hover:scale-110 transition-transform shadow-lg shadow-synth-glow-sm-blue">
                    {isPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl" />}
                </button>
            </div>

            <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-synth-dark-primary"
                style={{
                    background: `linear-gradient(to right, ${'#FF00FF'} 0%, ${'#FF00FF'} ${(currentTime / duration) * 100}%, ${'#1A1A33'} ${(currentTime / duration) * 100}%, ${'#1A1A33'} 100%)`,
                }}
                disabled={!htmlAudioRef.current || isNaN(duration)} // Disable if no audio or duration unknown
            />
            <div className="flex justify-between w-full text-synth-text-muted text-sm">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center gap-3 w-full justify-center mt-2">
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
                        background: `linear-gradient(to right, ${'#00FFFF'} 0%, ${'#00FFFF'} ${volume * 100}%, ${'#1A1A33'} ${volume * 100}%, ${'#1A1A33'} 100%)`,
                    }}
                />
            </div>
        </div>
    );
};

export default MusicPlayer;