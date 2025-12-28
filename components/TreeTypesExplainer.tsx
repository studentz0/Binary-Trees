import React, { useState, useMemo } from 'react';
import { Card } from './Layout';
import { Node, Edge } from './TreeVisuals';
import { Check, X, RotateCcw } from 'lucide-react';

export const TreeTypesExplainer = () => {
  const [activeTab, setActiveTab] = useState<'full' | 'complete' | 'perfect'>('full');
  const [customInput, setCustomInput] = useState<string>("1, 2, 3, 4, 5");

  const treeDefinitions = {
    full: {
      title: "Full",
      desc: "Every node has either 0 or 2 children. Never just 1 child.",
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
      desc: "Levels are filled left-to-right, no gaps allowed in the hierarchy.",
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
      desc: "All internal nodes have 2 children and leaves are at the same depth.",
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

    isComplete = nodes.length > 0;
    // Basic logic for current playground size
    isPerfect = (nodes.length === 1 || nodes.length === 3 || nodes.length === 7);

    return { nodes, isFull, isComplete, isPerfect };
  }, [customInput]);

  return (
    <div className="space-y-8 sm:space-y-12">
      <Card title="Quick Comparison" subtitle="Select a type to see its definition and an example.">
        <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100 mb-6">
          {(Object.keys(treeDefinitions) as Array<keyof typeof treeDefinitions>).map(key => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-3 text-xs sm:text-sm font-black rounded-lg transition-all ${activeTab === key ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {treeDefinitions[key].title}
            </button>
          ))}
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h4 className="text-xl font-black text-gray-900">{treeDefinitions[activeTab].title} Binary Tree</h4>
            <p className="text-gray-600 font-medium leading-relaxed">{treeDefinitions[activeTab].desc}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 flex justify-center overflow-hidden">
            <svg viewBox="0 0 400 200" className="w-full h-auto max-w-[320px] overflow-visible">
              {treeDefinitions[activeTab].example.map(n => {
                if (n.p === null) return null;
                const parent = treeDefinitions[activeTab].example.find(p => p.id === n.p);
                return <Edge key={`ex-e-${n.id}`} x1={parent!.x} y1={parent!.y} x2={n.x} y2={n.y} />;
              })}
              {treeDefinitions[activeTab].example.map(n => (
                <Node key={`ex-n-${n.id}`} x={n.x} y={n.y} value={n.id} type={n.p === null ? 'root' : 'default'} />
              ))}
            </svg>
          </div>
        </div>
      </Card>

      <Card title="Property Tester" subtitle="Add values to level-order to test properties.">
        <div className="mb-8">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Tree Nodes (Comma Separated)
          </label>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-lg sm:text-xl font-mono focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
              placeholder="1, 2, 3..."
            />
            <button 
              onClick={() => setCustomInput("1, 2, 3, 4, 5, 6, 7")}
              className="p-3 sm:p-4 bg-white border-2 border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
              title="Reset to Perfect"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-inner p-6 sm:p-8 flex items-center justify-center min-h-[240px] sm:min-h-[300px]">
             <svg viewBox="0 0 400 200" className="w-full h-auto max-w-[400px] overflow-visible">
              {customTree.nodes.map(n => {
                 if (n.p === null) return null;
                 const parent = customTree.nodes.find(p => p.id === n.p);
                 if (!parent) return null;
                 return <Edge key={`c-e-${n.id}`} x1={parent.x} y1={parent.y} x2={n.x} y2={n.y} />;
              })}
              {customTree.nodes.map(n => (
                <Node key={`c-n-${n.id}`} x={n.x} y={n.y} value={n.val} type={n.p === null ? 'root' : 'default'} />
              ))}
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
             <div className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${customTree.isFull ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                <span className="font-black text-sm uppercase tracking-wide">Is Full?</span>
                {customTree.isFull ? <Check size={20} /> : <X size={20} />}
             </div>
             <div className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${customTree.isComplete ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                <span className="font-black text-sm uppercase tracking-wide">Is Complete?</span>
                {customTree.isComplete ? <Check size={20} /> : <X size={20} />}
             </div>
             <div className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${customTree.isPerfect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                <span className="font-black text-sm uppercase tracking-wide">Is Perfect?</span>
                {customTree.isPerfect ? <Check size={20} /> : <X size={20} />}
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
};