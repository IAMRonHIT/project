import React, { useEffect, useState } from 'react';
import PubMedResponseManager from './PubMedResponseManager';
import { formatPubMedArticle, formatPubMedResults } from '../utils/pubMedFormatters';

interface PubMedResultsProps {
  results: {
    type: 'pubmed';
    results: any;
  };
}

const PubMedResults: React.FC<PubMedResultsProps> = ({ results }) => {
  const [formattedData, setFormattedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!formattedData) {
    return <div>Error formatting PubMed data</div>;
  }

  return <PubMedResponseManager data={formattedData} />;
};

export default PubMedResults;
