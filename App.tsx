
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
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* Mobile Top Bar */}
      <header className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-gray-100 px-5 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
             <Layers size={20} />
          </div>
          <h1 className="font-black text-xl text-gray-900 tracking-tighter uppercase">TreeMaster</h1>
        </div>
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="p-2.5 hover:bg-gray-100 rounded-2xl transition-colors text-gray-600 border border-gray-100 active:scale-95 shadow-sm"
          aria-label="Open menu"
        >
          <Menu size={24}/>
        </button>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 px-5 sm:px-10 md:px-12 lg:px-20 py-10 sm:py-16 lg:py-24 max-w-7xl mx-auto space-y-20 sm:space-y-32 lg:space-y-48">
        
        {/* Intro */}
        <div id="intro" className="space-y-6 sm:space-y-10 pt-4 text-center lg:text-left section-target">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-black tracking-widest uppercase border border-blue-100 shadow-sm mx-auto lg:mx-0">
            <BookOpen size={16} /> Data Structures Masterclass
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[1.05] text-balance">
            The Science of <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Binary Trees</span>
          </h1>
          <p className="text-lg sm:text-2xl md:text-3xl text-gray-400 max-w-4xl leading-relaxed font-semibold mx-auto lg:mx-0 text-balance">
            Interactive visual learning from the ground up. Explore traversals, 
            expression evaluation, and complex balancing rotations.
          </p>
        </div>

        <Section id="zoo" title="The Zoo of Trees" icon={GitGraph}>
          <div className="mb-10 sm:mb-16 p-6 sm:p-10 bg-white rounded-3xl sm:rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/40">
             <p className="text-gray-500 text-lg sm:text-2xl leading-relaxed font-bold text-balance">
               Algorithmic efficiency starts with structure. Understand the crucial differences 
               between <span className="text-blue-600">Full</span>, <span className="text-indigo-600">Complete</span>, and <span className="text-purple-600">Perfect</span> trees.
             </p>
          </div>
          <TreeTypesExplainer />
        </Section>

        <Section id="traversal" title="Systematic Traversals" icon={Activity}>
          <div className="mb-10 sm:mb-16 p-6 sm:p-10 bg-white rounded-3xl sm:rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/40">
             <p className="text-gray-500 text-lg sm:text-2xl leading-relaxed font-bold text-balance">
               How do we visit every node? The strategy determines the output sequence. 
               Experience Pre-order, In-order, and Post-order visually.
             </p>
          </div>
          <Card title="Interactive Traversal Suite" subtitle="Build a custom level-order tree and run step-by-step path animations.">
            <TraversalDemo />
            <AICodeExplainer topic="Binary Tree Traversals" />
          </Card>
        </Section>

        <Section id="expression" title="Logic in Trees" icon={Divide}>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center mb-10 sm:mb-20">
            <div className="space-y-6 sm:space-y-10">
              <p className="text-lg sm:text-2xl text-gray-500 leading-relaxed font-bold text-balance">
                Arithmetic expression trees are essential for compilers. They prioritize 
                operations using structural depth rather than just parenthesis.
              </p>
              <div className="p-6 sm:p-10 bg-orange-50/50 rounded-[2rem] sm:rounded-[3.5rem] border border-orange-100 space-y-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Divide size={24} className="text-orange-500" />
                 </div>
                 <h4 className="font-black text-orange-900 text-xl tracking-tight">Bottom-Up Evaluation</h4>
                 <p className="text-sm sm:text-base text-orange-700/80 font-bold leading-relaxed">
                   Compilers calculate results using post-order traversal, ensuring all child leaf values are available before applying the parent operator.
                 </p>
              </div>
            </div>
            <div className="flex justify-center p-10 sm:p-16 bg-white rounded-[3rem] sm:rounded-[5rem] border border-gray-100 shadow-2xl shadow-orange-50">
               <svg viewBox="0 0 200 120" className="w-full max-w-[220px] sm:max-w-sm drop-shadow-[0_20px_50px_rgba(255,165,0,0.2)] overflow-visible">
                  <line x1="100" y1="20" x2="60" y2="70" className="stroke-orange-200 stroke-[3]" />
                  <line x1="100" y1="20" x2="140" y2="70" className="stroke-orange-200 stroke-[3]" />
                  <circle cx="100" cy="20" r="18" className="fill-orange-500 stroke-orange-600 stroke-2" />
                  <text x="100" y="20" dy=".35em" textAnchor="middle" className="fill-white font-black text-xl font-mono">+</text>
                  <circle cx="60" cy="70" r="18" className="fill-blue-500 stroke-blue-600 stroke-2" />
                  <text x="60" y="70" dy=".35em" textAnchor="middle" className="fill-white font-black text-xl font-mono">A</text>
                  <circle cx="140" cy="70" r="18" className="fill-blue-500 stroke-blue-600 stroke-2" />
                  <text x="140" y="70" dy=".35em" textAnchor="middle" className="fill-white font-black text-xl font-mono">B</text>
               </svg>
            </div>
          </div>
          <ExpressionBuilder />
        </Section>

        <Section id="avl" title="Self-Balancing Logic" icon={ShieldCheck}>
           <div className="mb-12 sm:mb-20 p-8 sm:p-16 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] sm:rounded-[5rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
             <h3 className="text-3xl sm:text-6xl font-black mb-4 sm:mb-8 flex items-center gap-4">
               <ShieldCheck size={48} className="sm:w-16 sm:h-16 text-emerald-400" /> Height Control
             </h3>
             <p className="text-indigo-100 text-lg sm:text-3xl max-w-4xl font-bold leading-relaxed text-balance">
               AVL trees prevent performance degradation by maintaining a balance factor between -1 and 1. 
               This keeps search operations strictly O(log n).
             </p>
           </div>
           
           <div className="space-y-20 sm:space-y-40">
             <AVLExplainer />
             <AICodeExplainer topic="AVL Tree Balancing Logic" />
             <AVLSandbox />
           </div>
        </Section>

        <Section id="quiz" title="Final Assessment" icon={Brain}>
           <AIQuizSection />
        </Section>

        <footer className="pt-24 sm:pt-48 pb-12 sm:pb-20 text-center text-gray-400 border-t border-gray-100 bg-white/50">
          <div className="flex justify-center gap-8 mb-10">
            <Layers className="text-gray-200 hover:text-blue-500 transition-colors" size={24} />
            <GitGraph className="text-gray-200 hover:text-blue-500 transition-colors" size={24} />
            <Activity className="text-gray-200 hover:text-blue-500 transition-colors" size={24} />
          </div>
          <p className="font-black tracking-[0.3em] uppercase text-[10px] sm:text-xs px-10 leading-loose">
            © 2025 TreeMaster Educational Suite • AI Powered Interactive Learning <br/>
            Engineered for Academic Excellence
          </p>
        </footer>

      </main>
    </div>
  );
}
