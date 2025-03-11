import React, { useState, useEffect } from 'react';
import { X, Code, PlayCircle, Copy } from 'lucide-react';

interface CarePlanPreviewProps {
  code: string;
  onClose: () => void;
  isVisible: boolean;
}

// Simple React-to-HTML converter for demo purposes
const convertReactToHTML = (code: string): string => {
  // We'll simply extract key sections from the React code
  // For a demo, this creates a realistic HTML representation without executing the React code
  
  // Extract patient name and condition from header if available
  const headerMatch = code.match(/<h1[^>]*>(.*?)<\/h1>/);
  let titleText = headerMatch ? headerMatch[1] : "Care Plan";
  
  // Aggressively look for the condition in the code, not just relying on the <h1> tag
  // Check if we have any specific medical condition mentioned
  const commonConditions = [
    "hypertension", "diabetes", "asthma", "COPD", "arthritis", 
    "depression", "anxiety", "heart disease", "stroke", "cancer",
    "alzheimer", "dementia", "epilepsy", "migraine", "HIV", "AIDS",
    "hepatitis", "cirrhosis", "kidney", "osteoporosis", "pneumonia"
  ];
  
  let detectedCondition: string | null = null;
  for (const condition of commonConditions) {
    const regex = new RegExp(`\\b${condition}\\b`, "i");
    if (regex.test(code)) {
      detectedCondition = condition;
      break;
    }
  }
  
  // If we found a specific condition, use it
  if (detectedCondition) {
    // Capitalize first letter
    const capitalizedCondition = detectedCondition.charAt(0).toUpperCase() + detectedCondition.slice(1);
    titleText = `${capitalizedCondition} Management Care Plan`;
  } else if (titleText.includes("Diabetes") && !code.toLowerCase().includes("diabetes")) {
    // Try to find a more generic condition if "Diabetes" seems to be a default
    const conditionMatch = code.match(/condition|diagnosis|disease|disorder|syndrome/i);
    if (conditionMatch && conditionMatch.index !== undefined) {
      // Look for words near this match
      const nearbyText = code.substring(
        Math.max(0, conditionMatch.index - 50), 
        Math.min(code.length, conditionMatch.index + 50)
      );
      const possibleCondition = nearbyText.match(/\b[A-Z][a-zA-Z\s]{3,15}\b/);
      if (possibleCondition) {
        titleText = `${possibleCondition[0]} Management Care Plan`;
      } else {
        titleText = "Management Care Plan";
      }
    }
  }
  
  // Extract patient name
  const patientMatch = code.match(/<p[^>]*>Patient: ([^<]+)<\/p>/);
  const patientName = patientMatch ? patientMatch[1] : "Sarah Johnson";
  
  // Extract assessment items
  const assessmentItems = extractListItems(code, "Assessment");
  
  // Extract diagnosis items
  const diagnosisItems = extractListItems(code, "Diagnosis");
  
  // Extract planning items
  const shortTermGoals = extractNestedListItems(code, "Short-term Goals");
  const longTermGoals = extractNestedListItems(code, "Long-term Goals");
  
  // Extract implementation items
  const medicationItems = extractNestedListItems(code, "Medication");
  const dietaryItems = extractNestedListItems(code, "Dietary");
  const activityItems = extractNestedListItems(code, "Activity");
  
  // Extract evaluation items
  const monitoringItems = extractNestedListItems(code, "Monitoring");
  const successItems = extractNestedListItems(code, "Success");
  
  // Create a more compact HTML output that better utilizes space
  return `
    <div class="care-plan-container" style="height: 100%; width: 100%; overflow-y: auto; font-family: system-ui, sans-serif;">
      <div style="background: linear-gradient(to right, #16a085, #3498db); color: white; padding: 1.5rem; position: sticky; top: 0; z-index: 10; width: 100%; box-sizing: border-box;">
        <h1 style="margin: 0; font-size: 1.75rem; font-weight: bold; width: 100%;">${titleText}</h1>
        <p style="margin: 0.25rem 0 0; opacity: 0.9;">Patient: ${patientName}</p>
      </div>
      
      <div style="padding: 1.5rem; width: 100%; box-sizing: border-box;">
        <div style="margin-bottom: 1.5rem; width: 100%;">
          <h2 style="color: #16a085; font-size: 1.4rem; font-weight: 600; border-bottom: 1px solid #e0f2f1; padding-bottom: 0.5rem; margin-bottom: 1rem; width: 100%;">Assessment</h2>
          <ul style="margin: 0; padding-left: 1.5rem; list-style-type: disc; width: 100%;">
            ${assessmentItems.length > 0 
              ? assessmentItems.map(item => `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">${item}</li>`).join('') 
              : `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Assessment Item 1}</li>
                 <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Assessment Item 2}</li>
                 <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Assessment Item 3}</li>`}
          </ul>
        </div>
        
        <div style="margin-bottom: 1.5rem; width: 100%;">
          <h2 style="color: #16a085; font-size: 1.4rem; font-weight: 600; border-bottom: 1px solid #e0f2f1; padding-bottom: 0.5rem; margin-bottom: 1rem; width: 100%;">Diagnosis</h2>
          <ul style="margin: 0; padding-left: 1.5rem; list-style-type: disc; width: 100%;">
            ${diagnosisItems.length > 0 
              ? diagnosisItems.map(item => `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">${item}</li>`).join('') 
              : `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Diagnosis Item 1}</li>
                 <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Diagnosis Item 2}</li>
                 <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Diagnosis Item 3}</li>`}
          </ul>
        </div>
        
        <div style="margin-bottom: 1.5rem; width: 100%;">
          <h2 style="color: #16a085; font-size: 1.4rem; font-weight: 600; border-bottom: 1px solid #e0f2f1; padding-bottom: 0.5rem; margin-bottom: 1rem; width: 100%;">Planning</h2>
          
          <div style="margin-bottom: 1rem; width: 100%;">
            <h3 style="color: #2980b9; font-size: 1.2rem; font-weight: 600; margin: 0.75rem 0 0.5rem; width: 100%;">Short-term Goals (1-2 weeks)</h3>
            <ul style="margin: 0; padding-left: 1.5rem; list-style-type: disc; width: 100%;">
              ${shortTermGoals.length > 0 
                ? shortTermGoals.map(item => `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">${item}</li>`).join('') 
                : `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Short-term Goal 1}</li>
                   <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Short-term Goal 2}</li>
                   <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Short-term Goal 3}</li>`}
            </ul>
          </div>
          
          <div style="margin-bottom: 1rem; width: 100%;">
            <h3 style="color: #2980b9; font-size: 1.2rem; font-weight: 600; margin: 0.75rem 0 0.5rem; width: 100%;">Long-term Goals (1-3 months)</h3>
            <ul style="margin: 0; padding-left: 1.5rem; list-style-type: disc; width: 100%;">
              ${longTermGoals.length > 0 
                ? longTermGoals.map(item => `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">${item}</li>`).join('') 
                : `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Long-term Goal 1}</li>
                   <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Long-term Goal 2}</li>
                   <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Long-term Goal 3}</li>`}
            </ul>
          </div>
        </div>
        
        <div style="margin-bottom: 1.5rem; width: 100%;">
          <h2 style="color: #16a085; font-size: 1.4rem; font-weight: 600; border-bottom: 1px solid #e0f2f1; padding-bottom: 0.5rem; margin-bottom: 1rem; width: 100%;">Interventions</h2>
          
          <div style="margin-bottom: 1rem; width: 100%;">
            <h3 style="color: #2980b9; font-size: 1.2rem; font-weight: 600; margin: 0.75rem 0 0.5rem; width: 100%;">Medication Management</h3>
            <ul style="margin: 0; padding-left: 1.5rem; list-style-type: disc; width: 100%;">
              ${medicationItems.length > 0 
                ? medicationItems.map(item => `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">${item}</li>`).join('') 
                : `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Medication Intervention 1}</li>
                   <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Medication Intervention 2}</li>
                   <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Medication Intervention 3}</li>`}
            </ul>
          </div>
          
          <div style="margin-bottom: 1rem; width: 100%;">
            <h3 style="color: #2980b9; font-size: 1.2rem; font-weight: 600; margin: 0.75rem 0 0.5rem; width: 100%;">Dietary Interventions</h3>
            <ul style="margin: 0; padding-left: 1.5rem; list-style-type: disc; width: 100%;">
              ${dietaryItems.length > 0 
                ? dietaryItems.map(item => `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">${item}</li>`).join('') 
                : `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Dietary Intervention 1}</li>
                   <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Dietary Intervention 2}</li>
                   <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Dietary Intervention 3}</li>`}
            </ul>
          </div>
          
          <div style="margin-bottom: 1rem; width: 100%;">
            <h3 style="color: #2980b9; font-size: 1.2rem; font-weight: 600; margin: 0.75rem 0 0.5rem; width: 100%;">Activity Plan</h3>
            <ul style="margin: 0; padding-left: 1.5rem; list-style-type: disc; width: 100%;">
              ${activityItems.length > 0 
                ? activityItems.map(item => `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">${item}</li>`).join('') 
                : `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Activity Intervention 1}</li>
                   <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Activity Intervention 2}</li>
                   <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Activity Intervention 3}</li>`}
            </ul>
          </div>
        </div>
        
        <div style="margin-bottom: 1.5rem; width: 100%;">
          <h2 style="color: #16a085; font-size: 1.4rem; font-weight: 600; border-bottom: 1px solid #e0f2f1; padding-bottom: 0.5rem; margin-bottom: 1rem; width: 100%;">Evaluation</h2>
          
          <div style="margin-bottom: 1rem; width: 100%;">
            <h3 style="color: #2980b9; font-size: 1.2rem; font-weight: 600; margin: 0.75rem 0 0.5rem; width: 100%;">Monitoring Schedule</h3>
            <ul style="margin: 0; padding-left: 1.5rem; list-style-type: disc; width: 100%;">
              ${monitoringItems.length > 0 
                ? monitoringItems.map(item => `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">${item}</li>`).join('') 
                : `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Monitoring Item 1}</li>
                   <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Monitoring Item 2}</li>
                   <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Monitoring Item 3}</li>`}
            </ul>
          </div>
          
          <div style="margin-bottom: 1rem; width: 100%;">
            <h3 style="color: #2980b9; font-size: 1.2rem; font-weight: 600; margin: 0.75rem 0 0.5rem; width: 100%;">Success Indicators</h3>
            <ul style="margin: 0; padding-left: 1.5rem; list-style-type: disc; width: 100%;">
              ${successItems.length > 0 
                ? successItems.map(item => `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">${item}</li>`).join('') 
                : `<li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Success Indicator 1}</li>
                   <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Success Indicator 2}</li>
                   <li style="margin-bottom: 0.5rem; font-size: 1.1rem;">{Success Indicator 3}</li>`}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Helper function to extract list items for a specific section
