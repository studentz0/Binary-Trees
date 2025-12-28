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
  <section id={id} className="mb-16 sm:mb-24 scroll-mt-24">
    <div className="flex items-center gap-3 mb-6 sm:mb-8 border-b border-gray-100 pb-4">
      <div className="p-2.5 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl text-blue-600 shadow-sm">
        <Icon size={22} />
      </div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
    </div>
    <div className="space-y-6 sm:space-y-8">
      {children}
    </div>
  </section>
);

export const Card = ({ title, subtitle, children, className = "" }: { title?: string; subtitle?: string; children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden ${className}`}>
    {(title || subtitle) && (
      <div className="px-5 py-4 sm:px-8 sm:py-6 border-b border-gray-100 bg-gray-50/50">
        {title && <h3 className="font-bold text-gray-900 text-lg sm:text-xl">{title}</h3>}
        {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">{subtitle}</p>}
      </div>
    )}
    <div className="p-5 sm:p-8">
      {children}
    </div>
  </div>
);

export const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <>
    {/* Mobile Overlay */}
    {isOpen && (
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity" 
        onClick={onClose}
      />
    )}
    
    <aside className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 fixed lg:sticky inset-y-0 left-0 z-50 
      w-72 lg:w-72 bg-white border-r border-gray-100 overflow-y-auto 
      transition-transform duration-300 ease-in-out lg:block lg:h-screen
    `}>
      <div className="p-6 sm:p-8">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
               <Layers size={18} />
            </div>
            <h1 className="font-black text-2xl text-gray-900 tracking-tighter uppercase">TreeMaster</h1>
          </div>
          <button 
            onClick={onClose} 
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 border border-gray-50"
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
           <p className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-2">Did you know?</p>
           <p className="text-xs text-indigo-600/80 leading-relaxed font-medium">Binary Search Trees allow search, insert, and delete in O(log n) time if balanced!</p>
        </div>
      </div>
    </aside>
  </>
);