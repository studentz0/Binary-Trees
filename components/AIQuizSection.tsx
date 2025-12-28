import React, { useState } from 'react';
import { Card } from './Layout';
import { generateContent } from '../services/geminiService';
import { Brain, Sparkles, Loader2, Check, X, RotateCcw, MessageSquare, AlertCircle } from 'lucide-react';
import { QuizQuestion } from '../types';

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
      setError(e.message || "Failed to generate quiz. Please check your API configuration.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-t-4 border-t-purple-500">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Generating Challenge...</h3>
          <p className="text-gray-500 font-medium">Gemini is tailoring questions securely...</p>
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
          <p className="mb-6 font-medium text-gray-600 px-8">{error}</p>
          <button 
            onClick={startQuiz}
            className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all flex items-center gap-2"
          >
            <RotateCcw size={18} /> Retry Generation
          </button>
        </div>
      </Card>
    );
  }

  if (!questions) {
    return (
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-12 text-white text-center shadow-2xl shadow-indigo-200">
        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md">
           <Brain size={48} className="text-white" />
        </div>
        <h3 className="text-4xl font-black mb-4 tracking-tight">Ready for a Brain Teaser?</h3>
        <p className="mb-10 text-indigo-100 text-lg font-medium opacity-90 max-w-md mx-auto">Test your knowledge with dynamic questions generated securely by Gemini AI.</p>
        <button 
          onClick={startQuiz}
          className="bg-white text-indigo-700 px-10 py-5 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto text-lg"
        >
          <Sparkles size={24} />
          Start Smart Quiz
        </button>
      </div>
    );
  }

  return (
    <Card title="✨ Gemini Intelligence Check" className="border-t-4 border-t-purple-500">
      <div className="space-y-12">
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="border-b border-gray-100 last:border-0 pb-10 last:pb-0">
            <h4 className="font-black text-xl text-gray-900 mb-6 leading-tight">{qIdx + 1}. {q.q}</h4>
            <div className="grid gap-3">
              {q.options.map((opt, optIdx) => {
                const isSelected = userAnswers[qIdx] === optIdx;
                const isCorrect = q.correct === optIdx;
                let btnClass = "w-full text-left p-5 rounded-2xl border-2 transition-all font-bold ";
                
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
                      <span className="flex-1">{opt}</span>
                      {showResults && isCorrect && <Check size={20} className="text-emerald-600 shrink-0 ml-2" />}
                      {showResults && isSelected && !isCorrect && <X size={20} className="text-rose-600 shrink-0 ml-2" />}
                    </div>
                  </button>
                );
              })}
            </div>
            {showResults && (
              <div className="mt-6 p-6 bg-blue-50/50 text-blue-800 rounded-2xl flex gap-4 border border-blue-100">
                <MessageSquare size={20} className="shrink-0 mt-1 text-blue-500" />
                <p className="text-sm font-medium leading-relaxed"><strong>Key Insight:</strong> {q.explanation}</p>
              </div>
            )}
          </div>
        ))}
        
        {!showResults ? (
          <button 
            onClick={() => setShowResults(true)}
            className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
          >
            Submit Quiz
          </button>
        ) : (
          <button 
            onClick={startQuiz}
            className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black text-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-purple-100"
          >
            <RotateCcw size={24} /> Try Another Set
          </button>
        )}
      </div>
    </Card>
  );
};