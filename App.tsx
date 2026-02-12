
import React, { useState } from 'react';
import { CASE_STUDIES, QUIZ_QUESTIONS } from './constants.ts';
import { AppView, CaseStudy } from './types.ts';
import { getAIFeedback } from './services/gemini.ts';

// --- Local Data for Resources ---
const RISK_DRUGS_INFO = [
  { 
    title: "Insulin", 
    huskeregler: "Tjek type (hurtig/langsom), enheder (aldrig ml!), og blodsukker. Vær obs på peak-tidspunkt.",
    advarsel: "Fejldosering kan føre til koma på få timer."
  },
  { 
    title: "Kalium", 
    huskeregler: "Må ALDRIG gives ufortyndet. Skal blandes grundigt. Max infusionshastighed skal overholdes.",
    advarsel: "Ufortyndet kalium medfører øjeblikkeligt hjertestop."
  },
  { 
    title: "AK-behandling", 
    huskeregler: "Tjek seneste INR. Vær obs på blødningsrisiko ved antibiotika-opstart.",
    advarsel: "Små fejl kan give hjerneblødning eller store indre blødninger."
  },
  { 
    title: "Opioider", 
    huskeregler: "Monitorér respirationsfrekvens og bevidsthed. Hav Naloxon (modgift) tilgængelig.",
    advarsel: "Risiko for respirationsstop, især ved ældre eller KOL-patienter."
  },
  { 
    title: "Gentamicin", 
    huskeregler: "Kræver TDM (bundværdi-måling). Skal gives præcis til tiden.",
    advarsel: "Permanent høreskade og nyresvigt ved ophobning."
  },
  { 
    title: "Digoxin", 
    huskeregler: "Tjek puls og kalium-niveau. Obs på tegn på forgiftning (kvalme, gult syn).",
    advarsel: "Lavt kalium forstærker virkningen til toksisk niveau."
  },
  { 
    title: "Methotrexat", 
    huskeregler: "Kun ugentlig dosering ved gigt. Tjek ordination ekstremt grundigt.",
    advarsel: "Daglig dosering medfører dødeligt knoglemarvssvigt."
  }
];

const FIVE_RIGHTS_INFO = [
  { title: "Rigtig Patient", text: "ID-tjek (Navn/CPR) mod armbånd. Brug foto ved konfuse patienter." },
  { title: "Rigtig Medicin", text: "Tjek pakning mod FMK/ordination. Er depottabletten intakt?" },
  { title: "Rigtig Dosis", text: "Styrke og antal. Dobbelt-tjek beregninger af flydende medicin." },
  { title: "Rigtig Vej", text: "Oral, IV, IM eller SC? Tjek om medicinen må knuses/gives i sonde." },
  { title: "Rigtig Tid", text: "Gives på ordinerede klokkeslæt for at sikre stabilt serumniveau." }
];

const DISPENSING_CHECKLIST = [
  { title: "Ro & Koncentration", text: "Undgå afbrydelser. Bed kolleger om arbejdsro, mens du dispenserer." },
  { title: "Tjek FMK / Journal", text: "Arbejd altid ud fra den nyeste ordination. Tjek om der er pauseret medicin." },
  { title: "Dobbelt-kontrol", text: "Få en kollega til at kontrollere beregninger, insulin og andre højrisiko-præparater." },
  { title: "Emballage & Udløb", text: "Tjek at pakningen er intakt, og at medicinen ikke har overskredet datoen." },
  { title: "Signér Straks", text: "Signér i systemet umiddelbart efter dispensering, så andre ved det er gjort." }
];

const INTERACTIONS_INFO = [
  { pair: "Warfarin + NSAID/ASA", effect: "Ekstremt øget blødningsrisiko pga. hæmmet trombocytfunktion." },
  { pair: "ACE-hæmmer + Kalium", effect: "Risiko for svær hyperkaliæmi, som kan føre til akut hjertestop." },
  { pair: "Digoxin + Diuretika", effect: "Vanddrivende giver lavt kalium, hvilket øger risiko for Digoxin-forgiftning." },
  { pair: "Ciprofloxacin + Jern/Kalk", effect: "Antibiotika optages ikke. Forskyd indtagelse med mindst 2 timer." },
  { pair: "Tramadol + SSRI", effect: "Risiko for Serotonint Syndrom (konfusion, rysten, hjertebanken)." },
  { pair: "Statiner + Grapefrugt", effect: "Grapefrugt hæmmer nedbrydningen og giver risiko for muskelskader." }
];

