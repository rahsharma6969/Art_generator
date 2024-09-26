import express from "express";
import * as dotenv from "dotenv";
import OpenAIApi from "openai/index.mjs";

import Configuration from "openai/index.mjs";

dotenv.config();

const router = express.Router();

// Create DALL-E controller function
const dalleController = async (req, res) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const { prompt } = req.body;

    // Validate if the prompt exists
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Request to OpenAI to generate image
    const aiResponse = await openai.images.generate({
      prompt: "A futuristic city skyline",
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const image = aiResponse.data.data[0].b64_json;
    res.status(200).json({ photo: image });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .send(error?.response?.data?.error?.message || "Something went wrong");
  }
};

export { dalleController };
