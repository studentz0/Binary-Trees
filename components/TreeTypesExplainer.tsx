
import React, { useState, useMemo } from 'react';
import { Card } from './Layout';
import { Node, Edge } from './TreeVisuals';
import { Check, X, Move } from 'lucide-react';

export const TreeTypesExplainer = () => {
  const [activeTab, setActiveTab] = useState<'full' | 'complete' | 'perfect'>('full');
  const [customInput, setCustomInput] = useState<string>("1, 2, 3, 4, 5");

  const treeDefinitions = {
    full: {
      title: "Full",
      desc: "Every node has 0 or 2 children.",
      example: [
        { id: 1, x: 200, y: 40, p: null },
        { id: 2, x: 110, y: 100, p: 1 },
        { id: 3, x: 290, y: 100, p: 1 },
        { id: 4, x: 60, y: 160, p: 2 },
        { id: 5, x: 160, y: 160, p: 2 },
      ]
    },
    complete: {
      title: "Complete",
      desc: "Levels filled top-to-bottom, left-to-right.",
      example: [
        { id: 1, x: 200, y: 40, p: null },
        { id: 2, x: 110, y: 100, p: 1 },
        { id: 3, x: 290, y: 100, p: 1 },
        { id: 4, x: 60, y: 160, p: 2 },
        { id: 5, x: 160, y: 160, p: 2 },
        { id: 6, x: 240, y: 160, p: 3 },
      ]
    },
    perfect: {
      title: "Perfect",
      desc: "All levels are completely filled.",
      example: [
        { id: 1, x: 200, y: 40, p: null },
        { id: 2, x: 110, y: 100, p: 1 },
        { id: 3, x: 290, y: 100, p: 1 },
        { id: 4, x: 60, y: 160, p: 2 },
        { id: 5, x: 160, y: 160, p: 2 },
        { id: 6, x: 240, y: 160, p: 3 },
        { id: 7, x: 340, y: 160, p: 3 },
      ]
    }
  };

  const customTree = useMemo(() => {
    const values = customInput.split(',').map(v => v.trim()).filter(v => v !== "");
    const nodes: any[] = [];
    const positions = [
      { x: 200, y: 40, p: null },
      { x: 110, y: 100, p: 0 }, { x: 290, y: 100, p: 0 },
      { x: 60, y: 160, p: 1 }, { x: 160, y: 160, p: 1 },
      { x: 240, y: 160, p: 2 }, { x: 340, y: 160, p: 2 }
    ];
    values.slice(0, 7).forEach((val, idx) => {
      nodes.push({ id: idx + 1, val, x: positions[idx].x, y: positions[idx].y, p: positions[idx].p !== null ? positions[idx].p! + 1 : null });
    });
    let isFull = nodes.length > 0;
    nodes.forEach(n => {
      const children = nodes.filter(c => c.p === n.id);
      if (children.length === 1) isFull = false;
    });
    const isPerfect = (nodes.length === 1 || nodes.length === 3 || nodes.length === 7);
    return { nodes, isFull, isComplete: true, isPerfect };
  }, [customInput]);

  return (
    <div className="space-y-6 sm:space-y-16">
      <Card title="Structural Definitions" subtitle="Select a type to see architecture rules.">
        <div className="overflow-x-auto scrollbar-hide mb-6 -mx-1 px-1">
          <div className="flex bg-gray-100 p-1 rounded-xl w-max sm:w-auto min-w-full sm:max-w-xs sm:mx-auto">
            {(Object.keys(treeDefinitions) as Array<keyof typeof treeDefinitions>).map(key => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 min-w-[100px] px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === key ? 'bg-white text-blue-600 shadow-md' : 'text-gray-400'}`}
              >
                {treeDefinitions[key].title}
              </button>
            ))}
          </div>
        </div>
        <p className="text-center text-base sm:text-2xl text-gray-900 font-black mb-8">{treeDefinitions[activeTab].desc}</p>
        <div className="bg-gray-50/50 rounded-xl sm:rounded-[3rem] border border-gray-100 p-4 sm:p-10 overflow-x-auto scrollbar-hide relative group">
            <div className="min-w-[320px] flex justify-center">
              <svg viewBox="0 0 400 210" className="w-full h-auto max-w-[400px] overflow-visible">
                {treeDefinitions[activeTab].example.map((n: any) => {
                  if (n.p === null) return null;
                  const parent = treeDefinitions[activeTab].example.find(p => p.id === n.p);
                  return <Edge key={`e-${n.id}`} x1={parent!.x} y1={parent!.y} x2={n.x} y2={n.y} />;
                })}
                {treeDefinitions[activeTab].example.map((n: any) => (
                  <Node key={`n-${n.id}`} x={n.x} y={n.y} value={n.id} type={n.p === null ? 'root' : 'default'} />
                ))}
              </svg>
            </div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 lg:hidden bg-gray-900/10 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1.5 text-[8px] font-bold text-gray-500 uppercase border border-white/20">
              <Move size={8} /> Swipe
            </div>
        </div>
      </Card>

      <Card title="Structural Auditor" subtitle="Verify properties as you type.">
        <div className="mb-6">
          <input 
            type="text" 
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-4 text-sm sm:text-2xl font-black outline-none focus:border-blue-400 transition-all"
            placeholder="A, B, C"
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="bg-gray-50 rounded-xl sm:rounded-[3rem] border border-gray-100 p-4 sm:p-10 overflow-x-auto scrollbar-hide relative">
                <div className="min-w-[300px] flex justify-center">
                  <svg viewBox="0 0 400 210" className="w-full h-auto max-w-sm overflow-visible">
                      {customTree.nodes.map(n => {
                      if (n.p === null) return null;
                      const parent = customTree.nodes.find(p => p.id === n.p);
                      if (!parent) return null;
                      return <Edge key={`e-${n.id}`} x1={parent.x} y1={parent.y} x2={n.x} y2={n.y} />;
                      })}
                      {customTree.nodes.map(n => <Node key={`n-${n.id}`} x={n.x} y={n.y} value={n.val} type={n.p === null ? 'root' : 'default'} />)}
                  </svg>
                </div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 lg:hidden bg-gray-900/10 px-2 py-1 rounded-full flex items-center gap-1.5 text-[8px] font-bold text-gray-500 uppercase">
                  <Move size={8} /> Scroll Tree
                </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
             {[
               { label: 'Full', check: customTree.isFull },
               { label: 'Complete', check: customTree.isComplete },
               { label: 'Perfect', check: customTree.isPerfect }
             ].map((item, idx) => (
               <div key={idx} className={`px-4 py-3 rounded-lg border-2 flex items-center justify-between font-black text-[10px] sm:text-base uppercase tracking-tight ${item.check ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-700 opacity-60'}`}>
                  <span>{item.label} Tree</span>
                  {item.check ? <Check size={14} /> : <X size={14} />}
               </div>
             ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
