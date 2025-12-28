import React, { useState, useEffect, useMemo } from 'react';
import { Node, Edge } from './TreeVisuals';
import { Play, RotateCcw, Pause } from 'lucide-react';

export const TraversalDemo = () => {
  const [traversalType, setTraversalType] = useState<'preorder' | 'inorder' | 'postorder'>('inorder');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [customInput, setCustomInput] = useState<string>("A, B, C, D, E");

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
      }, 800);
    }
    return () => clearInterval(timer);
  }, [isPlaying, sequence]);

  const reset = () => {
    setIsPlaying(false);
    setActiveStep(-1);
  };

  const currentNodeId = activeStep >= 0 ? sequence[activeStep] : null;

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="mb-6 sm:mb-8">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">
            Build Tree (Level Order)
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input 
            type="text" 
            value={customInput}
            onChange={(e) => { setCustomInput(e.target.value); reset(); }}
            className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 sm:py-4 text-base sm:text-xl font-mono focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
            placeholder="A, B, C..."
          />
        </div>
      </div>

      <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-100 mx-auto w-full max-w-sm">
        {(['preorder', 'inorder', 'postorder'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTraversalType(t); reset(); }}
            className={`flex-1 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-sm font-black capitalize transition-all ${traversalType === t ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {t}
          </button>
        ))}
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-10 shadow-inner border border-gray-50 flex items-center justify-center min-h-[200px] sm:min-h-[300px] overflow-hidden">
          <svg viewBox="0 0 400 200" className="w-full h-auto overflow-visible max-w-[320px]">
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

        <div className="space-y-6 sm:space-y-8">
          <div className="p-5 sm:p-8 bg-gray-50 rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-sm">
            <h4 className="font-black text-gray-900 mb-4 sm:mb-6 text-lg sm:text-2xl capitalize leading-tight">{traversalType} Path</h4>
            <div className="flex flex-wrap items-center gap-2">
               {sequence.map((id, idx) => {
                 const isActive = idx === activeStep;
                 const isPassed = idx < activeStep;
                 const node = nodes.find(n => n.id === id);
                 return (
                    <div key={idx} className="flex items-center">
                      <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center font-mono text-sm sm:text-xl font-black transition-all duration-500 ${isActive ? 'bg-blue-600 text-white scale-110 shadow-lg' : isPassed ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-white text-gray-300 border border-gray-100'}`}>
                        {node?.val || '?'}
                      </div>
                      {idx < sequence.length - 1 && <div className={`h-px w-2 sm:w-4 mx-0.5 sm:mx-1 ${isPassed ? 'bg-emerald-200' : 'bg-gray-100'}`} />}
                    </div>
                 );
               })}
            </div>
          </div>

          <div className="flex gap-2 sm:gap-4">
             <button 
               onClick={() => setIsPlaying(!isPlaying)}
               className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg transition-all shadow-lg active:scale-95 ${isPlaying ? 'bg-amber-100 text-amber-700' : 'bg-blue-600 text-white'}`}
             >
               {isPlaying ? <><Pause size={20} /> Pause</> : activeStep >= sequence.length - 1 ? <><RotateCcw size={20} /> Replay</> : <><Play size={20} /> Play</>}
             </button>
             <button onClick={reset} className="p-4 sm:p-5 text-gray-400 bg-gray-50 hover:bg-gray-100 rounded-xl sm:rounded-2xl border border-gray-100 active:scale-95"><RotateCcw size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
