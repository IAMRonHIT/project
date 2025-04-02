import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Brain, ClipboardCheck, Users, BookOpen, BarChart3, Award, Search, User, FileQuestion, Check } from 'lucide-react';
import CareImplementation from './CareImplementation';
import { createPortal } from 'react-dom';

export interface Patient {
  member_id: string;
  member_name: string;
  member_dob: string;
  gender: string;
  diagnosis: string;
  medications: string;
  allergies: string | null;
  blood_type: string;
  mental_health_status: string;
  social_support: string;
  access_to_healthcare: string;
  income_level: string;
  education_level: string;
  housing_status: string;
  employment_status: string;
  food_insecurity: string;
  pcp: string;
  pcp_npi: string;
  pcp_tax_id: string;
  specialist?: string | null;
  specialty?: string | null;
  specialist_npi?: string | null;
  specialist_tax_id?: string | null;
}

interface CareFormProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  initialMode?: 'medication-reconciliation' | 'patient-content';
}

interface FormData {
  patientName: string;
  patientAge: string;
  patientGender: string;
  condition: string;
  symptoms: string;
  currentMedications: string;
  medicalHistory: string;
  goals: {
    symptoms: string;
    qualityOfLife: string;
    understanding: string;
  };
  socialDeterminants: {
    incomeLevel: string;
    educationLevel: string;
    housingStatus: string;
    employmentStatus: string;
    foodInsecurity: string;
    socialSupport: string;
    healthcareAccess: string;
    mentalHealthStatus: string;
  };
  providers: {
    pcp: {
      name: string;
      npi: string;
    };
    specialist?: {
      name: string;
      specialty: string;
      npi: string;
    };
  };
}

interface ResearchStatus {
  step: string;
  reasoning?: string;
  citations?: string[];
}

type OutputType = 'careplan' | 'education' | 'strategy' | 'population' | 'quality' | 'medication-reconciliation';

// Helper for text highlighting
interface HighlightPart {
  text: string;
  highlight: boolean;
}

// Function to split text into highlighted parts based on search query
const getHighlightedParts = (text: string, query: string): HighlightPart[] => {
  if (!query.trim()) {
    return [{ text, highlight: false }];
  }
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map(part => ({
    text: part,
    highlight: part.toLowerCase() === query.toLowerCase()
  }));
};

