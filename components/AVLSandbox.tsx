import React, { useState, useMemo } from 'react';
import { Card } from './Layout';
import { Node, Edge } from './TreeVisuals';
import { AlertTriangle, Plus, Trash2, HelpCircle, Info, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

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
    {
        id: 'LL',
        title: "LL Case (Left-Left)",
        concept: "A straight line heavy on the left. The root is imbalanced by its left child's left child.",
        mechanism: "Single Right Rotation. The left child rises to become the parent, and the old parent becomes its right child.",
    },
    {
        id: 'RR',
        title: "RR Case (Right-Right)",
        concept: "A straight line heavy on the right. The root is imbalanced by its right child's right child.",
        mechanism: "Single Left Rotation. The right child rises to become the parent, and the old parent becomes its left child.",
    },
    {
        id: 'LR',
        title: "LR Case (Left-Right)",
        concept: "A zig-zag shape heavy on the left. The child leans right, while the root leans left.",
        mechanism: "Double Rotation: Left Rotation on the child first (to make it LL), then a Right Rotation on the root.",
    },
    {
        id: 'RL',
        title: "RL Case (Right-Left)",
        concept: "A zig-zag shape heavy on the right. The child leans left, while the root leans right.",
        mechanism: "Double Rotation: Right Rotation on the child first (to make it RR), then a Left Rotation on the root.",
    }
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
            } else if (values[i] > current.val) {
                if (!current.right) { current.right = { val: values[i], left: null, right: null }; break; }
                current = current.right;
            } else break; 
        }
    }
    return rootNode;
};

interface VisualData {
  renderedNodes: { val: number; x: number; y: number; bf: number }[];
  currentImbalance: ImbalanceInfo | null;
  svgEdges: React.ReactNode[];
}

