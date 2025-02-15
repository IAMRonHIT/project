import { ReactNode } from 'react';

export interface Column {
  id: string;
  label: string;
  accessor: string;  // Changed from keyof PatientRecord to string to support nested paths
  visible: boolean;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  cell?: (value: any, row: PatientRecord) => ReactNode;
}

export type FilterOperator = 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between';

export interface FilterConfig {
  field: string;  // Changed from keyof PatientRecord to string to support nested paths
  operator: FilterOperator;
  value: string | number | [number, number];
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface PatientRecord {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  status: 'Active' | 'Critical' | 'Inactive' | 'Pending' | 'Watch' | 'New';
  riskLevel: 'High' | 'Medium' | 'Low';
  riskTrend: 'up' | 'down' | 'stable';
  lastVisit: string | null;
  nextAppointment: string | null;
  conditions: Array<{
    name: string;
    severity: 'severe' | 'moderate' | 'mild';
  }>;
  compliance: {
    overall: number;
    medication: number;
    appointments: number;
    monitoring: number;
  };
  avatar?: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  location: Location;
  [key: string]: any;  // Allow string indexing for dynamic field access
}