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
        console.log('Raw PubMed data:', results);
        
        // Check if this is a single article or search results
        let formatted;
        if (results.results.articles && Array.isArray(results.results.articles)) {
          console.log('Formatting as PubMed search results');
          formatted = await formatPubMedResults(results.results);
        } else if (results.results.pmid || results.results.title) {
          console.log('Formatting as single PubMed article');
          formatted = await formatPubMedArticle(results.results);
        } else {
          // Default format for unknown structures
          console.log('Unknown PubMed response format, using raw data');
          formatted = {
            type: 'pubmed',
            sections: [
              {
                title: 'PubMed Response',
                content: JSON.stringify(results.results, null, 2)
              }
            ],
            meta: {
              totalResults: 1,
              searchQuery: 'Unknown query'
            }
          };
        }
        
        console.log('Formatted PubMed data:', formatted);
        setFormattedData(formatted);
      } catch (error) {
        console.error('Error formatting PubMed data:', error);
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
      console.error('Error getting full text:', error);
      throw error;
    }
  };

  const handleSaveToPatient = async (articles: PubMedArticle[]) => {
    if (!onSaveToPatient) return;
    
    try {
      await onSaveToPatient(articles);
      // Could show a success message or update UI here
    } catch (error) {
      console.error('Error saving to patient record:', error);
      throw error;
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
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
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
