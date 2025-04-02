import React from 'react';
import { X } from 'lucide-react';

interface CarePlanPreviewProps {
  code: string;
  isVisible: boolean;
  onClose: () => void;
  patientInfo: {
    name: string;
    condition: string;
  };
}

const CarePlanPreview: React.FC<CarePlanPreviewProps> = ({
  code,
  isVisible,
  onClose,
  patientInfo
}) => {
  if (!isVisible) return null;

  // Extract just the React component code if the full implementation plan was provided
  const extractComponentCode = (fullCode: string): string => {
    try {
      // First check if this is already just a React component
      if (fullCode.trim().startsWith('import React') || 
          fullCode.trim().startsWith('const') || 
          fullCode.trim().startsWith('function')) {
        return fullCode;
      }
      
      // Try to find React component code in the implementation
      const componentMatch = fullCode.match(/```(?:jsx|tsx|react|js)?\s*((?:import|const|function)[\s\S]*?export default[\s\S]*?;?\s*(?:})?)\s*```/);
      
      if (componentMatch && componentMatch[1]) {
        return componentMatch[1].trim();
      }
    } catch (error) {
      console.error("Error extracting component code in preview:", error);
    }
    
    // If no React component found or error occurred, return a fallback component
    return `
import React, { useState } from 'react';

// Helper component for status badges
const StatusBadge = ({ status }) => {
   let bgColor = 'bg-gray-100';
   let textColor = 'text-gray-700';

   switch (status?.toLowerCase()) {
     case 'completed':
     case 'active':
       bgColor = 'bg-green-100';
       textColor = 'text-green-800';
       break;
     case 'in progress':
     case 'tracking':
     case 'scheduled':
       bgColor = 'bg-yellow-100';
       textColor = 'text-yellow-800';
       break;
     case 'upcoming':
     case 'planned':
       bgColor = 'bg-blue-100';
       textColor = 'text-blue-800';
       break;
     case 'not started':
     case 'pending':
       bgColor = 'bg-purple-100';
       textColor = 'text-purple-800';
       break;
     case 'high': // For risk
       bgColor = 'bg-red-100';
       textColor = 'text-red-800';
       break;
     case 'medium': // For risk
       bgColor = 'bg-orange-100';
       textColor = 'text-orange-800';
       break;
      case 'low': // For risk
       bgColor = 'bg-green-100';
       textColor = 'text-green-800';
       break;
     default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-700';
       break;
   }

   return (
     <span className={\`inline-flex items-center \${bgColor} \${textColor} text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full whitespace-nowrap\`}>
       {status || 'N/A'}
     </span>
   );
};

// Helper for placeholder interaction links/buttons
const InteractionPlaceholder = ({ text }) => (
    <span className="ml-2 text-blue-600 text-xs font-medium cursor-not-allowed opacity-60 hover:opacity-100 transition-opacity">
        {\`[\${text}]\`}
    </span>
);

// Main CarePlan Component
function PatientCarePlan({ patient, patientName, condition }) {
  const [openSections, setOpenSections] = useState({
    goals: true,
    timeline: false,
    careTeam: false,
    patientEngagement: true,
    aiAssistance: true,
    actions: true
  });

  // Handle both prop structures
  const name = patient?.name || patientName;
  const patientCondition = patient?.condition || condition;

  const toggleSection = (sectionName) => {
    setOpenSections(prev => ({ ...prev, [sectionName]: !prev[sectionName] }));
  };

  // Sample data for the rendered component
  const carePlanData = {
    patientInfo: {
      name,
      age: "45",
      gender: "Female",
      mrn: "MRN12345",
      condition: patientCondition,
      primaryProvider: "Dr. Emily Chen",
      lastUpdated: new Date().toISOString()
    },
    implementationOverview: \`This personalized care plan for \${name} focuses on managing \${patientCondition} through a technology-enabled approach including mobile app and telehealth services.\`,
    goals: [
      { id: 'goal1', text: \`Maintain stable condition metrics for \${patientCondition} via daily app reporting\`, status: 'In Progress', targetDate: 'Ongoing', progressPlaceholder: '[Progress: ███░░░░░░░ 30%]' },
      { id: 'goal2', text: 'Improve medication adherence tracked via app/AI', status: 'Tracking', targetDate: 'Ongoing', progressPlaceholder: '[Progress: █████████░ 95%]' }
    ]
  };

  // Minimal implementation of the component
  return (
    <div className="bg-gray-100 p-4 md:p-6 space-y-5">
      {/* Patient Header */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">{carePlanData.patientInfo.name}</h1>
        <div className="flex flex-wrap text-sm text-gray-600 mt-2 space-x-4">
          <span>Age: <span className="font-medium text-gray-800">{carePlanData.patientInfo.age}</span></span>
          <span>Gender: <span className="font-medium text-gray-800">{carePlanData.patientInfo.gender}</span></span>
          <span>MRN: <span className="font-medium text-gray-800">{carePlanData.patientInfo.mrn}</span></span>
        </div>
        <p className="text-base text-gray-700 mt-3">
          Condition: <span className="font-semibold text-gray-800">{carePlanData.patientInfo.condition}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Primary Provider: <span className="font-medium text-gray-700">{carePlanData.patientInfo.primaryProvider}</span>
        </p>
      </div>

      {/* Implementation Overview */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Implementation Overview</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{carePlanData.implementationOverview}</p>
      </div>

      {/* Goals Section */}
      <div className="bg-white rounded-lg shadow-md">
        <button
          onClick={() => toggleSection('goals')}
          className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 rounded-t-lg hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-700 flex items-center">
            <span className="text-blue-600 mr-2">📋</span>
            Goals
          </h2>
          <span>{openSections.goals ? '▲' : '▼'}</span>
        </button>
        
        {openSections.goals && (
          <div className="p-4 border-t border-gray-200">
            <ul className="space-y-4">
              {carePlanData.goals.map((goal) => (
                <li key={goal.id} className="flex items-start border-l-4 border-blue-500 pl-3 py-1">
                  <StatusBadge status={goal.status} />
                  <div className="flex-1">
                    <span className="text-sm text-gray-800 font-medium">
                      {goal.progressPlaceholder} {goal.text}
                    </span>
                    <InteractionPlaceholder text="Log Update/Progress" />
                    {goal.targetDate && (
                      <span className="block text-xs text-gray-500 mt-1">Target: {goal.targetDate}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientCarePlan;
    `;
  };

  // Create a sandboxed iframe HTML - wrap in try/catch to prevent console errors
  let dataUri = '';
  try {
    const componentCode = extractComponentCode(code);
    const sandboxHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    body { 
      margin: 0; 
      padding: 16px; 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    try {
      ${componentCode}
      
      // Render the component
      ReactDOM.render(
        <React.StrictMode>
          <PatientCarePlan 
            patient={{
              name: "${patientInfo.name}",
              condition: "${patientInfo.condition}"
            }}
            patientName="${patientInfo.name}"
            condition="${patientInfo.condition}"
          />
        </React.StrictMode>,
        document.getElementById('root')
      );
    } catch (error) {
      // Show error in UI instead of just console
      document.getElementById('root').innerHTML = 
        '<div style="padding:20px; background:#fee; border:1px solid #f99; border-radius:5px;">' + 
        '<h3 style="color:#c33; margin-top:0">Error Rendering Component</h3>' + 
        '<p>' + error.message + '</p>' + 
        '</div>';
    }
  </script>
</body>
</html>
  `;

    const encodedHtml = encodeURIComponent(sandboxHtml);
    dataUri = `data:text/html;charset=utf-8,${encodedHtml}`;
  } catch (error) {
    console.error("Error creating sandbox HTML:", error);
    dataUri = `data:text/html;charset=utf-8,<html><body><div style="padding:20px; color:red;">Error creating preview: ${error instanceof Error ? error.message : "Unknown error"}</div></body></html>`;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-white font-medium">Visual Care Plan</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <iframe 
            src={dataUri}
            className="w-full h-full bg-white"
            sandbox="allow-scripts"
            title="Care Plan Preview"
          />
        </div>
      </div>
    </div>
  );
};

export default CarePlanPreview;