const CareForm: React.FC<CareFormProps> = ({ isOpen, onClose, patients, initialMode }) => {
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [outputType, setOutputType] = useState<OutputType>(initialMode === 'medication-reconciliation' ? 'medication-reconciliation' : 'careplan');
  const [formData, setFormData] = useState<FormData>({
    patientName: '',
    patientAge: '',
    patientGender: '',
    condition: '',
    symptoms: '',
    currentMedications: '',
    medicalHistory: '',
    goals: {
      symptoms: 'Alleviate primary symptoms and prevent exacerbations',
      qualityOfLife: 'Improve daily functioning and overall quality of life',
      understanding: 'Enhance understanding of disease process and management strategies'
    },
    socialDeterminants: {
      incomeLevel: '',
      educationLevel: '',
      housingStatus: '',
      employmentStatus: '',
      foodInsecurity: '',
      socialSupport: '',
      healthcareAccess: '',
      mentalHealthStatus: '',
    },
    providers: {
      pcp: {
        name: 'Dr. Sarah Johnson',
        npi: '1234567890',
      },
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCarePlan, setGeneratedCarePlan] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string>('form');
  const [researchData, setResearchData] = useState<any>(null);
  const [researchStatus, setResearchStatus] = useState<ResearchStatus | null>(null);
  const [openSections, setOpenSections] = useState<string[]>(['patient', 'goals']);
  const [generatingGeminiPlan, setGeneratingGeminiPlan] = useState(false);
  const [showImplementation, setShowImplementation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openPanels, setOpenPanels] = useState<string[]>(['profile', 'medical', 'social', 'provider', 'goals', 'outputType']);
  const [isMedRecTest, setIsMedRecTest] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Test medications for medication reconciliation
  const testMedications = [
    "CLOBAZAM 2.5 MG/ML SUSPENSION",
    "MEROPENEM IV 500 MG VIAL",
    "CHLORPROMAZINE 25 MG/ML AMP",
    "PRAZOSIN 1 MG CAPSULE"
  ];

  const calculateAge = (dob: string): string => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    setSelectedPatient(patientId);
    
    if (patientId) {
      const patient = patients.find(p => p.member_id === patientId);
      if (patient) {
        const medicalHistory = `
Diagnoses: ${patient.diagnosis}
Allergies: ${patient.allergies || 'None'}

Social Determinants:
- Income Level: ${patient.income_level}
- Education: ${patient.education_level}
- Housing: ${patient.housing_status}
- Employment: ${patient.employment_status}
- Food Security: ${patient.food_insecurity}
- Social Support: ${patient.social_support}
- Healthcare Access: ${patient.access_to_healthcare}
- Mental Health: ${patient.mental_health_status}
`.trim();

        setFormData({
          patientName: patient.member_name,
          patientAge: calculateAge(patient.member_dob),
          patientGender: patient.gender,
          condition: patient.diagnosis.split(' ')[0],
          symptoms: 'Symptoms are consistent with primary diagnosis',
          currentMedications: patient.medications,
          medicalHistory,
          goals: {
            symptoms: 'Alleviate primary symptoms and prevent exacerbations',
            qualityOfLife: 'Improve daily functioning and overall quality of life',
            understanding: 'Enhance understanding of disease process and management strategies'
          },
          socialDeterminants: {
            incomeLevel: patient.income_level,
            educationLevel: patient.education_level,
            housingStatus: patient.housing_status,
            employmentStatus: patient.employment_status,
            foodInsecurity: patient.food_insecurity,
            socialSupport: patient.social_support,
            healthcareAccess: patient.access_to_healthcare,
            mentalHealthStatus: patient.mental_health_status
          },
          providers: {
            pcp: {
              name: patient.pcp,
              npi: patient.pcp_npi
            },
            ...(patient.specialist ? {
              specialist: {
                name: patient.specialist,
                specialty: patient.specialty || 'Unknown',
                npi: patient.specialist_npi || ''
              }
            } : {})
          }
        });
      }
    }
  };

  const handleGenerateCarePlan = async () => {
    if (!researchData) return;

    setGeneratingGeminiPlan(true);
    try {
      const response = await fetch('/api/deepresearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: formData.patientName,
          patientAge: formData.patientAge,
          patientGender: formData.patientGender,
          condition: formData.condition,
          medicalHistory: formData.medicalHistory,
          symptoms: formData.symptoms,
          currentMedications: formData.currentMedications,
          goals: `${formData.goals.symptoms}; ${formData.goals.qualityOfLife}; ${formData.goals.understanding}`,
          outputType
        }),
      });

      if (!response.ok) {
        throw new Error(`Care plan generation failed: ${await response.text()}`);
      }

      const responseData = await response.json();
      setResearchData(responseData);

      // Open the output section
      setOpenSections(prev => [...prev, outputType]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setGeneratingGeminiPlan(false);
    }
  };

  const handleGenerateGeminiCarePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratingGeminiPlan(true);

    try {
      // Default endpoint for care plans
      let endpoint = '/api/gemini-careplan';
      
      // Get current URL for building absolute URLs
      const baseUrl = window.location.origin;
      
      // Check if we're in medication reconciliation mode
      const isMedicationReconciliation = outputType === 'medication-reconciliation';
      
      // Define the request body
      const requestBody: any = { 
        ...formData,
        isMedicationReconciliation
      };
      
      // If it's a medication reconciliation test, use the test medications
      if (isMedicationReconciliation && isMedRecTest) {
        requestBody.testMedications = {
          home: testMedications,
          inpatient: testMedications.slice(0, 2) // Only first two for inpatient to create discrepancies
        };
      }
      
      console.log('Sending request with body:', requestBody);
      
      // Send the request to the API
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received response:', data);
      
      // Handle the response differently based on mode
      if (isMedicationReconciliation) {
        setGeneratedCarePlan(data.reconciliationResults || data);
        setActiveSection('medication-reconciliation');
      } else {
        setGeneratedCarePlan(data);
        setActiveSection('generated-careplan');
      }
    } catch (error) {
      console.error('Error generating care plan:', error);
      setErrorMessage('An error occurred while generating the care plan. Please try again.');
    } finally {
      setIsLoading(false);
      setGeneratingGeminiPlan(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: formData.patientName,
          patientAge: formData.patientAge,
          condition: formData.condition,
          symptoms: formData.symptoms,
          currentMedications: formData.currentMedications,
          medicalHistory: formData.medicalHistory,
          goals: `${formData.goals.symptoms}; ${formData.goals.qualityOfLife}; ${formData.goals.understanding}`
        }),
      });

      if (!response.ok) {
        throw new Error('Research request failed');
      }

      const data = await response.json();
      setResearchData(data);
      
      // Open the research section automatically
      if (!openSections.includes('research')) {
        setOpenSections(prev => [...prev, 'research']);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOutputTypeIcon = (type: OutputType) => {
    switch (type) {
      case 'careplan':
        return <ClipboardCheck size={16} />;
      case 'population':
        return <Users size={16} />;
      case 'education':
        return <BookOpen size={16} />;
      case 'strategy':
        return <BarChart3 size={16} />;
      case 'quality':
        return <Award size={16} />;
      default:
        return <ClipboardCheck size={16} />;
    }
  };

  // Handle close with animation
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
      setIsExiting(false);
    }, 300); // Match animation duration
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      patient.member_name.toLowerCase().includes(searchTerm) ||
      patient.diagnosis.toLowerCase().includes(searchTerm)
    );
  });
  
  // Generate patient avatar initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Get random color for avatar based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'from-indigo-500 to-blue-600', 
      'from-blue-500 to-indigo-600', 
      'from-purple-500 to-indigo-600',
      'from-teal-500 to-cyan-600', 
      'from-emerald-500 to-teal-600', 
      'from-violet-500 to-purple-600'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // Custom patient avatar component
  const PatientAvatar = ({ name, size = 'medium', highlight = false }: { name: string, size?: 'small'|'medium'|'large', highlight?: boolean }) => {
    const initials = getInitials(name);
    const colorClass = getAvatarColor(name);
    
    const sizeClasses = {
      small: 'w-6 h-6 text-[10px]',
      medium: 'w-8 h-8 text-xs',
      large: 'w-10 h-10 text-sm'
    };
    
    return (
      <div className={`relative group ${highlight ? 'scale-105' : ''}`}>
        <div className={`
          ${sizeClasses[size]} rounded-full flex items-center justify-center font-medium text-white 
          bg-gradient-to-br ${colorClass} shadow-md
          ${highlight ? 'ring-2 ring-indigo-400/50 ring-offset-1 ring-offset-gray-900' : ''}
        `}>
          {initials}
        </div>
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${colorClass} blur-sm opacity-50 -z-10 group-hover:opacity-70 transition-opacity`}></div>
      </div>
    );
  };

  // Custom patient select with avatar and search
  const renderPatientSelect = () => {
    const selectedPatientData = patients.find(p => p.member_id === selectedPatient);
    
    return (
      <div className="mb-4">
        <label htmlFor="patient-search" className="block text-xs font-medium text-gray-400 mb-1">
          Select Patient
        </label>
        
        {/* Selected patient display or placeholder */}
        <div 
          className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
          focus:outline-none hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]
          shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
          flex items-center justify-between cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="flex items-center gap-3 truncate">
            {selectedPatientData ? (
              <>
                <PatientAvatar name={selectedPatientData.member_name} highlight />
                <div className="truncate">
                  <div className="font-medium">{selectedPatientData.member_name}</div>
                  <div className="text-xs text-gray-400 truncate">{selectedPatientData.diagnosis}</div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-7 h-7 rounded-full bg-gray-800/80 border border-gray-700/60 flex items-center justify-center">
                  <User size={14} className="text-gray-500" />
                </div>
                <span>Select a patient</span>
              </div>
            )}
          </div>
          <ChevronDown size={16} className={`text-indigo-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if clicking outside of the patient selection section
      if (dropdownOpen && contentRef.current && !contentRef.current.querySelector('.patient-section')?.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Toggle panel open/closed
  const togglePanel = (panelId: string) => {
    setOpenPanels(prev =>
      prev.includes(panelId)
        ? prev.filter(id => id !== panelId)
        : [...prev, panelId]
    );
  };

  // If not open, don't render
  if (!isOpen) return null;

  // If showImplementation is true, render CareImplementation instead
  if (showImplementation) {
    return (
      <CareImplementation
        patientName={formData.patientName}
        patientAge={formData.patientAge}
        condition={formData.condition}
        providerName={formData.providers.pcp.name}
        researchData={researchData}
      />
    );
  }

  return (
    <>
      <div className={`fixed right-0 top-[65px] bottom-[136px] w-[450px] overflow-hidden flex flex-col 
        backdrop-blur-md bg-gradient-to-b from-gray-900/85 to-gray-800/90
        border-l border-indigo-500/30
        shadow-xl shadow-black/30
        ${isExiting ? 'animate-slide-out' : 'animate-slide-in'}`}>
        {/* Header section - no changes */}
        <div className="p-4 border-b border-indigo-500/30 bg-gray-800/50 flex items-center justify-between relative">
          {/* Decorative elements */}
          <div className="absolute left-0 top-0 w-1/3 h-0.5 bg-gradient-to-r from-indigo-500/80 to-transparent"></div>
          <div className="absolute right-0 bottom-0 w-1/4 h-0.5 bg-gradient-to-l from-teal-500/80 to-transparent"></div>
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_5px_rgba(79,70,229,0.5)]">
              <Brain className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">Care Plan Generator</h2>
              <p className="text-xs text-indigo-300/80">AI-Powered Patient Care</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors relative group"
          >
            <X size={18} />
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </button>
        </div>

        {/* Content area */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto py-4 px-3 space-y-3 relative"
        >
          {/* Subtle scanline effect */}
          <div className="absolute inset-0 pointer-events-none z-10 animate-scanline"></div>
          
          {/* Patient Selection Section */}
          <div
            className={`
              patient-section
              rounded-lg overflow-hidden
              border border-indigo-500/30 shadow-[0_0_5px_rgba(79,70,229,0.3),inset_0_0_5px_rgba(79,70,229,0.1)]
              shadow-lg shadow-black/10
              bg-gradient-to-b from-gray-800/10 via-gray-900/20 to-gray-800/10
              transition-all duration-200
            `}
          >
            <button
              onClick={() => toggleSection('patient')}
              className="w-full flex items-center justify-between px-4 py-3 group transition-colors relative"
            >
              <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500/30 group-hover:bg-indigo-500/60 transition-colors"></div>
              <span className="text-sm font-medium text-white flex items-center">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                Patient Selection
              </span>
              {openSections.includes('patient') ? (
                <ChevronUp className="text-gray-400" size={16} />
              ) : (
                <ChevronDown className="text-gray-400" size={16} />
              )}
            </button>
            
            {openSections.includes('patient') && (
              <div className="px-4 pb-3 pt-2 border-t border-gray-700/30 text-gray-300/90">
                {renderPatientSelect()}

                {/* Patient dropdown */}
                {dropdownOpen && (
                  <div className="w-full mt-1 rounded-md shadow-lg bg-gray-900/95 backdrop-blur-sm 
                    border border-indigo-500/30 shadow-[0_0_5px_rgba(79,70,229,0.3),inset_0_0_5px_rgba(79,70,229,0.1)]
                    overflow-hidden animate-fade-in">
                    
                    {/* Search input */}
                    <div className="p-2 border-b border-gray-800/60">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search size={14} className="text-indigo-400" />
                        </div>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search patients..."
                          className="w-full pl-9 py-1.5 bg-gray-800/70 border border-indigo-500/30 rounded-md text-white text-sm 
                          focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
                          shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] placeholder-gray-500"
                          autoFocus
                        />
                      </div>
                    </div>
                    
                    {/* Patients list */}
                    <div className="max-h-60 overflow-y-auto">
                      {filteredPatients.length === 0 ? (
                        <div className="py-4 px-4 text-sm text-gray-400 text-center flex flex-col items-center gap-2">
                          <FileQuestion size={20} />
                          <p>No patients found</p>
                        </div>
                      ) : (
                        filteredPatients.map(patient => (
                          <div
                            key={patient.member_id}
                            className={`py-2 px-3 cursor-pointer flex items-center gap-3 transition-colors duration-150
                            ${selectedPatient === patient.member_id 
                              ? 'bg-indigo-600/30 border-l-2 border-indigo-500' 
                              : 'hover:bg-indigo-600/20 border-l-2 border-transparent'}
                            `}
                            onClick={() => {
                              setSelectedPatient(patient.member_id);
                              handlePatientSelect({ target: { value: patient.member_id } } as any);
                              setDropdownOpen(false);
                              setSearchQuery('');
                            }}
                          >
                            <PatientAvatar 
                              name={patient.member_name} 
                              highlight={selectedPatient === patient.member_id}
                            />
                            <div className="truncate flex-1">
                              <div className="font-medium">
                                {patient.member_name}
                              </div>
                              <div className="text-xs text-gray-400 truncate">
                                {patient.diagnosis}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {selectedPatient && (
                  <div className="mt-4 space-y-2">
                    {/* Decorative line - cyberpunk style */}
                    <div className="relative h-0.5 w-full mb-2">
                      <div className="absolute left-0 w-1/3 h-full bg-gradient-to-r from-indigo-500/80 to-transparent shadow-[0_0_8px_rgba(79,70,229,0.7)]"></div>
                      <div className="absolute right-0 w-1/5 h-full bg-gradient-to-l from-teal-500/80 to-transparent shadow-[0_0_8px_rgba(20,184,166,0.7)]"></div>
                    </div>
                    
                    {/* Patient Profile */}
                    <div className="rounded-md bg-gray-800/40 border border-indigo-500/20 overflow-hidden transition-all duration-300 shadow-[0_0_5px_rgba(79,70,229,0.2)]
                      hover:shadow-[0_0_8px_rgba(79,70,229,0.3)] group">
                      <div 
                        className="flex items-center justify-between px-3 py-2 bg-indigo-900/30 border-b border-indigo-500/20 cursor-pointer
                        hover:bg-indigo-800/30 transition-colors duration-200 relative overflow-hidden"
                        onClick={() => togglePanel('profile')}
                      >
                        {/* Subtle animated background glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 
                          group-hover:opacity-100 opacity-0 transition-opacity duration-300 animate-pulse-glow"></div>
                          
                        <h3 className="text-xs font-medium text-indigo-300 flex items-center relative z-10">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2 shadow-[0_0_4px_rgba(79,70,229,0.7)]"></span>
                          Patient Profile
                        </h3>
                        <div className="transition-transform duration-200 relative z-10">
                          {openPanels.includes('profile') ? (
                            <ChevronUp className="text-indigo-400" size={14} />
                          ) : (
                            <ChevronDown className="text-indigo-400" size={14} />
                          )}
                        </div>
                      </div>
                      <div 
                        className={`transition-all duration-300 ease-in-out overflow-hidden
                        ${openPanels.includes('profile') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="p-3 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Primary Condition
                            </label>
                            <input
                              type="text"
                              value={formData.condition}
                              onChange={(e) => setFormData({...formData, condition: e.target.value})}
                              className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                              focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
                              shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
                              hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Age
                            </label>
                            <input
                              type="text"
                              value={formData.patientAge}
                              readOnly
                              className="w-full px-3 py-2 bg-gray-900/90 border border-gray-700/50 rounded-md text-white text-sm 
                              shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm cursor-default"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Medical Information */}
                    <div className="rounded-md bg-gray-800/40 border border-indigo-500/20 overflow-hidden transition-all duration-300 shadow-[0_0_5px_rgba(79,70,229,0.2)]
                      hover:shadow-[0_0_8px_rgba(79,70,229,0.3)] group">
                      <div 
                        className="flex items-center justify-between px-3 py-2 bg-indigo-900/30 border-b border-indigo-500/20 cursor-pointer
                        hover:bg-indigo-800/30 transition-colors duration-200 relative overflow-hidden"
                        onClick={() => togglePanel('medical')}
                      >
                        {/* Subtle animated background glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 
                          group-hover:opacity-100 opacity-0 transition-opacity duration-300 animate-pulse-glow"></div>
                          
                        <h3 className="text-xs font-medium text-indigo-300 flex items-center relative z-10">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2 shadow-[0_0_4px_rgba(79,70,229,0.7)]"></span>
                          Medical Information
                        </h3>
                        <div className="transition-transform duration-200 relative z-10">
                          {openPanels.includes('medical') ? (
                            <ChevronUp className="text-indigo-400" size={14} />
                          ) : (
                            <ChevronDown className="text-indigo-400" size={14} />
                          )}
                        </div>
                      </div>
                      <div 
                        className={`transition-all duration-300 ease-in-out overflow-hidden
                        ${openPanels.includes('medical') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="p-3 space-y-3 text-sm">
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Symptoms
                            </label>
                            <input
                              type="text"
                              value={formData.symptoms}
                              onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                              className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                              focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
                              shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
                              hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Current Medications
                            </label>
                            <textarea
                              value={formData.currentMedications}
                              onChange={(e) => setFormData({...formData, currentMedications: e.target.value})}
                              rows={2}
                              className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                              focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
                              shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
                              hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Social Determinants */}
                    <div className="rounded-md bg-gray-800/40 border border-indigo-500/20 overflow-hidden transition-all duration-300 shadow-[0_0_5px_rgba(79,70,229,0.2)]
                      hover:shadow-[0_0_8px_rgba(79,70,229,0.3)] group">
                      <div 
                        className="flex items-center justify-between px-3 py-2 bg-indigo-900/30 border-b border-indigo-500/20 cursor-pointer
                        hover:bg-indigo-800/30 transition-colors duration-200 relative overflow-hidden"
                        onClick={() => togglePanel('social')}
                      >
                        {/* Subtle animated background glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 
                          group-hover:opacity-100 opacity-0 transition-opacity duration-300 animate-pulse-glow"></div>
                          
                        <h3 className="text-xs font-medium text-indigo-300 flex items-center relative z-10">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2 shadow-[0_0_4px_rgba(79,70,229,0.7)]"></span>
                          Social Determinants
                        </h3>
                        <div className="transition-transform duration-200 relative z-10">
                          {openPanels.includes('social') ? (
                            <ChevronUp className="text-indigo-400" size={14} />
                          ) : (
                            <ChevronDown className="text-indigo-400" size={14} />
                          )}
                        </div>
                      </div>
                      <div 
                        className={`transition-all duration-300 ease-in-out overflow-hidden
                        ${openPanels.includes('social') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="p-3 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Mental Health
                            </label>
                            <div className="w-full px-3 py-2 bg-gray-900/90 border border-gray-700/50 rounded-md text-white text-sm 
                            shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                              {selectedPatient ? patients.find(p => p.member_id === selectedPatient)?.mental_health_status : ''}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Healthcare Access
                            </label>
                            <div className="w-full px-3 py-2 bg-gray-900/90 border border-gray-700/50 rounded-md text-white text-sm 
                            shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                              {selectedPatient ? patients.find(p => p.member_id === selectedPatient)?.access_to_healthcare : ''}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Housing Status
                            </label>
                            <div className="w-full px-3 py-2 bg-gray-900/90 border border-gray-700/50 rounded-md text-white text-sm 
                            shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                              {selectedPatient ? patients.find(p => p.member_id === selectedPatient)?.housing_status : ''}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Employment
                            </label>
                            <div className="w-full px-3 py-2 bg-gray-900/90 border border-gray-700/50 rounded-md text-white text-sm 
                            shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                              {selectedPatient ? patients.find(p => p.member_id === selectedPatient)?.employment_status : ''}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Food Security
                            </label>
                            <div className="w-full px-3 py-2 bg-gray-900/90 border border-gray-700/50 rounded-md text-white text-sm 
                            shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                              {selectedPatient ? patients.find(p => p.member_id === selectedPatient)?.food_insecurity : ''}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Social Support
                            </label>
                            <div className="w-full px-3 py-2 bg-gray-900/90 border border-gray-700/50 rounded-md text-white text-sm 
                            shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                              {selectedPatient ? patients.find(p => p.member_id === selectedPatient)?.social_support : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Provider Information */}
                    <div className="rounded-md bg-gray-800/40 border border-indigo-500/20 overflow-hidden transition-all duration-300 shadow-[0_0_5px_rgba(79,70,229,0.2)]
                      hover:shadow-[0_0_8px_rgba(79,70,229,0.3)] group">
                      <div 
                        className="flex items-center justify-between px-3 py-2 bg-indigo-900/30 border-b border-indigo-500/20 cursor-pointer
                        hover:bg-indigo-800/30 transition-colors duration-200 relative overflow-hidden"
                        onClick={() => togglePanel('provider')}
                      >
                        {/* Subtle animated background glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 
                          group-hover:opacity-100 opacity-0 transition-opacity duration-300 animate-pulse-glow"></div>
                          
                        <h3 className="text-xs font-medium text-indigo-300 flex items-center relative z-10">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2 shadow-[0_0_4px_rgba(79,70,229,0.7)]"></span>
                          Provider Information
                        </h3>
                        <div className="transition-transform duration-200 relative z-10">
                          {openPanels.includes('provider') ? (
                            <ChevronUp className="text-indigo-400" size={14} />
                          ) : (
                            <ChevronDown className="text-indigo-400" size={14} />
                          )}
                        </div>
                      </div>
                      <div 
                        className={`transition-all duration-300 ease-in-out overflow-hidden
                        ${openPanels.includes('provider') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="p-3 space-y-3 text-sm">
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Primary Care Provider
                            </label>
                            <div className="w-full px-3 py-2 bg-gray-900/90 border border-gray-700/50 rounded-md text-white text-sm 
                            shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                              {formData.providers.pcp.name} {formData.providers.pcp.npi ? `(NPI: ${formData.providers.pcp.npi})` : ''}
                            </div>
                          </div>
                          {formData.providers.specialist && (
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Specialist
                              </label>
                              <div className="w-full px-3 py-2 bg-gray-900/90 border border-gray-700/50 rounded-md text-white text-sm 
                              shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                                {formData.providers.specialist.name} ({formData.providers.specialist.specialty})
                                {formData.providers.specialist.npi ? ` (NPI: ${formData.providers.specialist.npi})` : ''}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Treatment Goals */}
                    <div className="rounded-md bg-gray-800/40 border border-indigo-500/20 overflow-hidden transition-all duration-300 shadow-[0_0_5px_rgba(79,70,229,0.2)]
                      hover:shadow-[0_0_8px_rgba(79,70,229,0.3)] group">
                      <div 
                        className="flex items-center justify-between px-3 py-2 bg-indigo-900/30 border-b border-indigo-500/20 cursor-pointer
                        hover:bg-indigo-800/30 transition-colors duration-200 relative overflow-hidden"
                        onClick={() => togglePanel('goals')}
                      >
                        {/* Subtle animated background glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 
                          group-hover:opacity-100 opacity-0 transition-opacity duration-300 animate-pulse-glow"></div>
                          
                        <h3 className="text-xs font-medium text-indigo-300 flex items-center relative z-10">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2 shadow-[0_0_4px_rgba(79,70,229,0.7)]"></span>
                          Treatment Goals
                        </h3>
                        <div className="transition-transform duration-200 relative z-10">
                          {openPanels.includes('goals') ? (
                            <ChevronUp className="text-indigo-400" size={14} />
                          ) : (
                            <ChevronDown className="text-indigo-400" size={14} />
                          )}
                        </div>
                      </div>
                      <div 
                        className={`transition-all duration-300 ease-in-out overflow-hidden
                        ${openPanels.includes('goals') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="p-3 space-y-3 text-sm">
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Symptom Management
                            </label>
                            <input
                              type="text"
                              value={formData.goals.symptoms}
                              onChange={(e) => setFormData({
                                ...formData, 
                                goals: {...formData.goals, symptoms: e.target.value}
                              })}
                              className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                              focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
                              shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
                              hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Quality of Life
                            </label>
                            <input
                              type="text"
                              value={formData.goals.qualityOfLife}
                              onChange={(e) => setFormData({
                                ...formData, 
                                goals: {...formData.goals, qualityOfLife: e.target.value}
                              })}
                              className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                              focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
                              shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
                              hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Patient Education
                            </label>
                            <input
                              type="text"
                              value={formData.goals.understanding}
                              onChange={(e) => setFormData({
                                ...formData, 
                                goals: {...formData.goals, understanding: e.target.value}
                              })}
                              className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                              focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
                              shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
                              hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Output Type */}
                    <div className="rounded-md bg-gray-800/40 border border-indigo-500/20 overflow-hidden transition-all duration-300 shadow-[0_0_5px_rgba(79,70,229,0.2)]
                      hover:shadow-[0_0_8px_rgba(79,70,229,0.3)] group">
                      <div 
                        className="flex items-center justify-between px-3 py-2 bg-indigo-900/30 border-b border-indigo-500/20 cursor-pointer
                        hover:bg-indigo-800/30 transition-colors duration-200 relative overflow-hidden"
                        onClick={() => togglePanel('outputType')}
                      >
                        {/* Subtle animated background glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 
                          group-hover:opacity-100 opacity-0 transition-opacity duration-300 animate-pulse-glow"></div>
                          
                        <h3 className="text-xs font-medium text-indigo-300 flex items-center relative z-10">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2 shadow-[0_0_4px_rgba(79,70,229,0.7)]"></span>
                          Output Type
                        </h3>
                        <div className="transition-transform duration-200 relative z-10">
                          {openPanels.includes('outputType') ? (
                            <ChevronUp className="text-indigo-400" size={14} />
                          ) : (
                            <ChevronDown className="text-indigo-400" size={14} />
                          )}
                        </div>
                      </div>
                      <div 
                        className={`transition-all duration-300 ease-in-out overflow-hidden
                        ${openPanels.includes('outputType') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="p-3 grid grid-cols-1 gap-2 text-white">
                          {(['careplan', 'education', 'strategy', 'population', 'quality'] as OutputType[]).map((type) => (
                            <label 
                              key={type} 
                              className={`
                                flex items-center p-2 rounded-md cursor-pointer relative overflow-hidden
                                ${outputType === type 
                                  ? 'bg-indigo-900/30 border border-indigo-500/50' 
                                  : 'bg-gray-800/30 border border-gray-700/30 hover:bg-gray-800/50 hover:border-indigo-500/30'
                                }
                                transition-all duration-200
                                ${outputType === type ? 'shadow-[0_0_10px_rgba(79,70,229,0.4)]' : ''}
                              `}
                            >
                              {/* Glowing edge effect on active selection */}
                              {outputType === type && (
                                <div className="absolute inset-0 overflow-hidden">
                                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-50"></div>
                                </div>
                              )}
                              
                              <input
                                type="radio"
                                name="outputType"
                                value={type}
                                checked={outputType === type}
                                onChange={() => setOutputType(type)}
                                className="sr-only"
                              />
                              <div className={`
                                p-1.5 rounded-md mr-3 flex items-center justify-center w-8 h-8
                                ${outputType === type 
                                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' 
                                  : 'bg-gray-800/70 text-gray-400 border border-gray-700/50'
                                }
                                transition-all duration-200
                              `}>
                                {renderOutputTypeIcon(type)}
                              </div>
                              <span className="text-sm font-medium flex-1">
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </span>
                              
                              {/* Custom radio indicator */}
                              <div className={`
                                w-5 h-5 rounded-full flex items-center justify-center border-2
                                ${outputType === type 
                                  ? 'border-indigo-500 bg-indigo-900/50 shadow-[0_0_5px_rgba(79,70,229,0.5)]' 
                                  : 'border-gray-600 bg-gray-900/50'
                                }
                                transition-all duration-200
                              `}>
                                {outputType === type && (
                                  <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Research Results (conditionally rendered) */}
                    {researchData && (
                      <div className="rounded-md bg-gray-800/40 border border-indigo-500/20 overflow-hidden transition-all duration-300 shadow-[0_0_5px_rgba(79,70,229,0.2)]
                        hover:shadow-[0_0_8px_rgba(79,70,229,0.3)] group">
                        <div 
                          className="flex items-center justify-between px-3 py-2 bg-indigo-900/30 border-b border-indigo-500/20 cursor-pointer
                          hover:bg-indigo-800/30 transition-colors duration-200 relative overflow-hidden"
                          onClick={() => togglePanel('research')}
                        >
                          {/* Subtle animated background glow */}
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 
                            group-hover:opacity-100 opacity-0 transition-opacity duration-300 animate-pulse-glow"></div>
                            
                          <h3 className="text-xs font-medium text-teal-300 flex items-center relative z-10">
                            <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mr-2 shadow-[0_0_4px_rgba(20,184,166,0.7)]"></span>
                            Research Results
                          </h3>
                          <div className="transition-transform duration-200 relative z-10">
                            {openPanels.includes('research') ? (
                              <ChevronUp className="text-teal-400" size={14} />
                            ) : (
                              <ChevronDown className="text-teal-400" size={14} />
                            )}
                          </div>
                        </div>
                        <div 
                          className={`transition-all duration-300 ease-in-out overflow-hidden
                          ${openPanels.includes('research') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                          <div className="p-3 space-y-2 text-sm">
                            {Object.keys(researchData).map((key) => (
                              <div key={key} className="mb-2">
                                <div className="text-xs font-medium text-indigo-400 mb-1 uppercase">
                                  {key.replace(/_/g, ' ')}
                                </div>
                                <div className="text-xs text-gray-300 bg-black/20 p-2 rounded-md whitespace-pre-wrap max-h-40 overflow-auto">
                                  {typeof researchData[key] === 'string' 
                                    ? researchData[key] 
                                    : JSON.stringify(researchData[key], null, 2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Goals Section */}
          <div
            className={`
              rounded-lg overflow-hidden
              border border-indigo-500/30 shadow-[0_0_5px_rgba(79,70,229,0.3),inset_0_0_5px_rgba(79,70,229,0.1)]
              shadow-lg shadow-black/10
              bg-gradient-to-b from-gray-800/10 via-gray-900/20 to-gray-800/10
              transition-all duration-200
            `}
          >
            <button
              onClick={() => toggleSection('goals')}
              className="w-full flex items-center justify-between px-4 py-3 group transition-colors relative"
            >
              <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500/30 group-hover:bg-indigo-500/60 transition-colors"></div>
              <span className="text-sm font-medium text-white flex items-center">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                Treatment Goals
              </span>
              {openSections.includes('goals') ? (
                <ChevronUp className="text-gray-400" size={16} />
              ) : (
                <ChevronDown className="text-gray-400" size={16} />
              )}
            </button>
            
            {openSections.includes('goals') && (
              <div className="px-4 pb-3 pt-2 border-t border-gray-700/30 text-gray-300/90">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Symptom Management
                    </label>
                    <input
                      type="text"
                      value={formData.goals.symptoms}
                      onChange={(e) => setFormData({
                        ...formData, 
                        goals: {...formData.goals, symptoms: e.target.value}
                      })}
                      className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent 
                      focus:shadow-[0_0_8px_rgba(79,70,229,0.6)] 
                      hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]
                      shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Quality of Life
                    </label>
                    <input
                      type="text"
                      value={formData.goals.qualityOfLife}
                      onChange={(e) => setFormData({
                        ...formData, 
                        goals: {...formData.goals, qualityOfLife: e.target.value}
                      })}
                      className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent 
                      focus:shadow-[0_0_8px_rgba(79,70,229,0.6)] 
                      hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]
                      shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Patient Education
                    </label>
                    <input
                      type="text"
                      value={formData.goals.understanding}
                      onChange={(e) => setFormData({
                        ...formData, 
                        goals: {...formData.goals, understanding: e.target.value}
                      })}
                      className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent 
                      focus:shadow-[0_0_8px_rgba(79,70,229,0.6)] 
                      hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]
                      shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Research Results Section (only shown after research) */}
          {researchData && (
            <div
              className={`
                rounded-lg overflow-hidden
                border border-indigo-500/30 shadow-[0_0_5px_rgba(79,70,229,0.3),inset_0_0_5px_rgba(79,70,229,0.1)]
                shadow-lg shadow-black/10
                bg-gradient-to-b from-indigo-900/10 via-purple-900/10 to-indigo-900/10
                transition-all duration-200
              `}
            >
            </div>
          )}
        </div>

        {/* Footer with action buttons */}
        <div className="p-4 border-t border-gray-700/50 bg-gray-800/30">
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleSubmit}
              disabled={!selectedPatient || isLoading}
              className={`
                w-full py-2 px-4 rounded-md font-medium text-sm
                ${!selectedPatient || isLoading
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_15px_rgba(79,70,229,0.7)] transition-all'
                }
                flex justify-center items-center
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Researching...
                </>
              ) : (
                'Research Condition'
              )}
            </button>
            
            {researchData && (
              <button
                onClick={handleGenerateGeminiCarePlan}
                disabled={generatingGeminiPlan}
                className={`
                  w-full py-2 px-4 rounded-md font-medium text-sm
                  ${generatingGeminiPlan
                    ? 'bg-teal-700/50 text-teal-300/50 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-[0_0_10px_rgba(20,184,166,0.5)] hover:shadow-[0_0_15px_rgba(20,184,166,0.7)] transition-all'
                  }
                  flex justify-center items-center
                `}
              >
                {generatingGeminiPlan ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  `Generate ${outputType.charAt(0).toUpperCase() + outputType.slice(1)}`
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CareForm;
