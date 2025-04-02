import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Edit, RefreshCw, Eye } from 'lucide-react';
import CarePlanPreview from './CarePlanPreview';

interface CareImplementationProps {
  patientName: string;
  patientAge: string;
  condition: string;
  providerName?: string;
  researchData?: any;
}

const CareImplementation: React.FC<CareImplementationProps> = ({
  patientName,
  patientAge,
  condition,
  providerName = 'Dr. Emily Chen',
  researchData
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['implementation-prompt']);
  const [isPlanGenerating, setIsPlanGenerating] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [implementationPlan, setImplementationPlan] = useState<string>("");
  const [reactComponentCode, setReactComponentCode] = useState<string | null>(null);
  const [showSandbox, setShowSandbox] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };
  
  // Get content from research data sections if available
  const assessmentContent = researchData?.sections?.assessment?.content || '';
  const diagnosisContent = researchData?.sections?.diagnosis?.content || '';
  const planningContent = researchData?.sections?.planning?.content || '';
  const interventionContent = researchData?.sections?.intervention?.content || '';
  const evaluationContent = researchData?.sections?.evaluation?.content || '';
  const clinicalReasoningContent = researchData?.sections?.clinicalReasoning?.content || '';
  const geminiCarePlanContent = researchData?.generatedCarePlan || '';

  const deepResearchText = `
ASSESSMENT:
${assessmentContent}

DIAGNOSIS:
${diagnosisContent}

PLANNING:
${planningContent}

INTERVENTION:
${interventionContent}

EVALUATION:
${evaluationContent}

CLINICAL REASONING:
${clinicalReasoningContent}

GENERATED CARE PLAN:
${geminiCarePlanContent}

${editPrompt ? `REFINEMENTS:
${editPrompt}` : ''}`;

  // Updated implementation prompt text that includes research data
  const implementationPromptText = `
You are an AI Care Implementation Coordinator responsible for implementing a newly created care plan for a patient with ${condition}. Your task is to create a detailed, step-by-step implementation strategy that outlines how to operationalize this care plan in a real-world healthcare setting.

PATIENT INFORMATION:
- Name: ${patientName}
- Age: ${patientAge}
- Condition: ${condition}
- Primary Provider: ${providerName}

DEEP RESEARCH INSIGHTS:
${deepResearchText}

IMPLEMENTATION REQUIREMENTS:
1. Create a detailed timeline with specific action items for the first 30, 60, and 90 days of the care plan
2. Identify key team members needed for implementation and define their specific responsibilities
3. Establish communication protocols between the patient, caregivers, and healthcare providers
4. Incorporate digital health tools and remote monitoring when appropriate
5. Design workflows for medication management and adherence support
6. Include strategies to address social determinants of health that may impact care
7. Develop mechanisms for continuous assessment and plan adjustment
8. Create a personalized patient engagement strategy
9. Define specific metrics to evaluate implementation success
10. Include contingency plans for potential barriers to implementation

Your implementation plan should be practical, actionable, and take into account realistic healthcare workflow constraints. Consider both technical and human factors in your planning.

OUTPUT FORMAT:
Please structure your response with the following sections:
1. Implementation Overview
2. Key Personnel and Responsibilities
3. 30-Day Action Plan (detailed daily/weekly tasks)
4. 60-Day Milestones
5. 90-Day Evaluation Metrics
6. Communication Protocols
7. Technical Integration Steps
8. Patient Engagement Strategy
9. Risk Mitigation Plan
10. Continuous Improvement Mechanism

When executing this plan, you should focus on practical steps that actual healthcare workers would take, using realistic timelines and considering resource constraints. USE THE DEEP RESEARCH INSIGHTS ABOVE to inform your implementation strategy and ensure it aligns with evidence-based practices for this specific condition.
`;

  const handleApproveResearch = async () => {
    setIsPlanGenerating(true);
    try {
      const response = await fetch('/api/implementation-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName,
          patientAge,
          patientGender: researchData?.patientInfo?.gender || 'Unknown',
          condition,
          providerName,
          prompt: implementationPromptText,
          researchData,
          codeGeneration: true
        }),
      });

      if (!response.ok) {
        // Try to get structured error info
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        console.error('API error details:', errorData);
        
        let errorMessage = `API Error (${response.status})`;
        if (errorData.additionalInfo) {
          errorMessage += `: ${errorData.additionalInfo}`;
        } else if (errorData.error) {
          errorMessage += `: ${errorData.error}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      setImplementationPlan(data.implementationPlan);
      setPlanGenerated(true);
      
      if (data.codeGenerated && data.reactComponentCode) {
        setReactComponentCode(data.reactComponentCode);
      }
      
      // Auto-expand the section
      setExpandedSections(prev => [...prev, 'plan-of-care']);
    } catch (error) {
      console.error('Error generating implementation plan:', error);
      // Show user-friendly error alert
      alert(`${error instanceof Error ? error.message : 'Unknown error'}\n\nUsing mock component for testing purposes.`);
      
      // Set mock data for testing UI flow
      generateMockImplementation();
    } finally {
      setIsPlanGenerating(false);
    }
  };

  const handleRefinePrompt = () => {
    setIsEditing(false);
    // The refinements are already part of the prompt
    handleApproveResearch();
  };

  const handleFinalize = () => {
    setIsFinalized(true);
    alert("Plan of Care finalized. Ready for implementation.");
  };

  // Mock implementation for testing UI when API fails
  const generateMockImplementation = () => {
    const mockPlan = `# Implementation Plan for ${patientName}\n\nThis is a mock implementation plan for ${condition}. In a production environment, this would be generated by Gemini AI.`;
    
    const mockComponent = `
import React, { useState } from 'react';

// Helper component for status badges
const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \${getStatusStyles(status)}\`}>
      {status}
    </span>
  );
};

function PatientCarePlan({ patient, patientName, condition }) {
  const [expandedSections, setExpandedSections] = useState({
    overview: true, tasks: true, monitoring: false
  });
  
  // Use props in multiple formats
  const name = patient?.name || patientName;
  const patientCondition = patient?.condition || condition;
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
        <h1 className="text-xl font-bold text-white">
          Care Plan: {name}
        </h1>
        <p className="text-blue-100">Condition: {patientCondition}</p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Implementation Overview */}
        <div className="border rounded-md overflow-hidden">
          <button 
            onClick={() => toggleSection('overview')}
            className="w-full flex justify-between items-center p-4 bg-gray-50 text-left font-medium"
          >
            <span>Implementation Overview</span>
            <span>{expandedSections.overview ? '▲' : '▼'}</span>
          </button>
          
          {expandedSections.overview && (
            <div className="p-4 border-t">
              <p className="text-gray-700">
                This is a demonstration care plan for {name} to manage {patientCondition}. 
                It includes monitoring, medication management, and lifestyle modifications.
              </p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <h3 className="font-medium text-blue-800">30-Day Goals</h3>
                  <p className="text-sm text-blue-700">Establish baseline and initial treatment response</p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <h3 className="font-medium text-purple-800">60-Day Goals</h3>
                  <p className="text-sm text-purple-700">Adjust interventions based on progress</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <h3 className="font-medium text-green-800">90-Day Goals</h3>
                  <p className="text-sm text-green-700">Evaluate overall effectiveness and long-term plan</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Task Timeline */}
        <div className="border rounded-md overflow-hidden">
          <button 
            onClick={() => toggleSection('tasks')}
            className="w-full flex justify-between items-center p-4 bg-gray-50 text-left font-medium"
          >
            <span>Implementation Tasks</span>
            <span>{expandedSections.tasks ? '▲' : '▼'}</span>
          </button>
          
          {expandedSections.tasks && (
            <div className="p-4 border-t">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                  <StatusBadge status="Active" />
                  <div>
                    <p className="font-medium">Daily medication adherence tracking</p>
                    <p className="text-sm text-gray-500">Using mobile app reminders and weekly provider check-ins</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                  <StatusBadge status="Pending" />
                  <div>
                    <p className="font-medium">Biweekly vital signs monitoring</p>
                    <p className="text-sm text-gray-500">Schedule home health visits or teach self-monitoring techniques</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                  <StatusBadge status="Pending" />
                  <div>
                    <p className="font-medium">Care team coordination meeting</p>
                    <p className="text-sm text-gray-500">Schedule monthly virtual case conference with all providers</p>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientCarePlan;`;
    
    // Set mock data
    setImplementationPlan(mockPlan);
    setPlanGenerated(true);
    setReactComponentCode(mockComponent);
    
    // Expand the section
    setExpandedSections(prev => [...prev, 'plan-of-care']);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      {/* Deep Research POC Section */}
      <div className="border-b border-gray-700">
        <div
          className="cursor-pointer hover:bg-gray-800/50 transition-colors"
          onClick={() => toggleSection('implementation-prompt')}
        >
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-purple-400" />
              <h3 className="font-medium text-white">Deep Research POC</h3>
            </div>
            {expandedSections.includes('implementation-prompt') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
        
        {expandedSections.includes('implementation-prompt') && (
          <div className="p-4 bg-gray-800/30">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 overflow-auto max-h-64">
              <pre className="text-gray-300 whitespace-pre-wrap text-sm font-mono">{deepResearchText}</pre>
            </div>
            
            {isEditing ? (
              <div className="mt-4">
                <textarea 
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded p-3 h-[100px]"
                  placeholder="Enter refinements to the research..."
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                />
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded flex items-center gap-2 transition-colors"
                    onClick={handleRefinePrompt}
                    disabled={isPlanGenerating}
                  >
                    {isPlanGenerating ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Apply Refinements</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  onClick={() => setIsEditing(true)}
                  disabled={isPlanGenerating || planGenerated}
                >
                  <Edit className="w-4 h-4" />
                  <span>Refine Research</span>
                </button>
                
                <button
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  onClick={handleApproveResearch}
                  disabled={isPlanGenerating || planGenerated}
                >
                  {isPlanGenerating ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Approve Research</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Plan of Care Section */}
      {planGenerated && (
        <div className="border-b border-gray-700">
          <div
            className="cursor-pointer hover:bg-gray-800/50 transition-colors"
            onClick={() => toggleSection('plan-of-care')}
          >
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-400" />
                <h3 className="font-medium text-white">Plan of Care</h3>
              </div>
              {expandedSections.includes('plan-of-care') ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
          
          {expandedSections.includes('plan-of-care') && (
            <div className="p-4 bg-gray-800/30">
              <div className="flex justify-end space-x-3 mb-4">
                <button
                  className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors text-sm"
                  onClick={() => setShowSandbox(true)}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                
                {!isFinalized && (
                  <>
                    <button
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors text-sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit with AI</span>
                    </button>
                    
                    <button
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors text-sm"
                      onClick={handleFinalize}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Finalize Plan</span>
                    </button>
                  </>
                )}
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-wrap">{implementationPlan}</div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Sandbox Preview Modal */}
      {showSandbox && planGenerated && (
        <CarePlanPreview 
          code={reactComponentCode || implementationPlan}
          onClose={() => setShowSandbox(false)}
          isVisible={showSandbox}
          patientInfo={{
            name: patientName,
            condition: condition
          }}
        />
      )}
    </div>
  );
};

export default CareImplementation; 