
import { GoogleGenAI } from "@google/genai";
import { CaseStudy } from "../types.ts";

export const getAIFeedback = async (caseStudy: CaseStudy, reflection: string): Promise<string> => {
  // 1. Præ-tjek af API-nøgle for at diagnosticere opsætningsfejl
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    console.error("API_KEY mangler eller er ugyldig i process.env");
    return "Fejl: Systemet kan ikke finde en gyldig API-nøgle (API_KEY). Kontrollér venligst din konfiguration.";
  }

  try {
    // 2. Initialisér klienten med den fundne nøgle
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
      
      Giv faglig feedback herpå.
    `;

    // 3. Udfør kaldet med den simpleste mulige struktur
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
    console.error("Detaljeret API fejl:", error);
    
    // 4. Målrettede fejlbeskeder baseret på fejltypen
    const msg = error?.message || "";
    
    if (msg.includes("403") || msg.includes("permission")) {
      return "Adgang nægtet (403): API-nøglen har ikke tilladelse til at bruge denne model.";
    } 
    if (msg.includes("429") || msg.includes("quota")) {
      return "Systemet er overbelastet (429): For mange forespørgsler på én gang. Vent 30 sekunder.";
    }
    if (msg.includes("API key not found") || msg.includes("key is invalid")) {
      return "Ugyldig API-nøgle: Den konfigurerede nøgle virker ikke.";
    }

    return `Teknisk fejl: ${msg || "Kunne ikke forbinde til AI-underviseren"}. Tjek din internetforbindelse og prøv igen.`;
  }
};
