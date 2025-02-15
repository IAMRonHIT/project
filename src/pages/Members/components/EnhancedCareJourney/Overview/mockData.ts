import { Activity, AlertCircle, Heart, Calendar } from 'lucide-react';
import { CareJourneyData } from './types';

export const mockCareJourneyData: CareJourneyData = {
  header: {
    type: 'Chronic',
    diagnosis: 'Congestive Heart Failure (ICD-10: I50.9)',
    duration: '45 days active',
    phase: 'Active Management Phase',
    severity: 75,
    careTeam: [
      { role: 'Primary Care', name: 'Dr. Sarah Johnson' },
      { role: 'Cardiologist', name: 'Dr. Michael Chen' },
      { role: 'Care Coordinator', name: 'Emily Davis' }
    ]
  },
  predictions: [
    {
      id: 'p1',
      title: 'High Risk of Readmission',
      description: 'Based on recent vital trends and medication adherence patterns',
      confidence: 85,
      timeframe: 'Next 30 days',
      priority: 'high',
      action: 'Review Care Plan'
    },
    {
      id: 'p2',
      title: 'Medication Interaction Alert',
      description: 'Potential interaction between new prescription and existing medications',
      confidence: 75,
      timeframe: 'Immediate attention needed',
      priority: 'medium',
      action: 'Schedule Review'
    }
  ],
  metrics: [
    {
      id: 'm1',
      name: 'Risk Score',
      value: '75',
      trend: 'up',
      change: '+5 pts',
      status: 'warning',
      icon: AlertCircle,
      description: 'Increased from last assessment'
    },
    {
      id: 'm2',
      name: 'Care Plan Adherence',
      value: '85%',
      trend: 'stable',
      change: '0%',
      status: 'success',
      icon: Heart,
      description: 'Maintaining consistent adherence'
    },
    {
      id: 'm3',
      name: 'Next Appointment',
      value: '3 days',
      trend: 'down',
      change: 'On track',
      status: 'success',
      icon: Calendar,
      description: 'Follow-up with Dr. Johnson'
    },
    {
      id: 'm4',
      name: 'Active Tasks',
      value: '4',
      trend: 'up',
      change: '+2',
      status: 'warning',
      icon: Activity,
      description: 'New tasks added today'
    }
  ],
  timeline: [
    {
      id: 't1',
      type: 'clinical',
      title: 'Primary Care Visit',
      description: 'Routine follow-up and medication review',
      date: '2024-02-05',
      status: 'completed',
      metadata: {
        provider: 'Dr. Sarah Johnson',
        location: 'Primary Care Clinic',
        outcome: 'Medication adjusted'
      }
    },
    {
      id: 't2',
      type: 'administrative',
      title: 'Care Plan Update',
      description: 'Modified exercise and diet recommendations',
      date: '2024-02-03',
      status: 'completed'
    },
    {
      id: 't3',
      type: 'communication',
      title: 'Care Team Conference',
      description: 'Discussion of progress and next steps',
      date: '2024-02-01',
      status: 'completed',
      metadata: {
        provider: 'Multiple providers'
      }
    },
    {
      id: 't4',
      type: 'alert',
      title: 'Missed Medication',
      description: 'Beta blocker dose skipped',
      date: '2024-01-30',
      status: 'completed'
    }
  ]
} as const;
