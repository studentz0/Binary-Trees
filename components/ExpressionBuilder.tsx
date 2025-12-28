
import React, { useState, useEffect, useRef } from 'react';
import { Card } from './Layout';
import { Node, Edge } from './TreeVisuals';
import { AlertTriangle, Hash, Download, Maximize2, Move } from 'lucide-react';

export const ExpressionBuilder = () => {
  const [expression, setExpression] = useState("(a+b)*(c-d)/e");
  const [nodes, setNodes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

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
        downloadLink.download = `expression-tree.png`;
        downloadLink.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  useEffect(() => {
    try {
      if (!expression) { setNodes([]); return; }
      const tokens = expression.match(/([a-zA-Z0-9]+|[\+\-\*\/\(\)])/g);
      if (!tokens) return;
      const outputQueue: any[] = [];
      const operatorStack: string[] = [];
      const precedence: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2 };

      tokens.forEach(token => {
        if (/[a-zA-Z0-9]/.test(token)) {
           outputQueue.push({ val: token, type: 'var', left: null, right: null });
        } else if (['+', '-', '*', '/'].includes(token)) {
           while (operatorStack.length > 0 && 
                  operatorStack[operatorStack.length-1] !== '(' && 
                  precedence[operatorStack[operatorStack.length-1]] >= precedence[token]) {
                const op = operatorStack.pop()!;
                const right = outputQueue.pop();
                const left = outputQueue.pop();
                outputQueue.push({ val: op, type: 'op', left, right });
           }
           operatorStack.push(token);
        } else if (token === '(') {
           operatorStack.push(token);
        } else if (token === ')') {
           while (operatorStack.length > 0 && operatorStack[operatorStack.length-1] !== '(') {
              const op = operatorStack.pop()!;
              const right = outputQueue.pop();
              const left = outputQueue.pop();
              outputQueue.push({ val: op, type: 'op', left, right });
           }
           operatorStack.pop(); 
        }
      });

      while(operatorStack.length > 0) {
         const op = operatorStack.pop()!;
         if (op === '(') throw new Error("Mismatched parenthesis");
         const right = outputQueue.pop();
         const left = outputQueue.pop();
         if (!right || !left) throw new Error("Invalid structure");
         outputQueue.push({ val: op, type: 'op', left, right });
      }

      const root = outputQueue[0];
      if (!root) return;
      const nodeList: any[] = [];
      let idCounter = 1;

      const assignCoords = (node: any, x: number, y: number, level: number, parentId: number | null, availableWidth: number) => {
         if (!node) return;
         const currentId = idCounter++;
         const offset = Math.max(availableWidth / 2, 40);
         nodeList.push({ id: currentId, val: node.val, type: node.type, x: x, y: y, p: parentId });
         if (node.left) assignCoords(node.left, x - offset, y + 80, level + 1, currentId, offset);
         if (node.right) assignCoords(node.right, x + offset, y + 80, level + 1, currentId, offset);
      };

      assignCoords(root, 400, 60, 1, null, 280);
      setNodes(nodeList);
      setError(null);
    } catch (err) { setError("Syntax error."); }
  }, [expression]);

  return (
    <Card title="Tree Playground" subtitle="Type any equation. The tree scales automatically.">
      <div className="mb-6 sm:mb-8">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">
            Infix Expression
        </label>
        <div className="relative">
          <input 
              type="text" 
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className={`w-full bg-gray-50 border-2 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-5 text-base sm:text-2xl font-mono focus:ring-4 focus:ring-blue-100 outline-none transition-all ${error ? 'border-rose-200' : 'border-gray-100 focus:border-blue-400'}`}
              placeholder="(x+y)/z"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {error ? <AlertTriangle className="text-rose-400" size={18} /> : <Hash className="text-gray-200" size={18} />}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] border-2 border-gray-100 bg-white shadow-inner">
        <div className="w-full h-[300px] sm:h-[500px] overflow-x-auto scrollbar-hide flex items-center justify-center p-4">
          <div className="min-w-[600px] sm:min-w-[800px] h-full flex items-center justify-center">
            <svg 
              ref={svgRef}
              viewBox="0 0 800 600" 
              className="w-full h-auto overflow-visible" 
            >
              <rect width="800" height="600" fill="transparent" />
              {nodes.map(n => {
                if (!n.p) return null;
                const parent = nodes.find(p => p.id === n.p);
                if(!parent) return null;
                return <Edge key={`e-${n.id}`} x1={parent.x} y1={parent.y} x2={n.x} y2={n.y} />;
              })}
              {nodes.map(n => (
                <Node key={n.id} x={n.x} y={n.y} value={n.val} type={n.type} />
              ))}
            </svg>
          </div>
        </div>
        
        <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6">
          <button 
            onClick={downloadImage}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-white/90 backdrop-blur border border-gray-100 shadow-xl rounded-xl text-gray-800 font-black text-[9px] sm:text-[11px] uppercase tracking-tighter active:scale-95"
          >
            <Download size={14} className="text-blue-500" /> Export PNG
          </button>
        </div>

        <div className="absolute top-3 left-1/2 -translate-x-1/2 lg:hidden bg-gray-900/5 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest border border-white/20">
           <Move size={10} /> Scroll to view
        </div>
      </div>
    </Card>
  );
};
