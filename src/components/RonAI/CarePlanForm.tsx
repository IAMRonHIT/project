import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, Code } from 'lucide-react';

interface CarePlanFormProps {
  code: string;
  onUpdate: (updatedCode: string) => void;
  onToggleView: () => void;
}

interface FormData {
  patientName: string;
  patientId: string;
  primaryCondition: string;
  assessment: string[];
  diagnosis: string[];
  shortTermGoals: string[];
  longTermGoals: string[];
  medications: string[];
  dietaryInterventions: string[];
  activityPlan: string[];
  monitoringSchedule: string[];
  successIndicators: string[];
  createdDate: string;
  reviewDate: string;
  careCoordinator: string;
}

const CarePlanForm: React.FC<CarePlanFormProps> = ({ code, onUpdate, onToggleView }) => {
  const [formData, setFormData] = useState<FormData>({
    patientName: '',
    patientId: '',
    primaryCondition: '',
    assessment: [''],
    diagnosis: [''],
    shortTermGoals: [''],
    longTermGoals: [''],
    medications: [''],
    dietaryInterventions: [''],
    activityPlan: [''],
    monitoringSchedule: [''],
    successIndicators: [''],
    createdDate: new Date().toLocaleDateString(),
    reviewDate: '',
    careCoordinator: ''
  });

  // Parse the code to extract data for the form
  useEffect(() => {
    if (!code) return;
    
    try {
      // Extract patient name
      const patientNameMatch = code.match(/Patient:\s*([^<]+)/);
      const patientName = patientNameMatch ? patientNameMatch[1].trim() : '';
      
      // Extract patient ID (if available)
      const patientIdMatch = code.match(/ID:\s*([^<]+)/);
      const patientId = patientIdMatch ? patientIdMatch[1].trim() : '';
      
      // Extract primary condition
      const conditionMatch = code.match(/Condition:\s*([^<]+)/) || code.match(/Diagnosis:\s*([^<]+)/);
      const primaryCondition = conditionMatch ? conditionMatch[1].trim() : '';
      
      // Extract assessment items
      const assessmentItems: string[] = [];
      const assessmentSection = code.match(/<section[^>]*>[\s\S]*?Assessment[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/);
      if (assessmentSection) {
        const listItems = assessmentSection[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g);
        if (listItems) {
          listItems.forEach(item => {
            const content = item.replace(/<li[^>]*>/, '').replace(/<\/li>/, '').trim();
            assessmentItems.push(content);
          });
        }
      }
      
      // Extract diagnosis items
      const diagnosisItems: string[] = [];
      const diagnosisSection = code.match(/<section[^>]*>[\s\S]*?Diagnosis[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/);
      if (diagnosisSection) {
        const listItems = diagnosisSection[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g);
        if (listItems) {
          listItems.forEach(item => {
            const content = item.replace(/<li[^>]*>/, '').replace(/<\/li>/, '').trim();
            diagnosisItems.push(content);
          });
        }
      }
      
      // Extract short-term goals
      const shortTermGoals: string[] = [];
      const shortTermSection = code.match(/Short-term Goals[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/);
      if (shortTermSection) {
        const listItems = shortTermSection[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g);
        if (listItems) {
          listItems.forEach(item => {
            const content = item.replace(/<li[^>]*>/, '').replace(/<\/li>/, '').trim();
            shortTermGoals.push(content);
          });
        }
      }
      
      // Extract long-term goals
      const longTermGoals: string[] = [];
      const longTermSection = code.match(/Long-term Goals[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/);
      if (longTermSection) {
        const listItems = longTermSection[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g);
        if (listItems) {
          listItems.forEach(item => {
            const content = item.replace(/<li[^>]*>/, '').replace(/<\/li>/, '').trim();
            longTermGoals.push(content);
          });
        }
      }
      
      // Extract medications
      const medications: string[] = [];
      const medicationSection = code.match(/Medication Management[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/);
      if (medicationSection) {
        const listItems = medicationSection[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g);
        if (listItems) {
          listItems.forEach(item => {
            const content = item.replace(/<li[^>]*>/, '').replace(/<\/li>/, '').trim();
            medications.push(content);
          });
        }
      }
      
      // Extract dietary interventions
      const dietaryInterventions: string[] = [];
      const dietarySection = code.match(/Dietary Interventions[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/);
      if (dietarySection) {
        const listItems = dietarySection[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g);
        if (listItems) {
          listItems.forEach(item => {
            const content = item.replace(/<li[^>]*>/, '').replace(/<\/li>/, '').trim();
            dietaryInterventions.push(content);
          });
        }
      }
      
      // Extract activity plan
      const activityPlan: string[] = [];
      const activitySection = code.match(/Activity Plan[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/);
      if (activitySection) {
        const listItems = activitySection[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g);
        if (listItems) {
          listItems.forEach(item => {
            const content = item.replace(/<li[^>]*>/, '').replace(/<\/li>/, '').trim();
            activityPlan.push(content);
          });
        }
      }
      
      // Extract monitoring schedule
      const monitoringSchedule: string[] = [];
      const monitoringSection = code.match(/Monitoring Schedule[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/);
      if (monitoringSection) {
        const listItems = monitoringSection[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g);
        if (listItems) {
          listItems.forEach(item => {
            const content = item.replace(/<li[^>]*>/, '').replace(/<\/li>/, '').trim();
            monitoringSchedule.push(content);
          });
        }
      }
      
      // Extract success indicators
      const successIndicators: string[] = [];
      const successSection = code.match(/Success Indicators[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/);
      if (successSection) {
        const listItems = successSection[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g);
        if (listItems) {
          listItems.forEach(item => {
            const content = item.replace(/<li[^>]*>/, '').replace(/<\/li>/, '').trim();
            successIndicators.push(content);
          });
        }
      }
      
      // Extract dates and care coordinator
      const metadataMatch = code.match(/Care Plan Created:\s*([^|]+)\s*\|\s*Next Review:\s*([^<]+)/);
      const createdDate = metadataMatch ? metadataMatch[1].trim() : new Date().toLocaleDateString();
      const reviewDate = metadataMatch ? metadataMatch[2].trim() : '';
      
      const coordinatorMatch = code.match(/Care Coordinator:\s*([^|]+)\s*\|\s*Contact:/);
      const careCoordinator = coordinatorMatch ? coordinatorMatch[1].trim() : '';
      
      // Update form data
      setFormData({
        patientName,
        patientId,
        primaryCondition,
        assessment: assessmentItems.length > 0 ? assessmentItems : [''],
        diagnosis: diagnosisItems.length > 0 ? diagnosisItems : [''],
        shortTermGoals: shortTermGoals.length > 0 ? shortTermGoals : [''],
        longTermGoals: longTermGoals.length > 0 ? longTermGoals : [''],
        medications: medications.length > 0 ? medications : [''],
        dietaryInterventions: dietaryInterventions.length > 0 ? dietaryInterventions : [''],
        activityPlan: activityPlan.length > 0 ? activityPlan : [''],
        monitoringSchedule: monitoringSchedule.length > 0 ? monitoringSchedule : [''],
        successIndicators: successIndicators.length > 0 ? successIndicators : [''],
        createdDate,
        reviewDate,
        careCoordinator
      });
    } catch (error) {
      console.error('Error parsing care plan code:', error);
    }
  }, [code]);

  // Form handling functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddItem = (field: keyof FormData) => {
    if (Array.isArray(formData[field])) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] as string[]), '']
      });
    }
  };

  const handleRemoveItem = (field: keyof FormData, index: number) => {
    if (Array.isArray(formData[field])) {
      const newItems = [...(formData[field] as string[])];
      newItems.splice(index, 1);
      setFormData({ ...formData, [field]: newItems });
    }
  };

  const handleItemChange = (field: keyof FormData, index: number, value: string) => {
    if (Array.isArray(formData[field])) {
      const newItems = [...(formData[field] as string[])];
      newItems[index] = value;
      setFormData({ ...formData, [field]: newItems });
    }
  };

  // Generate code from form data
  const generateCode = () => {
    const code = `
const CarePlan = () => {
  return (
    <div className="font-sans max-w-full text-gray-800">
      <header className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold text-white">${formData.primaryCondition} Care Plan</h1>
        <p className="text-white opacity-90">Patient: ${formData.patientName}</p>
      </header>
      
      <div className="p-6 bg-white rounded-b-lg shadow-md">
        {/* Assessment */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-teal-700 border-b border-teal-200 pb-2 mb-3">
            Assessment
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            ${formData.assessment.map(item => `<li>${item}</li>`).join('\n            ')}
          </ul>
        </section>
        
        {/* Diagnosis */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-teal-700 border-b border-teal-200 pb-2 mb-3">
            Diagnosis
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            ${formData.diagnosis.map(item => `<li>${item}</li>`).join('\n            ')}
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
                ${formData.shortTermGoals.map(item => `<li>${item}</li>`).join('\n                ')}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-teal-600">Long-term Goals (3-6 months)</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                ${formData.longTermGoals.map(item => `<li>${item}</li>`).join('\n                ')}
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
                ${formData.medications.map(item => `<li>${item}</li>`).join('\n                ')}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-teal-600">Dietary Interventions</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                ${formData.dietaryInterventions.map(item => `<li>${item}</li>`).join('\n                ')}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-teal-600">Activity Plan</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                ${formData.activityPlan.map(item => `<li>${item}</li>`).join('\n                ')}
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
                ${formData.monitoringSchedule.map(item => `<li>${item}</li>`).join('\n                ')}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-teal-600">Success Indicators</h3>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                ${formData.successIndicators.map(item => `<li>${item}</li>`).join('\n                ')}
              </ul>
            </div>
          </div>
        </section>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Care Plan Created: ${formData.createdDate} | Next Review: ${formData.reviewDate}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Care Coordinator: ${formData.careCoordinator} | Contact: 555-123-4567
          </p>
        </div>
      </div>
    </div>
  );
};
`;
    
    return code;
  };

  const handleSubmit = () => {
    const generatedCode = generateCode();
    onUpdate(generatedCode);
  };

  // Render list items with add/remove buttons
  const renderListItems = (field: keyof FormData, label: string) => {
    if (!Array.isArray(formData[field])) return null;
    
    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">{label}</h4>
        {(formData[field] as string[]).map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(field, index, e.target.value)}
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
              aria-label={`${label} ${index + 1}`}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
            <button
              type="button"
              onClick={() => handleRemoveItem(field, index)}
              className="ml-2 text-red-400 hover:text-red-300"
              aria-label={`Remove ${label} item`}
              title={`Remove ${label} item`}
            >
              <MinusCircle size={18} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddItem(field)}
          className="flex items-center text-teal-400 hover:text-teal-300 mt-1 text-sm"
          aria-label={`Add ${label} item`}
          title={`Add ${label} item`}
        >
          <PlusCircle size={18} className="mr-1" />
          <span>Add Item</span>
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-lg font-light">Care Plan Form</h3>
        <button
          onClick={onToggleView}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
          title="Switch to Code View"
        >
          <Code size={16} />
          <span className="text-xs font-medium">Code View</span>
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Patient Information */}
          <div className="p-4 bg-gray-800 rounded-md">
            <h4 className="text-md font-medium text-teal-400 mb-3">Patient Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="patientName">Name</label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="patientId">ID</label>
                <input
                  type="text"
                  id="patientId"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
                  placeholder="Enter patient ID"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1" htmlFor="primaryCondition">Primary Condition</label>
                <input
                  type="text"
                  id="primaryCondition"
                  name="primaryCondition"
                  value={formData.primaryCondition}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
                  placeholder="Enter primary condition"
                />
              </div>
            </div>
          </div>

          {/* Assessment */}
          <div className="p-4 bg-gray-800 rounded-md">
            <h4 className="text-md font-medium text-teal-400 mb-3">Assessment</h4>
            {renderListItems('assessment', 'Assessment Item')}
          </div>

          {/* Diagnosis */}
          <div className="p-4 bg-gray-800 rounded-md">
            <h4 className="text-md font-medium text-teal-400 mb-3">Diagnosis</h4>
            {renderListItems('diagnosis', 'Diagnosis Item')}
          </div>

          {/* Planning */}
          <div className="p-4 bg-gray-800 rounded-md">
            <h4 className="text-md font-medium text-teal-400 mb-3">Planning</h4>
            {renderListItems('shortTermGoals', 'Short-term Goal')}
            {renderListItems('longTermGoals', 'Long-term Goal')}
          </div>

          {/* Implementation */}
          <div className="p-4 bg-gray-800 rounded-md">
            <h4 className="text-md font-medium text-teal-400 mb-3">Implementation</h4>
            {renderListItems('medications', 'Medication')}
            {renderListItems('dietaryInterventions', 'Dietary Intervention')}
            {renderListItems('activityPlan', 'Activity Plan Item')}
          </div>

          {/* Evaluation */}
          <div className="p-4 bg-gray-800 rounded-md">
            <h4 className="text-md font-medium text-teal-400 mb-3">Evaluation</h4>
            {renderListItems('monitoringSchedule', 'Monitoring Schedule Item')}
            {renderListItems('successIndicators', 'Success Indicator')}
          </div>

          {/* Metadata */}
          <div className="p-4 bg-gray-800 rounded-md">
            <h4 className="text-md font-medium text-teal-400 mb-3">Care Plan Metadata</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="createdDate">Created Date</label>
                <input
                  type="text"
                  id="createdDate"
                  name="createdDate"
                  value={formData.createdDate}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
                  placeholder="Enter created date"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="reviewDate">Review Date</label>
                <input
                  type="text"
                  id="reviewDate"
                  name="reviewDate"
                  value={formData.reviewDate}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
                  placeholder="Enter review date"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="careCoordinator">Care Coordinator</label>
                <input
                  type="text"
                  id="careCoordinator"
                  name="careCoordinator"
                  value={formData.careCoordinator}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
                  placeholder="Enter care coordinator name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-md font-medium"
        >
          Update Care Plan
        </button>
      </div>
    </div>
  );
};

export default CarePlanForm;
