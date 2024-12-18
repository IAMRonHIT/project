import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Accordion({ title, children, defaultOpen = false, className = '' }: AccordionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={`border-b border-gray-200 dark:border-white/10 ${className}`}>
      <button
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-sm text-gray-900 dark:text-white">{title}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-white/60" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500 dark:text-white/60" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-gray-600 dark:text-white/80">
          {children}
        </div>
      )}
    </div>
  );
}
