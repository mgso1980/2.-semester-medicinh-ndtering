
import { GoogleGenAI } from "@google/genai";
import { CaseStudy } from "../types";

export const getAIFeedback = async (caseStudy: CaseStudy, reflection: string): Promise<string> => {
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

  const prompt = `
    Case: ${caseStudy.title}
    Scenarie: ${caseStudy.scenario}
    Spørgsmål: ${caseStudy.reflectionQuestion}
    
    Studerendes refleksion:
    "${reflection}"
    
    Giv feedback baseret på de sygeplejefaglige standarder.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Kunne ikke generere feedback. Prøv igen.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Der skete en fejl ved hentning af feedback. Tjek din internetforbindelse.";
  }
};
