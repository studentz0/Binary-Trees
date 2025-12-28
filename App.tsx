import React, { useState } from 'react';
import { Sidebar, Section, Card } from './components/Layout';
import { TreeTypesExplainer } from './components/TreeTypesExplainer';
import { TraversalDemo } from './components/TraversalDemo';
import { ExpressionBuilder } from './components/ExpressionBuilder';
import { AVLSandbox } from './components/AVLSandbox';
import { AVLExplainer } from './components/AVLExplainer';
import { AICodeExplainer } from './components/AICodeExplainer';
import { AIQuizSection } from './components/AIQuizSection';
import { Info, Menu, ShieldCheck, Divide, Activity, GitGraph, BookOpen, Layers, Brain } from 'lucide-react';

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Mobile Top Bar */}
      <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
             <Layers size={18} />
          </div>
          <h1 className="font-black text-lg text-gray-900 tracking-tighter uppercase">TreeMaster</h1>
        </div>
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-600 border border-gray-100 focus:ring-2 focus:ring-blue-100"
        >
          <Menu size={20}/>
        </button>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 px-4 py-8 sm:p-6 md:p-12 lg:p-16 max-w-6xl mx-auto space-y-12 sm:space-y-20 lg:space-y-32">
        
        {/* Intro */}
        <div id="intro" className="space-y-6 pt-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase border border-blue-100 shadow-sm">
            <BookOpen size={16} /> Data Structures Interactive Suite
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight">
            The World of <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Binary Trees</span>
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-gray-500 max-w-3xl leading-relaxed font-medium mx-auto lg:mx-0">
            Learn hierarchies from the ground up. Interactive visualization for 
            properties, traversals, and complex balancing rotations.
          </p>
        </div>

        <Section id="zoo" title="The Zoo of Trees" icon={GitGraph}>
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
             <p className="text-gray-600 text-sm sm:text-lg leading-relaxed font-medium">
               Not all binary trees are balanced. The structure (Full, Complete, or Perfect) 
               directly impacts the space and time complexity of your operations.
             </p>
          </div>
          <TreeTypesExplainer />
        </Section>

        <Section id="traversal" title="Traversing the Structure" icon={Activity}>
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
             <p className="text-gray-600 text-sm sm:text-lg leading-relaxed font-medium">
               Traversal is the process of visiting every node in a tree. Build your own tree 
               below and watch Pre-order, In-order, and Post-order strategies in action.
             </p>
          </div>
          <Card title="Interactive Traversal Suite" subtitle="Build a custom level-order tree and run animations.">
            <TraversalDemo />
            <AICodeExplainer topic="Binary Tree Traversals" />
          </Card>
        </Section>

        <Section id="expression" title="Expression Trees" icon={Divide}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-6 sm:mb-8">
            <div className="space-y-4 sm:space-y-6">
              <p className="text-sm sm:text-lg text-gray-600 leading-relaxed font-medium">
                Expression trees are a specialized binary tree used by compilers. They 
                provide a unique way to represent and evaluate mathematical operations.
              </p>
              <div className="p-4 sm:p-6 bg-orange-50 rounded-2xl sm:rounded-3xl border border-orange-100 space-y-3">
                 <h4 className="font-bold text-orange-800 flex items-center gap-2">
                   <Info size={18} /> Internal vs. Leaves
                 </h4>
                 <p className="text-xs sm:text-sm text-orange-700 font-medium leading-relaxed">
                   Internal nodes store <strong>Operators</strong> (+, -, *, /) while leaf nodes 
                   store <strong>Operands</strong> (variables/numbers).
                 </p>
              </div>
            </div>
            <div className="flex justify-center p-6 sm:p-8 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-inner">
               <svg viewBox="0 0 200 120" className="w-full max-w-[200px] sm:max-w-[240px] drop-shadow-xl">
                  <line x1="100" y1="20" x2="60" y2="70" className="stroke-orange-200 stroke-2" />
                  <line x1="100" y1="20" x2="140" y2="70" className="stroke-orange-200 stroke-2" />
                  <circle cx="100" cy="20" r="15" className="fill-orange-500 stroke-orange-600" />
                  <text x="100" y="20" dy=".35em" textAnchor="middle" className="fill-white font-black text-lg">+</text>
                  <circle cx="60" cy="70" r="15" className="fill-blue-500 stroke-blue-600" />
                  <text x="60" y="70" dy=".35em" textAnchor="middle" className="fill-white font-black text-lg">A</text>
                  <circle cx="140" cy="70" r="15" className="fill-blue-500 stroke-blue-600" />
                  <text x="140" y="70" dy=".35em" textAnchor="middle" className="fill-white font-black text-lg">B</text>
               </svg>
            </div>
          </div>
          <ExpressionBuilder />
        </Section>

        <Section id="avl" title="AVL Trees & Balancing" icon={ShieldCheck}>
           <div className="mb-6 sm:mb-8 p-5 sm:p-8 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl sm:rounded-3xl text-white shadow-2xl shadow-blue-200">
             <h3 className="text-xl sm:text-3xl font-black mb-3 sm:mb-4 flex items-center gap-3">
               <ShieldCheck size={32} /> The AVL Standard
             </h3>
             <p className="text-blue-100 text-sm sm:text-lg max-w-2xl font-medium leading-relaxed">
               Binary Search Trees can become skewed. AVL trees use the <strong>Balance Factor (BF)</strong> 
               to detect height imbalances and trigger rotations to keep depth at O(log n).
             </p>
           </div>
           
           <div className="space-y-12 sm:space-y-24">
             <AVLExplainer />
             <AICodeExplainer topic="AVL Tree Balancing Logic" />
             <AVLSandbox />
           </div>
        </Section>

        <Section id="quiz" title="Test Your Knowledge" icon={Brain}>
           <AIQuizSection />
        </Section>

        <footer className="pt-12 sm:pt-24 pb-8 sm:pb-12 text-center text-gray-400 border-t border-gray-100">
          <div className="flex justify-center gap-6 mb-6">
            <Layers className="text-gray-300" size={20} />
            <GitGraph className="text-gray-300" size={20} />
            <Activity className="text-gray-300" size={20} />
          </div>
          <p className="font-bold tracking-widest uppercase text-[10px] sm:text-xs px-4">© 2025 TreeMaster Educational Suite • AI Enhanced Learning</p>
        </footer>

      </main>
    </div>
  );
}