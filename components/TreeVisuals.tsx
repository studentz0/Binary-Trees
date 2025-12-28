
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
    if (ghost) return { fill: '#ffffff', stroke: '#e5e7eb', strokeDasharray: '3 3' };
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
        r="16" 
        style={{ 
          fill: style.fill, 
          stroke: style.stroke, 
          strokeWidth: '2px',
          transition: 'all 0.3s ease',
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
          fontSize: '11px', 
          fontWeight: '900', 
          fontFamily: 'JetBrains Mono, monospace',
          pointerEvents: 'none'
        }}
      >
        {value}
      </text>
      {label && (
        <text 
          x={x} 
          y={y + 28} 
          textAnchor="middle" 
          style={{ 
            fill: '#94a3b8', 
            fontSize: '8px', 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
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
      stroke: highlight ? '#3b82f6' : '#e2e8f0', 
      strokeWidth: highlight ? '3px' : '1.5px',
      strokeLinecap: 'round',
      transition: 'all 0.3s ease'
    }} 
  />
);
