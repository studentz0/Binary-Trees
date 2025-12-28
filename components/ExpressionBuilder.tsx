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
      // Use a fixed high-res output size
      const outputWidth = 2400;
      const outputHeight = 1600;
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // We want to draw the 1200x800 SVG into the 2400x1600 canvas
        // This is a 2x scale, but we add 10% padding to avoid the "zoomed-in" look
        const padding = 0.1; // 10% padding
        const targetWidth = canvas.width * (1 - padding * 2);
        const targetHeight = canvas.height * (1 - padding * 2);
        
        const xOffset = (canvas.width - targetWidth) / 2;
        const yOffset = (canvas.height - targetHeight) / 2;
        
        ctx.drawImage(img, xOffset, yOffset, targetWidth, targetHeight);
        
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `expression-tree-${Date.now()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  useEffect(() => {
    try {
      if (!expression) {
        setNodes([]);
        return;
      }
      
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
         const offset = Math.max(availableWidth / 2, 35);
         
         nodeList.push({ id: currentId, val: node.val, type: node.type, x: x, y: y, p: parentId });
         
         if (node.left) assignCoords(node.left, x - offset, y + 90, level + 1, currentId, offset);
         if (node.right) assignCoords(node.right, x + offset, y + 90, level + 1, currentId, offset);
      };

      assignCoords(root, 600, 80, 1, null, 420);
      setNodes(nodeList);
      setError(null);
    } catch (err) {
      setError("Expression error. Check balance.");
    }
  }, [expression]);

  return (
    <Card title="Expression Tree Visualizer" subtitle="Dynamic AST generation. Best viewed on larger screens, scroll horizontally on mobile.">
      <div className="mb-6 sm:mb-8">
        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
            Math Expression Input
        </label>
        <div className="relative group">
          <input 
              type="text" 
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className={`w-full bg-gray-50 border-2 rounded-2xl px-5 py-4 sm:px-6 sm:py-5 text-lg sm:text-2xl font-mono focus:ring-4 focus:ring-blue-100 outline-none transition-all ${error ? 'border-rose-200' : 'border-gray-100 focus:border-blue-400'}`}
              placeholder="(x+y)/z"
          />
          <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
            {error ? <AlertTriangle className="text-rose-400" size={20} /> : <Hash className="text-gray-300" size={20} />}
          </div>
        </div>
        {error && <p className="mt-2 text-rose-500 text-[10px] font-black px-2">{error}</p>}
      </div>

      <div className="relative group/canvas overflow-hidden rounded-[2rem] border-2 border-gray-100 bg-white">
        <div className="w-full h-[400px] sm:h-[500px] overflow-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent flex items-start justify-center cursor-grab active:cursor-grabbing">
          <div className="min-w-[1200px] py-10">
            <svg 
              ref={svgRef}
              viewBox="0 0 1200 800" 
              width="1200"
              height="800"
              className="w-full h-auto overflow-visible" 
            >
              <rect width="1200" height="800" fill="white" fillOpacity="0" />
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
        
        {/* Floating Actions - Always visible on mobile */}
        <div className="absolute bottom-4 right-4 sm:top-6 sm:right-6 sm:bottom-auto flex gap-3 opacity-100 sm:opacity-0 sm:group-hover/canvas:opacity-100 transition-opacity z-20">
          <button 
            onClick={downloadImage}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 shadow-2xl rounded-2xl text-gray-800 font-black text-[11px] uppercase tracking-tighter hover:text-blue-600 hover:border-blue-100 transition-all active:scale-95"
          >
            <Download size={16} className="text-blue-500" /> Export PNG
          </button>
        </div>

        {/* Swipe indicator for mobile */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 lg:hidden pointer-events-none bg-black/5 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-white/20">
           <Move size={12} /> Slide to view
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
          <Maximize2 size={12} /> 1200px Infinite Canvas
        </div>
        <div className="hidden sm:block text-[10px] font-bold text-gray-300 italic">Nodes automatically space out for complex depth</div>
      </div>
    </Card>
  );
};