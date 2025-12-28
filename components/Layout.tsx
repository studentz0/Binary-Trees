
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
  <section id={id} className="mb-10 sm:mb-20 lg:mb-24 scroll-mt-20 sm:scroll-mt-32 section-target">
    <div className="flex items-center gap-3 mb-6 sm:mb-10 border-b border-gray-100 pb-3 sm:pb-6">
      <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shadow-sm shrink-0">
        <Icon size={18} className="sm:w-6 sm:h-6" />
      </div>
      <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-none">{title}</h2>
    </div>
    <div className="space-y-6 sm:space-y-10">
      {children}
    </div>
  </section>
);

export const Card = ({ title, subtitle, children, className = "" }: { title?: string; subtitle?: string; children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl sm:rounded-[2.5rem] shadow-xl shadow-gray-200/20 border border-gray-100 overflow-hidden ${className}`}>
    {(title || subtitle) && (
      <div className="px-4 py-4 sm:px-10 sm:py-8 border-b border-gray-100 bg-gray-50/50">
        {title && <h3 className="font-black text-gray-900 text-base sm:text-2xl leading-tight tracking-tight">{title}</h3>}
        {subtitle && <p className="text-[10px] sm:text-base text-gray-500 mt-1 font-medium leading-relaxed">{subtitle}</p>}
      </div>
    )}
    <div className="p-4 sm:p-10">
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
      { threshold: 0.1, rootMargin: '-20% 0px -60% 0px' }
    );

    const sections = document.querySelectorAll('.section-target');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-gray-950/40 backdrop-blur-sm z-[60] lg:hidden transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-64 sm:w-80 bg-white border-r border-gray-100 overflow-y-auto transform transition-transform duration-300 ease-in-out
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:w-80 lg:shadow-none
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-6 sm:p-10">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-xl shadow-blue-100">
                 <Layers size={18} />
              </div>
              <h1 className="font-black text-lg sm:text-2xl text-gray-900 tracking-tighter uppercase">TreeMaster</h1>
            </div>
            <button 
              onClick={onClose} 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-400 border border-gray-100"
            >
              <X size={20}/>
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
                    flex items-center justify-between px-4 py-3 text-[13px] sm:text-[15px] font-bold rounded-xl transition-all group border-2
                    ${isActive 
                      ? 'bg-blue-50 border-blue-100 text-blue-700 shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <item.icon size={18} className={`${isActive ? 'text-blue-600' : 'text-gray-300 group-hover:text-gray-500'}`} />
                    {item.label}
                  </div>
                  {isActive && <ChevronRight size={14} className="text-blue-400" />}
                </a>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
