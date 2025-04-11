// Service for interacting with the Ron AI backend agents

// Define interfaces for expected data structures (adjust as needed based on actual API responses)
interface MedicationData {
  // Structure of data from FDAService
  [key: string]: any; // Example placeholder
}

interface PubMedData {
  // Structure of data from pubmedService
  citations?: string[];
  [key: string]: any; // Example placeholder
}

interface MedicationReconciliationResponse {
  reconciliation: string;
  originalData: MedicationData;
  // Add other fields returned by the backend
}

interface ResearchAnalysisResponse {
  summary: string;
  keyFindings: string[];
  citations: string[];
  originalData: PubMedData;
  // Add other fields returned by the backend
}

interface GenerateComponentPayload {
  formData: any; // Define a more specific type based on CareForm's formData
  medicationReconciliation: MedicationReconciliationResponse;
  researchAnalysis: ResearchAnalysisResponse;
}

interface GenerateComponentResponse {
  componentCode: string;
  // Add other fields returned by the backend
}

const API_BASE = '/api/agents';

/**
 * Sends medication data to the backend for processing by Gemini Flash.
 * @param medData - Data obtained from the FDAService.
 * @returns The processed medication reconciliation data.
 */
async function processMedicationReconciliation(
  medData: MedicationData
): Promise<MedicationReconciliationResponse> {
  try {
    console.log('ronAgentService: Sending to medication-reconciliation', medData);
    const response = await fetch(`${API_BASE}/medication-reconciliation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Error from medication-reconciliation: ${response.status} ${response.statusText}`,
        errorBody
      );
      throw new Error(`Failed to process medication data: ${response.statusText}`);
    }

    const result: MedicationReconciliationResponse = await response.json();
    console.log('ronAgentService: Received from medication-reconciliation', result);
    return result;
  } catch (error) {
    console.error('ronAgentService: Error calling medication-reconciliation', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

/**
 * Sends PubMed research data to the backend for analysis by Gemini 2.5 Pro.
 * @param pubmedData - Data obtained from the pubmedService.
 * @returns The analyzed research findings.
 */
async function analyzeResearchFindings(
  pubmedData: PubMedData
): Promise<ResearchAnalysisResponse> {
  try {
    console.log('ronAgentService: Sending to research-analysis', pubmedData);
    const response = await fetch(`${API_BASE}/research-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pubmedData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Error from research-analysis: ${response.status} ${response.statusText}`,
        errorBody
      );
      throw new Error(`Failed to analyze research data: ${response.statusText}`);
    }

    const result: ResearchAnalysisResponse = await response.json();
    console.log('ronAgentService: Received from research-analysis', result);
    return result;
  } catch (error) {
    console.error('ronAgentService: Error calling research-analysis', error);
    throw error;
  }
}

/**
 * Sends all necessary data to the backend Coding Agent to generate a React component.
 * @param payload - Object containing formData, processed medication data, and analyzed research findings.
 * @returns An object containing the generated React component code string.
 */
async function generateCarePlanComponent(
  payload: GenerateComponentPayload
): Promise<GenerateComponentResponse> {
  try {
    console.log('ronAgentService: Sending to generate-component', payload);
    const response = await fetch(`${API_BASE}/generate-component`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Error from generate-component: ${response.status} ${response.statusText}`,
        errorBody
      );
      throw new Error(`Failed to generate component: ${response.statusText}`);
    }

    const result: GenerateComponentResponse = await response.json();
    console.log(
      'ronAgentService: Received from generate-component',
      result.componentCode.substring(0, 100) + '...'
    );
    return result;
  } catch (error) {
    console.error('ronAgentService: Error calling generate-component', error);
    throw error;
  }
}

export const ronAgentService = {
  processMedicationReconciliation,
  analyzeResearchFindings,
  generateCarePlanComponent,
};
