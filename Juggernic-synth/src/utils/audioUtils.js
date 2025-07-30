// src/utils/audioUtils.js

// Declare shared AudioContext and AnalyserNode at the module level
// This ensures a single instance is used across the application for consistency.
let audioContext = null;
let analyserNode = null;
let sourceNodeMap = new Map(); // To keep track of connected sources (e.g., HTML audio)

/**
 * Initializes and returns the global AudioContext and AnalyserNode.
 * Ensures only one instance is created.
 * @returns {{audioContext: AudioContext, analyser: AnalyserNode}}
 */
export const initAudioContext = () => {
    if (!audioContext) {
        // Use Web Audio API for cross-browser compatibility
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create an analyser node for audio visualization
        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048; // Fast Fourier Transform size (power of 2)
    }
    return { audioContext, analyser: analyserNode };
};

/**
 * Attempts to resume the AudioContext, which might be suspended by browsers
 * (e.g., Chrome's autoplay policy). Should be called on a user interaction.
 */
export const resumeAudioContext = () => {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log("AudioContext resumed successfully.");
        }).catch(e => {
            console.error("Error resuming AudioContext:", e);
        });
    }
};

/**
 * Connects an HTMLMediaElement (like <audio> or <video>) to the AnalyserNode.
 * @param {HTMLMediaElement} mediaElement The audio or video element.
 * @returns {MediaElementAudioSourceNode} The source node created from the media element.
 */
export const connectAudioSource = (mediaElement) => {
    if (!audioContext || !analyserNode) {
        console.error("AudioContext or AnalyserNode not initialized.");
        return null;
    }

    let sourceNode;
    if (sourceNodeMap.has(mediaElement)) {
        // If already connected, use existing source node
        sourceNode = sourceNodeMap.get(mediaElement);
    } else {
        // Create a media element source node
        sourceNode = audioContext.createMediaElementSource(mediaElement);
        sourceNodeMap.set(mediaElement, sourceNode);
    }

    // Disconnect existing connections to prevent multiple connections on re-attach
    sourceNode.disconnect();

    // Connect the media element source to the analyser
    sourceNode.connect(analyserNode);

    // Connect the analyser to the audio context's destination (speakers)
    analyserNode.connect(audioContext.destination);

    return sourceNode;
};

/**
 * Disconnects an audio source from the AnalyserNode and AudioContext destination.
 * This function should be called when an audio source is no longer needed to prevent
 * memory leaks or zombie nodes.
 * @param {HTMLMediaElement | AudioBufferSourceNode} [source] - The specific source node to disconnect.
 * If not provided, attempts to disconnect analyser from destination.
 */
export const disconnectAudioSource = (source = null) => {
    if (!audioContext || !analyserNode) {
        // console.warn("AudioContext or AnalyserNode not initialized. Cannot disconnect.");
        return;
    }

    // Disconnect the analyser from the destination.
    // This is a common point for all audio paths if analyser is the final node before destination.
    try {
        analyserNode.disconnect(audioContext.destination);
    } catch (e) {
        // console.warn("Analyser already disconnected from destination:", e);
    }

    if (source instanceof HTMLMediaElement) {
        const mediaSource = sourceNodeMap.get(source);
        if (mediaSource) {
            try {
                mediaSource.disconnect(analyserNode); // Disconnect from analyser
                sourceNodeMap.delete(source);
            } catch (e) {
                // console.warn("Error disconnecting HTMLMediaElement source:", e);
            }
        }
    } else if (source instanceof AudioBufferSourceNode) {
        try {
            source.disconnect(); // Disconnect the AudioBufferSourceNode entirely
        } catch (e) {
            // console.warn("Error disconnecting AudioBufferSourceNode:", e);
        }
    }
    // Note: If a gainNode is inserted between source and analyser (as in useAudioPlayback),
    // you'd also need to manage its disconnection if it's specific to that source.
    // For this generic util, we handle the main source to analyser/destination path.
};


/**
 * Decodes an ArrayBuffer containing audio data into an AudioBuffer.
 * @param {ArrayBuffer} arrayBuffer The audio data as an ArrayBuffer.
 * @returns {Promise<AudioBuffer>} A promise that resolves with the decoded AudioBuffer.
 */
export const decodeAudioData = async (arrayBuffer) => {
    if (!audioContext) {
        throw new Error("AudioContext not initialized. Cannot decode audio data.");
    }
    return new Promise((resolve, reject) => {
        audioContext.decodeAudioData(arrayBuffer, resolve, reject);
    });
};