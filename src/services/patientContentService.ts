import axios from 'axios';

export interface PatientContentRequest {
  prompt: string;
  patientInfo: any;
  contentType: 'care-plan' | 'education' | 'exercise' | 'diet';
}

export interface PatientContentResponse {
  code: string;
}

/**
 * Service for generating patient content using the Grok API
 * This is completely separate from the OpenAI integration
 */
export const generatePatientContent = async (request: PatientContentRequest): Promise<string> => {
  try {
    const response = await axios.post<PatientContentResponse>('/api/patient-content', request);
    return response.data.code;
  } catch (error) {
    console.error('Error generating patient content:', error);
    throw new Error('Failed to generate patient content');
  }
};
