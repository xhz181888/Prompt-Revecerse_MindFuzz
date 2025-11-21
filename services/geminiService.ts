import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisStyle, AnalysisResult, ModelType } from "../types";

// Helper to get API Key from env or local storage
const getApiKey = (): string => {
  const envKey = process.env.API_KEY;
  if (envKey) return envKey;
  
  const localKey = localStorage.getItem('gemini_api_key');
  if (localKey) return localKey;
  
  return '';
};

const getSystemInstruction = (style: AnalysisStyle, isVideo: boolean) => {
  const base = `You are an elite AI Visual Director and Prompt Engineer (MindFuzz Edition). 
  Your task is to reverse-engineer the visual input into a highly detailed prompt that can be used to recreate the exact same image or video using Generative AI models (e.g., Midjourney v6, Veo, Sora, Stable Diffusion).
  
  STRICT OUTPUT FORMAT:
  You must return a JSON object with two keys: "english" and "chinese".
  - "english": The highly detailed prompt in English.
  - "chinese": The prompt translated and optimized for Chinese understanding.
  `;

  const videoSpecifics = isVideo ? `
  FOR VIDEO INPUT ANALYSIS (CRITICAL):
  You are analyzing a video to create a high-fidelity "Text-to-Video" generation prompt.
  To ensure the generated video is EXACTLY the same as the input, you must analyze:

  1. **Camera Movement (镜头语言)**: Precisely identify the camera move: Static, Pan (Left/Right), Tilt (Up/Down), Zoom (In/Out), Dolly (Forward/Backward), Truck (Left/Right), Pedestal, Handheld shake, FPV drone, or 360 orbit.
  2. **Subject & Action (主体与动态)**: Describe exactly who/what is in the shot and their specific movements (e.g., "turning head slowly," "running towards camera," "particles floating upwards").
  3. **Pacing & Duration (节奏与时长)**: Is it Slow Motion (high frame rate)? Timelapse? Hyperlapse? Real-time? Fast cuts? Mention the speed of the video.
  4. **Lighting & Atmosphere (光影与氛围)**: Describe the lighting change over time if any (e.g., "sun setting," "lights flickering").
  5. **Subtitles/Text (字幕文字)**: If there is ANY text overlay or subtitles, you MUST transcribe them and describe their font style/color/position.
  6. **Audio/Vibe (听觉暗示)**: Describe the implied sound or mood (e.g., "calm," "chaotic," "thumping bass implied").

  PROMPT STRUCTURE FOR VIDEO:
  Start with the Camera Movement and Pacing. Then describe the Subject and Environment. End with Style keywords.
  Example: "Cinematic drone shot pushing forward, slow motion. A cyberpunk city street at night... [details]... neon lighting, volumetric fog, high fidelity."
  ` : `
  FOR IMAGE INPUT ANALYSIS:
  Focus on composition, lighting, texture, lens choice (e.g., 85mm f/1.2), and artistic style.
  `;

  const styles = {
    photorealistic: `
      Style: Photorealistic / Cinematic.
      Focus: 8k resolution, raw photo qualities, physically based rendering, volumetric lighting, ISO noise, depth of field.
      Keywords: Hyper-realistic, unreal engine 5, cinematic lighting, film grain, IMAX quality.`,
    anime: `
      Style: Anime / Manga / Cel-Shaded.
      Focus: Specific studio styles (Ghibli, Ufotable, MAPPA), line weight, color palette, character design features.
      Keywords: Anime key visual, makoto shinkai style, vibrant colors, 2D, high quality illustration.`,
    creative: `
      Style: Creative / Abstract / Surreal.
      Focus: Conceptual imagery, dreamlike states, unusual materials, artistic interpretation, emotional atmosphere.
      Keywords: Surrealism, abstract, dreamscape, ethereal, avant-garde, mixed media.`,
    minimalist: `
      Style: Minimalist / Design.
      Focus: Clean lines, negative space, geometric shapes, simple color palettes, functional aesthetics.
      Keywords: Minimal, bauhaus, studio lighting, flat lay, clean background, vector style.`,
  };

  return `${base}\n\n${videoSpecifics}\n\nSTYLE GUIDELINES: ${styles[style]}`;
};

export const reverseEngineerPrompt = async (
  base64Data: string,
  mimeType: string,
  style: AnalysisStyle = 'photorealistic',
  model: ModelType = 'gemini-2.5-flash'
): Promise<AnalysisResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing. Please set it in Settings.");

  const ai = new GoogleGenAI({ apiKey });
  const isVideo = mimeType.startsWith('video/');

  try {
    // Gemini 3 Pro supports thinking config for deeper reasoning, but we'll keep it standard for prompt generation to avoid timeouts on vercel limits if deployed.
    // However, we use the model parameter to switch backends.
    
    const response = await ai.models.generateContent({
      model: model,
      config: {
        systemInstruction: getSystemInstruction(style, isVideo),
        temperature: model === 'gemini-3-pro-preview' ? 0.7 : 0.4, // Higher temp for Pro to be more creative
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            english: { type: Type.STRING },
            chinese: { type: Type.STRING },
          },
          required: ["english", "chinese"],
        },
      },
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: isVideo 
              ? "Analyze this video frame-by-frame implies. Create a prompt that would generate this EXACT video, including camera moves, text overlays, and pacing." 
              : "Analyze this image and generate a production-ready prompt." 
          },
        ],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const refinePrompt = async (
  base64Data: string,
  mimeType: string,
  currentResult: AnalysisResult,
  userRefinement: string
): Promise<AnalysisResult> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing. Please set it in Settings.");

  const ai = new GoogleGenAI({ apiKey });

  const refineInstruction = `
    The user wants to modify the previous prompt based on the visual input and a new instruction.
    
    Original English Prompt: "${currentResult.english}"
    User Refinement Instruction: "${userRefinement}"
    
    Task:
    1. Keep the core visual description accurate to the original file.
    2. Apply the user's requested changes (e.g., change lighting, modify mood, adjust style).
    3. Output strict JSON with updated "english" and "chinese" fields.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use Flash for quick refinements
      config: {
        systemInstruction: "You are a helpful AI assistant refining generative AI prompts (MindFuzz Edition).",
        temperature: 0.5,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            english: { type: Type.STRING },
            chinese: { type: Type.STRING },
          },
          required: ["english", "chinese"],
        },
      },
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: refineInstruction },
        ],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Refine API Error:", error);
    throw error;
  }
};