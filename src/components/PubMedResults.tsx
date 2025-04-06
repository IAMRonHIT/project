import React from 'react';
import PubMedResponseManager from './PubMedResponseManager';

interface PubMedResultsProps {
  results: {
    type: 'pubmed';
    results: any;
  };
}

const PubMedResults: React.FC<PubMedResultsProps> = ({ results }) => {
  // Direct pass-through to PubMedResponseManager
  if (!results || !results.results) {
    return null;
  }

  // Pass the data directly without any transformation
  return <PubMedResponseManager data={results.results} />;
};

export default PubMedResults;
