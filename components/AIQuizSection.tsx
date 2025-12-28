
import React, { useState } from 'react';
import { Card } from './Layout';
import { generateContent } from '../services/geminiService';
import { Brain, Sparkles, Loader2, Check, X, RotateCcw, MessageSquare, AlertCircle, Key, ExternalLink } from 'lucide-react';
import { QuizQuestion } from '../types';

// Fix: Define AIStudio interface to ensure identical modifiers and consistent type for window.aistudio
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio: AIStudio;
  }
}

export const AIQuizSection = () => {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    setError(null);
    
    const prompt = `Generate 3 advanced multiple-choice questions about Binary Trees and AVL balancing. 
    Return strictly as a JSON array: [{"q": string, "options": string[], "correct": number, "explanation": string}].`;
    
    try {
      const text = await generateContent(prompt, true);
      const parsed = JSON.parse(text);
      setQuestions(parsed);
      setUserAnswers({});
      setShowResults(false);
    } catch (e: any) {
      if (e.message === "MISSING_KEY") {
        setError("API_KEY_REQUIRED");
      } else {
        setError(e.message || "Failed to generate quiz. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeySetup = async () => {
    try {
      await window.aistudio.openSelectKey();
      // Assume success and retry
      startQuiz();
    } catch (e) {
      console.error("Failed to open key selector", e);
    }
  };

  if (loading) {
    return (
      <Card className="border-t-4 border-t-purple-500">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">Generating Challenge...</h3>
          <p className="text-gray-500 font-medium px-4 text-sm sm:text-base">Gemini is tailoring questions securely...</p>
        </div>
      </Card>
    );
  }

  if (error === "API_KEY_REQUIRED") {
    return (
      <Card className="border-t-4 border-t-rose-500">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-4">
            <Key size={32} />
          </div>
          <h3 className="text-lg sm:text-xl font-black uppercase mb-2 text-rose-900">API Key Required</h3>
          <p className="mb-6 font-medium text-gray-600 px-6 text-sm max-w-md">
            To generate AI quizzes, you must select a Gemini API key from a paid GCP project.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleKeySetup}
              className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-rose-100"
            >
              Configure API Key
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 text-gray-500 font-bold text-sm hover:text-gray-800 flex items-center justify-center gap-2"
            >
              Billing Docs <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-t-4 border-t-rose-500">
        <div className="flex flex-col items-center justify-center py-12 text-center text-rose-600">
          <AlertCircle size={48} className="mb-4" />
          <h3 className="text-xl font-black uppercase mb-2">Quiz Error</h3>
          <p className="mb-6 font-medium text-gray-600 px-8 text-sm">{error}</p>
          <button 
            onClick={startQuiz}
            className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all flex items-center gap-2 active:scale-95"
          >
            <RotateCcw size={18} /> Retry Generation
          </button>
        </div>
      </Card>
    );
  }

  if (!questions) {
    return (
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 text-white text-center shadow-2xl shadow-indigo-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-2xl" />
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 backdrop-blur-md border border-white/20">
           <Brain size={40} className="text-white sm:w-12 sm:h-12" />
        </div>
        <h3 className="text-2xl sm:text-4xl font-black mb-4 tracking-tight leading-tight">Ready for a Brain Teaser?</h3>
        <p className="mb-8 sm:mb-10 text-indigo-100 text-sm sm:text-lg font-medium opacity-90 max-w-md mx-auto">Test your knowledge with dynamic questions generated securely by Gemini AI.</p>
        <button 
          onClick={startQuiz}
          className="w-full sm:w-auto bg-white text-indigo-700 px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto text-base sm:text-lg"
        >
          <Sparkles size={20} className="sm:w-6 sm:h-6" />
          Start Smart Quiz
        </button>
      </div>
    );
  }

  return (
    <Card title="✨ Gemini Intelligence Check" className="border-t-4 border-t-purple-500">
      <div className="space-y-10 sm:space-y-12">
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="border-b border-gray-100 last:border-0 pb-8 sm:pb-10 last:pb-0">
            <h4 className="font-black text-lg sm:text-xl text-gray-900 mb-4 sm:mb-6 leading-tight">{qIdx + 1}. {q.q}</h4>
            <div className="grid gap-2 sm:gap-3">
              {q.options.map((opt, optIdx) => {
                const isSelected = userAnswers[qIdx] === optIdx;
                const isCorrect = q.correct === optIdx;
                let btnClass = "w-full text-left p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all font-bold text-sm sm:text-base ";
                
                if (showResults) {
                  if (isCorrect) btnClass += "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm";
                  else if (isSelected) btnClass += "bg-rose-50 border-rose-300 text-rose-700";
                  else btnClass += "bg-gray-50 border-gray-100 text-gray-400 opacity-50";
                } else {
                  btnClass += isSelected 
                    ? "bg-indigo-50 border-indigo-500 text-indigo-800 shadow-md ring-4 ring-indigo-50" 
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
                      {showResults && isCorrect && <Check size={20} className="text-emerald-600 shrink-0 ml-2" />}
                      {showResults && isSelected && !isCorrect && <X size={20} className="text-rose-600 shrink-0 ml-2" />}
                    </div>
                  </button>
                );
              })}
            </div>
            {showResults && (
              <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-blue-50/50 text-blue-800 rounded-xl sm:rounded-2xl flex gap-3 sm:gap-4 border border-blue-100">
                <MessageSquare size={20} className="shrink-0 mt-1 text-blue-500" />
                <p className="text-xs sm:text-sm font-medium leading-relaxed"><strong>Key Insight:</strong> {q.explanation}</p>
              </div>
            )}
          </div>
        ))}
        
        {!showResults ? (
          <button 
            onClick={() => setShowResults(true)}
            className="w-full py-4 sm:py-5 bg-gray-900 text-white rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-95"
          >
            Submit Quiz
          </button>
        ) : (
          <button 
            onClick={startQuiz}
            className="w-full py-4 sm:py-5 bg-purple-600 text-white rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-purple-100 active:scale-95"
          >
            <RotateCcw size={20} className="sm:w-6 sm:h-6" /> Try Another Set
          </button>
        )}
      </div>
    </Card>
  );
};
