
import { GoogleGenAI } from "@google/genai";
import { CaseStudy } from "../types.ts";

export const getAIFeedback = async (caseStudy: CaseStudy, reflection: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    return "Fejl: Ingen API-nøgle fundet i systemet. Kontakt venligst din administrator.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `
      Du er en erfaren klinisk sygeplejeunderviser. 
      Giv konstruktiv og faglig feedback på en 2. semester sygeplejestuderendes refleksion.
      Fokusér på:
      - 'De 5 rigtige' (Patient, Medicin, Dosis, Vej, Tid).
      - Patientsikkerhed og klinisk beslutningstagen.
      - Sygeplejefaglige observationer.
      Sprog: Dansk. Format: Brug punktform.
    `;

    const promptText = `
      CASE: ${caseStudy.title}
      SCENARIE: ${caseStudy.scenario}
      REFLEKSION: "${reflection}"
      
      Giv faglig feedback herpå baseret på sygeplejestandarder.
    `;

    // Brug gemini-3-flash-preview som er hurtig og effektiv til tekst-feedback
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptText,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    if (!response || !response.text) {
      throw new Error("AI-modellen returnerede et tomt svar.");
    }

    return response.text;
  } catch (error: any) {
    console.error("API fejl:", error);
    const msg = error?.message || "";
    return `Der skete en fejl ved generering af feedback: ${msg}. Tjek din forbindelse og prøv igen.`;
  }
};
