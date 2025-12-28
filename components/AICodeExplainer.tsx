import React, { useState } from 'react';
import { Sparkles, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { generateContent } from '../services/geminiService';

export const AICodeExplainer = ({ topic }: { topic: string }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCode = async () => {
    if (content) return;
    setLoading(true);
    try {
      const prompt = `Write a concise, high-quality Python implementation of ${topic} in a Binary Tree. Include brief comments explaining the logic. Do not include markdown code fences (like \`\`\`), just the raw code text.`;
      const result = await generateContent(prompt);
      setContent(result.replace(/```python/g, '').replace(/```/g, '').trim());
    } catch (e) {
      setContent("Error generating code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border border-indigo-100 rounded-2xl overflow-hidden shadow-sm">
      <button 
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) fetchCode(); }}
        className="w-full flex items-center justify-between p-4 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 transition-colors"
      >
        <span className="flex items-center gap-2 font-bold text-sm">
          <Sparkles size={16} className="text-indigo-500" />
          {isOpen ? `Hide ${topic} Logic` : `Explain ${topic} with Gemini`}
        </span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      
      {isOpen && (
        <div className="p-4 sm:p-6 bg-gray-900 text-gray-100 font-mono text-[10px] sm:text-xs overflow-x-auto relative min-h-[120px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-indigo-300">
              <Loader2 className="animate-spin mb-2" size={24} />
              <p className="font-sans text-xs">Gemini is writing code...</p>
            </div>
          ) : (
            <pre className="leading-relaxed whitespace-pre-wrap sm:whitespace-pre">{content}</pre>
          )}
        </div>
      )}
    </div>
  );
};