export const AVLSandbox = () => {
    const [treeValues, setTreeValues] = useState<number[]>([]);
    const [inputVal, setInputVal] = useState("");

    const root = useMemo(() => buildTree(treeValues), [treeValues]);

    const handleApplyRotation = () => {
        const sorted = [...new Set([...treeValues])].sort((a, b) => a - b);
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
        const nodes: { val: number; x: number; y: number; bf: number }[] = [];
        const edges: React.ReactNode[] = [];
        let detected: ImbalanceInfo | null = null;

        const layout = (node: BSTNode | null, x: number, y: number, level: number, availableWidth: number) => {
            if (!node) return;
            const offset = availableWidth / 2;
            
            const hl = getHeight(node.left);
            const hr = getHeight(node.right);
            const bf = hl - hr;
            
            if (Math.abs(bf) > 1 && !detected) {
                const lbf = getHeight(node.left?.left) - getHeight(node.left?.right);
                const rbf = getHeight(node.right?.left) - getHeight(node.right?.right);
                
                if (bf > 1) {
                    detected = { type: lbf >= 0 ? "LL" : "LR", val: node.val, bf };
                } else {
                    detected = { type: rbf <= 0 ? "RR" : "RL", val: node.val, bf };
                }
            }
            
            nodes.push({ val: node.val, x, y, bf });
            
            if (node.left) {
                edges.push(<Edge key={`${node.val}-l`} x1={x} y1={y} x2={x - offset} y2={y + 70} highlight={Math.abs(bf) > 1} />);
                layout(node.left, x - offset, y + 70, level + 1, offset);
            }
            if (node.right) {
                edges.push(<Edge key={`${node.val}-r`} x1={x} y1={y} x2={x + offset} y2={y + 70} highlight={Math.abs(bf) > 1} />);
                layout(node.right, x + offset, y + 70, level + 1, offset);
            }
        };

        if (root) layout(root, 200, 50, 1, 180);
        return { renderedNodes: nodes, currentImbalance: detected, svgEdges: edges };
    }, [root]);

    const { renderedNodes, currentImbalance, svgEdges } = visualization;

    const addValue = () => {
        const val = parseInt(inputVal);
        if (!isNaN(val) && !treeValues.includes(val)) {
            setTreeValues([...treeValues, val]);
            setInputVal("");
        }
    };

    return (
        <div className="space-y-12">
            <Card title="Interactive AVL Sandbox" subtitle="Input numbers to create a tree. If an imbalance occurs, the system will highlight the required rotation.">
                <div className="flex flex-wrap items-center gap-4 mb-10">
                    <div className="relative">
                      <input 
                          type="number" 
                          value={inputVal}
                          onChange={(e) => setInputVal(e.target.value)}
                          placeholder="Node value"
                          className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 w-44 font-black text-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                          onKeyDown={(e) => e.key === 'Enter' && addValue()}
                      />
                    </div>
                    <button onClick={addValue} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-100 transition-all flex items-center gap-3">
                        <Plus size={20}/> INSERT
                    </button>
                    <button onClick={() => setTreeValues([])} className="bg-white text-gray-500 hover:text-rose-600 hover:bg-rose-50 border-2 border-gray-100 px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-3">
                        <Trash2 size={20}/> CLEAR
                    </button>
                </div>

                <div className="rounded-[3rem] bg-gray-50 min-h-[500px] border-4 border-dashed border-gray-100 relative overflow-hidden flex items-center justify-center p-12 mb-10">
                    <svg viewBox="0 0 400 450" className="w-full h-full overflow-visible">
                        <g>{svgEdges}</g>
                        {renderedNodes.map(n => (
                            <Node key={n.val} x={n.x} y={n.y} value={n.val} highlight={Math.abs(n.bf) > 1} label={`BF: ${n.bf}`} />
                        ))}
                    </svg>
                    {treeValues.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-4">
                            <HelpCircle size={64} className="text-gray-200" />
                            <p className="font-black uppercase tracking-widest">Input a value above</p>
                        </div>
                    )}
                </div>

                {currentImbalance ? (
                    <div className="bg-rose-50 border-2 border-rose-100 rounded-[2.5rem] p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-4 border-b border-rose-100 pb-4">
                            <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-rose-900 uppercase tracking-tighter text-xl">Imbalance Detected!</h4>
                                <p className="text-rose-700 font-bold">Node {currentImbalance.val} has a Balance Factor of {currentImbalance.bf}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {ROTATION_CASES.map(rotation => {
                                const isRequired = currentImbalance.type === rotation.id;
                                return (
                                    <div key={rotation.id} className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${isRequired ? 'bg-white border-rose-400 shadow-xl shadow-rose-100 ring-4 ring-rose-50' : 'bg-white/50 border-rose-100 opacity-60'}`}>
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-black ${isRequired ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-700'}`}>{rotation.id}</span>
                                                {isRequired && <Zap size={16} className="text-rose-500 animate-pulse" />}
                                            </div>
                                            <h5 className="font-black text-rose-900 mb-2">{rotation.title}</h5>
                                            <p className="text-xs text-rose-700 leading-relaxed font-medium mb-4">{rotation.concept}</p>
                                        </div>
                                        {isRequired && (
                                            <button 
                                                onClick={handleApplyRotation}
                                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-200"
                                            >
                                                Apply <ArrowRight size={14} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="p-6 bg-white rounded-2xl border border-rose-100">
                            <h6 className="font-black text-xs text-rose-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Info size={14} /> Solution Mechanism
                            </h6>
                            <p className="text-sm text-rose-700 leading-relaxed font-medium">
                                {ROTATION_CASES.find(r => r.id === currentImbalance.type)?.mechanism}
                            </p>
                        </div>
                    </div>
                ) : treeValues.length > 0 && (
                    <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[2.5rem] p-8 flex items-center gap-6">
                        <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <h4 className="font-black text-emerald-900 uppercase tracking-tighter text-xl">Perfectly Balanced</h4>
                            <p className="text-emerald-700 font-bold">Your AVL property is satisfied for all nodes.</p>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};