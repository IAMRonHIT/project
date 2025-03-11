import { v4 as uuidv4 } from 'uuid';

// Types for our transformed patient data
export interface PatientProfile {
  id: string;
  name: string;
  gender?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  photo?: string;
  condition?: string;
  riskScore: number;
  careStatus: string;
  healthPlan?: string;
  lastUpdated: string;
}

export interface Condition {
  id: string;
  code: string;
  display: string;
  onsetDate?: string;
  severity?: string;
  status: string;
  category?: string;
  type?: 'Chronic' | 'Acute' | 'Injury' | 'Mental Health';
}

export interface Observation {
  id: string;
  code: string;
  display: string;
  value?: string;
  unit?: string;
  date: string;
  status: string;
  category?: string;
  interpretation?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage?: string;
  frequency?: string;
  refillDate?: string;
  adherenceRate?: number;
  lastTaken?: string;
  nextDue?: string;
  status: 'ACTIVE' | 'PENDING_REFILL' | 'COMPLETED' | 'STOPPED';
}

export interface CareJourney {
  id: string;
  title: string;
  startDate: string;
  status: string;
  primaryCondition: string;
  riskLevel: string;
  lastUpdated: string;
  type: 'Chronic' | 'Acute' | 'Injury' | 'Mental Health';
  severity: number;
  phase: string;
  careTeam: Array<{ role: string; name: string }>;
  metrics: {
    reviews: number;
    activePlans: number;
    claims: number;
    communications: number;
  };
  timeline: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    date: string;
    status: string;
    metadata?: Record<string, string>;
  }>;
  predictions: Array<{
    id: string;
    title: string;
    description: string;
    confidence: number;
    timeframe: string;
    priority: 'high' | 'medium' | 'low';
    action: string;
  }>;
}

export interface PatientData {
  profile: PatientProfile;
  conditions: Condition[];
  observations: Observation[];
  medications: Medication[];
  careJourneys: CareJourney[];
}

// Helper functions to extract data from FHIR resources
const extractPatientData = (fhirBundle: any): PatientProfile => {
  // Find the Patient resource in the bundle
  const patientResource = fhirBundle.entry.find(
    (entry: any) => entry.resource.resourceType === 'Patient'
  )?.resource;

  if (!patientResource) {
    throw new Error('Patient resource not found in FHIR bundle');
  }

  // Extract name
  const name = patientResource.name && patientResource.name[0];
  const fullName = name 
    ? `${name.given?.join(' ') || ''} ${name.family || ''}`.trim()
    : 'Unknown';

  // Extract address
  const address = patientResource.address && patientResource.address[0];
  
  // Generate avatar based on name and gender
  const gender = patientResource.gender || 'unknown';
  const avatarSeed = `${fullName}-${gender}`;
  const photoUrl = `https://avatars.dicebear.com/api/personas/${encodeURIComponent(avatarSeed)}.svg`;

  // Calculate a mock risk score based on conditions count
  const conditionsCount = fhirBundle.entry.filter(
    (entry: any) => entry.resource.resourceType === 'Condition'
  ).length;
  
  const riskScore = Math.min(Math.max(10 + conditionsCount * 7, 10), 100);

  return {
    id: patientResource.id || uuidv4(),
    name: fullName,
    gender: patientResource.gender,
    birthDate: patientResource.birthDate,
    address: address?.line?.join(', '),
    city: address?.city,
    state: address?.state,
    phone: patientResource.telecom?.find((t: any) => t.system === 'phone')?.value,
    email: patientResource.telecom?.find((t: any) => t.system === 'email')?.value,
    photo: photoUrl,
    riskScore: riskScore,
    careStatus: 'Active', // Default value
    healthPlan: 'Standard Care Plan', // Mock value
    lastUpdated: new Date().toISOString()
  };
};

