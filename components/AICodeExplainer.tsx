
import React, { useState } from 'react';
import { Sparkles, Loader2, ChevronDown, ChevronRight, Key } from 'lucide-react';
import { generateContent } from '../services/geminiService';

export const AICodeExplainer = ({ topic }: { topic: string }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [keyError, setKeyError] = useState(false);

  const fetchCode = async () => {
    if (content && !keyError) return;
    
    // Check for API key presence
    if (window.aistudio && !await window.aistudio.hasSelectedApiKey() && !process.env.API_KEY) {
      try {
        await window.aistudio.openSelectKey();
      } catch (e) {
        return;
      }
    }

    setLoading(true);
    setKeyError(false);
    try {
      const prompt = `Write a clean implementation of ${topic} in Python. Use high-quality coding standards. Output raw code only.`;
      const result = await generateContent(prompt);
      setContent(result.replace(/```python/g, '').replace(/```/g, '').trim());
    } catch (e: any) {
      if (e.message === "MISSING_KEY") {
        setKeyError(true);
      } else {
        setContent("Error generating code logic. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border border-indigo-100 rounded-2xl overflow-hidden shadow-sm">
      <button 
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) fetchCode(); }}
        className="w-full flex items-center justify-between p-5 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 transition-colors"
      >
        <span className="flex items-center gap-3 font-black text-sm uppercase tracking-tight">
          <Sparkles size={18} className="text-indigo-500" />
          {isOpen ? `Hide ${topic}` : `Explain ${topic} with Gemini`}
        </span>
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      
      {isOpen && (
        <div className="p-6 bg-gray-900 text-gray-100 font-mono text-xs overflow-x-auto relative min-h-[140px] scrollbar-hide">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-indigo-300">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="font-sans font-bold uppercase tracking-widest text-[10px]">Thinking...</p>
            </div>
          ) : keyError ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Key size={32} className="text-rose-400 mb-3" />
              <p className="font-sans text-gray-400 mb-4">API Key Required for AI content.</p>
              <button 
                onClick={fetchCode}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
              >
                Connect Key
              </button>
            </div>
          ) : (
            <pre className="leading-relaxed whitespace-pre">{content}</pre>
          )}
        </div>
      )}
    </div>
  );
};
