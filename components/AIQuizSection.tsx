
import React, { useState, useEffect } from 'react';
import { Card } from './Layout';
import { generateContent } from '../services/geminiService';
import { Brain, Sparkles, Loader2, Check, X, RotateCcw, MessageSquare, AlertCircle, Key, ShieldCheck, ArrowRight } from 'lucide-react';
import { QuizQuestion } from '../types';

// Declare the global AIStudio interface and associate it with window.aistudio to fix type conflicts.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // Fixed: Added optional modifier '?' to aistudio to resolve "identical modifiers" error with existing global declarations
    aistudio?: AIStudio;
  }
}

export const AIQuizSection = () => {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isKeyConnected, setIsKeyConnected] = useState<boolean>(false);

  useEffect(() => {
    const checkKey = async () => {
      const hasKey = !!process.env.API_KEY || (window.aistudio && await window.aistudio.hasSelectedApiKey());
      setIsKeyConnected(!!hasKey);
    };
    checkKey();
  }, []);

  const startQuiz = async () => {
    setError(null);
    
    // Check if key is available, if not prompt user
    if (window.aistudio && !await window.aistudio.hasSelectedApiKey() && !process.env.API_KEY) {
      try {
        await window.aistudio.openSelectKey();
        setIsKeyConnected(true);
        // Continue to generation immediately after assuming success
      } catch (e) {
        console.error("Key selection cancelled", e);
        return;
      }
    }

    setLoading(true);
    const prompt = `Generate 3 advanced multiple-choice questions about Binary Trees. Return strictly as a JSON array: [{"q": string, "options": string[], "correct": number, "explanation": string}].`;
    
    try {
      const text = await generateContent(prompt, true);
      const parsed = JSON.parse(text);
      setQuestions(parsed);
      setUserAnswers({});
      setShowResults(false);
      setIsKeyConnected(true);
    } catch (e: any) {
      if (e.message === "MISSING_KEY") {
        setIsKeyConnected(false);
        setError("API_KEY_REQUIRED");
      } else {
        setError(e.message || "Failed to generate quiz.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-t-4 border-t-purple-500">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="animate-spin text-purple-600 mb-6" size={48} />
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">Generating Challenge</h3>
          <p className="text-gray-500 font-medium px-6 text-sm mt-2">Gemini is crafting 3 unique questions using your API key...</p>
        </div>
      </Card>
    );
  }

  if (error === "API_KEY_REQUIRED") {
    return (
      <div className="bg-white rounded-[2rem] sm:rounded-[3rem] border-2 border-dashed border-rose-200 p-8 sm:p-16 text-center shadow-sm relative overflow-hidden">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-rose-600">
          <Key size={40} />
        </div>
        <h3 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4 tracking-tight">API Key Required</h3>
        <p className="text-gray-500 font-medium text-sm sm:text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Please select a valid Gemini API key to proceed with the AI assessment.
        </p>
        <button 
          onClick={startQuiz}
          className="bg-rose-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-rose-100 hover:bg-rose-700 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto"
        >
          Connect & Generate <ArrowRight size={20} />
        </button>
      </div>
    );
  }

  if (!questions) {
    return (
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] sm:rounded-[3rem] p-10 sm:p-20 text-white text-center shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="w-20 h-20 bg-white/15 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md border border-white/20">
           <Brain size={44} className="text-white" />
        </div>
        <h3 className="text-3xl sm:text-6xl font-black mb-6 tracking-tight leading-tight">Mastery Challenge</h3>
        <p className="mb-10 text-indigo-100 text-base sm:text-2xl font-medium opacity-90 max-w-2xl mx-auto leading-relaxed">
          Unlock dynamic, AI-generated assessments to prove your binary tree expertise.
        </p>
        <button 
          onClick={startQuiz}
          className="w-full sm:w-auto bg-white text-indigo-700 px-12 py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto"
        >
          <Sparkles size={24} className="text-indigo-500" />
          {isKeyConnected ? "Generate Quiz" : "Connect Key & Start"}
        </button>
        {isKeyConnected && (
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
            <ShieldCheck size={14} /> API Key Connected
          </div>
        )}
      </div>
    );
  }

  return (
    <Card title="✨ Gemini Intelligence Check" className="border-t-4 border-t-purple-500">
      <div className="space-y-12">
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="border-b border-gray-100 last:border-0 pb-10 last:pb-0">
            <h4 className="font-black text-lg sm:text-xl text-gray-900 mb-6 leading-tight flex gap-3">
                <span className="text-indigo-600 opacity-30 select-none">#{qIdx + 1}</span>
                {q.q}
            </h4>
            <div className="grid gap-3">
              {q.options.map((opt, optIdx) => {
                const isSelected = userAnswers[qIdx] === optIdx;
                const isCorrect = q.correct === optIdx;
                let btnClass = "w-full text-left p-5 rounded-2xl border-2 transition-all font-bold text-sm sm:text-base leading-relaxed ";
                
                if (showResults) {
                  if (isCorrect) btnClass += "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm";
                  else if (isSelected) btnClass += "bg-rose-50 border-rose-300 text-rose-700";
                  else btnClass += "bg-gray-50 border-gray-100 text-gray-400 opacity-60";
                } else {
                  btnClass += isSelected 
                    ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-md ring-4 ring-indigo-50" 
                    : "bg-white border-gray-100 hover:border-indigo-200 hover:bg-gray-50 text-gray-700";
                }

                return (
                  <button 
                    key={optIdx} 
                    onClick={() => !showResults && setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                    disabled={showResults}
                    className={btnClass}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex-1 pr-4">{opt}</span>
                      {showResults && isCorrect && <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0"><Check size={20} /></div>}
                      {showResults && isSelected && !isCorrect && <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0"><X size={20} /></div>}
                    </div>
                  </button>
                );
              })}
            </div>
            {showResults && (
              <div className="mt-6 p-6 bg-blue-50/70 text-blue-900 rounded-[2rem] flex gap-4 border border-blue-100 animate-in fade-in slide-in-from-top-2">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                    <MessageSquare size={20} />
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Explanation</p>
                    <p className="text-xs sm:text-sm font-semibold leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {!showResults ? (
          <button 
            onClick={() => setShowResults(true)}
            disabled={Object.keys(userAnswers).length < questions.length}
            className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-gray-800 transition-all shadow-xl active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {Object.keys(userAnswers).length < questions.length ? `Complete All Questions` : 'Analyze Results'}
          </button>
        ) : (
          <button 
            onClick={startQuiz}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
          >
            <RotateCcw size={20} /> New Challenge
          </button>
        )}
      </div>
    </Card>
  );
};
