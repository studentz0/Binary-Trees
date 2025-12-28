
import React, { useState, useEffect } from 'react';
import { Layers, X, GitGraph, Activity, Divide, BookOpen, ShieldCheck, ChevronRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { id: 'intro', label: 'Introduction', icon: BookOpen },
  { id: 'zoo', label: 'Types of Trees', icon: GitGraph },
  { id: 'traversal', label: 'Traversals', icon: Activity },
  { id: 'expression', label: 'Expression Trees', icon: Divide },
  { id: 'avl', label: 'AVL & Balance', icon: ShieldCheck },
  { id: 'quiz', label: 'Final Quiz', icon: ShieldCheck },
];

export const Section = ({ title, icon: Icon, children, id }: { title: string; icon: any; children?: React.ReactNode; id: string }) => (
  <section id={id} className="mb-12 sm:mb-20 lg:mb-24 scroll-mt-24 sm:scroll-mt-32 px-1 section-target">
    <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 border-b border-gray-100 pb-4 sm:pb-6">
      <div className="p-2.5 sm:p-4 bg-blue-100 rounded-xl sm:rounded-2xl text-blue-600 shadow-sm shrink-0">
        <Icon size={20} className="sm:w-7 sm:h-7" />
      </div>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">{title}</h2>
    </div>
    <div className="space-y-6 sm:space-y-10">
      {children}
    </div>
  </section>
);

export const Card = ({ title, subtitle, children, className = "" }: { title?: string; subtitle?: string; children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-[1.5rem] sm:rounded-[3rem] shadow-xl shadow-gray-200/30 border border-gray-100 overflow-hidden ${className}`}>
    {(title || subtitle) && (
      <div className="px-6 py-5 sm:px-10 sm:py-8 border-b border-gray-100 bg-gray-50/50">
        {title && <h3 className="font-black text-gray-900 text-lg sm:text-2xl leading-tight tracking-tight">{title}</h3>}
        {subtitle && <p className="text-xs sm:text-base text-gray-500 mt-1 font-medium leading-relaxed">{subtitle}</p>}
      </div>
    )}
    <div className="p-6 sm:p-10">
      {children}
    </div>
  </div>
);

export const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [activeId, setActiveId] = useState('intro');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-10% 0px -70% 0px' }
    );

    const sections = document.querySelectorAll('.section-target');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-gray-950/40 backdrop-blur-md z-[60] lg:hidden transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-[85%] sm:w-80 bg-white border-r border-gray-100 overflow-y-auto transform transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:w-80 lg:shadow-none
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-8 sm:p-10">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                 <Layers size={22} />
              </div>
              <h1 className="font-black text-2xl text-gray-900 tracking-tighter uppercase">TreeMaster</h1>
            </div>
            <button 
              onClick={onClose} 
              className="lg:hidden p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400 border border-gray-100 active:scale-95"
            >
              <X size={24}/>
            </button>
          </div>
          
          <nav className="space-y-1">
            {navItems.map(item => {
              const isActive = activeId === item.id;
              return (
                <a 
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={onClose}
                  className={`
                    flex items-center justify-between px-5 py-4 text-[15px] font-black rounded-2xl transition-all group border-2
                    ${isActive 
                      ? 'bg-blue-50 border-blue-100 text-blue-700 shadow-sm translate-x-1' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={20} className={`${isActive ? 'text-blue-600' : 'text-gray-300 group-hover:text-gray-500'} transition-colors`} />
                    {item.label}
                  </div>
                  {isActive && <ChevronRight size={16} className="text-blue-400" />}
                </a>
              );
            })}
          </nav>
          
          <div className="mt-16 p-6 sm:p-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100/50 shadow-inner">
             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
                  <ShieldCheck size={16} className="text-indigo-600" />
             </div>
             <p className="text-[10px] font-black text-indigo-800 uppercase tracking-widest mb-2">Algorithm Fact</p>
             <p className="text-xs text-indigo-700/80 leading-relaxed font-bold italic">Balanced trees prevent worst-case O(n) complexity, keeping your apps lightning fast!</p>
          </div>
        </div>
      </aside>
    </>
  );
};