const extractListItems = (code: string, sectionName: string): string[] => {
  // Find section and extract list items
  const sectionRegex = new RegExp(`<h2[^>]*>${sectionName}[\\s\\S]*?<ul[^>]*>([\\s\\S]*?)<\\/ul>`);
  const sectionMatch = code.match(sectionRegex);
  
  if (sectionMatch && sectionMatch[1]) {
    // Extract all list items within this section
    const itemRegex = /<li[^>]*>(.*?)<\/li>/g;
    const items: string[] = [];
    let match;
    
    while ((match = itemRegex.exec(sectionMatch[1])) !== null) {
      items.push(match[1]);
    }
    
    return items;
  }
  
  // Default placeholder items if not found
  return [
    "{Assessment Item 1}",
    "{Assessment Item 2}",
    "{Assessment Item 3}"
  ];
};

// Helper function to extract nested list items (for sections with h3 subsections)
const extractNestedListItems = (code: string, subsectionName: string): string[] => {
  // Find subsection and extract list items
  const subsectionRegex = new RegExp(`<h3[^>]*>${subsectionName}[\\s\\S]*?<ul[^>]*>([\\s\\S]*?)<\\/ul>`);
  const subsectionMatch = code.match(subsectionRegex);
  
  if (subsectionMatch && subsectionMatch[1]) {
    // Extract all list items within this subsection
    const itemRegex = /<li[^>]*>(.*?)<\/li>/g;
    const items: string[] = [];
    let match;
    
    while ((match = itemRegex.exec(subsectionMatch[1])) !== null) {
      items.push(match[1]);
    }
    
    return items;
  }
  
  // Default placeholder items based on subsection name
  if (subsectionName.includes("Short-term")) {
    return [
      "{Short-term Goal 1}",
      "{Short-term Goal 2}",
      "{Short-term Goal 3}"
    ];
  } else if (subsectionName.includes("Long-term")) {
    return [
      "{Long-term Goal 1}",
      "{Long-term Goal 2}",
      "{Long-term Goal 3}"
    ];
  } else if (subsectionName.includes("Medication")) {
    return [
      "{Medication Intervention 1}",
      "{Medication Intervention 2}",
      "{Medication Intervention 3}"
    ];
  } else if (subsectionName.includes("Dietary")) {
    return [
      "{Dietary Intervention 1}",
      "{Dietary Intervention 2}",
      "{Dietary Intervention 3}"
    ];
  } else if (subsectionName.includes("Activity")) {
    return [
      "{Activity Intervention 1}",
      "{Activity Intervention 2}",
      "{Activity Intervention 3}"
    ];
  } else if (subsectionName.includes("Monitoring")) {
    return [
      "{Monitoring Item 1}",
      "{Monitoring Item 2}",
      "{Monitoring Item 3}"
    ];
  } else if (subsectionName.includes("Success")) {
    return [
      "{Success Indicator 1}",
      "{Success Indicator 2}",
      "{Success Indicator 3}"
    ];
  } else {
    return [
      `{${subsectionName} Item 1}`,
      `{${subsectionName} Item 2}`,
      `{${subsectionName} Item 3}`
    ];
  }
};

