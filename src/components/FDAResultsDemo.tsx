import React from 'react';
import FDAResults from './FDAResults';

const sampleDrugData = {
  type: 'drug' as const,
  sections: [
    {
      title: 'Description',
      content: '**ASPIRIN** (acetylsalicylic acid) is a nonsteroidal anti-inflammatory drug (NSAID) that exhibits anti-inflammatory, analgesic, and antipyretic activities.'
    },
    {
      title: 'Indications and Usage',
      content: '### Primary Uses\n\n- Pain relief\n- Fever reduction\n- Prevention of heart attacks and strokes\n\n### Specific Indications\n\n1. Mild to moderate pain\n2. Fever\n3. Inflammatory conditions'
    },
    {
      title: 'Dosage and Administration',
      content: '### Adult Dosing\n\n- **Pain/Fever:** 325-650 mg every 4-6 hours\n- **Anti-inflammatory:** 650 mg every 4-6 hours\n- **Cardiovascular:** 81-325 mg once daily\n\n> Do not exceed 4,000 mg in 24 hours'
    },
    {
      title: 'Warnings and Precautions',
      content: '⚠️ **Important Safety Information**\n\n1. May cause stomach bleeding\n2. Children and teenagers should not use for viral infections\n3. Reye\'s syndrome risk in children\n\n### Contraindications\n\n- Active bleeding\n- Severe asthma\n- Known hypersensitivity'
    }
  ],
  meta: {
    totalResults: 1,
    searchQuery: 'aspirin'
  }
};

const FDAResultsDemo: React.FC = () => {
  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          FDA Results Component Demo
        </h1>
        <FDAResults results={sampleDrugData} />
      </div>
    </div>
  );
};

export default FDAResultsDemo;
