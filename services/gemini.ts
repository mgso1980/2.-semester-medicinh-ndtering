
import { GoogleGenAI } from "@google/genai";
import { CaseStudy } from "../types.ts";

// Mock feedback database til brug når API-nøgle mangler (Simulation Mode)
const SIMULATED_FEEDBACK: Record<number, string> = {
  1: `DIN REFLEKSION ER MODTAGET (Simulationstilstand)
  
  Faglig vurdering:
  - Du har korrekt identificeret risikoen ved koncentreret kalium.
  - Husk altid 'Dobbelt-kontrol' ved højrisikomedicin. Kalium må aldrig findes i koncentreret form på sengestuer.
  - Din observation af arytmi som faresignal er central.
  
  Anbefaling: Repetér afdelingens instrukser for medicinblanding og infusionshastigheder.`,
  2: `DIN REFLEKSION ER MODTAGET (Simulationstilstand)
  
  Faglig vurdering:
  - God fokus på forvekslingsrisikoen mellem hurtig- og langtidsvirkende insulin.
  - Du bør overveje, hvordan opbevaringen kan optimeres (f.eks. adskilte hylder eller farvekoder).
  - Korrekt fokus på de kliniske tegn på hypoglykæmi (konfusion, koldsved).
  
  Anbefaling: Gennemgå 'De 5 Rigtige' med særligt fokus på 'Rigtig Dosis' og 'Rigtig Medicin'.`,
  3: `DIN REFLEKSION ER MODTAGET (Simulationstilstand)
  
  Faglig vurdering:
  - Kritisk vigtig observation af respirationsfrekvensen. 
  - Ved administration af opioider til KOL-patienter er monitorering af bevidsthedsniveauet lige så vigtigt som selve vejrtrækningen.
  - Du har ret i, at Naloxon altid skal være præsent i afdelingen.
  
  Anbefaling: Læs op på opioid-induceret respirationsdepression og monitoreringsintervaller.`,
  4: `DIN REFLEKSION ER MODTAGET (Simulationstilstand)
  
  Faglig vurdering:
  - Du adresserer korrekt kompleksiteten ved polyfarmaci.
  - Interaktionen mellem Warfarin og makrolider (antibiotika) er en klassisk kilde til alvorlige blødninger.
  - Godt set at INR-monitorering skal intensiveres ved medicinskift.
  
  Anbefaling: Brug altid interaktions-databaser (f.eks. pro.medicin.dk) når en patient i AK-behandling får ny medicin.`,
  5: `DIN REFLEKSION ER MODTAGET (Simulationstilstand)
  
  Faglig vurdering:
  - Du har fat i sagens kerne: Kommunikation og synlighed.
  - Allergier skal ikke kun stå i journalen, men også markeres tydeligt (f.eks. rødt armbånd eller i FMK).
  - Din hurtige identifikation af anafylaksi er livsvigtig.
  
  Anbefaling: Gennemgå hospitalets standard for allergimærkning og proceduren for anafylaktisk chok.`
};

export const getAIFeedback = async (caseStudy: CaseStudy, reflection: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  // Hvis ingen nøgle, brug simulationstilstand
  if (!apiKey || apiKey === "undefined" || apiKey.length < 5) {
    // Simulér en lille ventetid for realisme
    await new Promise(resolve => setTimeout(resolve, 1500));
    return SIMULATED_FEEDBACK[caseStudy.id] || "God refleksion. Du har vist god forståelse for de kliniske aspekter i denne case.";
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

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptText,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Kunne ikke generere feedback. Prøv igen.";
  } catch (error: any) {
    console.warn("API fejlede, skifter til simulation:", error);
    return SIMULATED_FEEDBACK[caseStudy.id] || "Simulation: God refleksion med fokus på patientsikkerhed.";
  }
};