const CarePlanPreview: React.FC<CarePlanPreviewProps> = ({ code, onClose, isVisible }) => {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [renderedHTML, setRenderedHTML] = useState<string>('');
  
  useEffect(() => {
    if (code) {
      // Extract code from markdown blocks if present
      let cleanedCode = code;
      if (code.includes('```')) {
        const codeMatch = code.match(/```(?:jsx|tsx|javascript|react|js|typescript|ts)?([\s\S]+?)```/);
        if (codeMatch && codeMatch[1]) {
          cleanedCode = codeMatch[1].trim();
        }
      }
      
      // Convert the React component to HTML
      const html = convertReactToHTML(cleanedCode);
      setRenderedHTML(html);
    }
  }, [code]);
  
  if (!isVisible) return null;
  
  // Extract code from markdown blocks if present
  let cleanedCode = code;
  if (code.includes('```')) {
    const codeMatch = code.match(/```(?:jsx|tsx|javascript|react|js|typescript|ts)?([\s\S]+?)```/);
    if (codeMatch && codeMatch[1]) {
      cleanedCode = codeMatch[1].trim();
    }
  }
  
  // Function to copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(cleanedCode);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden">
      <div className="w-full h-screen max-w-full bg-gray-900 rounded-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-2 border-b border-gray-700">
          <h3 className="text-lg font-light text-white">Care Plan Preview</h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'preview' ? 'code' : 'preview')}
              className="p-1.5 rounded-md transition-colors text-gray-400 hover:text-white hover:bg-gray-700"
              title={viewMode === 'preview' ? "View Code" : "View Preview"}
            >
              {viewMode === 'preview' ? <Code size={16} /> : <PlayCircle size={16} />}
            </button>
            
            {viewMode === 'code' && (
              <button
                onClick={copyToClipboard}
                className="p-1.5 rounded-md transition-colors text-gray-400 hover:text-white hover:bg-gray-700"
                title="Copy Code"
              >
                <Copy size={16} />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Close preview"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        {viewMode === 'preview' ? (
          <div className="flex-1 overflow-auto p-0 w-full">
            <div 
              className="h-full w-full"
              dangerouslySetInnerHTML={{ __html: renderedHTML }} 
            />
          </div>
        ) : (
          <div className="flex-1 overflow-auto w-full">
            <pre className="p-4 text-sm text-gray-300 font-mono">{cleanedCode}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarePlanPreview;
