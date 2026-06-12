import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // Initialize `@google/genai`
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", hasApiKey: !!apiKey });
  });

  // Main Gemini endpoint
  app.post("/api/gemini", async (req, res) => {
    try {
      if (!apiKey || !ai) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured. Please add it in Settings > Secrets.",
        });
      }

      const { model, prompt, contents, mode, voice, targetLanguage } = req.body;

      if (!model) {
        return res.status(400).json({ error: "Model parameter is required" });
      }

      // Handle raw image models (nano banana) & Imagen
      if (mode === "image" || model === "imagen-4.0-generate-001" || model.includes("image")) {
        if (model === "imagen-4.0-generate-001") {
          const response = await ai.models.generateImages({
            model: "imagen-4.0-generate-001",
            prompt: prompt || "A beautiful artwork",
            config: {
              numberOfImages: 1,
              outputMimeType: "image/jpeg",
              aspectRatio: "1:1",
            },
          });
          const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
          if (base64Image) {
            return res.json({
              image: `data:image/jpeg;base64,${base64Image}`,
              text: `Generated successfully using ${model}.`,
            });
          } else {
            throw new Error("No image data returned from Imagen model");
          }
        } else {
          // nano banana generateContent
          const response = await ai.models.generateContent({
            model: model,
            contents: {
              parts: [{ text: prompt || "A beautiful illustration" }],
            },
            config: {
              imageConfig: {
                aspectRatio: "1:1",
                imageSize: "1K",
              },
            },
          });

          let base64Image = "";
          let textResult = "";
          if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                base64Image = part.inlineData.data;
              } else if (part.text) {
                textResult += part.text;
              }
            }
          }

          if (base64Image) {
            return res.json({
              image: `data:image/png;base64,${base64Image}`,
              text: textResult || `Generated successfully using ${model}.`,
            });
          } else {
            throw new Error("No image inline data returned from " + model);
          }
        }
      }

      // Handle TTS (text to speech)
      if (mode === "tts" || model === "gemini-3.1-flash-tts-preview") {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: `Say cheerfully: ${prompt}` }] }],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice || "Zephyr" },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          return res.json({
            audio: `data:audio/wav;base64,${base64Audio}`, // raw PCM format or wave-encoded
            text: `Generated audio successfully with voice ${voice || "Zephyr"}.`,
          });
        } else {
          throw new Error("No audio payload returned from TTS model");
        }
      }

      // Handle Translation Mode
      if (mode === "translation") {
        const systemIns = `You are a professional, exact translator. Translate the text directly and accurately into the target language: ${targetLanguage || "Spanish"}. Do not add any conversational filler or meta-commentary, just return the translated text itself.`;
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [{ parts: [{ text: prompt }] }],
          config: {
            systemInstruction: systemIns,
          },
        });
        return res.json({ text: response.text });
      }

      // Default: Multi-turn Chat mode
      // Expecting contents list in [{ role: 'user'|'model', parts: [{ text: string }] }] format
      let formattedContents = contents;
      if (!formattedContents || !Array.isArray(formattedContents)) {
        formattedContents = [{ role: "user", parts: [{ text: prompt || "Hello!" }] }];
      }

      // For gemini-3.1-pro-preview, optionally add thinking level
      const isPro = model === "gemini-3.1-pro-preview";
      const response = await ai.models.generateContent({
        model: model,
        contents: formattedContents,
        config: isPro ? {
          systemInstruction: "You are a helpful, extremely clever study and gaming companion. You support users fully.",
        } : undefined,
      });

      return res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "An error occurred with Gemini API" });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    // Custom dev-html-redirect inside Express for consistency with Vite config
    app.use((req, res, next) => {
      if (req.url === "/" || req.url === "/index.html") {
        req.url = "/dev.html";
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "dev.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