const extractConditions = (fhirBundle: any): Condition[] => {
  // Find all Condition resources in the bundle
  const conditionResources = fhirBundle.entry
    .filter((entry: any) => entry.resource.resourceType === 'Condition')
    .map((entry: any) => entry.resource);

  return conditionResources.map((condition: any) => {
    const coding = condition.code?.coding?.[0];
    
    // Determine condition type based on category or code
    let type: 'Chronic' | 'Acute' | 'Injury' | 'Mental Health' = 'Chronic';
    
    // Use filename or condition code to determine type
    if (condition.category) {
      const categoryCode = condition.category[0]?.coding?.[0]?.code;
      if (categoryCode === 'problem-list-item') {
        type = 'Chronic';
      } else if (categoryCode === 'encounter-diagnosis') {
        type = 'Acute';
      }
    }
    
    // Check code system for injury or mental health
    if (coding?.system?.includes('icd10')) {
      if (coding.code.startsWith('S') || coding.code.startsWith('T')) {
        type = 'Injury';
      } else if (coding.code.startsWith('F')) {
        type = 'Mental Health';
      }
    }

    return {
      id: condition.id || uuidv4(),
      code: coding?.code || '',
      display: coding?.display || condition.code?.text || 'Unknown Condition',
      onsetDate: condition.onsetDateTime,
      severity: condition.severity?.coding?.[0]?.display,
      status: condition.clinicalStatus?.coding?.[0]?.code || 'active',
      category: condition.category?.[0]?.coding?.[0]?.display,
      type
    };
  });
};

const extractObservations = (fhirBundle: any): Observation[] => {
  // Find all Observation resources in the bundle
  const observationResources = fhirBundle.entry
    .filter((entry: any) => entry.resource.resourceType === 'Observation')
    .map((entry: any) => entry.resource);

  return observationResources.map((observation: any) => {
    const coding = observation.code?.coding?.[0];
    
    // Extract value based on type
    let value = '';
    let unit = '';
    
    if (observation.valueQuantity) {
      value = observation.valueQuantity.value?.toString();
      unit = observation.valueQuantity.unit;
    } else if (observation.valueCodeableConcept) {
      value = observation.valueCodeableConcept.coding?.[0]?.display ||
             observation.valueCodeableConcept.text;
    } else if (observation.valueString) {
      value = observation.valueString;
    }

    return {
      id: observation.id || uuidv4(),
      code: coding?.code || '',
      display: coding?.display || observation.code?.text || 'Unknown Observation',
      value,
      unit,
      date: observation.effectiveDateTime || observation.issued,
      status: observation.status || 'unknown',
      category: observation.category?.[0]?.coding?.[0]?.display,
      interpretation: observation.interpretation?.[0]?.coding?.[0]?.display
    };
  });
};

