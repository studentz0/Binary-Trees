
import React from 'react';
import { Layers, X, GitGraph, Activity, Divide, BookOpen, ShieldCheck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { id: 'intro', label: 'Introduction', icon: BookOpen },
  { id: 'zoo', label: 'Types of Trees', icon: GitGraph },
  { id: 'traversal', label: 'Traversals', icon: Activity },
  { id: 'expression', label: 'Expression Trees', icon: Divide },
  { id: 'avl', label: 'AVL & Balance', icon: ShieldCheck },
];

export const Section = ({ title, icon: Icon, children, id }: { title: string; icon: any; children?: React.ReactNode; id: string }) => (
  <section id={id} className="mb-10 sm:mb-20 lg:mb-24 scroll-mt-20 sm:scroll-mt-24">
    <div className="flex items-center gap-3 sm:gap-3 mb-6 sm:mb-8 border-b border-gray-100 pb-3 sm:pb-4 px-1">
      <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl text-blue-600 shadow-sm shrink-0">
        <Icon size={18} className="sm:w-6 sm:h-6" />
      </div>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">{title}</h2>
    </div>
    <div className="space-y-4 sm:space-y-8">
      {children}
    </div>
  </section>
);

export const Card = ({ title, subtitle, children, className = "" }: { title?: string; subtitle?: string; children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden ${className}`}>
    {(title || subtitle) && (
      <div className="px-5 py-4 sm:px-8 sm:py-6 border-b border-gray-100 bg-gray-50/50">
        {title && <h3 className="font-bold text-gray-900 text-sm sm:text-xl leading-tight">{title}</h3>}
        {subtitle && <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1 font-medium">{subtitle}</p>}
      </div>
    )}
    <div className="p-4 sm:p-8">
      {children}
    </div>
  </div>
);

export const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <>
    {/* Mobile Backdrop */}
    <div 
      className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
      onClick={onClose}
    />
    
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white border-r border-gray-100 overflow-y-auto transform transition-transform duration-300 ease-in-out
      lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
      ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
    `}>
      <div className="p-6 sm:p-8">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
               <Layers size={18} />
            </div>
            <h1 className="font-black text-2xl text-gray-900 tracking-tighter uppercase">TreeMaster</h1>
          </div>
          <button 
            onClick={onClose} 
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 border border-gray-100 active:scale-95"
          >
            <X size={20}/>
          </button>
        </div>
        <nav className="space-y-1">
          {navItems.map(item => (
            <a 
              key={item.id}
              href={`#${item.id}`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all group"
            >
              <item.icon size={18} className="text-gray-400 group-hover:text-blue-600" />
              {item.label}
            </a>
          ))}
        </nav>
        
        <div className="mt-12 p-5 sm:p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100/50">
           <p className="text-[10px] font-black text-indigo-800 uppercase tracking-widest mb-2">Algorithm Fact</p>
           <p className="text-[11px] text-indigo-600/80 leading-relaxed font-medium italic">Balanced trees prevent worst-case O(n) complexity, keeping your apps lightning fast!</p>
        </div>
      </div>
    </aside>
  </>
);
