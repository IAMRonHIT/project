import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, X, Pill, Bookmark, Copy, AlertCircle } from 'lucide-react';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';

interface FDASection {
  title: string;
  content: string;
  isWarning?: boolean;
}

interface FDAAccordionProps {
  data: any; // FDA API response data
  onClose: () => void;
}

const FDAAccordion: React.FC<FDAAccordionProps> = ({ data, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [showNotes, setShowNotes] = useState(false);
  const [selectionToolbar, setSelectionToolbar] = useState({ visible: false, x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  
  const result = data.results?.[0];

  if (!result) {
    return null;
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // Get all available sections from the result
  const warningKeys = ['boxed_warning', 'warnings', 'warnings_and_precautions', 'contraindications'];
  
  // Handle text selection
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectionToolbar({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.top - 40
      });
    } else {
      setSelectionToolbar({ visible: false, x: 0, y: 0 });
    }
  };

  // Add selected text to notes
  const addToNotes = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSavedNotes(prev => [...prev, selection.toString().trim()]);
      setSelectionToolbar({ visible: false, x: 0, y: 0 });
      selection.removeAllRanges();
    }
  };

  const removeNote = (index: number) => {
    setSavedNotes(prev => prev.filter((_, i) => i !== index));
  };
  
  const sections = Object.entries(result)
    .filter(([key, value]) => 
      Array.isArray(value) && 
      value.length > 0 && 
      !key.startsWith('openfda') &&
      !key.includes('product_elements') &&
      !key.includes('spl_product_data')
    )
    .map(([key, value]) => {
      // Create a shorter title for long sections
      let title = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      // If title is too long, shorten it
      if (title.length > 30) {
        // Try to find a good breaking point
        const breakIndex = title.indexOf(' And ', 15);
        if (breakIndex > 0) {
          title = title.substring(0, breakIndex) + '...';
        } else {
          title = title.substring(0, 30) + '...';
        }
      }
      
      return {
        id: key,
        title,
        content: value as string[],
        isWarning: warningKeys.includes(key)
      };
    });

  // Unified content renderer
  const renderContent = (text: string, isWarning: boolean, sectionId: string) => {
    // Clean the HTML first
    const sanitizedContent = DOMPurify.sanitize(text, {
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'ul', 'ol', 'li', 'br']
    });
    
    // If it contains table markup, render it as HTML
    if (sanitizedContent.includes('<table') || sanitizedContent.includes('<tr')) {
      return (
        <div className="w-full overflow-x-auto">
          {parse(sanitizedContent, {
            replace: (domNode) => {
              if (domNode.type === 'tag') {
                // Apply custom styles to table elements
                if (domNode.name === 'table') {
                  domNode.attribs.class = 'w-full border-collapse border border-indigo-500/30 my-2';
                } else if (domNode.name === 'tr') {
                  // Fix the TypeScript error by adding a null check
                  const nodeIndex = domNode.parent?.children?.indexOf?.(domNode) ?? 0;
                  const isEven = nodeIndex % 2 === 0;
                  domNode.attribs.class = isEven ? 'bg-indigo-500/5' : 'bg-gray-900/60';
                } else if (domNode.name === 'td' || domNode.name === 'th') {
                  domNode.attribs.class = 'border border-indigo-500/30 p-2';
                }
              }
              return undefined;
            }
          })}
        </div>
      );
    }
    
    // Convert the content to markdown-like bullet points
    const contentItems = splitContentIntoBulletPoints(sanitizedContent, sectionId);
    
    return (
      <div className="space-y-2">
        {contentItems.map((item, index) => (
          <div key={index} className="flex">
            <span className={`mr-2 ${isWarning ? 'text-rose-300' : 'text-indigo-400'}`}>•</span>
            <p className={`whitespace-pre-wrap leading-relaxed ${
              isWarning ? 'text-rose-100/90' : 'text-gray-300/90'
            }`}>{item.trim()}</p>
          </div>
        ))}
      </div>
    );
  };

  // Helper function to intelligently split content into bullet points
  const splitContentIntoBulletPoints = (content: string, sectionId: string): string[] => {
    // Remove any HTML tags
    let cleanContent = content.replace(/<[^>]*>/g, '');
    
    // Special case for dosage forms and strengths sections
    if (sectionId.includes('dosage_forms') || sectionId.includes('strength')) {
      // Check if it contains standard bullets or mg measurements
      if (cleanContent.includes('• ') || cleanContent.includes(' mg ')) {
        // Try to detect bullet points with strength info (like your first example)
        if (cleanContent.includes('• ')) {
          return cleanContent
            .split('• ')
            .filter(item => item.trim())
            .map(item => item.trim());
        }
        
        // If no bullets but contains mg, parse by dosage strengths
        if (cleanContent.includes(' mg ')) {
          // Split the prefix (like "3 DOSAGE FORMS AND STRENGTHS") from the actual dosages
          const prefixMatch = cleanContent.match(/^([^•]+?)(\d+(\.\d+)?\s*mg|•)/);
          const prefix = prefixMatch ? prefixMatch[1].trim() : '';
          
          // Remove the prefix from the content for parsing
          if (prefix) {
            cleanContent = cleanContent.substring(prefix.length).trim();
          }
          
          // Look for explicit capsule/tablet descriptions
          const dosageItems: string[] = [];
          
          // Try to match dosage patterns:
          // - 37.5 mg extended-release capsule: grey cap and peach body...
          // - 75 mg extended-release capsule: peach cap and body...
          const dosageRegex = /(\d+(\.\d+)?\s*mg\s*[^:•]+?)(?=\d+(\.\d+)?\s*mg|\(|\Z)/g;
          let match;
          
          while ((match = dosageRegex.exec(cleanContent)) !== null) {
            dosageItems.push(match[1].trim());
          }
          
          // If we found proper dosage items, return them
          if (dosageItems.length > 0) {
            return dosageItems;
          }
        }
      }
    }
    
    // Improved handling for ingredient lists
    if (sectionId.includes('ingredient') || 
        cleanContent.includes('HYDROCHLORIDE') || 
        cleanContent.includes('CAPSULE') ||
        cleanContent.includes('TABLET')) {
      
      // Check if this is a complex formulation list
      if (cleanContent.includes('CAPSULE') || 
          cleanContent.includes('TABLET') || 
          cleanContent.match(/W;[^;]+;\d+/)) {
        
        // First handle case with multiple formulations
        const formulations: string[] = [];
        const formulationPattern = /(Effexor XR|[A-Z]+\s*XR)[^W]*(W;[^;]+;\d+)/g;
        
        let formulationMatch;
        let lastIndex = 0;
        
        // Find all formulation pattern matches
        while ((formulationMatch = formulationPattern.exec(cleanContent)) !== null) {
          if (formulationMatch.index > lastIndex) {
            // There's content before this match - add it as a formulation
            formulations.push(cleanContent.substring(lastIndex, formulationMatch.index));
          }
          
          // Add this formulation
          formulations.push(formulationMatch[0]);
          lastIndex = formulationMatch.index + formulationMatch[0].length;
        }
        
        // Add any remaining content
        if (lastIndex < cleanContent.length) {
          formulations.push(cleanContent.substring(lastIndex));
        }
        
        // Process each formulation into components
        if (formulations.length > 0) {
          const result: string[] = [];
          
          formulations.forEach((formulation, index) => {
            // Extract the formulation identifier
            const idMatch = formulation.match(/W;[^;]+;\d+/);
            const formulationId = idMatch ? idMatch[0] : `Formulation ${index + 1}`;
            
            // Add a header for this formulation
            result.push(`${formulationId}:`);
            
            // Split ingredients using robust pattern recognition
            const ingredientPattern = /([A-Z][A-Z, ()]+)(?=[A-Z]{2}|$)/g;
            let ingredientMatch;
            
            // First try the pattern-based approach
            const ingredients: string[] = [];
            while ((ingredientMatch = ingredientPattern.exec(formulation)) !== null) {
              const ingredient = ingredientMatch[1].trim();
              if (ingredient && ingredient.length > 1 && 
                  !ingredient.includes('CAPSULE') && 
                  !ingredient.includes('TABLET') && 
                  !ingredient.match(/W;[^;]+;\d+/)) {
                ingredients.push(ingredient);
              }
            }
            
            // If that didn't work well, fall back to comma splitting
            if (ingredients.length < 3) {
              // Remove the formulation ID and any capsule/tablet text
              let cleanFormulation = formulation
                .replace(/W;[^;]+;\d+/, '')
                .replace(/\b(CAPSULE|TABLET)\b/g, '')
                .trim();
                
              // Split by commas, accounting for special cases
              const commaItems = cleanFormulation
                .split(/,\s*/)
                .map(ing => ing.trim())
                .filter(ing => ing.length > 0 && ing !== 'CAPSULE' && ing !== 'TABLET');
                
              result.push(...commaItems);
            } else {
              // Use the pattern-matched ingredients
              result.push(...ingredients);
            }
          });
          
          return result.filter(item => item.trim().length > 0);
        }
      }
      
      // For simple ingredient lists, split by commas but be careful with special pharmaceutical terms
      // First identify special terms that might have commas within them
      const specialTerms = [
        'GELATIN, UNSPECIFIED',
        'ETHYLCELLULOSE (100 MPA.S)',
        'HYPROMELLOSE, UNSPECIFIED',
        'HYPROMELLOSE 2910 (6 MPA.S)'
      ];
      
      // Replace commas in special terms temporarily
      let processedContent = cleanContent;
      specialTerms.forEach((term, i) => {
        processedContent = processedContent.replace(
          new RegExp(term, 'g'), 
          term.replace(/,/g, '|||COMMA|||')
        );
      });
      
      // Now split by commas
      const ingredients = processedContent
        .split(/,\s*/)
        .map(item => item.trim().replace(/\|\|\|COMMA\|\|\|/g, ','))
        .filter(item => item.length > 0);
        
      return ingredients;
    }
    
    // Warning sections - split by common warning phrases and periods
    if (sectionId.includes('warning') || sectionId.includes('precaution')) {
      const warningPhrases = [
        'Do not', 'Stop', 'Ask a doctor', 'When using', 'Keep out', 
        'If pregnant', 'Call', 'Get medical', 'If you have', 'May cause'
      ];
      
      // First split by sentences
      const sentences = cleanContent.split(/(?<=[.!?])\s+/);
      let results: string[] = [];
      
      sentences.forEach(sentence => {
        let added = false;
        
        // Check for warning phrases inside the sentence
        for (const phrase of warningPhrases) {
          const index = sentence.indexOf(phrase);
          if (index > 0) { // Only split if not at beginning
            results.push(sentence.substring(0, index).trim());
            results.push(sentence.substring(index).trim());
            added = true;
            break;
          }
        }
        
        if (!added) {
          results.push(sentence);
        }
      });
      
      return results.filter(item => item.trim().length > 0);
    }
    
    // Default: split by sentences for most content
    return cleanContent.split(/(?<=[.!?])\s+/).filter(s => s.trim());
  };

  return (
    <div className="fixed right-0 top-[65px] bottom-[136px] w-[450px] overflow-hidden flex flex-col 
      bg-gradient-to-b from-gray-900/90 via-gray-800/90 to-gray-900/90 border-l border-indigo-500/30 
      backdrop-blur-sm z-20">
      {/* Header with notes toggle */}
      <div className="p-4 border-b border-indigo-500/30 bg-gray-800/50 flex items-center justify-between relative">
        {/* Decorative elements */}
        <div className="absolute left-0 top-0 w-1/3 h-0.5 bg-gradient-to-r from-indigo-500/80 to-transparent"></div>
        <div className="absolute right-0 bottom-0 w-1/4 h-0.5 bg-gradient-to-l from-teal-500/80 to-transparent"></div>
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_5px_rgba(79,70,229,0.5)]">
            <Pill className="w-4 h-4 text-indigo-400" />
          </div>
          <h2 className="text-sm font-medium text-white">
            {result.openfda?.brand_name?.[0] || result.openfda?.generic_name?.[0] || 'Drug Information'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-1.5 rounded-md transition-colors relative ${
              savedNotes.length > 0 
                ? 'text-indigo-400 hover:bg-indigo-500/20' 
                : 'text-gray-400 hover:bg-indigo-500/10'
            }`}
            title="Your notes"
          >
            <Bookmark size={18} />
            {savedNotes.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full w-4 h-4 
                flex items-center justify-center shadow-[0_0_5px_rgba(79,70,229,0.5)]">
                {savedNotes.length}
              </span>
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-indigo-500/20 transition-colors relative group"
            aria-label="Close"
          >
            <X size={18} />
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </button>
        </div>
      </div>

      {/* Content area */}
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto py-4 px-3 space-y-3"
        onMouseUp={handleMouseUp}
      >
        {/* Show notes section if toggled */}
        {showNotes && savedNotes.length > 0 && (
          <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg 
            shadow-[0_0_10px_rgba(79,70,229,0.2)]">
            <h3 className="text-indigo-300 font-medium mb-2">Your Saved Notes</h3>
            <div className="space-y-2">
              {savedNotes.map((note, i) => (
                <div key={i} className="flex group">
                  <div className="flex-1 text-indigo-100 text-sm p-2 bg-gray-900/60 rounded border border-indigo-500/20">
                    {note}
                  </div>
                  <button 
                    onClick={() => removeNote(i)}
                    className="ml-2 p-1 opacity-0 group-hover:opacity-100 text-indigo-400 hover:text-indigo-300 transition-opacity"
                    aria-label="Remove note"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {sections.map(section => (
          <div
            key={section.id}
            className={`
              rounded-lg overflow-hidden transition-all duration-200
              ${section.isWarning 
                ? 'bg-gray-900/90 border border-rose-500/20 shadow-[0_0_10px_rgba(79,70,229,0.2),inset_0_0_30px_rgba(244,63,94,0.1)]' 
                : 'bg-gray-900/90 border border-indigo-500/30 shadow-[0_0_10px_rgba(79,70,229,0.2)]'
              }
              ${section.isWarning 
                ? 'hover:shadow-[0_0_15px_rgba(79,70,229,0.3),inset_0_0_40px_rgba(244,63,94,0.15)]' 
                : 'hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]'
              }
              backdrop-blur-sm
            `}
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 group relative overflow-hidden"
            >
              {/* Subtle animated background glow */}
              <div className={`absolute inset-0 ${
                section.isWarning
                  ? 'bg-gradient-to-r from-indigo-500/0 via-rose-500/5 to-indigo-500/0'
                  : 'bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0'
              } group-hover:opacity-100 opacity-0 transition-opacity duration-300 animate-pulse-glow`}></div>
              
              <span className={`text-sm font-medium transition-colors duration-200 relative z-10 ${
                section.isWarning 
                  ? 'text-rose-300 group-hover:text-rose-200' 
                  : 'text-indigo-400 group-hover:text-indigo-300'
              }`}>
                {section.title}
              </span>
              <div className={`transition-transform duration-200 relative z-10 ${
                expandedSections.has(section.id) ? 'rotate-180' : ''
              }`}>
                <ChevronDown className={`${
                  section.isWarning ? 'text-rose-300' : 'text-indigo-400'
                }`} size={16} />
              </div>
            </button>
            
            {expandedSections.has(section.id) && (
              <div className={`px-4 pb-3 pt-2 border-t text-sm space-y-2.5 ${
                section.isWarning 
                  ? 'border-rose-500/20 text-rose-100/90 bg-gradient-to-r from-rose-500/5 via-transparent to-transparent' 
                  : 'border-indigo-500/30 text-gray-300/90'
              }`}>
                {section.content.map((text, i) => (
                  <div key={i} className="content-section">
                    {renderContent(text, section.isWarning, section.id)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selection toolbar */}
      {selectionToolbar.visible && (
        <div 
          className="fixed bg-indigo-500 rounded-md shadow-lg py-1 px-2 text-white text-xs animate-fade-in z-50
            shadow-[0_0_10px_rgba(79,70,229,0.4)]"
          style={{ 
            left: `${selectionToolbar.x}px`, 
            top: `${selectionToolbar.y}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <button 
            onClick={addToNotes}
            className="flex items-center gap-1 hover:bg-indigo-600 p-1 rounded-sm transition-colors"
          >
            <Bookmark size={12} />
            <span>Save to Notes</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FDAAccordion;
