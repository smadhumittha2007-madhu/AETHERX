import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.post("/api/gemini/command", async (req, res) => {
  try {
    const { command, context } = req.body;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are Aether, a futuristic smart mobility assistant. 
      The user says: "${command}"
      Current Context: ${JSON.stringify(context)}
      
      Respond in a helpful, conversational, and futuristic tone. 
      If the user wants to navigate, find places, or check emissions, provide a structured response.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "Voice response text" },
            action: { 
              type: Type.STRING, 
              enum: ["NAVIGATE", "SEARCH_PLACES", "CHECK_STATS", "GENERAL_CHAT"],
              description: "The intended action"
            },
            params: { 
              type: Type.OBJECT, 
              description: "Parameters for the action (e.g. { location: 'Starbucks' })"
            },
            ecoTip: { type: Type.STRING, description: "A quick eco-driving tip" }
          },
          required: ["text", "action"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to process command" });
  }
});

// Vite middleware setup
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();
