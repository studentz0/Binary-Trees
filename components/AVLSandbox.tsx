
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
        const outputWidth = 1600;
        const outputHeight = 1300;
        canvas.width = outputWidth;
        canvas.height = outputHeight;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Better centering with 15% padding
          const paddingFactor = 0.15;
          const targetWidth = canvas.width * (1 - paddingFactor * 2);
          const targetHeight = canvas.height * (1 - paddingFactor * 2);
          const xOffset = (canvas.width - targetWidth) / 2;
          const yOffset = (canvas.height - targetHeight) / 2;

          ctx.drawImage(img, xOffset, yOffset, targetWidth, targetHeight);
          
          const pngUrl = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = `avl-balancing-diagram.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
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
            const offset = Math.max(availableWidth / 2, 38);
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
                edges.push(<Edge key={`${node.val}-l-${nodes.length}`} x1={x} y1={y} x2={x - offset} y2={y + 80} highlight={Math.abs(bf) > 1} />);
                layout(node.left, x - offset, y + 80, level + 1, offset);
            }
            if (node.right) {
                edges.push(<Edge key={`${node.val}-r-${nodes.length}`} x1={x} y1={y} x2={x + offset} y2={y + 80} highlight={Math.abs(bf) > 1} />);
                layout(node.right, x + offset, y + 80, level + 1, offset);
            }
        };

        if (root) layout(root, 400, 80, 1, 360);
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
        <div className="space-y-6 sm:space-y-10">
            <Card title="Interactive AVL Balancing" subtitle="Insert numbers to see Balance Factors update. If BF > 1, apply rotations.">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 sm:mb-8">
                    <input 
                      type="number" 
                      value={inputVal} 
                      onChange={(e) => setInputVal(e.target.value)} 
                      placeholder="Insert Node" 
                      className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 sm:w-44 font-black text-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all" 
                      onKeyDown={(e) => e.key === 'Enter' && addValue()} 
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={addValue} 
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-black shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                          <Plus size={18}/> INSERT
                      </button>
                      <button 
                        onClick={() => setTreeValues([])} 
                        className="flex-1 sm:flex-none bg-white text-gray-400 hover:text-rose-600 hover:bg-rose-50 border-2 border-gray-100 px-6 py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                          <Trash2 size={18}/> CLEAR
                      </button>
                    </div>
                </div>

                <div className="relative group/avl overflow-hidden rounded-[2rem] border-2 border-gray-100 bg-white">
                  <div className="w-full h-[400px] sm:h-[550px] overflow-auto flex items-start justify-center cursor-grab active:cursor-grabbing scrollbar-thin scrollbar-thumb-gray-200">
                      <div className="min-w-[800px] py-12 px-6 flex items-center justify-center">
                        <svg 
                          ref={svgRef} 
                          viewBox="0 0 800 650" 
                          width="800" 
                          height="650"
                          className="w-full h-auto overflow-visible"
                        >
                            <rect width="800" height="650" fill="white" fillOpacity="0" />
                            <g>{svgEdges}</g>
                            {renderedNodes.map((n, idx) => (
                                <Node key={`${n.val}-${idx}`} x={n.x} y={n.y} value={n.val} highlight={Math.abs(n.bf) > 1} label={`BF: ${n.bf}`} />
                            ))}
                        </svg>
                      </div>
                      {treeValues.length === 0 && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-4 p-4 text-center pointer-events-none">
                              <HelpCircle size={48} className="text-gray-100" />
                              <p className="font-black uppercase tracking-widest text-xs">Waiting for nodes...</p>
                          </div>
                      )}
                  </div>
                  
                  {treeValues.length > 0 && (
                    <div className="absolute bottom-4 right-4 sm:top-6 sm:right-6 sm:bottom-auto z-20">
                      <button 
                        onClick={downloadImage}
                        className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 shadow-2xl rounded-2xl text-gray-800 font-black text-[11px] uppercase tracking-tighter hover:text-blue-600 hover:border-blue-100 transition-all active:scale-95 group"
                      >
                        <Download size={16} className="text-blue-500 group-hover:scale-110 transition-transform" /> 
                        <span>Download PNG</span>
                      </button>
                    </div>
                  )}

                  <div className="absolute top-4 left-1/2 -translate-x-1/2 lg:hidden pointer-events-none bg-black/5 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-white/20">
                     <Move size={12} /> Pan Area
                  </div>
                </div>

                {currentImbalance ? (
                    <div className="bg-rose-50 border-2 border-rose-100 rounded-[2rem] p-5 sm:p-8 mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-3 border-b border-rose-100 pb-4">
                            <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600"><AlertTriangle size={24} /></div>
                            <div>
                                <h4 className="font-black text-rose-900 uppercase tracking-tighter text-base sm:text-lg">Balance Required</h4>
                                <p className="text-rose-700 font-bold text-xs">Node {currentImbalance.val} is heavy on the {currentImbalance.type.startsWith('L') ? 'Left' : 'Right'} (BF: {currentImbalance.bf})</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            {ROTATION_CASES.map(rotation => {
                                const isRequired = currentImbalance.type === rotation.id;
                                return (
                                    <div key={rotation.id} className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${isRequired ? 'bg-white border-rose-400 shadow-xl ring-4 ring-rose-50 scale-[1.02]' : 'bg-white/50 border-rose-100 opacity-60'}`}>
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${isRequired ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-700'}`}>{rotation.id}</span>
                                                {isRequired && <Zap size={14} className="text-rose-500 animate-pulse" />}
                                            </div>
                                            <h5 className="font-black text-rose-900 mb-1.5 text-xs sm:text-sm leading-tight">{rotation.title}</h5>
                                            <p className="text-[10px] text-rose-700 leading-tight font-medium">{rotation.concept}</p>
                                        </div>
                                        {isRequired && (
                                            <button 
                                              onClick={handleApplyRotation} 
                                              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-[11px] uppercase flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                                            >
                                                Auto-Fix <ArrowRight size={14} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : treeValues.length > 0 && (
                    <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] p-6 mt-8 flex items-center gap-4 animate-in fade-in">
                        <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600 shadow-sm"><CheckCircle2 size={28} /></div>
                        <div>
                            <h4 className="font-black text-emerald-900 uppercase tracking-tighter text-lg">Stable AVL Tree</h4>
                            <p className="text-emerald-700 font-bold text-xs">All nodes satisfy the height-balance requirement.</p>
                        </div>
                    </div>
                )}
                
                <div className="mt-6 flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest px-2">
                  <Move size={12} /> Horizontal pan enabled for mobile • High-Res PNG Export
                </div>
            </Card>
        </div>
    );
};
