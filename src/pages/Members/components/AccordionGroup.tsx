import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ title, children, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border-b border-gray-200 dark:border-white/10">
      <button
        className="w-full px-4 py-3 flex items-center justify-between hover:"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-50 dark:hover:bg-white/5 transition-colors"
        onClick={onToggle}
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

interface AccordionGroup {
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

interface AccordionGroupProps {
  accordions: AccordionGroup[];
  className?: string;
}

export function AccordionGroup({ accordions, className = '' }: AccordionGroupProps) {
  const [openAccordions, setOpenAccordions] = React.useState<boolean[]>(
    accordions.map(accordion => accordion.defaultOpen ?? false)
  );

  const toggleAccordion = (index: number) => {
    setOpenAccordions(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className={className}>
      {accordions.map((accordion, index) => (
        <AccordionItem
          key={accordion.title}
          title={accordion.title}
          isOpen={openAccordions[index]}
          onToggle={() => toggleAccordion(index)}
        >
          {accordion.content}
        </AccordionItem>
      ))}
    </div>
  );
}
