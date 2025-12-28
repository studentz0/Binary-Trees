
import React, { useState, useMemo } from 'react';
import { Card } from './Layout';
import { Node, Edge } from './TreeVisuals';
import { Check, X, RotateCcw, Move } from 'lucide-react';

export const TreeTypesExplainer = () => {
  const [activeTab, setActiveTab] = useState<'full' | 'complete' | 'perfect'>('full');
  const [customInput, setCustomInput] = useState<string>("1, 2, 3, 4, 5");

  const treeDefinitions = {
    full: {
      title: "Full",
      desc: "Every node has 0 or 2 children. No single children allowed.",
      example: [
        { id: 1, x: 200, y: 40, p: null },
        { id: 2, x: 100, y: 100, p: 1 },
        { id: 3, x: 300, y: 100, p: 1 },
        { id: 4, x: 50, y: 160, p: 2 },
        { id: 5, x: 150, y: 160, p: 2 },
      ]
    },
    complete: {
      title: "Complete",
      desc: "Levels are filled top-to-bottom, left-to-right, without gaps.",
      example: [
        { id: 1, x: 200, y: 40, p: null },
        { id: 2, x: 100, y: 100, p: 1 },
        { id: 3, x: 300, y: 100, p: 1 },
        { id: 4, x: 50, y: 160, p: 2 },
        { id: 5, x: 150, y: 160, p: 2 },
        { id: 6, x: 250, y: 160, p: 3 },
      ]
    },
    perfect: {
      title: "Perfect",
      desc: "All levels are filled. Internal nodes have 2 children, leaves are uniform.",
      example: [
        { id: 1, x: 200, y: 40, p: null },
        { id: 2, x: 100, y: 100, p: 1 },
        { id: 3, x: 300, y: 100, p: 1 },
        { id: 4, x: 50, y: 160, p: 2 },
        { id: 5, x: 150, y: 160, p: 2 },
        { id: 6, x: 250, y: 160, p: 3 },
        { id: 7, x: 350, y: 160, p: 3 },
      ]
    }
  };

  const customTree = useMemo(() => {
    const values = customInput.split(',').map(v => v.trim()).filter(v => v !== "");
    const nodes: any[] = [];
    const positions = [
      { x: 200, y: 40, p: null },
      { x: 100, y: 100, p: 0 }, { x: 300, y: 100, p: 0 },
      { x: 50, y: 160, p: 1 }, { x: 150, y: 160, p: 1 },
      { x: 250, y: 160, p: 2 }, { x: 350, y: 160, p: 2 }
    ];

    values.slice(0, 7).forEach((val, idx) => {
      nodes.push({ id: idx + 1, val, x: positions[idx].x, y: positions[idx].y, p: positions[idx].p !== null ? positions[idx].p! + 1 : null });
    });

    let isFull = true;
    let isComplete = true;
    let isPerfect = true;

    if (nodes.length === 0) return { nodes: [], isFull: false, isComplete: false, isPerfect: false };

    nodes.forEach(n => {
      const children = nodes.filter(c => c.p === n.id);
      if (children.length === 1) isFull = false;
    });

    isPerfect = (nodes.length === 1 || nodes.length === 3 || nodes.length === 7);

    return { nodes, isFull, isComplete, isPerfect };
  }, [customInput]);

  return (
    <div className="space-y-10 sm:space-y-20">
      <Card title="Structural Definitions" subtitle="Toggle types to see strict architectural requirements.">
        <div className="flex bg-gray-100/80 p-1.5 rounded-2xl mb-8 border border-gray-100 max-w-sm mx-auto shadow-inner">
          {(Object.keys(treeDefinitions) as Array<keyof typeof treeDefinitions>).map(key => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-3 text-xs sm:text-sm font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === key ? 'bg-white text-blue-600 shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {treeDefinitions[key].title}
            </button>
          ))}
        </div>
        <div className="text-center mb-10 px-6">
          <p className="text-xl sm:text-3xl text-gray-900 font-black leading-tight tracking-tight text-balance">{treeDefinitions[activeTab].desc}</p>
        </div>
        <div className="bg-white rounded-[2rem] sm:rounded-[4rem] border border-gray-100 shadow-inner p-6 sm:p-12 max-w-2xl mx-auto overflow-x-auto scrollbar-hide">
          <div className="min-w-[440px]">
            <svg viewBox="0 0 400 200" className="w-full h-auto drop-shadow-2xl overflow-visible">
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
        </div>
        <div className="mt-4 flex justify-center lg:hidden">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                <Move size={12} /> Slide to view full tree
            </div>
        </div>
      </Card>

      <Card title="Live Structural Auditor" subtitle="Enter level-order values to live-verify tree properties.">
        <div className="mb-10">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">
              Sequence (Level Order, Max 7)
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-5 text-xl sm:text-2xl font-black focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder:text-gray-200"
              placeholder="e.g. A, B, C"
            />
            <button 
              onClick={() => setCustomInput("1, 2, 3, 4, 5, 6, 7")} 
              className="px-8 py-5 bg-white border-2 border-gray-100 rounded-2xl text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 shadow-sm"
            >
              <RotateCcw size={18} /> Reset
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
          <div className="bg-white rounded-[2.5rem] sm:rounded-[4rem] border border-gray-100 shadow-inner p-6 sm:p-12 flex items-center justify-center min-h-[250px] overflow-x-auto scrollbar-hide">
             <div className="min-w-[340px]">
                <svg viewBox="0 0 400 200" className="w-full h-auto overflow-visible">
                    {customTree.nodes.map(n => {
                    if (n.p === null) return null;
                    const parent = customTree.nodes.find(p => p.id === n.p);
                    if (!parent) return null;
                    return <Edge key={`e-${n.id}`} x1={parent.x} y1={parent.y} x2={n.x} y2={n.y} />;
                    })}
                    {customTree.nodes.map(n => <Node key={`n-${n.id}`} x={n.x} y={n.y} value={n.val} type={n.p === null ? 'root' : 'default'} />)}
                </svg>
             </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
             {[
               { label: 'Full Binary Tree', check: customTree.isFull },
               { label: 'Complete Binary Tree', check: customTree.isComplete },
               { label: 'Perfect Binary Tree', check: customTree.isPerfect }
             ].map((item, idx) => (
               <div key={idx} className={`p-6 sm:p-8 rounded-[2rem] border-2 flex items-center justify-between font-black text-sm sm:text-xl uppercase tracking-tight transition-all ${item.check ? 'bg-emerald-50 border-emerald-100 text-emerald-800 shadow-lg shadow-emerald-50' : 'bg-rose-50 border-rose-100 text-rose-700 opacity-60 grayscale-[0.5]'}`}>
                  <span>{item.label}</span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.check ? 'bg-emerald-500 text-white shadow-lg' : 'bg-rose-500 text-white'}`}>
                    {item.check ? <Check size={20} /> : <X size={20} />}
                  </div>
               </div>
             ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
