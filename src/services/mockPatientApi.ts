import { PatientData, PatientProfile } from './fhirPatientService';

// Mock patient data to represent our FHIR files
const mockPatients = [
  {
    id: 'AK_Covid_Alakanuk742_Aklaq159',
    name: 'Aklaq Alakanuk',
    gender: 'male',
    birthDate: '1985-07-15',
    address: '123 Tundra Way',
    city: 'Alakanuk',
    state: 'AK',
    condition: 'Covid-19',
    riskScore: 68,
    careStatus: 'Active',
    healthPlan: 'Alaska Premium Care',
    lastUpdated: '2025-03-01T14:30:00Z',
    photo: 'https://avatars.dicebear.com/api/personas/AklaqAlakanuk.svg'
  },
  {
    id: 'CA_Covid_Whitcomb731_Everett285',
    name: 'Everett Whitcomb',
    gender: 'male',
    birthDate: '1973-09-12',
    address: '4821 Pacific Coast Hwy',
    city: 'San Diego',
    state: 'CA',
    condition: 'Covid-19',
    riskScore: 54,
    careStatus: 'Active',
    healthPlan: 'California Care Plus',
    lastUpdated: '2025-03-05T09:15:00Z',
    photo: 'https://avatars.dicebear.com/api/personas/EverettWhitcomb.svg'
  },
  {
    id: 'TX_HepB_Booker726_Terrence153',
    name: 'Terrence Booker',
    gender: 'male',
    birthDate: '1992-04-22',
    address: '782 Magnolia Blvd',
    city: 'Houston',
    state: 'TX',
    condition: 'Hepatitis B',
    riskScore: 72,
    careStatus: 'Active',
    healthPlan: 'Texas Health Select',
    lastUpdated: '2025-02-28T11:20:00Z',
    photo: 'https://avatars.dicebear.com/api/personas/TerrenceBooker.svg'
  },
  {
    id: 'NY_Covid_Fitzgerald743_Walter159',
    name: 'Walter Fitzgerald',
    gender: 'male',
    birthDate: '1965-11-08',
    address: '221 Broadway Ave',
    city: 'New York',
    state: 'NY',
    condition: 'Covid-19',
    riskScore: 63,
    careStatus: 'Active',
    healthPlan: 'Empire State Health',
    lastUpdated: '2025-03-08T16:45:00Z',
    photo: 'https://avatars.dicebear.com/api/personas/WalterFitzgerald.svg'
  },
  {
    id: 'FL_HepB_Morales742_Carmen185',
    name: 'Carmen Morales',
    gender: 'female',
    birthDate: '1988-02-19',
    address: '1543 Ocean Drive',
    city: 'Miami',
    state: 'FL',
    condition: 'Hepatitis B',
    riskScore: 47,
    careStatus: 'Active',
    healthPlan: 'Sunshine State Care',
    lastUpdated: '2025-03-07T10:30:00Z',
    photo: 'https://avatars.dicebear.com/api/personas/CarmenMorales.svg'
  }
];

// Get all patients
export const getAllPatients = async (): Promise<PatientProfile[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPatients as PatientProfile[];
};

// Get a specific patient by ID
export const getPatientById = async (id: string): Promise<PatientProfile | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const patient = mockPatients.find(p => p.id === id);
  return patient ? (patient as PatientProfile) : null;
};

// Get full patient data including conditions, observations, etc.
export const getPatientData = async (id: string): Promise<PatientData | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const patient = mockPatients.find(p => p.id === id) as PatientProfile;
  if (!patient) return null;
  
  // Create mock patient data with the profile
  return {
    profile: patient,
    conditions: [
      {
        id: '1',
        code: patient.condition === 'Covid-19' ? 'U07.1' : 'B18.1',
        display: patient.condition || 'Unknown Condition',
        status: 'active',
        type: 'Acute',
        onsetDate: '2025-01-15'
      }
    ],
    observations: [
      {
        id: '1',
        code: '8480-6',
        display: 'Systolic blood pressure',
        value: '125',
        unit: 'mmHg',
        date: '2025-02-28T09:30:00Z',
        status: 'final',
        category: 'vital-signs'
      },
      {
        id: '2',
        code: '8462-4',
        display: 'Diastolic blood pressure',
        value: '82',
        unit: 'mmHg',
        date: '2025-02-28T09:30:00Z',
        status: 'final',
        category: 'vital-signs'
      }
    ],
    medications: [
      {
        id: '1',
        name: patient.condition === 'Covid-19' ? 'Paxlovid' : 'Entecavir',
        dosage: patient.condition === 'Covid-19' ? '300mg' : '0.5mg',
        frequency: 'Daily',
        refillDate: '2025-04-01',
        adherenceRate: 85,
        lastTaken: '2025-03-09T08:00:00Z',
        nextDue: '2025-03-10T08:00:00Z',
        status: 'ACTIVE'
      }
    ],
    careJourneys: [
      {
        id: '1',
        title: `${patient.condition} Management`,
        startDate: '2025-01-20',
        status: 'Active',
        primaryCondition: patient.condition || 'Unknown',
        riskLevel: patient.riskScore > 60 ? 'High' : 'Medium',
        lastUpdated: patient.lastUpdated,
        type: patient.condition === 'Covid-19' ? 'Acute' : 'Chronic',
        severity: patient.riskScore / 10,
        phase: 'Treatment',
        careTeam: [
          { role: 'Primary Care Physician', name: 'Dr. Emily Chen' },
          { role: 'Care Coordinator', name: 'James Wilson' }
        ],
        metrics: {
          reviews: 4,
          activePlans: 2,
          claims: 5,
          communications: 12
        },
        timeline: [
          {
            id: '1',
            type: 'Diagnosis',
            title: `${patient.condition} Diagnosis`,
            description: `Initial diagnosis of ${patient.condition}`,
            date: '2025-01-15',
            status: 'Completed'
          },
          {
            id: '2',
            type: 'Treatment',
            title: 'Treatment Plan Initiated',
            description: 'Started medication and monitoring protocol',
            date: '2025-01-20',
            status: 'Completed'
          },
          {
            id: '3',
            type: 'Follow-up',
            title: 'First Follow-up Visit',
            description: 'Assessment of treatment response',
            date: '2025-02-05',
            status: 'Completed'
          },
          {
            id: '4',
            type: 'Lab Test',
            title: 'Lab Results Review',
            description: 'Review of latest lab results',
            date: '2025-02-15',
            status: 'Completed'
          },
          {
            id: '5',
            type: 'Follow-up',
            title: 'Upcoming Follow-up Visit',
            description: 'Scheduled for treatment assessment',
            date: '2025-03-15',
            status: 'Scheduled'
          }
        ],
        predictions: [
          {
            id: '1',
            title: 'Potential Medication Adjustment',
            description: 'May need dosage adjustment based on latest lab results',
            confidence: 0.75,
            timeframe: '2 weeks',
            priority: 'medium',
            action: 'Schedule lab test review with PCP'
          }
        ]
      }
    ]
  };
};
