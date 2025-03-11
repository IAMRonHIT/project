import axios from 'axios';

export interface PatientContentRequest {
  prompt: string;
  patientInfo: any;
  contentType: 'care-plan' | 'education' | 'exercise' | 'diet' | 'conversation';
  clearHistory?: boolean;
}

export interface PatientContentResponse {
  code: string;
  message?: string;
}

/**
 * Service for generating patient content using the Ron AI API
 * This is completely separate from the OpenAI integration
 */
export const generatePatientContent = async (request: PatientContentRequest): Promise<string> => {
  try {
    const response = await axios.post<PatientContentResponse>('/api/patient-content', request);
    return response.data.code || response.data.message || '';
  } catch (error) {
    console.error('Error generating patient content:', error);
    throw new Error('Failed to generate patient content');
  }
};

/**
 * Clears the conversation history with Ron AI
 */
export const clearRonAIConversation = async (): Promise<void> => {
  try {
    await axios.post('/api/patient-content', { clearHistory: true });
  } catch (error) {
    console.error('Error clearing Ron AI conversation:', error);
  }
};
