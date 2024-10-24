import { createProdia } from 'prodia'; // Ensure this is imported

const prodia = createProdia({
    apiKey: '80f9acde-a9e4-4130-89f2-87ae43e4b40d', // Replace with your actual API key
});

export const imageGenerator = async (req, res) => {
    const { prompt } = req.body;
    console.log('Received prompt:', prompt);

    try {
        // Ensure the parameters match the API documentation
        const enhancedPrompt = `${prompt}. High-resolution, ultra-detailed, cinematic lighting, photorealistic textures, sharp focus, 4K quality`; // Enhance the prompt

        const job = await prodia.generate({
            prompt: enhancedPrompt, // Use the enhanced prompt for better quality
            model: "v1-5-pruned-emaonly.safetensors [d7049739]", // Check if there is a higher-quality model available
            n: 1, // Number of images to generate
            size: "2048x2048", // Increase image resolution for higher quality
        });

        console.log('Job created:', job); // Log the job information
        
        // Wait for the job to complete and retrieve the image URL
        const { imageUrl, status } = await prodia.wait(job);
        console.log('Job status:', status); // Log the status
        
        // Check if the job succeeded and send back the image URL
        if (status === 'succeeded' && imageUrl) {
            res.json({ imageUrl });
        } else {
            res.status(500).json({ error: `Image generation failed. Job status: ${status}` });
        }
    } catch (error) {
        // Log and handle the error
        console.error('Error generating image:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error generating image: ' + (error.response?.data || error.message) });
    }
};
