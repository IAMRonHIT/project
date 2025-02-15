import { TimelineGroupData } from './types';

export const mockTimelineData: TimelineGroupData[] = [
  {
    month: 'March 2024',
    events: [
      {
        id: '1',
        type: 'appointment',
        title: 'Pre-operative Assessment',
        description: 'Comprehensive evaluation for ACL surgery readiness',
        time: 'Mar 15, 2024 09:30 AM',
        provider: 'Dr. Sarah Miller',
        status: 'scheduled'
      },
      {
        id: '2',
        type: 'medication',
        title: 'Pain Management Review',
        description: 'Adjustment to current medication regimen',
        time: 'Mar 12, 2024 02:15 PM',
        provider: 'Dr. James Chen',
        status: 'completed'
      }
    ]
  },
  {
    month: 'February 2024',
    events: [
      {
        id: '3',
        type: 'treatment',
        title: 'Physical Therapy Session',
        description: 'Strength training and mobility exercises',
        time: 'Feb 28, 2024 11:00 AM',
        provider: 'Emily Parker, PT',
        status: 'completed'
      },
      {
        id: '4',
        type: 'communication',
        title: 'Care Team Discussion',
        description: 'Review of treatment progress and next steps',
        time: 'Feb 20, 2024 03:45 PM',
        status: 'completed'
      },
      {
        id: '5',
        type: 'document',
        title: 'MRI Results',
        description: 'Complete ACL tear confirmation and analysis',
        time: 'Feb 15, 2024 10:00 AM',
        provider: 'Dr. Michael Ross',
        status: 'completed'
      }
    ]
  },
  {
    month: 'January 2024',
    events: [
      {
        id: '6',
        type: 'appointment',
        title: 'Initial Consultation',
        description: 'Evaluation of knee injury and treatment planning',
        time: 'Jan 30, 2024 02:00 PM',
        provider: 'Dr. Sarah Miller',
        status: 'completed'
      },
      {
        id: '7',
        type: 'treatment',
        title: 'Emergency Care',
        description: 'Initial assessment and stabilization of knee injury',
        time: 'Jan 28, 2024 08:45 AM',
        provider: 'Dr. James Chen',
        status: 'completed'
      }
    ]
  }
];