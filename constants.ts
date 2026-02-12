
import { CaseStudy, QuizQuestion } from './types';

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 1,
    title: "Kaliuminfusion givet i forkert styrke",
    scenario: "En intensivpatient skal have kalium til korrigering af hypokaliæmi. En studerende blander ved en fejl koncentreret kalium direkte i infusionsposen, uden yderligere fortynding. Patienten får en livstruende arytmi, og hjertestopteamet må tilkaldes.",
    reflectionQuestion: "Hvordan arbejder man sikkert med højrisikomedicin som kalium?",
    tags: ["Intensiv", "Højrisiko", "Elektrolytter"]
  },
  {
    id: 2,
    title: "Forveksling af insulinpenne",
    scenario: "En ældre borger får ved en fejl 40 enheder langtidsvirkende insulin i stedet for de ordinerede 6 enheder hurtigvirkende. Patienten bliver fundet konfus og kold 3 timer senere – svært hypoglykæmisk – og må behandles akut.",
    reflectionQuestion: "Hvad fortæller casen om opbevaring, mærkning og kontroller?",
    tags: ["Hjemmepleje", "Diabetes", "Forveksling"]
  },
  {
    id: 3,
    title: "Morfin givet til respirationssvag patient",
    scenario: "En patient med svær KOL får 10 mg morfin som smertebehandling. Respirationsfrekvensen var allerede lav, men dette blev overset. Patienten udvikler respirationsstop og må genoplives.",
    reflectionQuestion: "Hvorfor er monitorering før og efter opioid-administration kritisk?",
    tags: ["Opioider", "Monitorering", "Respiration"]
  },
  {
    id: 4,
    title: "Warfarin og antibiotika-interaktion overses",
    scenario: "En patient in fast warfarinbehandling får ordineret clarithromycin for en infektion. Interaktionen opdages ikke. Patienten indlægges tre dage senere med massiv GI-blødning og INR på 9,0.",
    reflectionQuestion: "Hvordan undgår man interaktionsfejl – især ved højrisikopræparater?",
    tags: ["Interaktioner", "Blodfortyndende", "Polyfarmaci"]
  },
  {
    id: 5,
    title: "Anafylaktisk chok efter penicillin",
    scenario: "En studerende giver penicillin til en patient, selvom allergi står registreret i journalen. Kort efter udvikler patienten anafylaksi og må behandles med adrenalin og indlægges på intensiv.",
    reflectionQuestion: "Hvordan kan allergier sikres synlige for alle faggrupper?",
    tags: ["Allergi", "Journalføring", "Akut"]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Hvad er den vigtigste fysiologiske observation ved administration af parenterale opioider?",
    options: [
      "Blodtryk og temperatur",
      "Respirationsfrekvens og bevidsthedsniveau",
      "Blodsukker og diurese",
      "Iltmætning alene"
    ],
    correctIndex: 1,
    explanation: "Opioider virker dæmpende på respirationscentret. En faldende respirationsfrekvens er det tidligste tegn på overdosering, ofte ledsaget af sløvhed. Iltmætning kan være falsk høj ved ilttilskud."
  },
  {
    id: 2,
    question: "En patient i Digoxin-behandling udvikler hypokaliæmi (lavt kalium). Hvorfor er dette kritisk?",
    options: [
      "Det stopper Digoxins virkning helt",
      "Det øger risikoen for Digoxin-forgiftning markant",
      "Det medfører at patienten skal have dobbelt dosis Digoxin",
      "Det har ingen klinisk betydning"
    ],
    correctIndex: 1,
    explanation: "Lavt ekstracellulært kalium øger Digoxins binding til natrium-kalium-pumpen i hjertet, hvilket potentierer virkningen og øger risikoen for toksiske arytmier selv ved normale Digoxin-niveauer."
  },
  {
    id: 3,
    question: "Ved ugentlig Methotrexat-behandling sker der en fatal fejl. Hvilken?",
    options: [
      "Patienten får det med mælk",
      "Patienten får det ved en fejl hver dag i en uge",
      "Patienten springer en dosis over",
      "Dosis gives om aftenen i stedet for om morgenen"
    ],
    correctIndex: 1,
    explanation: "Methotrexat til non-maligne lidelser (f.eks. gigt) gives kun ÉN gang om ugen. Ved daglig dosering opstår svær knoglemarvssuppression, som ofte er dødelig pga. infektion eller blødning."
  },
  {
    id: 4,
    question: "Hvilken af 'De 5 Rigtige' er sværest at overholde hos en konfus patient med demens uden armbånd?",
    options: [
      "Rigtig Tid",
      "Rigtig Vej",
      "Rigtig Patient",
      "Rigtig Dosis"
    ],
    correctIndex: 2,
    explanation: "Rigtig patient kræver sikker identifikation. En konfus patient kan bekræfte et forkert navn. Her skal man bruge foto i medicinsystemet eller identifikation ved fast personale/pårørende."
  },
  {
    id: 5,
    question: "Hvad kendetegner en 'Nærhændelse' i UTH-systemet?",
    options: [
      "En fejl der blev begået, men som ikke skadede patienten",
      "En fejl der blev opdaget af patienten selv",
      "En fejl der blev stoppet inden den nåede patienten",
      "En fejl begået af en studerende under opsyn"
    ],
    correctIndex: 2,
    explanation: "En nærhændelse er en situation, hvor en fejl opstod, men blev fanget af en kontrolinstans (f.eks. dig selv eller en kollega) før lægemidlet blev administreret."
  },
  {
    id: 6,
    question: "Hvorfor skal Gentamicin-koncentrationen (TDM) måles som en 'bundværdi'?",
    options: [
      "For at tjekke om patienten har fået for lidt",
      "For at sikre at nyrerne når at udskille stoffet til et sikkert niveau før næste dosis",
      "Fordi det er nemmest at tage blodprøven om morgenen",
      "For at tjekke om medicinen er aktiv i blodet"
    ],
    correctIndex: 1,
    explanation: "Gentamicin er nefrotoksisk. Ved at måle lige før næste dosis sikrer man, at koncentrationen er faldet tilstrækkeligt til, at nyrerne ikke skades af konstant høj eksponering."
  },
  {
    id: 7,
    question: "En AK-patient (Warfarin) starter på bredspektret antibiotika. Hvad skal sygeplejersken være opmærksom på?",
    options: [
      "At antibiotika fjerner Warfarins virkning",
      "At INR kan stige markant pga. ændret tarmflora og nedsat K-vitamin produktion",
      "At patienten skal have mere grøn salat for at modvirke medicinen",
      "Intet, de to præparater påvirker ikke hinanden"
    ],
    correctIndex: 1,
    explanation: "Antibiotika dræber de tarmbakterier, der producerer K-vitamin. Da Warfarin virker ved at hæmme K-vitamin-afhængige koagulationsfaktorer, vil manglen på K-vitamin forstærke Warfarins virkning og øge blødningsrisikoen."
  },
  {
    id: 8,
    question: "Hvad er den korrekte procedure ved fund af en knust depottablet i en medicinbakke?",
    options: [
      "Giv den til patienten, hvis de har svært ved at synke",
      "Opløs resterne i vand og giv det i sonde",
      "Kassér den og kontakt lægen for en alternativ formulering",
      "Bland den i yoghurt for at dække smagen"
    ],
    correctIndex: 2,
    explanation: "Depotformuleringer ødelægges ved knusning, hvilket fører til 'dose-dumping' (hele dosis frigives på én gang). Det er livsfarligt for f.eks. morfin eller antihypertensiva."
  },
  {
    id: 9,
    question: "Hvilken observation er vigtigst umiddelbart efter opstart af hurtigvirkende insulin?",
    options: [
      "BT-måling efter 2 timer",
      "Observation for sveden, rysten og sultfølelse efter 30-60 min",
      "Måling af temperatur for at udelukke infektion",
      "Vejning af patienten"
    ],
    correctIndex: 1,
    explanation: "Hurtigvirkende insulin har peak-effekt efter kort tid. Sveden og rysten er adrenerge symptomer på begyndende hypoglykæmi, som kræver hurtig handling (juice/druesukker)."
  },
  {
    id: 10,
    question: "Du opdager en kollega give medicin uden at tjekke CPR-nummer. Hvad er din faglige pligt?",
    options: [
      "Ignorere det, hun er erfaren",
      "Gøre hende opmærksom på det på en konstruktiv måde med reference til 'De 5 Rigtige'",
      "Sladre til afdelingssygeplejersken med det samme uden at tale med kollegaen",
      "Skrive en anonym UTH uden at tale med nogen"
    ],
    correctIndex: 1,
    explanation: "Patientsikkerhed er et fælles ansvar. En direkte, faglig dialog er den bedste måde at korrigere adfærd på og forebygge fejl her og nu."
  }
];
