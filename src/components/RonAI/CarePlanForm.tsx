import React, { useState, useEffect } from 'react';
import { X, FileSearch } from 'lucide-react';
import { loadPatientDataForForm } from '../../services/fhirPatientService';

interface CarePlanFormProps {
  onSubmit: (formData: CarePlanFormData) => void;
  onClose: () => void;
}

export interface CarePlanFormData {
  patientName: string;
  patientAge: string;
  patientGender: string;
  condition: string;
  symptoms: string;
  currentMedications: string;
  relevantHistory: string;
  goals: string;
}

const commonConditions = [
  "Hypertension",
  "Diabetes Type 1",
  "Diabetes Type 2",
  "Asthma",
  "COPD",
  "Heart Failure",
  "Coronary Artery Disease",
  "Stroke",
  "Arthritis",
  "Depression",
  "Anxiety",
  "Alzheimer's",
  "Dementia",
  "Parkinson's",
  "Multiple Sclerosis",
  "Epilepsy",
  "Cancer",
  "Chronic Kidney Disease",
  "Hepatitis",
  "HIV/AIDS",
  "Obesity",
  "Osteoporosis",
  "Migraines",
  "Fibromyalgia",
  "Other"
];

const CarePlanForm: React.FC<CarePlanFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<CarePlanFormData>({
    patientName: "",
    patientAge: "",
    patientGender: "",
    condition: "",
    symptoms: "",
    currentMedications: "",
    relevantHistory: "",
    goals: ""
  });
  
  const [customCondition, setCustomCondition] = useState("");
  const [otherSelected, setOtherSelected] = useState(false);
  const [patientFiles, setPatientFiles] = useState<string[]>([]);
  const [selectedPatientFile, setSelectedPatientFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Fetch list of patient files
    const fetchPatientFiles = async () => {
      try {
        // In a real application, this would be an API call
        // Here we're simulating this by using a fixed path to the backend data
        const files = Array.from({length: 10}, (_, i) => {
          // Get random files from the directory
          const patientFiles = [
            "FL_HepB_Morales742_Carmen185.fhir.json",
            "MD_HepB_Nguyen735_Minh602.fhir.json",
            "WA_Covid_Carlson729_Olivia453.fhir.json",
            "VA_HepC_Patel789_Anjali123.fhir.json",
            "MI_HepC_Gustafson724_Leif319.fhir.json",
            "NH_Covid_Callahan742_Margaret315.fhir.json",
            "KY_HepC_Stonebraker984_Amelia315.fhir.json",
            "NY_Covid_Fitzgerald743_Walter159.fhir.json",
            "MS_Salmonella_Hawkins723_Tamara851.fhir.json",
            "MA_HepB_Prendergast783_Everett159.fhir.json"
          ];
          return patientFiles[i];
        });
        setPatientFiles(files);
      } catch (error) {
        console.error("Error fetching patient files:", error);
      }
    };
    
    fetchPatientFiles();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "condition" && value === "Other") {
      setOtherSelected(true);
      setFormData({ ...formData, condition: "" });
    } else if (name === "condition") {
      setOtherSelected(false);
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleCustomConditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCondition(e.target.value);
    setFormData({ ...formData, condition: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPatientFile(e.target.value);
  };
  
  const loadPatientData = async () => {
    if (!selectedPatientFile) return;
    
    setIsLoading(true);
    try {
      const filePath = `backend/data/Patients/${selectedPatientFile}`;
      const patientFormData = await loadPatientDataForForm(filePath);
      
      // Update form data with loaded patient data
      setFormData(patientFormData);
      
      // Check if condition is in the list or should be "Other"
      const isCommonCondition = commonConditions.includes(patientFormData.condition);
      setOtherSelected(!isCommonCondition);
      if (!isCommonCondition) {
        setCustomCondition(patientFormData.condition);
      }
    } catch (error) {
      console.error("Error loading patient data:", error);
      alert("Failed to load patient data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Create Personalized Care Plan</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Patient selection dropdown */}
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Auto-fill from Patient File
                </label>
                <select
                  value={selectedPatientFile}
                  onChange={handlePatientSelect}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a patient file</option>
                  {patientFiles.map((file) => (
                    <option key={file} value={file}>
                      {file.replace('.fhir.json', '')}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={loadPatientData}
                disabled={!selectedPatientFile || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
              >
                <FileSearch size={16} />
                {isLoading ? "Loading..." : "Auto-fill Form"}
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Age
                </label>
                <input
                  type="text"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Gender
              </label>
              <select
                name="patientGender"
                value={formData.patientGender}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Medical Condition
              </label>
              <select
                name="condition"
                value={otherSelected ? "Other" : formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Condition</option>
                {commonConditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
              
              {otherSelected && (
                <div className="mt-3">
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Specify Condition
                  </label>
                  <input
                    type="text"
                    value={customCondition}
                    onChange={handleCustomConditionChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter specific condition"
                    required
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Current Symptoms
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe current symptoms"
                required
              ></textarea>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Current Medications
              </label>
              <textarea
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List any current medications"
              ></textarea>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Relevant Medical History
              </label>
              <textarea
                name="relevantHistory"
                value={formData.relevantHistory}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any relevant medical history"
              ></textarea>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Treatment Goals
              </label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What are the goals for this care plan?"
              ></textarea>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-md hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Generate Care Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarePlanForm;
