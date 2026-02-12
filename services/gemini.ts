
import { GoogleGenAI } from "@google/genai";
import { CaseStudy } from "../types.ts";

export const getAIFeedback = async (caseStudy: CaseStudy, reflection: string): Promise<string> => {
  try {
    // Initialisér AI klienten inde i try-blokken for at fange eventuelle config-fejl
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `
      Du er en erfaren klinisk sygeplejeunderviser.
      En sygeplejestuderende på 2. semester har skrevet en refleksion over en case med en medicineringsfejl.
      Din opgave er at give konstruktiv, anerkendende og faglig feedback.
      Fokusér på:
      1. 'De 5 rigtige' (Rigtig patient, rigtig medicin, rigtig dosis, rigtig administrationsvej, rigtigt tidspunkt).
      2. Patientsikkerhed og klinisk beslutningstagen.
      3. Sygeplejefaglige observationer og handlinger.
      4. Foreslå relevante spørgsmål til videre refleksion.
      Svaret skal være på dansk, opmuntrende og letlæseligt. Brug gerne punktform til nøglepunkter.
    `;

    const promptText = `
      Case: ${caseStudy.title}
      Scenarie: ${caseStudy.scenario}
      Spørgsmål: ${caseStudy.reflectionQuestion}
      
      Studerendes refleksion:
      "${reflection}"
      
      Giv feedback baseret på de sygeplejefaglige standarder.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    if (!response || !response.text) {
      throw new Error("Ingen tekst modtaget fra modellen");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini API Error Detail:", error);
    // Returner en brugervenlig fejlbesked der forklarer hvad der skete
    if (error instanceof Error && error.message.includes("API key")) {
      return "Fejl: API-nøglen er ikke konfigureret korrekt eller er ugyldig.";
    }
    return "Der skete en fejl ved generering af feedback. Tjek din internetforbindelse eller prøv igen senere.";
  }
};
