
import React, { useState, useMemo, useRef } from 'react';
import { Card } from './Layout';
import { Node, Edge } from './TreeVisuals';
import { AlertTriangle, Plus, Trash2, HelpCircle, Zap, ArrowRight, CheckCircle2, Download, Move } from 'lucide-react';

interface BSTNode {
    val: number;
    left: BSTNode | null;
    right: BSTNode | null;
}

interface ImbalanceInfo {
  type: string;
  val: number;
  bf: number;
}

const ROTATION_CASES = [
    { id: 'LL', title: "LL Case", concept: "Heavy on left-left branch.", mechanism: "Single Right Rotation." },
    { id: 'RR', title: "RR Case", concept: "Heavy on right-right branch.", mechanism: "Single Left Rotation." },
    { id: 'LR', title: "LR Case", concept: "Zig-zag left-then-right.", mechanism: "Double Rotation (L then R)." },
    { id: 'RL', title: "RL Case", concept: "Zig-zag right-then-left.", mechanism: "Double Rotation (R then L)." }
];

const getHeight = (node: BSTNode | null | undefined): number => {
    if (!node) return 0;
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
};

const buildTree = (values: number[]): BSTNode | null => {
    if (!values.length) return null;
    const rootNode: BSTNode = { val: values[0], left: null, right: null };
    for (let i = 1; i < values.length; i++) {
        let current = rootNode;
        while (true) {
            if (values[i] < current.val) {
                if (!current.left) { current.left = { val: values[i], left: null, right: null }; break; }
                current = current.left;
            } else {
                if (!current.right) { current.right = { val: values[i], left: null, right: null }; break; }
                current = current.right;
            }
        }
    }
    return rootNode;
};

interface VisualNode { val: number; x: number; y: number; bf: number }
interface VisualData { renderedNodes: VisualNode[]; currentImbalance: ImbalanceInfo | null; svgEdges: React.ReactNode[]; }

