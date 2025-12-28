
import React, { useState, useEffect, useMemo } from 'react';
import { Node, Edge } from './TreeVisuals';
import { Play, RotateCcw, Pause, Plus } from 'lucide-react';

export const TraversalDemo = () => {
  const [traversalType, setTraversalType] = useState<'preorder' | 'inorder' | 'postorder'>('inorder');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [customInput, setCustomInput] = useState<string>("A, B, C, D, E, F, G");

  const nodes = useMemo(() => {
    const values = customInput.split(',').map(v => v.trim()).filter(v => v !== "");
    const res: any[] = [];
    const positions = [
      { x: 200, y: 40, p: null },
      { x: 100, y: 100, p: 0 }, { x: 300, y: 100, p: 0 },
      { x: 50, y: 160, p: 1 }, { x: 150, y: 160, p: 1 },
      { x: 250, y: 160, p: 2 }, { x: 350, y: 160, p: 2 }
    ];

    values.slice(0, 7).forEach((val, idx) => {
      res.push({ id: idx + 1, val, x: positions[idx].x, y: positions[idx].y, p: positions[idx].p !== null ? positions[idx].p! + 1 : null });
    });
    return res;
  }, [customInput]);

  const sequence = useMemo(() => {
    const seq: number[] = [];
    const traverse = (idx: number) => {
      if (idx >= nodes.length) return;
      
      if (traversalType === 'preorder') seq.push(nodes[idx].id);
      traverse(2 * idx + 1);
      if (traversalType === 'inorder') seq.push(nodes[idx].id);
      traverse(2 * idx + 2);
      if (traversalType === 'postorder') seq.push(nodes[idx].id);
    };
    if (nodes.length > 0) traverse(0);
    return seq;
  }, [nodes, traversalType]);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep(prev => {
          if (prev >= sequence.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, sequence]);

  const reset = () => {
    setIsPlaying(false);
    setActiveStep(-1);
  };

  const currentNodeId = activeStep >= 0 ? sequence[activeStep] : null;

  return (
    <div className="space-y-12">
      <div className="mb-8">
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            Build Your Tree (Level Order)
        </label>
        <div className="flex gap-4">
          <input 
            type="text" 
            value={customInput}
            onChange={(e) => { setCustomInput(e.target.value); reset(); }}
            className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-xl font-mono focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
            placeholder="A, B, C, D..."
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 bg-gray-50 p-2 rounded-2xl w-fit border border-gray-100 mx-auto">
        {(['preorder', 'inorder', 'postorder'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTraversalType(t); reset(); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-black capitalize transition-all ${traversalType === t ? 'bg-white text-blue-700 shadow-md border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {t}
          </button>
        ))}
      </div>
      
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-inner border border-gray-50 flex items-center justify-center min-h-[300px]">
          <svg viewBox="0 0 400 200" className="w-full h-auto overflow-visible">
            {nodes.map(n => {
               if (n.p === null) return null;
               const parent = nodes.find(p => p.id === n.p);
               if (!parent) return null;
               const isPathActive = activeStep >= 0 && 
                  sequence.indexOf(n.id) <= activeStep && 
                  sequence.indexOf(parent.id) <= activeStep;
               return <Edge key={`e-${n.id}`} x1={parent.x} y1={parent.y} x2={n.x} y2={n.y} highlight={isPathActive} />;
            })}
            {nodes.map(n => (
              <Node 
                key={`n-${n.id}`} x={n.x} y={n.y} value={n.val} 
                highlight={n.id === currentNodeId}
                type={sequence.indexOf(n.id) < activeStep ? 'leaf' : 'default'}
              />
            ))}
          </svg>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-sm">
            <h4 className="font-black text-gray-900 mb-6 text-2xl capitalize">{traversalType} Path</h4>
            <div className="flex flex-wrap items-center gap-3">
               {sequence.map((id, idx) => {
                 const isActive = idx === activeStep;
                 const isPassed = idx < activeStep;
                 const node = nodes.find(n => n.id === id);
                 return (
                    <div key={idx} className="flex items-center">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono text-xl font-black transition-all duration-500 ${isActive ? 'bg-blue-600 text-white scale-125 shadow-xl rotate-3' : isPassed ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-white text-gray-300 border border-gray-100'}`}>
                        {node?.val || '?'}
                      </div>
                      {idx < sequence.length - 1 && <div className={`h-0.5 w-4 mx-1 ${isPassed ? 'bg-emerald-200' : 'bg-gray-100'}`} />}
                    </div>
                 );
               })}
            </div>
          </div>

          <div className="flex gap-4">
             <button 
               onClick={() => setIsPlaying(!isPlaying)}
               className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-lg transition-all shadow-xl ${isPlaying ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}
             >
               {isPlaying ? <><Pause size={24} /> Pause</> : activeStep >= sequence.length - 1 ? <><RotateCcw size={24} /> Replay</> : <><Play size={24} /> Start Animation</>}
             </button>
             <button onClick={reset} className="p-5 text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-gray-600 rounded-2xl transition-all border border-gray-100 shadow-sm"><RotateCcw size={24} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
