import React from 'react';
interface BarSegment {
  value: number;
  color: string;
  label: string;
}

interface StackedBarChartProps {
  data: {
    label: string;
    segments: BarSegment[];
  }[];
  height?: number;
}

export function StackedBarChart({ data, height = 200 }: StackedBarChartProps) {
  console.log("StackedBarChart received data:", data);
  
  if (!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-gray-400">No data available</div>;
  }

  const maxTotal = Math.max(...data.map(item =>
    item.segments.reduce((sum, segment) => sum + segment.value, 0)
  )) || 0;
  console.log("StackedBarChart - Max Total:", maxTotal);
  
  // Calculate dynamic bar width based on number of data points
  const minBarWidth = 30; // Minimum width to ensure readability
  const maxBarWidth = 80; // Maximum width to prevent bars from being too wide
  const calculatedWidth = Math.min(maxBarWidth, Math.max(minBarWidth, 200 / data.length));
  const barWidth = calculatedWidth; // Dynamic width based on data points

  // Calculate dynamic gap between bars based on number of elements
  const minGap = 20; // Minimum gap between bars
  const maxGap = 60; // Maximum gap between bars
  const gapSize = Math.min(maxGap, Math.max(minGap, 120 / data.length));

  return (
    <div className="relative w-full pl-16" style={{ height: `${height}px` }}>
      <div className="absolute inset-0 pl-16">
        {[...Array(6)].map((_, i) => {
          const value = maxTotal > 0 ? Math.round((maxTotal / 5) * (5 - i)) : 0;
          return (
            <div
              key={i}
              className="absolute w-full h-[1px] bg-white/10"
              style={{ top: `${i * 20}%` }}
            >
              <span className="absolute -left-12 -translate-y-1/2 text-xs text-gray-400">
                {value}
              </span>
            </div>
          );
        })}
      </div>
      <div 
        className="relative h-full flex items-end justify-center gap-x-[var(--gap)] pt-8 pb-12 transition-all duration-500" 
        style={{ 
          '--gap': `${gapSize}px`,
          paddingLeft: '48px',
          paddingRight: '48px'
        } as React.CSSProperties}
      >
        {data.map((bar, barIndex) => {
          let heightAccumulator = 0;
          console.log(`Bar ${barIndex}:`, bar);
          const reversedSegments = [...bar.segments].reverse();

          return (
            <div
              key={barIndex}
              className="relative group animate-fade-in-up"
              style={{ 
                width: `${barWidth}px`, 
                height: '100%',
                animationDelay: `${barIndex * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <div className="relative h-full transition-all duration-500">
                {reversedSegments.map((segment, segmentIndex) => {
                  const segmentHeight = maxTotal > 0 ? (segment.value / maxTotal) * 100 : 0;
                  const currentHeight = heightAccumulator;
                  heightAccumulator += segmentHeight;
                  return (
                    <div
                      key={segmentIndex}
                      className="absolute w-full rounded-sm transition-all duration-500 origin-bottom animate-grow-up group-hover:scale-[1.02]"
                      style={{
                        height: `${segmentHeight}%`,
                        bottom: `${currentHeight}%`,
                        background: `linear-gradient(180deg, 
                          ${segment.color}ff,
                          ${segment.color}88
                        )`,
                        boxShadow: `0 0 10px ${segment.color}33, inset 0 0 15px ${segment.color}22`,
                        animationDelay: `${barIndex * 100 + segmentIndex * 100}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap transition-all duration-200 z-10">
                        {segment.label}: {segment.value}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap transition-all duration-500">
                {bar.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
