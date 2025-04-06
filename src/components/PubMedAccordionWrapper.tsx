import React, { useEffect, useState } from 'react';
import { formatPubMedArticle, formatPubMedResults } from '../utils/pubMedFormatters';

interface PubMedArticle {
  pmid?: string;
  pmcid?: string;
  hasFullText?: boolean;
  title?: string;
}

interface PubMedAccordionWrapperProps {
  results: {
    type: 'pubmed';
    results: any;
  };
  onGetFullText?: (pmcid: string) => Promise<any>;
  onSaveToPatient?: (articles: PubMedArticle[]) => Promise<void>;
}

const PubMedAccordionWrapper: React.FC<PubMedAccordionWrapperProps> = ({ 
  results,
  onGetFullText,
  onSaveToPatient
}) => {
  const [formattedData, setFormattedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fullTextData, setFullTextData] = useState<Record<string, any>>({});

  useEffect(() => {
    const formatData = async () => {
      try {
        // Check if this is a single article or search results
        let formatted;
        if (results.results.articles && Array.isArray(results.results.articles)) {
          formatted = await formatPubMedResults(results.results);
        } else if (results.results.pmid || results.results.title) {
          formatted = await formatPubMedArticle(results.results);
        } else {
          // Default format for unknown structures
          formatted = {
            type: 'pubmed',
            sections: [
              {
                title: 'PubMed Response',
                content: 'Unable to parse PubMed response. Please try again.'
              }
            ],
            meta: {
              totalResults: 1,
              searchQuery: 'Unknown query'
            }
          };
        }
        
        setFormattedData(formatted);
      } catch (error) {
        // Silent error handling
      } finally {
        setLoading(false);
      }
    };

    formatData();
  }, [results]);

  const handleGetFullText = async (pmcid: string) => {
    if (!onGetFullText) return;
    
    try {
      // Call the provided function to get full text
      const fullTextResult = await onGetFullText(pmcid);
      
      // Format the full text result
      const formattedFullText = await formatPubMedArticle({
        ...fullTextResult,
        title: `Full Text: ${fullTextResult.title || 'Article'}`
      });
      
      // Store the formatted full text
      setFullTextData(prev => ({
        ...prev,
        [pmcid]: formattedFullText
      }));
      
      // If we have formatted data, append the full text sections
      if (formattedData) {
        const updatedSections = [...formattedData.sections];
        
        // Find the article with this PMCID
        const articleIndex = formattedData.meta?.articles?.findIndex(
          (article: PubMedArticle) => article.pmcid === pmcid
        );
        
        if (articleIndex !== undefined && articleIndex >= 0) {
          // Add full text sections after this article's section
          const insertPosition = articleIndex + 1;
          
          // Add a "Full Text" header section
          updatedSections.splice(insertPosition, 0, {
            title: `Full Text for Article ${articleIndex + 1}`,
            content: `# Full Text\n\nFull text retrieved from PMC (${pmcid})`
          });
          
          // Add the formatted full text sections
          formattedFullText.sections.forEach((section: any, idx: number) => {
            if (section.title !== '📝 Citation') { // Skip duplicate citation
              updatedSections.splice(insertPosition + idx + 1, 0, {
                ...section,
                title: `${section.title} (Full Text)`
              });
            }
          });
          
          // Update the formatted data with the new sections
          setFormattedData({
            ...formattedData,
            sections: updatedSections
          });
        }
      }
      
      return fullTextResult;
    } catch (error) {
      // Silent error handling
      throw error;
    }
  };

  const handleSaveToPatient = async (articles: PubMedArticle[]) => {
    if (!onSaveToPatient) return;
    
    try {
      await onSaveToPatient(articles);
      // Could show a success message or update UI here
    } catch (error) {
      // Silently handle error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!formattedData) {
    return <div>Error formatting PubMed data</div>;
  }
  return (
    <div className="pubmed-accordion-container">
      {/* TODO: Create and import PubMedAccordion component */}
      <div className="pubmed-accordion">
        {formattedData.sections.map((section, index) => (
          <div key={index} className="accordion-section">
            <h3>{section.title}</h3>
            <div className="p-3 whitespace-pre-wrap text-sm">
              {typeof section.content === 'string' 
                ? section.content 
                : 'Content not available in text format'}
            </div>
          </div>
        ))}
      </div>
      {/* Temporary implementation until PubMedAccordion component is created */}
      {onGetFullText && (
        <button onClick={() => handleGetFullText(formattedData.article)}>
          Get Full Text
        </button>
      )}
      {onSaveToPatient && (
        <button onClick={() => handleSaveToPatient([formattedData.article])}>
          Save to Patient
        </button>
      )}
    </div>
  );
};

export default PubMedAccordionWrapper;
