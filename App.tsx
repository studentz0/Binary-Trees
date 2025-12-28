import React, { useState } from 'react';
import { Sidebar, Section, Card } from './components/Layout';
import { TreeTypesExplainer } from './components/TreeTypesExplainer';
import { TraversalDemo } from './components/TraversalDemo';
import { ExpressionBuilder } from './components/ExpressionBuilder';
import { AVLSandbox } from './components/AVLSandbox';
import { AVLExplainer } from './components/AVLExplainer';
import { AICodeExplainer } from './components/AICodeExplainer';
import { AIQuizSection } from './components/AIQuizSection';
import { BookOpen, Menu, Activity, GitGraph, ShieldCheck, Divide, Brain, Layers } from 'lucide-react';

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Mobile Top Bar */}
      <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
             <Layers size={18} />
          </div>
          <h1 className="font-black text-lg text-gray-900 tracking-tighter uppercase">TreeMaster</h1>
        </div>
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 border border-gray-100 active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={20}/>
        </button>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 lg:py-16 max-w-6xl mx-auto space-y-16 sm:space-y-24 lg:space-y-32">
        
        {/* Intro */}
        <div id="intro" className="space-y-4 sm:space-y-6 pt-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase border border-blue-100 shadow-sm mx-auto lg:mx-0">
            <BookOpen size={16} /> Data Structures Interactive Suite
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1]">
            The World of <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Binary Trees</span>
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-gray-500 max-w-3xl leading-relaxed font-medium mx-auto lg:mx-0">
            Learn hierarchies from the ground up. Interactive visualization for 
            properties, traversals, and complex balancing rotations.
          </p>
        </div>

        <Section id="zoo" title="The Zoo of Trees" icon={GitGraph}>
          <div className="mb-6 sm:mb-10 p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
             <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium">
               Not all binary trees are balanced. The structure (Full, Complete, or Perfect) 
               directly impacts the efficiency of search and insertion algorithms.
             </p>
          </div>
          <TreeTypesExplainer />
        </Section>

        <Section id="traversal" title="Traversing Trees" icon={Activity}>
          <div className="mb-6 sm:mb-10 p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
             <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium">
               Traversal is the systematic process of visiting every node. Build your own tree 
               and visualize Pre-order, In-order, and Post-order strategies.
             </p>
          </div>
          <Card title="Interactive Traversal Suite" subtitle="Build a level-order tree and run step-by-step animations.">
            <TraversalDemo />
            <AICodeExplainer topic="Binary Tree Traversals" />
          </Card>
        </Section>

        <Section id="expression" title="Expression Trees" icon={Divide}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-6 sm:mb-10">
            <div className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-medium">
                Used by compilers to evaluate math, expression trees store operators in internal nodes and operands in leaves.
              </p>
              <div className="p-4 sm:p-6 bg-orange-50 rounded-2xl sm:rounded-3xl border border-orange-100 space-y-2">
                 <h4 className="font-bold text-orange-800 text-sm sm:text-base">Pro Tip: Evaluation</h4>
                 <p className="text-xs sm:text-sm text-orange-700 font-medium leading-relaxed">
                   Evaluating an expression tree is essentially a post-order traversal where each node is computed after its children.
                 </p>
              </div>
            </div>
            <div className="flex justify-center p-6 sm:p-8 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-inner">
               <svg viewBox="0 0 200 120" className="w-full max-w-[200px] sm:max-w-xs drop-shadow-xl overflow-visible">
                  <line x1="100" y1="20" x2="60" y2="70" className="stroke-orange-200 stroke-2" />
                  <line x1="100" y1="20" x2="140" y2="70" className="stroke-orange-200 stroke-2" />
                  <circle cx="100" cy="20" r="15" className="fill-orange-500 stroke-orange-600" />
                  <text x="100" y="20" dy=".35em" textAnchor="middle" className="fill-white font-black text-lg font-mono">*</text>
                  <circle cx="60" cy="70" r="15" className="fill-blue-500 stroke-blue-600" />
                  <text x="60" y="70" dy=".35em" textAnchor="middle" className="fill-white font-black text-lg font-mono">X</text>
                  <circle cx="140" cy="70" r="15" className="fill-blue-500 stroke-blue-600" />
                  <text x="140" y="70" dy=".35em" textAnchor="middle" className="fill-white font-black text-lg font-mono">Y</text>
               </svg>
            </div>
          </div>
          <ExpressionBuilder />
        </Section>

        <Section id="avl" title="AVL Balancing" icon={ShieldCheck}>
           <div className="mb-6 sm:mb-10 p-6 sm:p-8 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl sm:rounded-3xl text-white shadow-xl">
             <h3 className="text-xl sm:text-3xl font-black mb-2 sm:mb-4 flex items-center gap-2 sm:gap-3">
               <ShieldCheck size={28} className="sm:w-8 sm:h-8" /> Height Invariance
             </h3>
             <p className="text-blue-100 text-sm sm:text-lg max-w-2xl font-medium leading-relaxed">
               AVL trees guarantee O(log n) time by maintaining a balance factor (BF) between -1 and 1 for every node.
             </p>
           </div>
           
           <div className="space-y-12 sm:space-y-24">
             <AVLExplainer />
             <AICodeExplainer topic="AVL Tree Balancing Logic" />
             <AVLSandbox />
           </div>
        </Section>

        <Section id="quiz" title="Practice" icon={Brain}>
           <AIQuizSection />
        </Section>

        <footer className="pt-16 sm:pt-24 pb-8 sm:pb-12 text-center text-gray-400 border-t border-gray-100">
          <div className="flex justify-center gap-6 mb-6">
            <Layers className="text-gray-300" size={20} />
            <GitGraph className="text-gray-300" size={20} />
            <Activity className="text-gray-300" size={20} />
          </div>
          <p className="font-bold tracking-widest uppercase text-[10px] sm:text-xs px-6">
            © 2025 TreeMaster Educational Suite • AI Powered Interactive Learning
          </p>
        </footer>

      </main>
    </div>
  );
}
