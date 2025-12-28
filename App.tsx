
import React, { useState } from 'react';
import { Sidebar, Section, Card } from './components/Layout';
import { TreeTypesExplainer } from './components/TreeTypesExplainer';
import { TraversalDemo } from './components/TraversalDemo';
import { ExpressionBuilder } from './components/ExpressionBuilder';
import { AVLSandbox } from './components/AVLSandbox';
import { AVLExplainer } from './components/AVLExplainer';
import { AICodeExplainer } from './components/AICodeExplainer';
import { QuizSection } from './components/QuizSection';
import { BookOpen, Menu, Activity, GitGraph, ShieldCheck, Divide, Brain, Layers } from 'lucide-react';

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col lg:flex-row text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative">
      
      {/* Mobile Top Bar */}
      <header className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
             <Layers size={18} />
          </div>
          <h1 className="font-black text-base text-gray-900 tracking-tighter uppercase">TreeMaster</h1>
        </div>
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 border border-gray-100 active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={20}/>
        </button>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area - Strictly constrained width */}
      <main className="flex-1 w-full min-w-0 max-w-full px-4 sm:px-10 lg:px-20 py-8 sm:py-16 lg:py-24 space-y-16 sm:space-y-32 lg:space-y-40 overflow-x-hidden">
        
        {/* Hero Section */}
        <div id="intro" className="space-y-5 sm:space-y-10 pt-2 text-center lg:text-left section-target w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black tracking-widest uppercase border border-blue-100 mx-auto lg:mx-0">
            <BookOpen size={12} /> CS Masterclass
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-black text-gray-900 tracking-tighter leading-[1.1] text-balance">
            The Science of <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Binary Trees</span>
          </h1>
          <p className="text-base sm:text-xl lg:text-2xl text-gray-400 max-w-3xl leading-relaxed font-semibold mx-auto lg:mx-0 text-balance">
            Interactive visual learning for hierarchical structures. Explore traversals, expression evaluation, and self-balancing logic.
          </p>
        </div>

        {/* Tree Taxonomy */}
        <Section id="zoo" title="Structural Taxonomy" icon={GitGraph}>
          <div className="mb-8 sm:mb-16 p-5 sm:p-10 bg-white rounded-2xl sm:rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/40">
             <p className="text-gray-500 text-sm sm:text-2xl leading-relaxed font-bold text-balance">
               Algorithmic efficiency starts with structure. Understand the crucial differences 
               between <span className="text-blue-600">Full</span>, <span className="text-indigo-600">Complete</span>, and <span className="text-purple-600">Perfect</span> trees.
             </p>
          </div>
          <TreeTypesExplainer />
        </Section>

        {/* Tree Traversals */}
        <Section id="traversal" title="Systematic Traversals" icon={Activity}>
          <div className="mb-8 sm:mb-16 p-5 sm:p-10 bg-white rounded-2xl sm:rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/40">
             <p className="text-gray-500 text-sm sm:text-2xl leading-relaxed font-bold text-balance">
               Experience Pre-order, In-order, and Post-order visually with step-by-step animations on your custom trees.
             </p>
          </div>
          <Card title="Traversal Suite" subtitle="Build a custom level-order tree and run path animations.">
            <TraversalDemo />
            <AICodeExplainer topic="Binary Tree Traversals" />
          </Card>
        </Section>

        {/* Expression Evaluation */}
        <Section id="expression" title="Logic in Trees" icon={Divide}>
          <div className="grid lg:grid-cols-2 gap-10 items-center mb-10 w-full">
            <div className="space-y-6 sm:space-y-10">
              <p className="text-lg sm:text-2xl text-gray-500 leading-relaxed font-bold">
                Arithmetic expression trees prioritize operations using structural depth. Compilers use these to evaluate complex math.
              </p>
              <div className="p-5 sm:p-10 bg-orange-50/50 rounded-2xl sm:rounded-[3.5rem] border border-orange-100 space-y-4">
                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Divide size={20} className="text-orange-500" />
                 </div>
                 <h4 className="font-black text-orange-900 text-lg sm:text-xl">Evaluation Strategy</h4>
                 <p className="text-xs sm:text-base text-orange-700/80 font-bold">
                   Expression trees are typically evaluated using Post-order traversal.
                 </p>
              </div>
            </div>
            <div className="hidden lg:flex justify-center p-16 bg-white rounded-[5rem] border border-gray-100 shadow-2xl">
               <svg viewBox="0 0 200 120" className="w-full max-w-sm">
                  <line x1="100" y1="20" x2="60" y2="70" className="stroke-orange-200 stroke-[3]" />
                  <line x1="100" y1="20" x2="140" y2="70" className="stroke-orange-200 stroke-[3]" />
                  <circle cx="100" cy="20" r="16" className="fill-orange-500 stroke-orange-600 stroke-2" />
                  <text x="100" y="20" dy=".35em" textAnchor="middle" className="fill-white font-black text-lg font-mono">*</text>
                  <circle cx="60" cy="70" r="16" className="fill-blue-500 stroke-blue-600 stroke-2" />
                  <text x="60" y="70" dy=".35em" textAnchor="middle" className="fill-white font-black text-lg font-mono">A</text>
                  <circle cx="140" cy="70" r="16" className="fill-blue-500 stroke-blue-600 stroke-2" />
                  <text x="140" y="70" dy=".35em" textAnchor="middle" className="fill-white font-black text-lg font-mono">B</text>
               </svg>
            </div>
          </div>
          <ExpressionBuilder />
        </Section>

        {/* AVL Balancing */}
        <Section id="avl" title="Self-Balancing Logic" icon={ShieldCheck}>
           <div className="mb-10 p-6 sm:p-16 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl sm:rounded-[5rem] text-white shadow-2xl relative overflow-hidden w-full">
             <h3 className="text-2xl sm:text-6xl font-black mb-4 flex items-center gap-3">
               <ShieldCheck size={28} className="sm:w-16 sm:h-16 text-emerald-400" /> AVL Guard
             </h3>
             <p className="text-indigo-100 text-sm sm:text-3xl max-w-4xl font-bold leading-relaxed">
               AVL trees maintain a balance factor between -1 and 1 to prevent worst-case O(n) performance.
             </p>
           </div>
           
           <div className="space-y-16 sm:space-y-32 w-full">
             <AVLExplainer />
             <AICodeExplainer topic="AVL Height Balance" />
             <AVLSandbox />
           </div>
        </Section>

        {/* Final Quiz */}
        <Section id="quiz" title="Assessment" icon={Brain}>
           <QuizSection />
        </Section>

        {/* Footer */}
        <footer className="pt-20 pb-10 text-center text-gray-400 border-t border-gray-100 bg-white/50 w-full">
          <p className="font-black tracking-[0.2em] uppercase text-[9px] px-6 leading-loose">
            © 2025 TreeMaster • High-Performance Learning
          </p>
        </footer>

      </main>
    </div>
  );
}
