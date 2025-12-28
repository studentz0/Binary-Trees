import React from 'react';

interface NodeProps {
  x: number;
  y: number;
  value: string | number;
  highlight?: boolean;
  type?: 'default' | 'root' | 'leaf' | 'op' | 'var';
  label?: string;
  onClick?: () => void;
  ghost?: boolean;
}

export const Node: React.FC<NodeProps> = ({ x, y, value, highlight, type = "default", label, onClick, ghost }) => {
  const getColors = () => {
    if (ghost) return "fill-white stroke-dashed stroke-gray-300 text-gray-300 hover:fill-gray-50";
    if (highlight) return "fill-blue-600 stroke-blue-700 text-white shadow-lg";
    
    switch(type) {
      case 'root': return "fill-indigo-600 stroke-indigo-700 text-white";
      case 'leaf': return "fill-emerald-50 stroke-emerald-200 text-emerald-700";
      case 'op': return "fill-orange-50 stroke-orange-200 text-orange-700";
      case 'var': return "fill-sky-50 stroke-sky-200 text-sky-700";
      default: return "fill-white stroke-gray-300 text-gray-700";
    }
  };

  const textColor = ghost ? "fill-gray-300" : (highlight || type === 'root') ? "fill-white" : "fill-gray-800";

  return (
    <g onClick={onClick} className={`transition-all duration-500 ease-in-out ${onClick ? 'cursor-pointer hover:scale-110 origin-center' : ''}`} style={{ transformOrigin: `${x}px ${y}px` }}>
      <circle cx={x} cy={y} r="18" className={`${getColors()} stroke-2 transition-all duration-300`} />
      <text x={x} y={y} dy=".35em" textAnchor="middle" className={`text-xs sm:text-sm font-extrabold pointer-events-none ${textColor} font-mono`}>
        {value}
      </text>
      {label && (
        <text x={x} y={y + 32} textAnchor="middle" className="text-[8px] sm:text-[10px] fill-gray-400 font-bold uppercase tracking-widest">
          {label}
        </text>
      )}
    </g>
  );
};

export const Edge: React.FC<{ x1: number; y1: number; x2: number; y2: number; highlight?: boolean }> = ({ x1, y1, x2, y2, highlight }) => (
  <line 
    x1={x1} y1={y1} x2={x2} y2={y2} 
    className={`stroke-2 ${highlight ? 'stroke-blue-500 stroke-[3px]' : 'stroke-gray-200'} transition-all duration-500 ease-in-out`} 
  />
);