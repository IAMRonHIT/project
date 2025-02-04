export interface HealthPlan {
  id: string;
  name: string;
  type: string;
  description: string;
  logo: string;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  coverage: Coverage;
}

export interface Coverage {
  status: 'active' | 'inactive' | 'pending';
  type: 'primary' | 'secondary';
  effectiveDate: string;
  endDate?: string;
  network: NetworkDetails;
  benefits: Benefit[];
}

export interface NetworkDetails {
  type: 'in-network' | 'out-of-network';
  tier: string;
  restrictions?: string[];
}

export interface Benefit {
  serviceType: string;
  coverage: number;
  deductible: number;
  outOfPocketMax: number;
  requiresAuth: boolean;
  restrictions?: string[];
}

export interface Claim {
  id: string;
  serviceDate: string;
  provider: string;
  serviceType: string;
  status: 'pending' | 'approved' | 'denied';
  amount: {
    billed: number;
    allowed: number;
    paid: number;
    patientResponsibility: number;
  };
  network: NetworkDetails;
  authorization?: Authorization;
}

export interface Authorization {
  id: string;
  status: 'pending' | 'approved' | 'denied';
  submittedDate: string;
  expirationDate: string;
  serviceType: string;
  provider: string;
  notes?: string[];
}

export interface Appeal {
  id: string;
  type: 'clinical' | 'administrative';
  status: 'draft' | 'submitted' | 'in-review' | 'decided';
  submittedDate: string;
  decision?: {
    date: string;
    outcome: 'approved' | 'denied';
    reason: string;
  };
}