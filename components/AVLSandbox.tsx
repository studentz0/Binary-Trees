
import React, { useState, useMemo } from 'react';
import { Card } from './Layout';
import { Node, Edge } from './TreeVisuals';
import { AlertTriangle, Plus, Trash2, ShieldCheck, HelpCircle, Info, RotateCcw, Zap, ArrowRight } from 'lucide-react';

interface BSTNode {
    val: number;
    left: BSTNode | null;
    right: BSTNode | null;
}

const ROTATION_INFO: Record<string, { title: string, description: string, mechanism: string }> = {
    'LL': {
        title: "Left-Left (LL) Case",
        description: "The tree is 'heavy' on the left side of a left child. It forms a straight line leaning left.",
        mechanism: "Perform a single Right Rotation on the imbalanced node. This 'pulls' the node down and elevates its left child."
    },
    'RR': {
        title: "Right-Right (RR) Case",
        description: "The tree is 'heavy' on the right side of a right child. It forms a straight line leaning right.",
        mechanism: "Perform a single Left Rotation on the imbalanced node. This 'pulls' the node down and elevates its right child."
    },
    'LR': {
        title: "Left-Right (LR) Case",
        description: "The child node is left-heavy, but its own child is right-heavy (a zig-zag shape).",
        mechanism: "Perform a Left Rotation on the child first (to make it LL), then a Right Rotation on the imbalanced root node."
    },
    'RL': {
        title: "Right-Left (RL) Case",
        description: "The child node is right-heavy, but its own child is left-heavy (a zig-zag shape).",
        mechanism: "Perform a Right Rotation on the child first (to make it RR), then a Left Rotation on the imbalanced root node."
    }
};

