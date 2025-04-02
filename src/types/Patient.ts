export interface Patient {
  member_id: string;
  first_name: string;
  last_name: string;
  member_name: string;
  member_ssn: string;
  person_code: string;
  relationship_subscriber: string;
  member_dob: string; // Consider using Date type if parsing
  gender: string;
  member_phone_number: string;
  member_email: string;
  member_street_address: string;
  member_city: string;
  member_state: string;
  member_zip: string;
  full_zip: string;
  group_id: string;
  group_name: string;
  medication_1?: string; // Optional fields based on JSON structure
  medication_2?: string;
  medication_3?: string;
  medication_4?: string;
  medications?: string;
  dx_1?: string;
  dx_2?: string;
  dx_3?: string;
  dx_4?: string;
  diagnosis?: string;
  weight_lbs?: number;
  height_inches?: number;
  body_mass_index?: number;
  plan?: string;
  effective_date?: string; // Consider using Date type if parsing
  pcp?: string;
  pcp_npi?: string;
  pcp_tax_id?: string;
  specialist?: string;
  specialty?: string;
  specialist_npi?: string | null; // Can be null
  specialist_tax_id?: string | null; // Can be null
  allergies?: string | null; // Can be null
  blood_type?: string;
  ethnicity?: string;
  income_level?: string;
  education_level?: string;
  housing_status?: string;
  employment_status?: string;
  access_to_healthcare?: string;
  food_insecurity?: string;
  social_support?: string;
  mental_health_status?: string;
}