export const AVLSandbox = () => {
    const [treeValues, setTreeValues] = useState<number[]>([]);
    const [inputVal, setInputVal] = useState("");
    const svgRef = useRef<SVGSVGElement>(null);

    const root = useMemo(() => buildTree(treeValues), [treeValues]);

    const downloadImage = () => {
      if (!svgRef.current) return;
      const svg = svgRef.current;
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svg);
      if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      const img = new Image();
      const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1400;
        canvas.height = 1200;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 100, 100, 1200, 1000);
          const pngUrl = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = `avl-balancing.png`;
          downloadLink.click();
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    };

    const handleApplyRotation = () => {
        const sorted = [...treeValues].sort((a, b) => a - b);
        const getBalancedOrder = (arr: number[]): number[] => {
            if (arr.length === 0) return [];
            const mid = Math.floor(arr.length / 2);
            const res = [arr[mid]];
            const left = getBalancedOrder(arr.slice(0, mid));
            const right = getBalancedOrder(arr.slice(mid + 1));
            const maxLen = Math.max(left.length, right.length);
            for(let i=0; i<maxLen; i++) {
                if(left[i] !== undefined) res.push(left[i]);
                if(right[i] !== undefined) res.push(right[i]);
            }
            return res;
        };
        setTreeValues(getBalancedOrder(sorted));
    };

    const visualization = useMemo<VisualData>(() => {
        const nodes: VisualNode[] = [];
        const edges: React.ReactNode[] = [];
        let detected: ImbalanceInfo | null = null;

        const layout = (node: BSTNode | null, x: number, y: number, level: number, availableWidth: number) => {
            if (!node) return;
            const offset = Math.max(availableWidth / 2, 36);
            const hl = getHeight(node.left);
            const hr = getHeight(node.right);
            const bf = hl - hr;
            
            if (Math.abs(bf) > 1 && !detected) {
                const lbf = getHeight(node.left?.left) - getHeight(node.left?.right);
                const rbf = getHeight(node.right?.left) - getHeight(node.right?.right);
                if (bf > 1) detected = { type: lbf >= 0 ? "LL" : "LR", val: node.val, bf };
                else detected = { type: rbf <= 0 ? "RR" : "RL", val: node.val, bf };
            }
            nodes.push({ val: node.val, x, y, bf });
            if (node.left) {
                edges.push(<Edge key={`${node.val}-l-${nodes.length}`} x1={x} y1={y} x2={x - offset} y2={y + 70} highlight={Math.abs(bf) > 1} />);
                layout(node.left, x - offset, y + 70, level + 1, offset);
            }
            if (node.right) {
                edges.push(<Edge key={`${node.val}-r-${nodes.length}`} x1={x} y1={y} x2={x + offset} y2={y + 70} highlight={Math.abs(bf) > 1} />);
                layout(node.right, x + offset, y + 70, level + 1, offset);
            }
        };

        if (root) layout(root, 350, 60, 1, 320);
        return { renderedNodes: nodes, currentImbalance: detected, svgEdges: edges };
    }, [root]);

    const { renderedNodes, currentImbalance, svgEdges } = visualization;

    const addValue = () => {
        const val = parseInt(inputVal);
        if (!isNaN(val)) {
            setTreeValues([...treeValues, val]);
            setInputVal("");
        }
    };

    return (
        <div className="space-y-4 sm:space-y-10">
            <Card title="Interactive AVL Balancing" subtitle="Insert nodes and verify factors.">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4 sm:mb-8">
                    <input 
                      type="number" 
                      value={inputVal} 
                      onChange={(e) => setInputVal(e.target.value)} 
                      placeholder="Val" 
                      className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 sm:w-44 font-black text-base focus:ring-4 focus:ring-blue-100 outline-none transition-all" 
                      onKeyDown={(e) => e.key === 'Enter' && addValue()} 
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={addValue} 
                        className="flex-1 sm:flex-none bg-blue-600 text-white px-5 py-3 rounded-xl font-black text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                          <Plus size={16}/> ADD
                      </button>
                      <button 
                        onClick={() => setTreeValues([])} 
                        className="flex-1 sm:flex-none bg-white text-gray-400 border-2 border-gray-100 px-5 py-3 rounded-xl font-black text-xs hover:text-rose-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                          <Trash2 size={16}/> CLEAR
                      </button>
                    </div>
                </div>

                <div className="relative group/avl overflow-hidden rounded-xl sm:rounded-[2rem] border-2 border-gray-100 bg-white shadow-inner">
                  <div className="w-full h-[300px] sm:h-[550px] overflow-auto flex items-start justify-center cursor-grab active:cursor-grabbing scrollbar-hide">
                      <div className="min-w-[700px] py-10 flex items-center justify-center">
                        <svg 
                          ref={svgRef} 
                          viewBox="0 0 700 600" 
                          className="w-full h-auto overflow-visible"
                        >
                            <g>{svgEdges}</g>
                            {renderedNodes.map((n, idx) => (
                                <Node key={`${n.val}-${idx}`} x={n.x} y={n.y} value={n.val} highlight={Math.abs(n.bf) > 1} label={`BF: ${n.bf}`} />
                            ))}
                        </svg>
                      </div>
                      {treeValues.length === 0 && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-2 p-4 text-center pointer-events-none">
                              <HelpCircle size={32} className="opacity-20" />
                              <p className="font-black uppercase tracking-widest text-[8px]">Empty Tree</p>
                          </div>
                      )}
                  </div>
                  
                  {treeValues.length > 0 && (
                    <div className="absolute bottom-2 right-2 sm:top-6 sm:right-6 sm:bottom-auto z-20">
                      <button 
                        onClick={downloadImage}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-100 shadow-xl rounded-xl text-gray-800 font-black text-[9px] uppercase tracking-tighter active:scale-95 group"
                      >
                        <Download size={14} className="text-blue-500" /> PNG
                      </button>
                    </div>
                  )}

                  <div className="absolute top-2 left-1/2 -translate-x-1/2 lg:hidden pointer-events-none bg-black/5 px-2 py-1 rounded-full flex items-center gap-1.5 text-[8px] font-bold text-gray-500 uppercase">
                     <Move size={10} /> Swipe View
                  </div>
                </div>

                {currentImbalance ? (
                    <div className="bg-rose-50 border-2 border-rose-100 rounded-xl sm:rounded-[2rem] p-4 sm:p-8 mt-4 sm:mt-8 space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-2 sm:gap-3 border-b border-rose-100 pb-3 sm:pb-4">
                            <div className="p-2 bg-rose-100 rounded-lg text-rose-600"><AlertTriangle size={18} /></div>
                            <div>
                                <h4 className="font-black text-rose-900 uppercase tracking-tighter text-xs sm:text-lg">Balance Needed</h4>
                                <p className="text-rose-700 font-bold text-[8px] sm:text-xs">Node {currentImbalance.val} is heavy (BF: {currentImbalance.bf})</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                            {ROTATION_CASES.map(rotation => {
                                const isRequired = currentImbalance.type === rotation.id;
                                return (
                                    <div key={rotation.id} className={`p-3 sm:p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${isRequired ? 'bg-white border-rose-400 shadow-xl scale-[1.02]' : 'bg-white/50 border-rose-100 opacity-60'}`}>
                                        <div className="mb-2 sm:mb-4">
                                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                                                <span className={`px-1.5 py-0.5 rounded-lg text-[8px] sm:text-[10px] font-black uppercase ${isRequired ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-700'}`}>{rotation.id}</span>
                                                {isRequired && <Zap size={12} className="text-rose-500" />}
                                            </div>
                                            <h5 className="font-black text-rose-900 mb-1 text-[10px] sm:text-sm leading-tight">{rotation.title}</h5>
                                            <p className="text-[8px] sm:text-[10px] text-rose-700 leading-tight font-medium">{rotation.concept}</p>
                                        </div>
                                        {isRequired && (
                                            <button 
                                              onClick={handleApplyRotation} 
                                              className="w-full py-2 bg-rose-600 text-white rounded-lg font-black text-[9px] uppercase flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
                                            >
                                                Fix <ArrowRight size={12} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : treeValues.length > 0 && (
                    <div className="bg-emerald-50 border-2 border-emerald-100 rounded-xl sm:rounded-[2rem] p-4 sm:p-6 mt-4 sm:mt-8 flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><CheckCircle2 size={20} /></div>
                        <div>
                            <h4 className="font-black text-emerald-900 uppercase tracking-tighter text-xs sm:text-lg">Stable AVL</h4>
                            <p className="text-emerald-700 font-bold text-[8px] sm:text-xs">Tree satisfies balance requirements.</p>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
