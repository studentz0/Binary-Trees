
import React, { useState, useMemo } from 'react';
import { Card } from './Layout';
import { Node, Edge } from './TreeVisuals';
import { Check, X, RotateCcw, Plus, Trash2 } from 'lucide-react';

export const TreeTypesExplainer = () => {
  const [activeTab, setActiveTab] = useState<'full' | 'complete' | 'perfect'>('full');
  const [customInput, setCustomInput] = useState<string>("1, 2, 3, 4, 5");

  const treeDefinitions = {
    full: {
      title: "Full Tree",
      desc: "Every node has either 0 or 2 children. Never just 1.",
      example: [
        { id: 1, x: 200, y: 40, p: null },
        { id: 2, x: 100, y: 100, p: 1 },
        { id: 3, x: 300, y: 100, p: 1 },
        { id: 4, x: 50, y: 160, p: 2 },
        { id: 5, x: 150, y: 160, p: 2 },
      ]
    },
    complete: {
      title: "Complete Tree",
      desc: "Levels filled left-to-right, no gaps allowed in levels.",
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
      title: "Perfect Tree",
      desc: "Completely symmetric; all leaves are at the max depth.",
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

    // Check properties
    let isFull = true;
    let isComplete = true;
    let isPerfect = true;

    if (nodes.length === 0) return { nodes: [], isFull: false, isComplete: false, isPerfect: false };

    nodes.forEach(n => {
      const children = nodes.filter(c => c.p === n.id);
      if (children.length === 1) isFull = false;
    });

    const maxId = nodes.length;
    // Complete check (sequential indices in level order) is simplified here for 7 slots
    isComplete = nodes.length > 0; // Simplified for visualizer slots
    isPerfect = (nodes.length === 1 || nodes.length === 3 || nodes.length === 7);

    return { nodes, isFull, isComplete, isPerfect };
  }, [customInput]);

  return (
    <div className="space-y-12">
      <Card title="Quick Comparison" subtitle="Select a type to see its definition and a standard example.">
        <div className="flex bg-gray-100/50 p-1.5 rounded-2xl mb-8 border border-gray-100 max-w-md mx-auto">
          {(Object.keys(treeDefinitions) as Array<keyof typeof treeDefinitions>).map(key => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === key ? 'bg-white text-blue-600 shadow-md' : 'text-gray-400 hover:text-gray-700'}`}
            >
              {treeDefinitions[key].title}
            </button>
          ))}
        </div>
        <div className="text-center mb-10">
          <p className="text-xl text-gray-700 font-semibold tracking-tight">{treeDefinitions[activeTab].desc}</p>
        </div>
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-inner p-10 max-w-2xl mx-auto">
          <svg viewBox="0 0 400 200" className="w-full h-auto drop-shadow-sm">
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
      </Card>

      <Card title="Custom Property Tester" subtitle="Input level-order values to see if your tree matches specific properties.">
        <div className="mb-8">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              Level Order Values (Max 7)
          </label>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-xl font-mono focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
              placeholder="1, 2, 3..."
            />
            <button onClick={() => setCustomInput("1, 2, 3, 4, 5, 6, 7")} className="px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all font-bold flex items-center gap-2">
              <RotateCcw size={18} /> Default
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-inner p-8 flex items-center justify-center min-h-[250px]">
             <svg viewBox="0 0 400 200" className="w-full h-auto">
                {customTree.nodes.map(n => {
                  if (n.p === null) return null;
                  const parent = customTree.nodes.find(p => p.id === n.p);
                  if (!parent) return null;
                  return <Edge key={`e-${n.id}`} x1={parent.x} y1={parent.y} x2={n.x} y2={n.y} />;
                })}
                {customTree.nodes.map(n => <Node key={`n-${n.id}`} x={n.x} y={n.y} value={n.val} type={n.p === null ? 'root' : 'default'} />)}
             </svg>
          </div>
          <div className="space-y-4">
             <div className={`p-4 rounded-2xl border-2 flex items-center justify-between font-bold ${customTree.isFull ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                <span>Full Tree</span>
                {customTree.isFull ? <Check size={20} /> : <X size={20} />}
             </div>
             <div className={`p-4 rounded-2xl border-2 flex items-center justify-between font-bold ${customTree.isComplete ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                <span>Complete Tree</span>
                {customTree.isComplete ? <Check size={20} /> : <X size={20} />}
             </div>
             <div className={`p-4 rounded-2xl border-2 flex items-center justify-between font-bold ${customTree.isPerfect ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                <span>Perfect Tree</span>
                {customTree.isPerfect ? <Check size={20} /> : <X size={20} />}
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
