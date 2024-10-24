import axios from 'axios';

const PODIA_API_URL = 'https://api.podia.com/v1/jobs'; // Ensure this is the correct URL

// Function to create a job using Podia's API
export const createJob = async (prompt, stylePreset) => {
  if (!prompt || !stylePreset) {
    throw new Error('Prompt and style preset are required.');
  }

  try {
    const response = await axios.post(
      PODIA_API_URL,
      {
        prompt,       // The prompt for image generation
        stylePreset,  // The style preset for image generation
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PODIA_ACCESS_TOKEN}`, // Access token for Podia API
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data; // Return the response data from Podia
  } catch (error) {
    console.error('Error creating job with Podia:', error.response?.data || error.message);
    throw new Error('Failed to create job');
  }
};
