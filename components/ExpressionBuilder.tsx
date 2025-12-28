
import React, { useState, useEffect } from 'react';
import { Card } from './Layout';
import { Node, Edge } from './TreeVisuals';
import { AlertTriangle, Hash } from 'lucide-react';

export const ExpressionBuilder = () => {
  const [expression, setExpression] = useState("(a+b)*c");
  const [nodes, setNodes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

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
         const offset = availableWidth / 2;
         
         nodeList.push({ id: currentId, val: node.val, type: node.type, x: x, y: y, p: parentId });
         
         if (node.left) assignCoords(node.left, x - offset, y + 70, level + 1, currentId, offset);
         if (node.right) assignCoords(node.right, x + offset, y + 70, level + 1, currentId, offset);
      };

      assignCoords(root, 200, 50, 1, null, 180);
      setNodes(nodeList);
      setError(null);
    } catch (err) {
      setError("Check your syntax! Make sure the expression is balanced.");
    }
  }, [expression]);

  return (
    <Card title="Tree Generator Playground" subtitle="Type any infix expression to see how a compiler's abstract syntax tree would structure it.">
      <div className="mb-10">
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            Arithmetic Infix Expression
        </label>
        <div className="relative group">
          <input 
              type="text" 
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className={`w-full bg-gray-50 border-2 rounded-2xl px-6 py-5 text-2xl font-mono focus:ring-4 focus:ring-blue-100 outline-none transition-all ${error ? 'border-rose-200' : 'border-gray-100 focus:border-blue-400'}`}
              placeholder="(x+y)/z"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-400 transition-colors">
            <Hash size={24} />
          </div>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-3 text-sm font-bold border border-rose-100">
            <AlertTriangle size={18} /> {error}
          </div>
        )}
      </div>

      <div className="w-full min-h-[400px] bg-white rounded-[3rem] border border-gray-100 shadow-inner overflow-hidden flex items-center justify-center p-8">
           <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
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
    </Card>
  );
};
