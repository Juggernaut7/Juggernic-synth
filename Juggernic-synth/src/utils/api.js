// src/utils/api.js

// This file now points to your backend server.
// It does NOT directly interact with Hugging Face or its API key.
// HF_TOKEN and HF_AUDIO_MODEL_URL are now exclusively managed by your Node.js backend.

// Point to your backend's URL.
// During local development, this defaults to http://localhost:3001.
// When you deploy, VITE_BACKEND_URL will be set to your deployed backend's URL.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Queries your backend server for AI audio generation.
 * The backend then handles the actual call to the Hugging Face API.
 * @param {string} prompt The text prompt for audio generation.
 * @returns {Promise<string>} A promise that resolves with the Blob URL of the generated audio.
 */
export async function queryHuggingFaceTextToAudio(prompt) {
    if (!prompt) {
        // Basic client-side validation for an empty prompt.
        throw new Error("Prompt cannot be empty for AI audio generation.");
    }

    try {
        console.log(`Sending prompt to backend: "${prompt}"`);
        console.log(`Backend API endpoint: ${BACKEND_URL}/generate-audio`);

        const response = await fetch(`${BACKEND_URL}/generate-audio`, {
            method: "POST",
            headers: {
                // We are sending a JSON payload to our backend.
                "Content-Type": "application/json",
                // NO Hugging Face Authorization header here! That's the backend's job.
            },
            body: JSON.stringify({ prompt }), // Send the prompt as a JSON object.
        });

        if (!response.ok) {
            // If the backend responds with an error (e.g., 4xx or 5xx),
            // it should send a JSON body with an 'error' property.
            const errorBody = await response.json();
            console.error(
                "Backend API Audio Error Response:",
                response.status,
                response.statusText,
                errorBody.error,
                errorBody.details || '' // 'details' might contain more info from HF
            );
            // Throw an error that can be caught by the calling component (AudioGenerator.jsx).
            throw new Error(`AI audio generation failed: ${errorBody.error || 'Unknown error from backend'}`);
        }

        // If the response is OK, the backend directly forwards the audio as a Blob.
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob); // Create a URL for the audio Blob.
        return audioUrl; // Return the URL for playback.

    } catch (error) {
        // Catch any network errors or errors thrown from the 'if (!response.ok)' block.
        console.error("Error calling backend for audio generation:", error);
        throw error; // Re-throw to propagate to the calling component.
    }
}