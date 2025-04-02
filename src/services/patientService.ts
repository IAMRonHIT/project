import { CarePlanFormData } from '../components/RonAI/CarePlanForm';

interface PatientJsonData {
  member_id: string;
  member_name: string;
  member_dob: string;
  gender: string;
  medication_1: string;
  medication_2: string;
  medication_3: string;
  medication_4: string;
  medications: string;
  dx_1: string;
  dx_2: string;
  dx_3: string;
  dx_4: string;
  diagnosis: string;
}

// Calculate age from date of birth
const calculateAge = (dob: string): string => {
  if (!dob) return '';
  
  // DOB format is MM/DD/YYYY
  const parts = dob.split('/');
  if (parts.length !== 3) return '';
  
  const birthDate = new Date(`${parts[2]}-${parts[0]}-${parts[1]}`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  
  // Adjust age if birthday hasn't occurred yet this year
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age.toString();
};

// Function to parse JSON patient data
const parsePatientJsonData = async (): Promise<PatientJsonData[]> => {
  try {
    const response = await fetch('/data/Patients/New Member Schema.json');
    if (!response.ok) {
      throw new Error(`Failed to load JSON patient data: ${response.statusText}`);
    }
    
    const jsonData: PatientJsonData[] = await response.json();
    return jsonData;
  } catch (error) {
    console.error('Error parsing JSON patient data:', error);
    return [];
  }
};

// Function to load patient data for a specific member ID
export const loadPatientDataByMemberId = async (memberId: string): Promise<CarePlanFormData> => {
  try {
    const patients = await parsePatientJsonData();
    const patient = patients.find(p => p.member_id === memberId);
    
    if (!patient) {
      throw new Error(`Patient with ID ${memberId} not found`);
    }
    
    // Extract primary diagnosis (first one in the list)
    let primaryCondition = '';
    if (patient.dx_1) {
      const diagnosisParts = patient.dx_1.split(',');
      primaryCondition = diagnosisParts.length > 1 ? diagnosisParts[1].trim() : diagnosisParts[0].trim();
    }
    
    // Format medications for display
    const medications = [
      patient.medication_1,
      patient.medication_2,
      patient.medication_3,
      patient.medication_4
    ].filter(med => med && med.trim() !== '');
    
    const formattedMedications = medications
      .map(med => `- ${med}`)
      .join('\n');
    
    // Format other diagnoses for relevant history
    const otherDiagnoses = [patient.dx_2, patient.dx_3, patient.dx_4]
      .filter(dx => dx && dx.trim() !== '')
      .map(dx => {
        const parts = dx.split(',');
        return `- ${parts.length > 1 ? parts[1].trim() : parts[0].trim()}`;
      })
      .join('\n');
    
    // Generic symptoms based on condition
    const symptoms = `Patient reports symptoms consistent with ${primaryCondition || 'their condition'}.`;
    
    // Generic goals
    const goals = `- Manage ${primaryCondition || 'condition'} effectively\n- Improve quality of life\n- Prevent complications`;
    
    return {
      patientName: patient.member_name,
      patientAge: calculateAge(patient.member_dob),
      patientGender: patient.gender,
      condition: primaryCondition,
      symptoms: symptoms,
      currentMedications: formattedMedications,
      relevantHistory: otherDiagnoses,
      goals: goals,
      outputType: "carePlan" // default to care plan
    };
  } catch (error) {
    console.error('Error loading patient data by member ID:', error);
    throw error;
  }
};

// Function to get all patients for dropdown
export const getAllPatients = async (): Promise<{ id: string; name: string }[]> => {
  try {
    const patients = await parsePatientJsonData();
    return patients.map(patient => ({
      id: patient.member_id,
      name: `${patient.member_name} (MRN: ${patient.member_id})`
    }));
  } catch (error) {
    console.error('Error getting all patients:', error);
    throw error;
  }
};
