import React, { useState } from 'react';
import { ArrowLeft, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import CarePlanPreview from '../../components/RonAI/CarePlanPreview';

const CarePlanPreviewPage: React.FC = () => {
  // State for managing the preview visibility
  const [showPreview, setShowPreview] = useState(false);
  
  // Sample care plan code for demonstration
  const [carePlanCode, setCarePlanCode] = useState<string>(`
const CarePlan = () => {
  return (
    <div className="font-sans max-w-full text-gray-800">
      <header className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold text-white">Diabetes Management Care Plan</h1>
        <p className="text-white opacity-90">Patient: Sarah Johnson</p>
      </header>
      
      <div className="p-6 bg-white rounded-b-lg shadow-md">
        {/* Assessment */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-teal-700 border-b border-teal-200 pb-2 mb-3">
            Assessment
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Blood glucose consistently elevated (HbA1c: 8.2%)</li>
            <li>Reports fatigue and increased thirst</li>
            <li>Currently on metformin 500mg twice daily</li>
            <li>Diet includes frequent processed foods</li>
            <li>Limited physical activity (sedentary job)</li>
            <li>Family history of type 2 diabetes (mother)</li>
          </ul>
        </section>
        
        {/* Diagnosis */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-teal-700 border-b border-teal-200 pb-2 mb-3">
            Diagnosis
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Uncontrolled Type 2 Diabetes Mellitus</li>
            <li>Risk for diabetic complications</li>
            <li>Knowledge deficit regarding diabetic self-management</li>
            <li>Nutritional imbalance related to poor dietary choices</li>
          </ul>
        </section>
        
        {/* Planning */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-teal-700 border-b border-teal-200 pb-2 mb-3">
            Planning
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-teal-600">Short-term Goals (1-2 weeks)</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Patient will monitor blood glucose levels twice daily</li>
                <li>Patient will maintain food diary for 7 days</li>
                <li>Patient will take medications as prescribed</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-teal-600">Long-term Goals (3-6 months)</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Reduce HbA1c to below 7.0%</li>
                <li>Increase physical activity to 30 minutes, 5 days per week</li>
                <li>Demonstrate proper self-management techniques</li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* Implementation */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-teal-700 border-b border-teal-200 pb-2 mb-3">
            Implementation
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-teal-600">Medication Management</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Continue metformin 500mg twice daily with meals</li>
                <li>Educate on medication purpose, timing, and side effects</li>
                <li>Provide pill organizer and medication schedule</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-teal-600">Dietary Interventions</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Referral to dietitian for personalized meal planning</li>
                <li>Education on carbohydrate counting and portion control</li>
                <li>Provide resources for diabetic-friendly recipes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-teal-600">Activity Plan</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Begin with 10-minute walks after meals</li>
                <li>Gradually increase duration and intensity</li>
                <li>Provide resources for chair exercises for office breaks</li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* Evaluation */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-teal-700 border-b border-teal-200 pb-2 mb-3">
            Evaluation
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-teal-600">Monitoring Schedule</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Weekly phone check-ins for first month</li>
                <li>Biweekly in-person visits for three months</li>
                <li>HbA1c testing at 3 months and 6 months</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-teal-600">Success Indicators</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Blood glucose readings within target range (80-130 mg/dL before meals)</li>
                <li>Consistent medication adherence</li>
                <li>Improved energy levels and reduced symptoms</li>
                <li>Demonstrated knowledge of self-management techniques</li>
              </ul>
            </div>
          </div>
        </section>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Care Plan Created: March 10, 2025 | Next Review: April 10, 2025
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Care Coordinator: Dr. Emily Chen | Contact: 555-123-4567
          </p>
        </div>
      </div>
    </div>
  );
};
  `);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/ron-ai" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span>Back to Ron AI</span>
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-2">Care Plan Preview</h1>
          <p className="text-gray-400">
            This page demonstrates the care plan preview feature. Click the "Preview Care Plan" button to render the care plan.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-light">Care Plan Code</h2>
              <div className="text-xs text-gray-400">React/TSX with Tailwind</div>
            </div>
            
            <div className="relative">
              <textarea
                value={carePlanCode}
                onChange={(e) => setCarePlanCode(e.target.value)}
                className="w-full h-[600px] bg-gray-900 text-gray-300 p-4 font-mono text-sm rounded-md border border-gray-700 focus:outline-none focus:border-teal-500"
                spellCheck="false"
                aria-label="Care Plan Code Editor"
                placeholder="Enter your care plan code here"
              />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-light">Preview</h2>
              
              {!showPreview && (
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-teal-500 bg-opacity-20 text-teal-400 hover:bg-opacity-30 transition-colors"
                  title="Preview Care Plan"
                >
                  <Eye size={16} />
                  <span className="text-xs font-medium">Preview Care Plan</span>
                </button>
              )}
            </div>
            
            <CarePlanPreview 
              code={carePlanCode} 
              onClose={() => setShowPreview(false)} 
              isVisible={showPreview} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarePlanPreviewPage;
