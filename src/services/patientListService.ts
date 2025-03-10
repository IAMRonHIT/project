import { loadPatientFromFHIR, PatientData, PatientProfile } from './fhirPatientService';

export interface PatientListItem {
  id: string;
  filename: string;
  profile: PatientProfile;
}

// Function to extract patient information from the filename
const extractPatientInfoFromFilename = (filename: string): { 
  state: string;
  condition: string;
  lastName: string;
  firstName: string;
} => {
  // Format is typically: STATE_CONDITION_LASTNAME_FIRSTNAME.fhir.json
  const parts = filename.split('.')[0].split('_');
  
  return {
    state: parts[0] || '',
    condition: parts[1] || '',
    lastName: parts[2] || '',
    firstName: parts[3] || ''
  };
};

// Function to load all patients
export const loadAllPatients = async (): Promise<PatientListItem[]> => {
  try {
    // This would normally be an API call to the backend
    // For demo purposes, we'll simulate it with a mock response
    const response = await fetch('/api/patients/list');
    
    if (!response.ok) {
      throw new Error('Failed to load patient list');
    }
    
    const patientFiles: string[] = await response.json();
    
    // For each file, extract basic patient info without loading the full file
    return patientFiles.map(filename => {
      const patientInfo = extractPatientInfoFromFilename(filename);
      
      // Create a minimal profile based on the filename
      const profile: PatientProfile = {
        id: filename.split('.')[0],
        name: `${patientInfo.firstName} ${patientInfo.lastName}`.replace(/\d+/g, ''),
        riskScore: Math.floor(Math.random() * 50) + 30,
        careStatus: 'Active',
        lastUpdated: new Date().toISOString(),
        healthPlan: 'Standard Care Plan',
        state: patientInfo.state,
        photo: `https://avatars.dicebear.com/api/personas/${encodeURIComponent(patientInfo.firstName + patientInfo.lastName)}.svg`
      };
      
      return {
        id: filename.split('.')[0],
        filename,
        profile
      };
    });
  } catch (error) {
    console.error('Error loading patient list:', error);
    return [];
  }
};

// Function to load a specific patient by filename
export const loadPatientByFilename = async (filename: string): Promise<PatientData | null> => {
  try {
    // This would normally call the backend API
    return await loadPatientFromFHIR(`/api/patients/file/${filename}`);
  } catch (error) {
    console.error(`Error loading patient ${filename}:`, error);
    return null;
  }
};
