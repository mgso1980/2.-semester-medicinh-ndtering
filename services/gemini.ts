
import { GoogleGenAI } from "@google/genai";
import { CaseStudy } from "../types.ts";

// Faglige fokuspunkter baseret på kliniske standarder (Fallback)
const CLINICAL_GUIDANCE: Record<number, string> = {
  1: `Her er de centrale faglige principper for denne situation:
  
- Administration af kalium kræver konsekvent dobbelt-kontrol af både præparat, styrke og beregning før ophældning.
- Koncentreret kalium udgør en ekstrem patientsikkerhedsrisiko og skal opbevares aflåst eller adskilt fra almindelige infusionsvæsker.
- Kontinuerlig EKG-monitorering (telemetri) er nødvendig ved hurtig korrigering af elektrolytforstyrrelser for at fange arytmier tidligt.
- Infusionshastigheden skal altid tjekkes mod lokale retningslinjer for at undgå hyperkaliæmi-induceret hjertestop.`,
  2: `Her er de centrale faglige principper for denne situation:
  
- Insulin-penne kan ligne hinanden visuelt; læs altid etiketten grundigt som en del af 'De 5 Rigtige'.
- Ved fejlmedicinering med insulin skal borgerens blodsukker monitoreres tæt de næste 4-8 timer pga. risiko for sen hypoglykæmi.
- Pårørende eller hjemmeplejen skal informeres om tidlige tegn på lavt blodsukker: Konfusion, koldsved, rysten og sult.
- Adskilt opbevaring af hurtig- og langtidsvirkende insulin reducerer risikoen for forveksling i en travl hverdag.`,
  3: `Her er de centrale faglige principper for denne situation:
  
- Opioider hæmmer respirationscentret. Patienter med KOL er i øget risiko for respirationsdepression selv ved små doser.
- Før administration skal respirationsfrekvens og bevidsthedsniveau (GCS) altid måles og dokumenteres som baseline.
- Monitoreringsintervallet efter administration skal tilpasses præparatets farmakokinetik (hvornår virker det kraftigst?).
- Naloxon (antidot) skal altid være umiddelbart tilgængeligt i afdelingen som en del af nødberedskabet.`,
  4: `Her er de centrale faglige principper for denne situation:
  
- Warfarin har et snævert terapeutisk vindue; mange antibiotika (især makrolider) forstærker virkningen ved at påvirke tarmfloraen.
- Ved enhver ændring i medicinering hos en AK-patient skal der foretages et aktivt interaktionstjek (f.eks. pro.medicin.dk).
- Hyppigere INR-målinger er påkrævet i dagene efter opstart af interagerende medicin for at kunne justere dosis rettidigt.
- Patienten skal instrueres i at observere for blødningstegn: Blå mærker, næseblod eller mørk afføring.`,
  5: `Her er de centrale faglige principper for denne situation:
  
- Sikker identifikation af allergier er en forudsætning for al medicinhåndtering. Tjek altid journal og FMK før klargøring.
- Ved kendt medicinallergi skal patienten bære et fysisk allergibånd, og medicinkortet skal være markeret med et tydeligt advarselssymbol.
- En grundig anamnese ved indlæggelse er vigtig for at skelne mellem reelle allergier og almindelige bivirkninger (f.eks. kvalme).
- Adrenalin-kit og nødberedskab skal være kendt af alt personale, der administrerer parenterale antibiotika.`
};

export const getAIFeedback = async (caseStudy: CaseStudy, reflection: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  // Hvis ingen nøgle findes, leveres de faglige fokuspunkter som en guide
  if (!apiKey || apiKey === "undefined" || apiKey.length < 5) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return CLINICAL_GUIDANCE[caseStudy.id] || "Gennemgå de kliniske standarder og 'De 5 Rigtige' for denne situation.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `
      Du er en erfaren klinisk sygeplejeunderviser. 
      Giv konstruktiv og faglig feedback på en 2. semester sygeplejestuderendes refleksion.
      Vær objektiv og fokusér på faglige standarder.
      Fokusér på:
      - 'De 5 rigtige' (Patient, Medicin, Dosis, Vej, Tid).
      - Patientsikkerhed og klinisk beslutningstagen.
      - Sygeplejefaglige observationer.
      Sprog: Dansk. Format: Brug punktform.
    `;

    const promptText = `
      CASE: ${caseStudy.title}
      SCENARIE: ${caseStudy.scenario}
      STUDERENDES REFLEKSION: "${reflection}"
      Giv faglig feedback baseret på sygeplejestandarder.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptText,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Kunne ikke generere feedback. Gennemgå de generelle kliniske principper.";
  } catch (error: any) {
    console.warn("API ikke tilgængelig, viser faglige fokuspunkter.");
    return CLINICAL_GUIDANCE[caseStudy.id] || "Gennemgå de faglige retningslinjer for medicinhåndtering.";
  }
};
