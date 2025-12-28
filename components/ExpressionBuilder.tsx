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
    
    // Add namespace if missing
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    
    const img = new Image();
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Set high resolution output (2x)
      const scaleFactor = 2;
      canvas.width = 1200 * scaleFactor;
      canvas.height = 800 * scaleFactor;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate fit - ensure it's centered and not too zoomed
        const svgAspect = 800 / 600;
        const canvasAspect = canvas.width / canvas.height;
        let drawWidth, drawHeight;
        
        if (svgAspect > canvasAspect) {
          drawWidth = canvas.width * 0.9;
          drawHeight = drawWidth / svgAspect;
        } else {
          drawHeight = canvas.height * 0.9;
          drawWidth = drawHeight * svgAspect;
        }

        const xOffset = (canvas.width - drawWidth) / 2;
        const yOffset = (canvas.height - drawHeight) / 2;
        
        ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);
        
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `expression-tree.png`;
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
         // Minimum horizontal distance between siblings to avoid overlap
         const offset = Math.max(availableWidth / 2, 28);
         
         nodeList.push({ id: currentId, val: node.val, type: node.type, x: x, y: y, p: parentId });
         
         if (node.left) assignCoords(node.left, x - offset, y + 85, level + 1, currentId, offset);
         if (node.right) assignCoords(node.right, x + offset, y + 85, level + 1, currentId, offset);
      };

      // Set initial spread wider (600 in an 1200 width canvas)
      assignCoords(root, 600, 60, 1, null, 400);
      setNodes(nodeList);
      setError(null);
    } catch (err) {
      setError("Expression syntax error. Check your parentheses.");
    }
  }, [expression]);

  return (
    <Card title="Expression Tree Visualizer" subtitle="Transforms your arithmetic logic into a hierarchical abstract syntax tree.">
      <div className="mb-8">
        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
            Infix Math Expression
        </label>
        <div className="relative group">
          <input 
              type="text" 
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className={`w-full bg-gray-50 border-2 rounded-2xl px-6 py-5 text-xl sm:text-2xl font-mono focus:ring-4 focus:ring-blue-100 outline-none transition-all ${error ? 'border-rose-200' : 'border-gray-100 focus:border-blue-400'}`}
              placeholder="(x+y)/z"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
            {error ? <AlertTriangle className="text-rose-400" size={24} /> : <Hash className="text-gray-300 group-focus-within:text-blue-400" size={24} />}
          </div>
        </div>
        {error && <p className="mt-3 text-rose-500 text-xs font-bold px-2">{error}</p>}
      </div>

      <div className="relative group/canvas overflow-hidden rounded-[2.5rem] border-2 border-gray-100 bg-white">
        {/* Scroll hint for mobile */}
        <div className="absolute top-4 left-4 z-10 lg:hidden pointer-events-none opacity-50 flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
           <Move size={12} /> Swipe to pan
        </div>

        <div className="w-full h-[500px] overflow-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent flex items-start justify-center cursor-grab active:cursor-grabbing">
          <div className="min-w-[1200px] p-12">
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
        
        {/* Overlay Actions */}
        <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover/canvas:opacity-100 transition-opacity">
          <button 
            onClick={downloadImage}
            title="Export as PNG"
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 shadow-xl rounded-xl text-gray-700 font-bold text-xs hover:text-blue-600 hover:border-blue-100 transition-all active:scale-95"
          >
            <Download size={16} /> Export Image
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
          <Maximize2 size={12} /> Panning Enabled • 1200px Canvas
        </div>
        <div className="text-[10px] font-bold text-gray-300 italic">Compilers use these trees to prioritize operations like PEMDAS</div>
      </div>
    </Card>
  );
};