export const AVLSandbox = () => {
    const [treeValues, setTreeValues] = useState<number[]>([]);
    const [inputVal, setInputVal] = useState("");

    const getHeight = (node: BSTNode | null): number => {
        if (!node) return 0;
        return 1 + Math.max(getHeight(node.left), getHeight(node.right));
    };

    const buildTree = (values: number[]): BSTNode | null => {
        if (!values.length) return null;
        const root: BSTNode = { val: values[0], left: null, right: null };
        
        for (let i = 1; i < values.length; i++) {
            let current = root;
            while (true) {
                if (values[i] < current.val) {
                    if (!current.left) { current.left = { val: values[i], left: null, right: null }; break; }
                    current = current.left;
                } else if (values[i] > current.val) {
                    if (!current.right) { current.right = { val: values[i], left: null, right: null }; break; }
                    current = current.right;
                } else break; // Dedupe
            }
        }
        return root;
    };

    const root = useMemo(() => buildTree(treeValues), [treeValues]);

    const handleBalance = () => {
        // Simplified educational balancing: sorting the values creates a perfectly balanced BST
        // when built with the sequential insertion logic (if we were to re-insert them optimally)
        // In a real AVL, we would just swap pointers, but for this visualizer's state management:
        const sorted = [...new Set([...treeValues])].sort((a, b) => a - b);
        
        const getBalancedOrder = (arr: number[]): number[] => {
            if (arr.length === 0) return [];
            const mid = Math.floor(arr.length / 2);
            const res = [arr[mid]];
            const left = getBalancedOrder(arr.slice(0, mid));
            const right = getBalancedOrder(arr.slice(mid + 1));
            // Interleave left and right for level-order style insertion to maintain balance
            const maxLen = Math.max(left.length, right.length);
            for(let i=0; i<maxLen; i++) {
                if(left[i] !== undefined) res.push(left[i]);
                if(right[i] !== undefined) res.push(right[i]);
            }
            return res;
        };

        const balancedValues = getBalancedOrder(sorted);
        setTreeValues(balancedValues);
    };

    const { renderedNodes, currentImbalance, svgEdges } = useMemo(() => {
        const nodes: any[] = [];
        const edges: any[] = [];
        let detected: { type: string, val: number, bf: number } | null = null;

        const layout = (node: BSTNode | null, x: number, y: number, level: number, availableWidth: number) => {
            if (!node) return;
            const offset = availableWidth / 2;
            
            const hl = getHeight(node.left);
            const hr = getHeight(node.right);
            const bf = hl - hr;
            
            if (Math.abs(bf) > 1 && !detected) {
                if (bf > 1) { 
                     const lbf = getHeight(node.left?.left) - getHeight(node.left?.right);
                     detected = { type: lbf >= 0 ? "LL" : "LR", val: node.val, bf };
                } else { 
                     const rbf = getHeight(node.right?.left) - getHeight(node.right?.right);
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

    const addValue = () => {
        const val = parseInt(inputVal);
        if (!isNaN(val) && !treeValues.includes(val)) {
            setTreeValues([...treeValues, val]);
            setInputVal("");
        }
    };

    return (
        <div className="space-y-12">
            <Card title="Interactive AVL Sandbox" subtitle="Build a tree and identify imbalances. The system will detect the specific rotation needed.">
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
                        <Plus size={20}/> INSERT NODE
                    </button>
                    <button onClick={() => setTreeValues([])} className="bg-white text-gray-500 hover:text-rose-600 hover:bg-rose-50 border-2 border-gray-100 hover:border-rose-100 px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-3">
                        <Trash2 size={20}/> CLEAR TREE
                    </button>
                </div>

                {currentImbalance && (
                    <div className="mb-10 p-0 overflow-hidden bg-rose-50 border-2 border-rose-100 rounded-[2.5rem] shadow-xl shadow-rose-100/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                            <div className="p-5 bg-rose-100 rounded-3xl text-rose-600 shrink-0">
                                <AlertTriangle size={40} />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h5 className="font-black text-rose-900 text-sm uppercase tracking-widest mb-1 flex items-center justify-center md:justify-start gap-2">
                                    <Zap size={16} /> Imbalance Found at Node {currentImbalance.val}
                                </h5>
                                <p className="font-bold text-2xl text-rose-800">
                                    Required: <span className="underline decoration-rose-300 decoration-4 underline-offset-4">{currentImbalance.type} Case</span>
                                </p>
                                <p className="text-rose-700 mt-2 font-medium opacity-80">
                                    Balance Factor is {currentImbalance.bf}. The height difference exceeds 1.
                                </p>
                            </div>
                            <button 
                                onClick={handleBalance}
                                className="bg-rose-600 hover:bg-rose-700 text-white px-10 py-5 rounded-2xl font-black shadow-lg shadow-rose-200 transition-all flex items-center gap-3 shrink-0 uppercase tracking-tight"
                            >
                                <ShieldCheck size={24} /> Resolve with {currentImbalance.type}
                            </button>
                        </div>
                        
                        <div className="px-8 py-6 bg-white/50 border-t border-rose-100 grid md:grid-cols-2 gap-8">
                            <div>
                                <h6 className="font-black text-xs text-rose-900 uppercase tracking-widest mb-2">The Problem</h6>
                                <p className="text-sm text-rose-800 leading-relaxed font-medium">
                                    {ROTATION_INFO[currentImbalance.type].description}
                                </p>
                            </div>
                            <div>
                                <h6 className="font-black text-xs text-rose-900 uppercase tracking-widest mb-2">The Solution</h6>
                                <p className="text-sm text-rose-800 leading-relaxed font-medium">
                                    {ROTATION_INFO[currentImbalance.type].mechanism}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="rounded-[3rem] bg-gray-50 min-h-[550px] border-4 border-dashed border-gray-100 relative overflow-hidden flex items-center justify-center p-12 transition-all duration-500">
                    <svg viewBox="0 0 400 450" className="w-full h-full overflow-visible">
                        <g className="transition-all duration-700">{svgEdges}</g>
                        {renderedNodes.map(n => (
                            <Node key={n.val} x={n.x} y={n.y} value={n.val} highlight={Math.abs(n.bf) > 1} label={`BF: ${n.bf}`} />
                        ))}
                    </svg>
                    {treeValues.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-6">
                            <div className="p-8 bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50">
                               <HelpCircle size={80} className="animate-pulse text-gray-100" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="font-black tracking-widest uppercase text-gray-400">Your Canvas is Empty</p>
                                <p className="text-sm text-gray-300 font-bold">Input a value to start the hierarchy</p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
                {Object.entries(ROTATION_INFO).map(([key, info]) => (
                    <div key={key} className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                {key}
                            </div>
                            <h4 className="text-2xl font-black text-gray-900">{info.title}</h4>
                        </div>
                        <p className="text-gray-600 font-medium leading-relaxed mb-6">
                            {info.description}
                        </p>
                        <div className="flex items-start gap-3 p-5 bg-indigo-50 rounded-2xl border border-indigo-100/50">
                            <div className="p-1.5 bg-indigo-200 rounded-lg text-indigo-700 shrink-0">
                                <ArrowRight size={14} />
                            </div>
                            <p className="text-xs text-indigo-800 font-bold leading-relaxed">
                                <span className="uppercase tracking-widest text-[10px] block mb-1 opacity-60">Logic</span>
                                {info.mechanism}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
