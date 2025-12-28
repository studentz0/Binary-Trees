
import React, { useState, useMemo, useRef, useEffect } from 'react';
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
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // 2D Free-Roam Panning Logic
    const isDragging = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });
    const startScroll = useRef({ left: 0, top: 0 });

    const handleDragStart = (x: number, y: number) => {
      if (!scrollContainerRef.current) return;
      isDragging.current = true;
      startPos.current = { 
        x: x - scrollContainerRef.current.offsetLeft, 
        y: y - scrollContainerRef.current.offsetTop 
      };
      startScroll.current = { 
        left: scrollContainerRef.current.scrollLeft, 
        top: scrollContainerRef.current.scrollTop 
      };
      scrollContainerRef.current.style.cursor = 'grabbing';
    };

    const handleDragMove = (x: number, y: number) => {
      if (!isDragging.current || !scrollContainerRef.current) return;
      const currentX = x - scrollContainerRef.current.offsetLeft;
      const currentY = y - scrollContainerRef.current.offsetTop;
      
      const walkX = (currentX - startPos.current.x);
      const walkY = (currentY - startPos.current.y);
      
      scrollContainerRef.current.scrollLeft = startScroll.current.left - walkX;
      scrollContainerRef.current.scrollTop = startScroll.current.top - walkY;
    };

    const handleMouseDown = (e: React.MouseEvent) => handleDragStart(e.pageX, e.pageY);
    const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging.current) e.preventDefault();
      handleDragMove(e.pageX, e.pageY);
    };

    const handleTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].pageX, e.touches[0].pageY);
    const handleTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].pageX, e.touches[0].pageY);

    const stopDragging = () => {
      isDragging.current = false;
      if (scrollContainerRef.current) scrollContainerRef.current.style.cursor = 'grab';
    };

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
        canvas.width = 1600;
        canvas.height = 1200;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 100, 100, 1400, 1000);
          const pngUrl = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = `avl-state.png`;
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
            const offset = Math.max(availableWidth / 2, 45);
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
                edges.push(<Edge key={`avl-edge-l-${node.val}`} x1={x} y1={y} x2={x - offset} y2={y + 100} highlight={Math.abs(bf) > 1} />);
                layout(node.left, x - offset, y + 100, level + 1, offset);
            }
            if (node.right) {
                edges.push(<Edge key={`avl-edge-r-${node.val}`} x1={x} y1={y} x2={x + offset} y2={y + 100} highlight={Math.abs(bf) > 1} />);
                layout(node.right, x + offset, y + 100, level + 1, offset);
            }
        };

        if (root) layout(root, 1000, 100, 1, 800); 
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

    // Centering Effect on Tree Change
    useEffect(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 1000 - (scrollContainerRef.current.clientWidth / 2);
      }
    }, [treeValues.length]);

    return (
        <div className="space-y-6 sm:space-y-12 w-full">
            <Card title="Free-Roam AVL Sandbox" subtitle="Insert numbers to see updates. The canvas is infinite-roam.">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 sm:mb-10 w-full">
                    <input 
                      type="number" 
                      value={inputVal} 
                      onChange={(e) => setInputVal(e.target.value)} 
                      placeholder="Node Value" 
                      className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-4 sm:w-64 font-black text-sm sm:text-lg focus:ring-8 focus:ring-blue-100 outline-none transition-all" 
                      onKeyDown={(e) => e.key === 'Enter' && addValue()} 
                    />
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button 
                        onClick={addValue} 
                        className="flex-1 sm:flex-none bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-xs sm:text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                          <Plus size={18}/> Insert
                      </button>
                      <button 
                        onClick={() => setTreeValues([])} 
                        className="flex-1 sm:flex-none bg-white text-gray-400 border-2 border-gray-100 px-6 py-4 rounded-xl font-black text-xs sm:text-sm hover:text-rose-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                          <Trash2 size={18}/> Reset
                      </button>
                    </div>
                </div>

                <div className="relative rounded-3xl sm:rounded-[3rem] border-2 border-gray-100 bg-white shadow-inner w-full overflow-hidden">
                  <div 
                    ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={stopDragging}
                    onMouseLeave={stopDragging}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={stopDragging}
                    className="w-full h-[450px] sm:h-[750px] overflow-auto scrollbar-hide cursor-grab select-none active:cursor-grabbing p-4 touch-none"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                      <div className="w-[2000px] h-[1500px] relative">
                        <svg 
                          ref={svgRef} 
                          viewBox="0 0 2000 1500" 
                          className="w-full h-full overflow-visible"
                        >
                            <g>{svgEdges}</g>
                            {renderedNodes.map((n, idx) => (
                                <Node key={`avl-node-${n.val}-${idx}`} x={n.x} y={n.y} value={n.val} highlight={Math.abs(n.bf) > 1} label={`BF: ${n.bf}`} />
                            ))}
                        </svg>
                      </div>
                      {treeValues.length === 0 && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-3 p-10 text-center pointer-events-none">
                              <HelpCircle size={48} className="opacity-10" />
                              <p className="font-black uppercase tracking-[0.3em] text-[10px]">Canvas Empty</p>
                          </div>
                      )}
                  </div>
                  
                  {treeValues.length > 0 && (
                    <div className="absolute bottom-6 right-6 z-20">
                      <button 
                        onClick={downloadImage}
                        className="flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur border border-gray-100 shadow-xl rounded-xl text-gray-800 font-black text-[10px] uppercase tracking-tighter active:scale-95 transition-all group"
                      >
                        <Download size={14} className="text-blue-500" /> Export PNG
                      </button>
                    </div>
                  )}

                  <div className="absolute bottom-6 left-6 pointer-events-none bg-gray-950/5 px-3 py-2 rounded-full flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-widest border border-white/40">
                     <Move size={12} className="animate-pulse" /> 2D Roam Active
                  </div>
                </div>

                {currentImbalance && (
                    <div className="bg-rose-50 border-2 border-rose-100 rounded-3xl sm:rounded-[4rem] p-6 sm:p-12 mt-8 sm:mt-12 space-y-8 sm:space-y-12 w-full">
                        <div className="flex items-center gap-4 sm:gap-8 border-b border-rose-100 pb-6 sm:pb-10">
                            <div className="p-4 bg-rose-100 rounded-2xl text-rose-600 shadow-sm"><AlertTriangle size={32} /></div>
                            <div>
                                <h4 className="font-black text-rose-900 uppercase tracking-tighter text-sm sm:text-3xl">Imbalance Detected</h4>
                                <p className="text-rose-700 font-bold text-[10px] sm:text-lg opacity-80">Threshold exceeded at Node {currentImbalance.val}.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-8">
                            {ROTATION_CASES.map(rotation => {
                                const isRequired = currentImbalance.type === rotation.id;
                                return (
                                    <div key={rotation.id} className={`p-6 sm:p-10 rounded-[2.5rem] border-2 transition-all flex flex-col justify-between ${isRequired ? 'bg-white border-rose-400 shadow-2xl scale-[1.05] z-10' : 'bg-white/50 border-rose-100 opacity-60'}`}>
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest ${isRequired ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-700'}`}>{rotation.id} Case</span>
                                                {isRequired && <Zap size={18} className="text-rose-500 animate-pulse" />}
                                            </div>
                                            <h5 className="font-black text-rose-900 mb-3 text-sm sm:text-xl leading-tight">{rotation.title}</h5>
                                            <p className="text-[10px] sm:text-xs text-rose-700 leading-relaxed font-bold opacity-70">{rotation.concept}</p>
                                        </div>
                                        {isRequired && (
                                            <button 
                                              onClick={handleApplyRotation} 
                                              className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-rose-700 active:scale-95 transition-all"
                                            >
                                                Apply Correction <ArrowRight size={14} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : treeValues.length > 0 && (
                    <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[3rem] p-6 sm:p-10 mt-8 sm:mt-12 flex items-center gap-6 shadow-sm w-full">
                        <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600 shadow-sm"><CheckCircle2 size={32} /></div>
                        <div>
                            <h4 className="font-black text-emerald-900 uppercase tracking-tighter text-sm sm:text-3xl">Stable Equilibrium</h4>
                            <p className="text-emerald-700 font-bold text-[10px] sm:text-lg opacity-80">Height balance factor is within safe limits (|BF| &le; 1).</p>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