const extractMedications = (fhirBundle: any): Medication[] => {
  // Find all MedicationAdministration and MedicationStatement resources in the bundle
  const medicationResources = fhirBundle.entry
    .filter((entry: any) => 
      entry.resource.resourceType === 'MedicationAdministration' || 
      entry.resource.resourceType === 'MedicationStatement'
    )
    .map((entry: any) => entry.resource);

  return medicationResources.map((medication: any) => {
    // Extract medication details
    let medicationName = 'Unknown Medication';
    let dosage = '';
    let frequency = '';
    
    // Try different paths to find medication info
    if (medication.medicationCodeableConcept) {
      // Most common pattern in FHIR data
      medicationName = medication.medicationCodeableConcept.coding?.[0]?.display || 
                     medication.medicationCodeableConcept.text || 
                     medicationName;
                     
      // Some FHIR implementations include dosage in the medication name
      // Try to extract dosage information if present
      if (medicationName.includes(' ')) {
        const parts = medicationName.split(' ');
        const lastPart = parts[parts.length - 1];
        const secondLastPart = parts.length > 1 ? parts[parts.length - 2] : null;
        
        // Check if last part or second last part contains dosage info (e.g., "500 MG" or "10mg")
        if (lastPart.match(/^[0-9]+(\.[0-9]+)?\s*(mg|mcg|ml|g|ug|units|mcg\/ml|mg\/ml)/i) ||
            (secondLastPart && /^[0-9]+(\.[0-9]+)?$/.test(secondLastPart) && 
             lastPart.match(/^(mg|mcg|ml|g|ug|units|tablet|capsule)/i))) {
          dosage = (secondLastPart && /^[0-9]+(\.[0-9]+)?$/.test(secondLastPart)) 
                    ? `${secondLastPart} ${lastPart}` 
                    : lastPart;
        }
      }
    } else if (medication.medication?.reference) {
      // If it's a reference, we need to find the medication in the bundle
      const medicationRef = medication.medication.reference;
      const medicationResource = fhirBundle.entry.find(
        (entry: any) => entry.fullUrl === medicationRef
      )?.resource;
      
      if (medicationResource) {
        medicationName = medicationResource.code?.coding?.[0]?.display ||
                       medicationResource.code?.text ||
                       medicationName;
      }
    }

    // Extract dosage information - FHIR dosage is often an array
    if (!dosage && medication.dosage) {
      // Handle both array and single object cases
      const dosageInstructions = Array.isArray(medication.dosage) 
                              ? medication.dosage 
                              : [medication.dosage];
      
      if (dosageInstructions.length > 0) {
        // Use first dosage instruction (most important)
        const firstDosage = dosageInstructions[0];
        
        if (firstDosage.dose?.value) {
          dosage = `${firstDosage.dose.value} ${firstDosage.dose.unit || ''}`;
        } else if (firstDosage.doseQuantity?.value) {
          dosage = `${firstDosage.doseQuantity.value} ${firstDosage.doseQuantity.unit || ''}`;
        } else if (firstDosage.text && !frequency) {
          // If text contains dosage info, parse it out
          const doseMatch = firstDosage.text.match(/(\d+(\.\d+)?)\s*(mg|mcg|ml|g|tablet|capsule|unit)/i);
          if (doseMatch) {
            dosage = doseMatch[0];
          } else {
            // If we can't extract a specific dose, use the full text
            dosage = firstDosage.text;
          }
        }
        
        // Extract frequency information
        if (!frequency) {
          if (firstDosage.timing?.code?.text) {
            frequency = firstDosage.timing.code.text;
          } else if (firstDosage.timing?.repeat?.frequency) {
            const repeat = firstDosage.timing.repeat;
            frequency = `${repeat.frequency} time(s)${repeat.period ? ` per ${repeat.period} ${repeat.periodUnit || 'day'}` : ' daily'}`;
          } else if (firstDosage.text) {
            // Try to extract frequency from text
            const freqPatterns = [
              /once daily/i, /twice daily/i, /three times daily/i, /every (\d+) hours/i,
              /(\d+) times? (a|per) (day|week|month)/i, /as needed/i, /prn/i
            ];
            
            for (const pattern of freqPatterns) {
              const match = firstDosage.text.match(pattern);
              if (match) {
                frequency = match[0];
                break;
              }
            }
            
            // If we couldn't extract frequency but have dosage text, use it
            if (!frequency && firstDosage.text && !dosage.includes(firstDosage.text)) {
              frequency = firstDosage.text;
            }
          }
        }
      }
    }
    
    // Fallback for frequency if still not found
    if (!frequency) {
      if (medication.effectivePeriod?.start) {
        const startDate = new Date(medication.effectivePeriod.start);
        frequency = medication.effectivePeriod?.end ? 
          `From ${startDate.toLocaleDateString()} to ${new Date(medication.effectivePeriod.end).toLocaleDateString()}` : 
          `Since ${startDate.toLocaleDateString()}`;
      } else {
        frequency = 'As directed';
      }
    }

    // Generate random adherence rate between 70 and 100
    const adherenceRate = Math.floor(Math.random() * 30) + 70;

    return {
      id: medication.id || uuidv4(),
      name: medicationName,
      dosage: dosage,
      frequency: frequency,
      refillDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      adherenceRate,
      lastTaken: medication.effectiveDateTime || medication.effectivePeriod?.start,
      nextDue: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: medication.status === 'completed' ? 'COMPLETED' : 
              medication.status === 'stopped' ? 'STOPPED' : 
              Math.random() > 0.7 ? 'PENDING_REFILL' : 'ACTIVE'
    };
  });
};

