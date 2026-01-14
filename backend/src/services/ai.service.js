import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeMoodWithGemini(base64Image) {
  const base64Data = base64Image.split(",")[1];

  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data,
      },
    },
    {
      text: `
Analyze the facial expression in the image.

Rules:
- If a clear human face is visible, return ONLY ONE WORD mood from:
  happy, sad, angry, neutral
- If no face is detected or the face is unclear, return EXACTLY:
  no face found
- Do NOT return sentences.
- Do NOT explain anything.
`
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });

  return response.text.trim().toLowerCase();
}
