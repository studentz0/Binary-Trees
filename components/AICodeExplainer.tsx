
import React, { useState } from 'react';
import { Sparkles, Loader2, ChevronDown, ChevronRight, Key } from 'lucide-react';
import { generateContent } from '../services/geminiService';

export const AICodeExplainer = ({ topic }: { topic: string }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);

  const handleKeySetup = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      setNeedsKey(false);
      fetchCode();
    }
  };

  const fetchCode = async () => {
    if (content) return;
    setLoading(true);
    setNeedsKey(false);
    try {
      const prompt = `Write a concise, clean implementation of ${topic} in Python. Include very brief comments. Output raw code only, no markdown formatting.`;
      const result = await generateContent(prompt);
      setContent(result.replace(/```python/g, '').replace(/```/g, '').trim());
    } catch (e: any) {
      if (e.message?.includes("API configuration")) {
        setNeedsKey(true);
      } else {
        setContent("Error generating code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border border-indigo-100 rounded-2xl overflow-hidden shadow-sm">
      <button 
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) fetchCode(); }}
        className="w-full flex items-center justify-between p-4 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 transition-colors"
      >
        <span className="flex items-center gap-2 font-bold text-sm">
          <Sparkles size={16} className="text-indigo-500" />
          {isOpen ? `Hide ${topic} Logic` : `Explain ${topic} with Gemini`}
        </span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      
      {isOpen && (
        <div className="p-6 bg-gray-900 text-gray-100 font-mono text-xs overflow-x-auto relative min-h-[120px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-indigo-300">
              <Loader2 className="animate-spin mb-2" size={24} />
              <p className="font-sans">Gemini is thinking...</p>
            </div>
          ) : needsKey ? (
            <div className="flex flex-col items-center justify-center py-4 text-center space-y-4">
              <p className="text-indigo-300 font-sans">API Key Required</p>
              <button 
                onClick={handleKeySetup}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
              >
                <Key size={16} /> Configure API Key
              </button>
            </div>
          ) : (
            <pre className="leading-relaxed">{content}</pre>
          )}
        </div>
      )}
    </div>
  );
};
