import React from 'react';
import { useTheme } from '../../hooks/useTheme';

interface PieSegment {
  value: number;
  color: string;
  label: string;
}

interface PieChartProps {
  data: PieSegment[];
  height?: number;
}

export function PieChart({ data, height = 400 }: PieChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const total = data.reduce((sum, segment) => sum + segment.value, 0);
  const centerX = 200;
  const centerY = 200;
  const radius = 150;

  // Calculate all segments
  let startAngle = 0;
  const segments = data.map(dataSegment => {
    const percentage = dataSegment.value / total;
    const angle = percentage * 2 * Math.PI;
    const endAngle = startAngle + angle;
    
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    
    const segmentData = {
      path,
      color: dataSegment.color,
      label: dataSegment.label,
      value: dataSegment.value,
      percentage,
      startAngle,
      endAngle
    };
    
    startAngle = endAngle;
    return segmentData;
  });

  return (
    <div className="relative" style={{ height }}>
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.2))' }}
      >
        <defs>
          {segments.map((segment, i) => (
            <linearGradient
              key={`gradient-${i}`}
              id={`segment-gradient-${i}`}
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor={`${segment.color}ff`} />
              <stop offset="100%" stopColor={`${segment.color}88`} />
            </linearGradient>
          ))}
          {segments.map((segment, i) => (
            <filter key={`glow-${i}`} id={`glow-${i}`}>
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          ))}
        </defs>
        
        {segments.map((segment, i) => (
          <g key={i} className="group transition-transform duration-300 hover:scale-105">
            <path
              d={segment.path}
              fill={`url(#segment-gradient-${i})`}
              className="transition-all duration-300 hover:brightness-125"
              style={{
                filter: `url(#glow-${i})`,
                opacity: 0.9
              }}
            />
            
            {/* Label line and text */}
            {segment.percentage > 0.05 && (
              <g>
                {/* Calculate label position */}
                {(() => {
                  const midAngle = (segment.startAngle + segment.endAngle) / 2;
                  const labelRadius = radius * 1.2;
                  const x = centerX + labelRadius * Math.cos(midAngle);
                  const y = centerY + labelRadius * Math.sin(midAngle);
                  
                  return (
                    <>
                      <line
                        x1={centerX + radius * 0.8 * Math.cos(midAngle)}
                        y1={centerY + radius * 0.8 * Math.sin(midAngle)}
                        x2={x}
                        y2={y}
                        stroke={segment.color}
                        strokeWidth="2"
                        className="opacity-50 group-hover:opacity-100 transition-opacity"
                      />
                      <text
                        x={x + (Math.cos(midAngle) > 0 ? 10 : -10)}
                        y={y}
                        fill={isDark ? '#ffffff' : '#00344E'}
                        fontSize="12"
                        textAnchor={Math.cos(midAngle) > 0 ? 'start' : 'end'}
                        alignmentBaseline="middle"
                        className="opacity-75 group-hover:opacity-100 transition-opacity"
                      >
                        {segment.label} ({(segment.percentage * 100).toFixed(1)}%)
                      </text>
                    </>
                  );
                })()}
              </g>
            )}
          </g>
        ))}
        
        {/* Center circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.5}
          fill="#1E2024"
          className="stroke-accent/20"
          strokeWidth="2"
        />
        
        {/* Total in center */}
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          fill={isDark ? '#ffffff' : '#00344E'}
          fontSize="24"
          fontWeight="bold"
        >
          {total}
        </text>
        <text
          x={centerX}
          y={centerY + 20}
          textAnchor="middle"
          fill={isDark ? '#ffffff99' : '#00344E99'}
          fontSize="14"
        >
          Total
        </text>
      </svg>
    </div>
  );
}
