
import React, { useState } from 'react';
import { Card } from './Layout';
import { Node, Edge } from './TreeVisuals';
import { RotateCcw, ShieldCheck, Info, ArrowRight, Activity, Zap } from 'lucide-react';

export const AVLExplainer = () => {
  const [caseType, setCaseType] = useState<'LL' | 'RR' | 'LR' | 'RL'>('LL');
  const [isBalanced, setIsBalanced] = useState(false);

  const scenarios = {
    LL: {
      title: "Left-Left (LL) Case",
      concept: "A straight line heavy on the left. The root is imbalanced by its left-left grandchild.",
      mechanism: "Perform a single Right Rotation. Imagine 'pulling down' the root to the right; the left child rises to become the new parent.",
      example: "Insert 30, then 20, then 10. 30 becomes imbalanced.",
      unbalanced: [
        { id: '30', x: 200, y: 50, p: null, bf: 2 },
        { id: '20', x: 120, y: 120, p: '30', bf: 1 },
        { id: '10', x: 60, y: 190, p: '20', bf: 0 },
      ],
      balanced: [
        { id: '20', x: 200, y: 50, p: null, bf: 0 },
        { id: '10', x: 120, y: 120, p: '20', bf: 0 },
        { id: '30', x: 280, y: 120, p: '20', bf: 0 },
      ]
    },
    RR: {
      title: "Right-Right (RR) Case",
      concept: "A straight line heavy on the right. The root is imbalanced by its right-right grandchild.",
      mechanism: "Perform a single Left Rotation. The right child is pulled 'up' to the root, pushing the old root down to the left.",
      example: "Insert 10, then 20, then 30. 10 becomes imbalanced.",
      unbalanced: [
        { id: '10', x: 200, y: 50, p: null, bf: -2 },
        { id: '20', x: 280, y: 120, p: '10', bf: -1 },
        { id: '30', x: 340, y: 190, p: '20', bf: 0 },
      ],
      balanced: [
        { id: '20', x: 200, y: 50, p: null, bf: 0 },
        { id: '10', x: 120, y: 120, p: '20', bf: 0 },
        { id: '30', x: 280, y: 120, p: '20', bf: 0 },
      ]
    },
    LR: {
      title: "Left-Right (LR) Case",
      concept: "A zig-zag (dog-leg) to the left. The child leans right, while the root leans left.",
      mechanism: "Requires two steps: First, a Left Rotation on the child to transform it into an LL case, then a Right Rotation on the root.",
      example: "Insert 30, then 10, then 20. 30 is imbalanced, but 10 is right-heavy.",
      unbalanced: [
        { id: '30', x: 200, y: 50, p: null, bf: 2 },
        { id: '10', x: 120, y: 120, p: '30', bf: -1 },
        { id: '20', x: 180, y: 190, p: '10', bf: 0 },
      ],
      balanced: [
        { id: '20', x: 200, y: 50, p: null, bf: 0 },
        { id: '10', x: 120, y: 120, p: '20', bf: 0 },
        { id: '30', x: 280, y: 120, p: '20', bf: 0 },
      ]
    },
    RL: {
      title: "Right-Left (RL) Case",
      concept: "A zig-zag to the right. The child leans left, while the root leans right.",
      mechanism: "Double rotation: First, a Right Rotation on the child to make it an RR case, then a Left Rotation on the root.",
      example: "Insert 10, then 30, then 20. 10 is imbalanced, but 30 is left-heavy.",
      unbalanced: [
        { id: '10', x: 200, y: 50, p: null, bf: -2 },
        { id: '30', x: 280, y: 120, p: '10', bf: 1 },
        { id: '20', x: 220, y: 190, p: '30', bf: 0 },
      ],
      balanced: [
        { id: '20', x: 200, y: 50, p: null, bf: 0 },
        { id: '10', x: 120, y: 120, p: '20', bf: 0 },
        { id: '30', x: 280, y: 120, p: '20', bf: 0 },
      ]
    }
  };

  const current = scenarios[caseType];
  const nodes = isBalanced ? current.balanced : current.unbalanced;

  return (
    <Card title="Rotation Logic & BF Explained" subtitle="Master how Balance Factors trigger specific rotations.">
      <div className="mb-10 p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex flex-col md:flex-row gap-6 items-center">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-indigo-100 flex items-center justify-center">
          <Activity size={40} className="text-indigo-600" />
        </div>
        <div>
          <h4 className="text-xl font-black text-indigo-900 mb-2">What is the Balance Factor (BF)?</h4>
          <p className="text-indigo-700 font-medium leading-relaxed">
            BF = <span className="font-black">Height(Left Subtree) - Height(Right Subtree)</span>. 
            In an AVL tree, every node must have a BF of <span className="underline">-1, 0, or 1</span>. 
            If BF is 2 or -2, the tree is "skewed" and requires rotation to fix the height.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 bg-gray-50 p-2 rounded-2xl w-fit border border-gray-100">
        {(Object.keys(scenarios) as Array<keyof typeof scenarios>).map(key => (
          <button
            key={key}
            onClick={() => { setCaseType(key); setIsBalanced(false); }}
            className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all ${caseType === key ? 'bg-white text-indigo-700 shadow-md border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {key} Case
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-inner p-10 min-h-[300px] flex items-center justify-center relative">
            <svg viewBox="0 0 400 250" className="w-full h-auto overflow-visible">
               {nodes.map(n => {
                 if (n.p === null) return null;
                 const parent = nodes.find(p => p.id === n.p);
                 return <Edge key={`e-${n.id}`} x1={parent!.x} y1={parent!.y} x2={n.x} y2={n.y} />;
               })}
               {nodes.map(n => (
                  <Node key={n.id} x={n.x} y={n.y} value={n.id} highlight={Math.abs(n.bf) > 1} label={`BF: ${n.bf}`} />
               ))}
            </svg>
          </div>
          <button
            onClick={() => setIsBalanced(!isBalanced)}
            className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl ${isBalanced ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 shadow-amber-50' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'}`}
          >
            {isBalanced ? <><RotateCcw size={22}/> Reset to Unbalanced</> : <><ShieldCheck size={22}/> Apply Balance Rotation</>}
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-3xl font-black text-gray-900 mb-2">{current.title}</h3>
            <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4">Scenario: {current.example}</p>
            <div className="h-1.5 w-20 bg-indigo-600 rounded-full mb-6"></div>
            
            <div className="space-y-6">
               <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem]">
                 <h4 className="font-black text-rose-800 text-sm uppercase tracking-widest mb-2">The Concept</h4>
                 <p className="text-rose-700 leading-relaxed font-medium">{current.concept}</p>
               </div>

               <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem]">
                 <h4 className="font-black text-emerald-800 text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                   <Zap size={16} /> How it works
                 </h4>
                 <p className="text-emerald-700 leading-relaxed font-medium">{current.mechanism}</p>
               </div>
            </div>
          </div>
          
          <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
             <h4 className="font-black text-gray-900 flex items-center gap-2">
               <Info size={18} /> Pro Tip
             </h4>
             <p className="text-sm text-gray-500 font-medium leading-relaxed">
               Rotations are O(1) time complexity operations. They only involve changing 3 pointers 
               (parent, left, and right). This keeps AVL trees fast for both search and update.
             </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