const Header: React.FC<{ currentView: AppView, onViewChange: (view: AppView) => void }> = ({ currentView, onViewChange }) => (
  <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg sticky top-0 z-50 print:hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onViewChange(AppView.DASHBOARD)}>
        <div className="bg-white/20 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight uppercase">SygeplejeRefleksion</h1>
      </div>
      <nav className="flex flex-wrap justify-center gap-x-2 gap-y-2 text-sm">
        {[
          { id: AppView.DASHBOARD, label: 'Cases' },
          { id: AppView.RESOURCES, label: 'Ressourcer' },
          { id: AppView.QUIZ, label: 'Klinisk Quiz' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`font-bold px-4 py-2 rounded-lg transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-white text-blue-800 shadow-md' 
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  </header>
);

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<string | null>(null);
  
  // Quiz State
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{ correct: boolean, text: string, selectedIndex: number } | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleSubmitReflection = async () => {
    if (!selectedCase || !reflectionText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const feedback = await getAIFeedback(selectedCase, reflectionText);
      setCurrentFeedback(feedback);
    } catch (error) {
      console.error("Error in handleSubmitReflection:", error);
      setCurrentFeedback("Der opstod en fejl. Prøv venligst igen senere.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuizAnswer = (idx: number) => {
    if (quizFeedback) return;
    const currentQ = QUIZ_QUESTIONS[quizIdx];
    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) setQuizScore(quizScore + 1);
    setQuizFeedback({ correct: isCorrect, text: currentQ.explanation, selectedIndex: idx });
  };

  const nextQuizQ = () => {
    setQuizFeedback(null);
    if (quizIdx + 1 < QUIZ_QUESTIONS.length) {
      setQuizIdx(quizIdx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizIdx(0);
    setQuizScore(0);
    setQuizFeedback(null);
    setQuizFinished(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header currentView={currentView} onViewChange={(v) => { 
        setCurrentView(v); 
        setSelectedCase(null); 
        if (v === AppView.QUIZ) resetQuiz();
      }} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {currentView === AppView.DASHBOARD && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 mb-2">Kliniske Cases</h2>
              <p className="text-lg text-slate-600">Træn din dømmekraft gennem virkelighedsnære scenarier fra sygeplejen.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CASE_STUDIES.map(cs => (
                <div key={cs.id} onClick={() => { setSelectedCase(cs); setCurrentFeedback(null); setReflectionText(''); setCurrentView(AppView.CASE_DETAIL); }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full">
                  <div className="p-6 flex-grow">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cs.tags.map(tag => <span key={tag} className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-3 py-1 rounded-md">{tag}</span>)}
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-3 group-hover:text-blue-700 leading-tight">Case {cs.id}: {cs.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed italic">"{cs.scenario}"</p>
                  </div>
                  <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center text-xs font-black text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    REFLEKTÉR NU
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === AppView.RESOURCES && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-12">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 mb-2">Klinisk Værktøjskasse</h2>
              <p className="text-slate-600 font-medium italic">Sikker medicinhåndtering og tjeklister til 2. semester.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Dispenserings-tjekliste */}
              <section className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-xl font-black mb-6 flex items-center gap-3 uppercase tracking-tighter italic">
                  Tjekliste: Medicindispensering
                </h3>
                <div className="space-y-4">
                  {DISPENSING_CHECKLIST.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-white text-indigo-900 flex items-center justify-center font-black text-lg shadow-lg">{i + 1}</div>
                      <div>
                        <p className="font-black text-sm mb-1">{item.title}</p>
                        <p className="text-[11px] text-indigo-100 leading-relaxed font-medium">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* De 5 Rigtige */}
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-blue-100">
                <h3 className="text-xl font-black text-blue-800 mb-6 flex items-center gap-3 uppercase tracking-tighter">
                  <div className="bg-blue-600 text-white p-2 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                  </div>
                  De 5 Rigtige
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {FIVE_RIGHTS_INFO.map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-300 transition-colors group">
                      <p className="font-black text-slate-800 text-sm mb-1 group-hover:text-blue-700">{item.title}</p>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Interaktioner */}
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100">
                <h3 className="text-xl font-black text-emerald-800 mb-6 flex items-center gap-3 uppercase tracking-tighter italic">
                  Kritiske Interaktioner
                </h3>
                <div className="space-y-4">
                  {INTERACTIONS_INFO.map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                      <p className="font-black text-emerald-900 text-xs mb-1 underline">{item.pair}</p>
                      <p className="text-[10px] text-emerald-700 leading-relaxed font-bold italic">{item.effect}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Risikosituationslægemidler */}
              <section className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-red-100">
                <h3 className="text-xl font-black text-red-800 mb-6 flex items-center gap-3 uppercase tracking-tighter">
                  <div className="bg-red-500 text-white p-2 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  De 7 Risikosituationslægemidler
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {RISK_DRUGS_INFO.map((drug, i) => (
                    <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-red-50 hover:border-red-200 transition-all group">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="h-7 w-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-[10px]">{i+1}</span>
                        <h4 className="font-black text-slate-800 text-sm group-hover:text-red-900">{drug.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed mb-3 font-medium">{drug.huskeregler}</p>
                      <div className="pt-2 border-t border-red-100">
                        <p className="text-[9px] font-black text-red-500 uppercase italic">Kritisk fare ved fejl</p>
                        <p className="text-[10px] text-red-900 italic font-bold">{drug.advarsel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {currentView === AppView.QUIZ && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!quizFinished ? (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
                <div className="bg-blue-800 p-8 text-white">
                  <div className="flex justify-between items-center mb-6">
                    <span className="px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">Spørgsmål {quizIdx + 1} af {QUIZ_QUESTIONS.length}</span>
                    <span className="font-black text-blue-200 bg-blue-900/40 px-3 py-1 rounded-lg">Rigtige: {quizScore}</span>
                  </div>
                  <h3 className="text-2xl font-black leading-tight">{QUIZ_QUESTIONS[quizIdx].question}</h3>
                </div>
                
                <div className="p-8 space-y-3 bg-slate-50">
                  {QUIZ_QUESTIONS[quizIdx].options.map((opt, i) => (
                    <button
                      key={i}
                      disabled={!!quizFeedback}
                      onClick={() => handleQuizAnswer(i)}
                      className={`w-full p-5 rounded-2xl text-left font-bold transition-all flex items-center justify-between border-2 text-sm shadow-sm ${
                        quizFeedback 
                          ? i === QUIZ_QUESTIONS[quizIdx].correctIndex
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                            : (i === quizFeedback.selectedIndex && !quizFeedback.correct) ? 'bg-red-50 border-red-200 text-red-900' : 'bg-white border-slate-100 text-slate-400'
                          : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                      }`}
                    >
                      <span className="flex-grow">{opt}</span>
                      {quizFeedback && i === QUIZ_QUESTIONS[quizIdx].correctIndex && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      )}
                    </button>
                  ))}
                </div>

                {quizFeedback && (
                  <div className="px-8 pb-8 bg-slate-50 animate-in slide-in-from-top-2">
                    <div className={`p-6 rounded-2xl border-l-8 ${quizFeedback.correct ? 'bg-emerald-100 border-emerald-600 text-emerald-900' : 'bg-red-100 border-red-600 text-red-900'}`}>
                      <p className="font-black mb-2 text-base uppercase tracking-wider">{quizFeedback.correct ? 'Korrekt!' : 'Ikke helt rigtigt'}</p>
                      <p className="text-sm font-medium leading-relaxed">{quizFeedback.text}</p>
                    </div>
                    <button onClick={nextQuizQ} className="w-full mt-6 py-5 bg-slate-900 text-white rounded-2xl font-black shadow-lg hover:bg-slate-800 transition-all uppercase tracking-widest active:scale-95">
                      {quizIdx + 1 < QUIZ_QUESTIONS.length ? 'Næste spørgsmål' : 'Se dit resultat'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-200">
                <div className="h-24 w-24 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-4">Godt kæmpet!</h3>
                <p className="text-xl text-slate-500 mb-8 font-medium">Du svarede rigtigt på <span className="text-blue-600 font-black">{quizScore}</span> ud af {QUIZ_QUESTIONS.length} kliniske spørgsmål.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={resetQuiz} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all uppercase tracking-widest">Prøv igen</button>
                  <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="px-10 py-5 bg-slate-200 text-slate-700 rounded-2xl font-black hover:bg-slate-300 transition-all uppercase tracking-widest">Gå til cases</button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === AppView.CASE_DETAIL && selectedCase && (
          <div className="max-w-4xl mx-auto">
            <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="mb-6 text-blue-700 font-black flex items-center hover:underline group uppercase tracking-widest text-xs print:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              Tilbage til oversigten
            </button>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 print:shadow-none print:border-none">
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-8 py-10 text-white print:bg-none print:text-slate-900 print:border-b-2 print:border-slate-200">
                <h2 className="text-3xl font-black leading-tight mb-4">{selectedCase.title}</h2>
                <div className="flex gap-2 print:hidden">{selectedCase.tags.map(t => <span key={t} className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">{t}</span>)}</div>
              </div>
              <div className="p-8">
                <div className="mb-10">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Situationsbeskrivelse</h3>
                  <div className="bg-slate-50 p-8 rounded-2xl border-l-8 border-blue-600 text-slate-800 italic leading-relaxed text-base shadow-inner print:shadow-none print:bg-slate-100">"{selectedCase.scenario}"</div>
                </div>
                {!currentFeedback ? (
                  <div className="space-y-6">
                    <label className="block text-sm font-black text-slate-800 uppercase tracking-wide">{selectedCase.reflectionQuestion}</label>
                    <textarea 
                      value={reflectionText} 
                      onChange={(e) => setReflectionText(e.target.value)} 
                      placeholder="Indtast din refleksion her... Hvad tænker du om situationen? Hvilke handlinger mangler?" 
                      className="w-full h-64 p-8 rounded-2xl border-2 border-slate-200 focus:ring-8 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all shadow-inner bg-slate-50 text-slate-800 text-base leading-relaxed font-medium" 
                    />
                    <button 
                      onClick={handleSubmitReflection} 
                      disabled={isAnalyzing || !reflectionText.trim()} 
                      className={`w-full py-6 rounded-2xl font-black text-white shadow-2xl transition-all active:scale-95 uppercase tracking-widest ${isAnalyzing || !reflectionText.trim() ? 'bg-slate-300' : 'bg-blue-800 hover:bg-blue-900'}`}
                    >
                      {isAnalyzing ? (
                        <span className="flex items-center justify-center gap-3">
                          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Underviseren analyserer dit svar...
                        </span>
                      ) : 'INDSEEND REFLEKSION'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-10 relative overflow-hidden print:bg-white print:border-slate-200">
                      <div className="absolute top-0 right-0 p-6 opacity-5 print:hidden">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      </div>
                      <div className="flex justify-between items-start mb-6 border-b border-emerald-200 pb-4 print:border-slate-200">
                        <div className="flex flex-col">
                          <h3 className="text-2xl font-black text-emerald-900 italic print:text-slate-900">Underviserens Feedback</h3>
                        </div>
                        <button onClick={handlePrint} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-emerald-700 transition-colors shadow-lg print:hidden">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                          GEM / PRINT
                        </button>
                      </div>
                      <div className="prose prose-slate max-w-none text-emerald-900 whitespace-pre-wrap text-base leading-relaxed font-bold italic print:text-slate-800">{currentFeedback}</div>
                    </div>
                    <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest print:hidden">Vælg en ny case</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="bg-slate-900 text-slate-500 py-16 text-center text-[10px] uppercase tracking-widest font-black border-t border-white/5 print:hidden">
        SygeplejeRefleksion - Klinisk Træning til 2. Semester
      </footer>
    </div>
  );
}
