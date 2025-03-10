import React from 'react';
import CarePlanPreview from './CarePlanPreview';

// This component is a simple re-export of CarePlanPreview to maintain compatibility
// with any existing imports that might be using CarePlanRenderer
interface CarePlanRendererProps {
  code: string;
}

const CarePlanRenderer: React.FC<CarePlanRendererProps> = ({ code }) => {
  return (
    <CarePlanPreview 
      code={code} 
      onClose={() => {}} 
      isVisible={true} 
    />
  );
};

export default CarePlanRenderer;
