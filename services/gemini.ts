
import { GoogleGenAI } from "@google/genai";
import { CaseStudy } from "../types.ts";

export const getAIFeedback = async (caseStudy: CaseStudy, reflection: string): Promise<string> => {
  // Always use the latest available key from process.env.API_KEY
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey.length < 5) {
    // If we get here, the dialog might have been bypassed or failed.
    // Try one last check of the env but return a helpful message if it fails.
    return "Fejl: Ingen gyldig API-nøgle fundet. Klik venligst på 'Vælg API-nøgle' for at fortsætte.";
  }

  try {
    // Create new instance right before making an API call to ensure it always uses the most up-to-date API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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
      
      Giv faglig feedback herpå.
    `;

    // Upgrade to gemini-3-pro-preview for advanced reasoning in clinical tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
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
    console.error("Detaljeret API fejl:", error);
    
    const msg = error?.message || "";
    if (msg.includes("403") || msg.includes("permission")) {
      return "Adgang nægtet: Sørg for at vælge en API-nøgle fra et projekt med fakturering aktiveret.";
    } 
    return `Teknisk fejl: ${msg || "Kunne ikke forbinde til AI-underviseren"}. Prøv igen om lidt.`;
  }
};
