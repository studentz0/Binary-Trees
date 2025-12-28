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
    { id: 'LL', title: "LL Case", concept: "Heavy on left-left.", mechanism: "Single Right Rotation. Left child becomes new parent." },
    { id: 'RR', title: "RR Case", concept: "Heavy on right-right.", mechanism: "Single Left Rotation. Right child becomes new parent." },
    { id: 'LR', title: "LR Case", concept: "Zig-zag left-right.", mechanism: "Left Rotate child, then Right Rotate root." },
    { id: 'RL', title: "RL Case", concept: "Zig-zag right-left.", mechanism: "Right Rotate child, then Left Rotate root." }
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
                // Duplicates go to right subtree
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
        const scaleFactor = 2;
        canvas.width = 1000 * scaleFactor;
        canvas.height = 1125 * scaleFactor; // Maintains 400x450 ratio
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Center content nicely
          const drawWidth = canvas.width * 0.9;
          const drawHeight = canvas.height * 0.9;
          const xOffset = (canvas.width - drawWidth) / 2;
          const yOffset = (canvas.height - drawHeight) / 2;

          ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);
          
          const pngUrl = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = `avl-tree.png`;
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
            const offset = Math.max(availableWidth / 2, 25);
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
                edges.push(<Edge key={`${node.val}-l-${nodes.length}`} x1={x} y1={y} x2={x - offset} y2={y + 75} highlight={Math.abs(bf) > 1} />);
                layout(node.left, x - offset, y + 75, level + 1, offset);
            }
            if (node.right) {
                edges.push(<Edge key={`${node.val}-r-${nodes.length}`} x1={x} y1={y} x2={x + offset} y2={y + 75} highlight={Math.abs(bf) > 1} />);
                layout(node.right, x + offset, y + 75, level + 1, offset);
            }
        };

        if (root) layout(root, 400, 60, 1, 350);
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
        <div className="space-y-8 sm:space-y-12">
            <Card title="Interactive AVL Sandbox" subtitle="Visualize height imbalances in real-time. Duplicate values are permitted.">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
                    <input 
                      type="number" 
                      value={inputVal} 
                      onChange={(e) => setInputVal(e.target.value)} 
                      placeholder="Node value" 
                      className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-4 sm:w-44 font-black text-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" 
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

                <div className="relative group/avl overflow-hidden rounded-[2.5rem] border-2 border-gray-100 bg-white">
                  <div className="w-full h-[450px] sm:h-[550px] overflow-auto flex items-start justify-center cursor-grab active:cursor-grabbing scrollbar-thin scrollbar-thumb-gray-200">
                      <div className="min-w-[800px] p-10 flex items-center justify-center">
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
                              <HelpCircle size={48} className="text-gray-200" />
                              <p className="font-black uppercase tracking-widest text-sm">Input values to begin visualization</p>
                          </div>
                      )}
                  </div>
                  
                  {treeValues.length > 0 && (
                    <div className="absolute top-6 right-6 opacity-0 group-hover/avl:opacity-100 transition-opacity">
                      <button 
                        onClick={downloadImage}
                        className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 shadow-xl rounded-xl text-gray-700 font-bold text-xs hover:text-blue-600 hover:border-blue-100 transition-all active:scale-95"
                      >
                        <Download size={16} /> Save Image
                      </button>
                    </div>
                  )}
                </div>

                {currentImbalance ? (
                    <div className="bg-rose-50 border-2 border-rose-100 rounded-[2rem] p-6 mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-3 border-b border-rose-100 pb-3">
                            <div className="p-2 bg-rose-100 rounded-lg text-rose-600"><AlertTriangle size={20} /></div>
                            <div>
                                <h4 className="font-black text-rose-900 uppercase tracking-tighter">Imbalance Detected!</h4>
                                <p className="text-rose-700 font-bold text-xs">Node {currentImbalance.val} has BF {currentImbalance.bf}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {ROTATION_CASES.map(rotation => {
                                const isRequired = currentImbalance.type === rotation.id;
                                return (
                                    <div key={rotation.id} className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${isRequired ? 'bg-white border-rose-400 shadow-lg ring-2 ring-rose-50' : 'bg-white/50 border-rose-100 opacity-60'}`}>
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${isRequired ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-700'}`}>{rotation.id}</span>
                                                {isRequired && <Zap size={12} className="text-rose-500 animate-pulse" />}
                                            </div>
                                            <h5 className="font-black text-rose-900 mb-1 text-sm leading-tight">{rotation.title}</h5>
                                            <p className="text-[11px] text-rose-700 leading-tight font-medium mb-3 line-clamp-2">{rotation.concept}</p>
                                        </div>
                                        {isRequired && (
                                            <button 
                                              onClick={handleApplyRotation} 
                                              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-black text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
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
                    <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] p-6 mt-8 flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600"><CheckCircle2 size={24} /></div>
                        <div>
                            <h4 className="font-black text-emerald-900 uppercase tracking-tighter">Balanced</h4>
                            <p className="text-emerald-700 font-bold text-xs">Tree satisfies AVL property.</p>
                        </div>
                    </div>
                )}
                
                <div className="mt-6 flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest px-2">
                  <Move size={12} /> Pan to view deep subtrees • Export Image supported
                </div>
            </Card>
        </div>
    );
};