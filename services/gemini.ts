
import { GoogleGenAI } from "@google/genai";
import { CaseStudy } from "../types.ts";

// Faglige fokuspunkter til brug som fallback
const CLINICAL_GUIDANCE: Record<number, string> = {
  1: `Faglige læringspunkter for denne case:
  
  - Ved administration af kalium skal der altid foretages dobbelt-kontrol af både præparat og beregning.
  - Koncentreret kalium må aldrig findes på patientstuer; det skal opbevares centralt og mærkes tydeligt.
  - Monitorering af hjerterytme (telemetri) er obligatorisk under korrigering af svær hypokaliæmi.
  
  Husk altid at tjekke afdelingens lokale instruks for maksimale infusionshastigheder.`,
  2: `Faglige læringspunkter for denne case:
  
  - Sikker identifikation af præparatet er afgørende. Insulin-penne kan ligne hinanden visuelt, hvorfor man skal læse på etiketten hver gang.
  - Ved insulin-fejldosering skal borgeren monitoreres tæt for hypoglykæmiske symptomer som konfusion, rysten og koldsved.
  - Overvej altid om opbevaringen af hurtig- og langtidsvirkende insulin kan adskilles fysisk for at minimere forvekslingsrisiko.
  
  Anvend 'De 5 Rigtige' konsekvent ved hver administration.`,
  3: `Faglige læringspunkter for denne case:
  
  - Opioider virker dæmpende på respirationscentret. En faldende respirationsfrekvens er ofte det første tegn på overdosering.
  - Særlig forsigtighed kræves hos patienter med nedsat lungefunktion (f.eks. KOL) eller ved kombination med andre sløvende præparater.
  - Naloxon skal altid være tilgængeligt som modgift ved administration af parenterale opioider.
  
  Systematisk monitorering af bevidsthedsniveau og respiration er en kerneopgave i smertebehandlingen.`,
  4: `Faglige læringspunkter for denne case:
  
  - AK-behandling med Warfarin kræver altid tjek af interaktioner, før ny medicin påbegyndes.
  - Mange typer antibiotika påvirker tarmfloraen og dermed K-vitamin produktionen, hvilket forstærker Warfarins virkning.
  - Ved opstart af interagerende medicin skal INR måles hyppigere for at justere dosis rettidigt.
  
  Brug altid kliniske beslutningsstøtteværktøjer som pro.medicin.dk til interaktionstjek.`,
  5: `Faglige læringspunkter for denne case:
  
  - Dokumentation af allergier skal ske centralt og være synlig i alle relevante medicinsystemer (f.eks. FMK).
  - Tjek altid patientens allergistatus som en fast del af forberedelsen, før medicinen trækkes op.
  - Ved kendt allergi bør patienten også bære et fysisk kendetegn, som f.eks. et rødt allergibånd.
  
  Hurtig genkendelse af anafylaktiske symptomer og kendskab til placeringen af afdelingens adrenalin-kit redder liv.`
};

export const getAIFeedback = async (caseStudy: CaseStudy, reflection: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  // Hvis ingen nøgle findes, leveres de faglige fokuspunkter direkte
  if (!apiKey || apiKey === "undefined" || apiKey.length < 5) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return CLINICAL_GUIDANCE[caseStudy.id] || "Tak for din refleksion. Gennemgå de generelle faglige standarder for medicinhåndtering for denne case.";
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
    console.warn("API fejl, viser generel vejledning.");
    return CLINICAL_GUIDANCE[caseStudy.id] || "Gennemgå de kliniske standarder for denne patientkategori.";
  }
};
