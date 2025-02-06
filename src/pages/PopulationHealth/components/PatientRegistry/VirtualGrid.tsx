import React, { useRef } from 'react';
import { useVirtual } from 'react-virtual';

interface VirtualGridProps {
  children: React.ReactNode;
  className?: string;
}

function VirtualGrid({ children, className = '' }: VirtualGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtual({
    size: React.Children.count(children),
    parentRef,
    estimateSize: React.useCallback(() => 60, []), // Estimate row height
    overscan: 5, // Number of items to render outside of the visible window
  });

  return (
    <div
      ref={parentRef}
      className={`max-h-[600px] overflow-auto ${className}`}
    >
      <div
        ref={scrollingRef}
        className="relative w-full"
        style={{
          height: `${rowVirtualizer.totalSize}px`,
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualRow) => (
          <div
            key={virtualRow.index}
            className="absolute top-0 left-0 w-full"
            style={{
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {React.Children.toArray(children)[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualGrid;