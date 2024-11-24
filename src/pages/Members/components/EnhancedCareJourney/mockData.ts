import { CareJourney } from './types';

export const mockCareJourneys: CareJourney[] = [
  {
    id: 'CJ001',
    title: 'ACL Surgery & Recovery',
    type: 'surgery',
    status: 'active',
    startDate: 'Mar 15, 2024',
    provider: 'Dr. Sarah Miller',
    events: [
      {
        id: 'e1',
        type: 'appointment',
        title: 'Pre-operative Assessment',
        description: 'Comprehensive evaluation for surgery readiness',
        date: 'Mar 15, 2024',
        provider: 'Dr. Sarah Miller'
      },
      {
        id: 'e2',
        type: 'treatment',
        title: 'Physical Therapy Session',
        description: 'Pre-operative strengthening exercises',
        date: 'Mar 12, 2024',
        provider: 'Emily Parker, PT'
      },
      {
        id: 'e3',
        type: 'medication',
        title: 'Pre-op Medication Review',
        description: 'Review and adjustment of current medications',
        date: 'Mar 10, 2024',
        provider: 'Dr. James Chen'
      }
    ]
  },
  {
    id: 'CJ002',
    title: 'Physical Therapy Program',
    type: 'therapy',
    status: 'completed',
    startDate: 'Feb 1, 2024',
    endDate: 'Mar 1, 2024',
    provider: 'Emily Parker, PT',
    events: [
      {
        id: 'e4',
        type: 'treatment',
        title: 'Final Assessment',
        description: 'Evaluation of therapy progress and outcomes',
        date: 'Mar 1, 2024',
        provider: 'Emily Parker, PT'
      },
      {
        id: 'e5',
        type: 'appointment',
        title: 'Progress Review',
        description: 'Mid-program progress evaluation',
        date: 'Feb 15, 2024',
        provider: 'Emily Parker, PT'
      }
    ]
  },
  {
    id: 'CJ003',
    title: 'Pain Management Plan',
    type: 'medication',
    status: 'pending',
    startDate: 'Mar 20, 2024',
    provider: 'Dr. James Chen',
    events: [
      {
        id: 'e6',
        type: 'medication',
        title: 'Initial Assessment',
        description: 'Pain evaluation and medication planning',
        date: 'Mar 20, 2024',
        provider: 'Dr. James Chen'
      }
    ]
  }
];