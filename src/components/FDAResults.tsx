import React, { useEffect, useState } from 'react';
import FDAAccordion from './FDAAccordion';
import { formatDrugLabelResults } from '../utils/fdaFormatters';

interface FDAResultsProps {
  results: {
    type: 'drug' | 'device' | 'ndc' | 'recall';
    results: any;
  };
}

const FDAResults: React.FC<FDAResultsProps> = ({ results }) => {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Array<{
    title: string;
    content: string;
    isWarning?: boolean;
  }>>([]);
  const [meta, setMeta] = useState<{
    disclaimer?: string;
    searchQuery?: string;
  }>({});

  useEffect(() => {
    const formatData = async () => {
      try {
        const formatted = await formatDrugLabelResults(results.results);
        
        // Transform the formatted data into sections
        const transformedSections = formatted.sections.map(section => ({
          title: section.title,
          content: section.content,
          isWarning: section.title.toLowerCase().includes('warning') || 
                    section.title.toLowerCase().includes('precaution') ||
                    section.title.toLowerCase().includes('contraindication')
        }));

        setSections(transformedSections);
        setMeta({
          disclaimer: formatted.meta?.searchQuery,
          searchQuery: formatted.meta?.searchQuery
        });
      } catch (error) {
        console.error('Error formatting FDA data:', error);
        setSections([{
          title: 'Error',
          content: 'Failed to format FDA data',
          isWarning: true
        }]);
      } finally {
        setLoading(false);
      }
    };

    formatData();
  }, [results]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <FDAAccordion 
      sections={sections}
      meta={meta}
    />
  );
};

export default FDAResults;
