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
    if (ghost) return { fill: '#ffffff', stroke: '#e5e7eb', strokeDasharray: '4 4' };
    if (highlight) return { fill: '#2563eb', stroke: '#1d4ed8' };
    
    switch(type) {
      case 'root': return { fill: '#4f46e5', stroke: '#4338ca' };
      case 'leaf': return { fill: '#f0fdf4', stroke: '#bbf7d0' };
      case 'op': return { fill: '#fff7ed', stroke: '#fed7aa' };
      case 'var': return { fill: '#f0f9ff', stroke: '#bae6fd' };
      default: return { fill: '#ffffff', stroke: '#d1d5db' };
    }
  };

  const style = getColors();
  const isDark = highlight || type === 'root';
  const textColor = ghost ? '#d1d5db' : isDark ? '#ffffff' : '#1f2937';

  return (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <circle 
        cx={x} 
        cy={y} 
        r="18" 
        style={{ 
          fill: style.fill, 
          stroke: style.stroke, 
          strokeWidth: '2.5px',
          ...(style.strokeDasharray ? { strokeDasharray: style.strokeDasharray } : {})
        }} 
      />
      <text 
        x={x} 
        y={y} 
        dy=".35em" 
        textAnchor="middle" 
        style={{ 
          fill: textColor, 
          fontSize: '13px', 
          fontWeight: '800', 
          fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          pointerEvents: 'none'
        }}
      >
        {value}
      </text>
      {label && (
        <text 
          x={x} 
          y={y + 34} 
          textAnchor="middle" 
          style={{ 
            fill: '#6b7280', 
            fontSize: '10px', 
            fontWeight: '800', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {label}
        </text>
      )}
    </g>
  );
};

export const Edge: React.FC<{ x1: number; y1: number; x2: number; y2: number; highlight?: boolean }> = ({ x1, y1, x2, y2, highlight }) => (
  <line 
    x1={x1} y1={y1} x2={x2} y2={y2} 
    style={{ 
      stroke: highlight ? '#3b82f6' : '#cbd5e1', 
      strokeWidth: highlight ? '3.5px' : '2px',
      strokeLinecap: 'round'
    }} 
  />
);