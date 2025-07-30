// src/hooks/useAudioPlayback.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { connectAudioSource, disconnectAudioSource, decodeAudioData, resumeAudioContext } from '../utils/audioUtils';
import { toast } from 'react-toastify';

/**
 * Custom hook for managing audio playback state and controls.
 * It can work with an HTMLAudioElement (for local files) or
 * an ArrayBuffer/Blob URL (for generated audio).
 *
 * @param {object} params
 * @param {AudioContext} params.audioContext The shared Web Audio API AudioContext.
 * @param {AnalyserNode} params.analyser The shared AnalyserNode for visualization.
 * @param {boolean} params.isContextReady Indicates if the AudioContext is in a 'running' state.
 * @returns {object} Playback state and control functions.
 */
const useAudioPlayback = ({ audioContext, analyser, isContextReady }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7); // Default volume
    const [isMuted, setIsMuted] = useState(false);

    // This ref will hold either the HTMLAudioElement or an AudioBufferSourceNode
    // depending on the audio source type.
    const currentAudioSourceNodeRef = useRef(null);
    const htmlAudioRef = useRef(null); // Specifically for HTML <audio> element if used directly

    // Internal state to track the type of audio source being played
    const audioSourceTypeRef = useRef(null); // 'html' or 'web-audio'

    // Gain node for volume control on Web Audio API sources
    const gainNodeRef = useRef(null);


    // Effect to manage volume/mute for Web Audio API sources
    useEffect(() => {
        if (audioContext && !gainNodeRef.current) {
            gainNodeRef.current = audioContext.createGain();
            // This gain node will be inserted into the audio graph when a source is connected
        }
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = isMuted ? 0 : volume;
        }
    }, [audioContext, volume, isMuted]);

    // Function to set up the audio source (HTMLAudioElement or AudioBufferSourceNode)
    const setupAudioSource = useCallback(async (source, type) => {
        if (!audioContext || !analyser || !isContextReady) {
            toast.warn("Audio system not ready. Please interact with the page first!");
            return false;
        }

        // Stop and disconnect any currently playing audio
        if (currentAudioSourceNodeRef.current) {
            try {
                if (audioSourceTypeRef.current === 'web-audio') {
                    currentAudioSourceNodeRef.current.stop();
                } else if (audioSourceTypeRef.current === 'html' && htmlAudioRef.current) {
                    htmlAudioRef.current.pause();
                }
                disconnectAudioSource(); // Disconnects from analyser
            } catch (e) {
                console.warn("Error stopping/disconnecting previous audio source:", e);
            }
            currentAudioSourceNodeRef.current = null;
        }

        if (type === 'html' && source instanceof HTMLMediaElement) {
            htmlAudioRef.current = source; // Keep a direct ref to the HTML audio element
            htmlAudioRef.current.volume = volume;
            htmlAudioRef.current.muted = isMuted;

            htmlAudioRef.current.ontimeupdate = () => setCurrentTime(htmlAudioRef.current.currentTime);
            htmlAudioRef.current.onloadedmetadata = () => setDuration(htmlAudioRef.current.duration || 0);
            htmlAudioRef.current.onended = () => setIsPlaying(false);

            currentAudioSourceNodeRef.current = connectAudioSource(htmlAudioRef.current);
            audioSourceTypeRef.current = 'html';
            return true;
        } else if (type === 'web-audio' && source instanceof ArrayBuffer) {
            try {
                const audioBuffer = await decodeAudioData(source);
                const bufferSource = audioContext.createBufferSource();
                bufferSource.buffer = audioBuffer;

                bufferSource.onended = () => {
                    setIsPlaying(false);
                    // Disconnect and clear after playback for single-use AudioBufferSourceNode
                    if (bufferSource) {
                        bufferSource.disconnect();
                    }
                    currentAudioSourceNodeRef.current = null; // Clear reference
                    audioSourceTypeRef.current = null;
                };

                // Connect source -> gain -> analyser -> destination
                bufferSource.connect(gainNodeRef.current);
                gainNodeRef.current.connect(analyser);
                analyser.connect(audioContext.destination);

                currentAudioSourceNodeRef.current = bufferSource;
                audioSourceTypeRef.current = 'web-audio';

                // For Web Audio, duration is from AudioBuffer
                setDuration(audioBuffer.duration);
                return true;
            } catch (error) {
                console.error("Error setting up Web Audio source:", error);
                toast.error("Failed to decode or set up audio for playback.");
                return false;
            }
        }
        return false;
    }, [audioContext, analyser, isContextReady, volume, isMuted]);


    const play = useCallback(() => {
        if (!isContextReady) {
            toast.warn("Audio system not ready. Please interact with the page first!");
            resumeAudioContext(); // Attempt resume on interaction
            return;
        }

        if (currentAudioSourceNodeRef.current) {
            if (audioSourceTypeRef.current === 'html' && htmlAudioRef.current) {
                htmlAudioRef.current.play();
            } else if (audioSourceTypeRef.current === 'web-audio') {
                // For web audio, if already played, need to re-create source
                // This means 'play' needs to trigger re-creation if sourceNodeRef is null after an end event
                // This hook assumes `setupAudioSource` is called before play is attempted on a new source.
                // If it's a re-play of a just finished generated sound, it needs the original buffer/blob ref.
                // For now, let's keep it simple: `play` just starts what's already connected.
                // A more advanced use would involve passing the original audio data here for re-creation.
                currentAudioSourceNodeRef.current.start(0); // Play from beginning
            }
            setIsPlaying(true);
        } else {
            toast.warn("No audio source to play. Load or generate one.");
        }
    }, [isContextReady]); // Depend on isContextReady

    const pause = useCallback(() => {
        if (currentAudioSourceNodeRef.current) {
            if (audioSourceTypeRef.current === 'html' && htmlAudioRef.current) {
                htmlAudioRef.current.pause();
            } else if (audioSourceTypeRef.current === 'web-audio') {
                // Web Audio API BufferSourceNode cannot be paused and resumed directly.
                // Stopping it means it's done. Re-playing requires new source.
                // For simplicity, we just stop for now, acting like a pause then reset.
                try {
                    currentAudioSourceNodeRef.current.stop();
                } catch (e) {
                    console.warn("Attempted to stop already stopped Web Audio source.", e);
                }
            }
            setIsPlaying(false);
        }
    }, []);

    const togglePlayPause = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }, [isPlaying, play, pause]);


    const stop = useCallback(() => {
        if (currentAudioSourceNodeRef.current) {
            if (audioSourceTypeRef.current === 'html' && htmlAudioRef.current) {
                htmlAudioRef.current.pause();
                htmlAudioRef.current.currentTime = 0;
            } else if (audioSourceTypeRef.current === 'web-audio') {
                 try {
                    currentAudioSourceNodeRef.current.stop();
                    // For Web Audio, stopping means the source is done, so clear ref
                    currentAudioSourceNodeRef.current.disconnect();
                    currentAudioSourceNodeRef.current = null;
                    audioSourceTypeRef.current = null;
                 } catch (e) {
                     console.warn("Attempted to stop already stopped Web Audio source.", e);
                 }
            }
            setIsPlaying(false);
            setCurrentTime(0);
        }
    }, []);

    const handleSeek = useCallback((newTime) => {
        if (currentAudioSourceNodeRef.current) {
            if (audioSourceTypeRef.current === 'html' && htmlAudioRef.current) {
                htmlAudioRef.current.currentTime = newTime;
                setCurrentTime(newTime);
            } else if (audioSourceTypeRef.current === 'web-audio') {
                // Seeking for AudioBufferSourceNode is complex (requires re-creation and offset).
                // For simplicity, we won't support seek for generated audio here directly via slider.
                // A toast warning would be appropriate.
                toast.info("Seeking not supported for generated audio in this player.");
            }
        }
    }, []);

    const handleVolumeChange = useCallback((newVolume) => {
        setVolume(newVolume);
        if (htmlAudioRef.current && audioSourceTypeRef.current === 'html') {
            htmlAudioRef.current.volume = newVolume;
        } else if (gainNodeRef.current && audioSourceTypeRef.current === 'web-audio') {
            gainNodeRef.current.gain.value = newVolume;
        }
        if (newVolume > 0) setIsMuted(false);
    }, []);

    const toggleMute = useCallback(() => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        if (htmlAudioRef.current && audioSourceTypeRef.current === 'html') {
            htmlAudioRef.current.muted = newMutedState;
        } else if (gainNodeRef.current && audioSourceTypeRef.current === 'web-audio') {
            gainNodeRef.current.gain.value = newMutedState ? 0 : volume;
        }
    }, [isMuted, volume]);


    return {
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        setupAudioSource, // Function to initialize the audio source
        play,
        pause,
        togglePlayPause,
        stop,
        handleSeek,
        handleVolumeChange,
        toggleMute,
        htmlAudioRef // Expose htmlAudioRef for the <audio> element in MusicPlayer
    };
};

export default useAudioPlayback;