const createCareJourneysFromConditions = (conditions: Condition[]): CareJourney[] => {
  // Group conditions by type and create care journeys
  const conditionGroups: Record<string, Condition[]> = {};
  
  conditions.forEach(condition => {
    const type = condition.type || 'Chronic';
    if (!conditionGroups[type]) {
      conditionGroups[type] = [];
    }
    conditionGroups[type].push(condition);
  });

  // Create care journeys from condition groups
  return Object.entries(conditionGroups).map(([type, groupedConditions]) => {
    const primaryCondition = groupedConditions[0];
    const conditionCount = groupedConditions.length;
    
    // Calculate a severity based on condition count
    const severity = Math.min(Math.max(conditionCount * 15, 20), 90);
    
    // Generate random metrics
    const reviews = Math.floor(Math.random() * 10) + 1;
    const activePlans = Math.floor(Math.random() * 3) + 1;
    const claims = Math.floor(Math.random() * 15) + 1;
    const communications = Math.floor(Math.random() * 30) + 1;

    // Generate mock care team
    const careTeam = [
      { role: 'Primary Care', name: 'Dr. Sarah Johnson' },
      { role: 'Specialist', name: 'Dr. Michael Chen' },
      { role: 'Care Coordinator', name: 'Emily Davis' }
    ];

    // Generate mock timeline events
    const timeline = [
      {
        id: uuidv4(),
        type: 'clinical',
        title: 'Initial Diagnosis',
        description: `Diagnosed with ${primaryCondition.display}`,
        date: primaryCondition.onsetDate || '2024-01-01',
        status: 'completed'
      },
      {
        id: uuidv4(),
        type: 'administrative',
        title: 'Care Plan Created',
        description: 'Treatment plan established',
        date: new Date(new Date(primaryCondition.onsetDate || '2024-01-01').getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'completed'
      },
      {
        id: uuidv4(),
        type: 'communication',
        title: 'Follow-up Consultation',
        description: 'Review of treatment progress',
        date: new Date(new Date(primaryCondition.onsetDate || '2024-01-01').getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'completed',
        metadata: {
          provider: 'Dr. Sarah Johnson'
        }
      }
    ];

    // Generate mock predictions
    const predictions = [
      {
        id: uuidv4(),
        title: severity > 70 ? 'High Risk of Complications' : 'Moderate Risk of Complications',
        description: `Based on ${primaryCondition.display} progression and risk factors`,
        confidence: severity,
        timeframe: 'Next 30 days',
        priority: severity > 70 ? 'high' : (severity > 40 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
        action: 'Review Care Plan'
      }
    ];

    return {
      id: uuidv4(),
      title: `${primaryCondition.display} Management`,
      startDate: primaryCondition.onsetDate || '2024-01-01',
      status: 'Active',
      primaryCondition: primaryCondition.display,
      riskLevel: severity > 70 ? 'High' : severity > 40 ? 'Medium' : 'Low',
      lastUpdated: new Date().toISOString().split('T')[0],
      type: type as 'Chronic' | 'Acute' | 'Injury' | 'Mental Health',
      severity,
      phase: 'Active Management Phase',
      careTeam,
      metrics: {
        reviews,
        activePlans,
        claims,
        communications
      },
      timeline,
      predictions
    };
  });
};

// Main function to transform FHIR data into our application format
export const transformFHIRToPatientProfile = (fhirData: any): PatientData => {
  // Extract patient demographics
  const profile = extractPatientData(fhirData);
  
  // Extract conditions & diagnoses
  const conditions = extractConditions(fhirData);
  
  // Extract observations (vital signs, lab results)
  const observations = extractObservations(fhirData);
  
  // Extract medications
  const medications = extractMedications(fhirData);
  
  // Create care journeys from conditions
  const careJourneys = createCareJourneysFromConditions(conditions);
  
  return {
    profile,
    conditions,
    observations,
    medications,
    careJourneys
  };
};

// Function to load FHIR data from JSON file
export const loadPatientFromFHIR = async (patientFilePath: string): Promise<PatientData> => {
  try {
    const response = await fetch(patientFilePath);
    if (!response.ok) {
      throw new Error(`Failed to load patient data: ${response.statusText}`);
    }
    const fhirData = await response.json();
    return transformFHIRToPatientProfile(fhirData);
  } catch (error) {
    console.error('Error loading patient data:', error);
    throw error;
  }
};

export const loadPatientDataForForm = async (patientFilePath: string): Promise<{
  patientName: string;
  patientAge: string;
  patientGender: string;
  condition: string;
  symptoms: string;
  currentMedications: string;
  relevantHistory: string;
  goals: string;
}> => {
  try {
    const patientData = await loadPatientFromFHIR(patientFilePath);
    
    // Extract patient profile data
    const patientProfile = patientData.profile;
    
    // Calculate age from birthDate
    let age = '';
    if (patientProfile.birthDate) {
      const birthDate = new Date(patientProfile.birthDate);
      const today = new Date();
      age = String(today.getFullYear() - birthDate.getFullYear());
      
      // Adjust age if birthday hasn't occurred yet this year
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age = String(parseInt(age) - 1);
      }
    }
    
    // Get primary condition
    let primaryCondition = '';
    let symptoms = '';
    
    if (patientData.conditions.length > 0) {
      // Find the most recent active condition
      const activeConditions = patientData.conditions.filter(c => c.status === 'active');
      if (activeConditions.length > 0) {
        // Sort by onset date if available
        activeConditions.sort((a, b) => {
          if (!a.onsetDate) return 1;
          if (!b.onsetDate) return -1;
          return new Date(b.onsetDate).getTime() - new Date(a.onsetDate).getTime();
        });
        primaryCondition = activeConditions[0].display;
        
        // Extract some symptoms based on observations related to this condition
        const relevantObservations = patientData.observations
          .filter(obs => obs.date && new Date(obs.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Last 30 days
          .map(obs => `- ${obs.display}: ${obs.value || ''} ${obs.unit || ''}`)
          .join('\n');
        
        symptoms = relevantObservations || 'No recent symptoms documented.';
      }
    }
    
    // Get current medications
    const activeMedications = patientData.medications
      .filter(med => med.status === 'ACTIVE')
      .map(med => {
        let medicationText = `- ${med.name}`;
        if (med.dosage) medicationText += ` ${med.dosage}`;
        if (med.frequency) medicationText += ` ${med.frequency}`;
        return medicationText;
      })
      .join('\n');
    
    // Compile relevant history from older conditions
    const relevantHistory = patientData.conditions
      .filter(c => c.status !== 'active')
      .map(c => `- ${c.display} (${c.status})`)
      .join('\n');
    
    // Set generic goals based on condition type
    let goals = '';
    const conditionObj = patientData.conditions.find(c => c.display === primaryCondition);
    if (conditionObj) {
      switch(conditionObj.type) {
        case 'Chronic':
          goals = '- Improve management of chronic condition\n- Reduce symptom frequency and severity\n- Maintain quality of life';
          break;
        case 'Acute':
          goals = '- Resolve acute condition\n- Prevent complications\n- Return to normal activities';
          break;
        case 'Injury':
          goals = '- Heal injury completely\n- Restore full function\n- Prevent re-injury';
          break;
        case 'Mental Health':
          goals = '- Improve mental health status\n- Develop coping mechanisms\n- Enhance daily functioning';
          break;
        default:
          goals = '- Improve overall health status\n- Manage symptoms effectively';
      }
    }
    
    return {
      patientName: patientProfile.name,
      patientAge: age,
      patientGender: patientProfile.gender || '',
      condition: primaryCondition,
      symptoms: symptoms,
      currentMedications: activeMedications || 'No current medications documented.',
      relevantHistory: relevantHistory || 'No relevant history documented.',
      goals: goals
    };
  } catch (error) {
    console.error('Error loading patient data for form:', error);
    throw error;
  }
};
