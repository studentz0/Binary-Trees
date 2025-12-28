
import React, { useState, useEffect, useRef } from 'react';
import { Card } from './Layout';
import { Node, Edge } from './TreeVisuals';
import { AlertTriangle, Hash, Download, Move, Maximize } from 'lucide-react';

export const ExpressionBuilder = () => {
  const [expression, setExpression] = useState("(a+b)*(c-d)/e");
  const [nodes, setNodes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const stopDragging = () => {
    isDragging.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

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
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 1200, 800);
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

  const centerView = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 1000 - (scrollContainerRef.current.clientWidth / 2);
      scrollContainerRef.current.scrollTop = 0;
    }
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
         if (node.left) assignCoords(node.left, x - offset, y + 60, level + 1, currentId, offset);
         if (node.right) assignCoords(node.right, x + offset, y + 60, level + 1, currentId, offset);
      };

      assignCoords(root, 1000, 80, 1, null, 400);
      setNodes(nodeList);
      setError(null);
      setTimeout(centerView, 50);
    } catch (err) { setError("Syntax error."); }
  }, [expression]);

  return (
    <Card title="Expression Architecture" subtitle="Compile infix math into structural trees. Compact graph rendering enabled.">
      <div className="mb-6 w-full">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
            Infix Expression
        </label>
        <div className="relative w-full">
          <input 
              type="text" 
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className={`w-full bg-gray-50 border-2 rounded-2xl px-5 py-4 text-base sm:text-2xl font-mono focus:ring-8 focus:ring-blue-100 outline-none transition-all ${error ? 'border-rose-200' : 'border-gray-100 focus:border-blue-400'}`}
              placeholder="(x+y)/z"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            {error ? <AlertTriangle className="text-rose-400" size={20} /> : <Hash className="text-gray-200" size={20} />}
          </div>
        </div>
      </div>

      <div className="relative rounded-[2rem] sm:rounded-[3rem] border-2 border-gray-100 bg-white shadow-inner w-full overflow-hidden group">
        <div 
          ref={scrollContainerRef}
          onMouseDown={(e) => handleDragStart(e.pageX, e.pageY)}
          onMouseMove={(e) => handleDragMove(e.pageX, e.pageY)}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          onTouchStart={(e) => handleDragStart(e.touches[0].pageX, e.touches[0].pageY)}
          onTouchMove={(e) => handleDragMove(e.touches[0].pageX, e.touches[0].pageY)}
          onTouchEnd={stopDragging}
          className="w-full h-[400px] sm:h-[550px] overflow-auto scrollbar-hide cursor-grab select-none active:cursor-grabbing p-4 touch-none bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:20px_20px]"
        >
          <div className="w-[2000px] h-[1000px] relative">
            <svg 
              ref={svgRef}
              viewBox="0 0 2000 1000" 
              className="w-full h-full overflow-visible" 
            >
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
        
        <div className="absolute bottom-6 right-6 z-20 flex gap-2">
          <button 
            onClick={centerView}
            className="flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur border border-gray-100 shadow-xl rounded-xl text-gray-800 font-black text-[10px] uppercase active:scale-95 transition-all hover:bg-gray-50"
          >
            <Maximize size={14} className="text-indigo-500" /> Center
          </button>
          {nodes.length > 0 && (
            <button 
              onClick={downloadImage}
              className="flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur border border-gray-100 shadow-xl rounded-xl text-gray-800 font-black text-[10px] uppercase active:scale-95 transition-all hover:bg-gray-50"
            >
              <Download size={14} className="text-emerald-500" /> Save PNG
            </button>
          )}
        </div>

        <div className="absolute bottom-6 left-6 pointer-events-none bg-gray-900/10 backdrop-blur px-3 py-2 rounded-full flex items-center gap-2 text-[9px] font-black text-gray-600 uppercase tracking-widest border border-white/40">
           <Move size={12} className="animate-pulse" /> 2D Panning Active
        </div>
      </div>
    </Card>
  );
};
