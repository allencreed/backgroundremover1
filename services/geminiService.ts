
import { GoogleGenAI, Modality } from "@google/genai";

export async function removeImageBackground(base64Image: string, mimeType: string): Promise<string> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: 'Remove the background of this image. The main subject should be perfectly preserved. The output must be a high-quality PNG with a transparent background.',
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageData = part.inlineData.data;
                    const imageMimeType = part.inlineData.mimeType;
                    return `data:${imageMimeType};base64,${base64ImageData}`;
                }
            }
        }

        throw new Error("No image data found in the Gemini API response.");

    } catch (error) {
        console.error("Error removing background with Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to process the image with Gemini API: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the Gemini API.");
    }
}
