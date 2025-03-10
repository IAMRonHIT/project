import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClinicalReviewsTable } from './ClinicalReviewsTable/index';
import { PlansOfCare } from './PlansOfCare';
import { Claims } from './Claims';
import { Overview } from './Overview';
import { Activity, AlertCircle, FileText, MessageSquare, ArrowLeft, User } from 'lucide-react';
import { PatientDashboard } from '../../../../components/PatientProfile';
import { PatientData, loadPatientFromFHIR } from '../../../../services/fhirPatientService';

const TABS = {
  OVERVIEW: 'overview',
  PATIENT_PROFILE: 'patient-profile',
  CLINICAL_REVIEWS: 'clinical-reviews',
  PLANS_OF_CARE: 'plans-of-care',
  CLAIMS: 'claims',
  COMMUNICATIONS: 'communications'
} as const;

type TabType = typeof TABS[keyof typeof TABS];

interface ClinicalReviewsTableProps {
  careJourneyId: string;
  onNewReview: () => void;
}

interface PlansOfCareProps {
  careJourneyId: string;
}

interface ClaimsProps {
  careJourneyId: string;
}

interface OverviewProps {
  careJourneyId: string;
}

interface CareJourney {
  id: string;
  title: string;
  startDate: string;
  status: string;
  primaryCondition: string;
  riskLevel: string;
  lastUpdated: string;
  metrics: {
    reviews: number;
    activePlans: number;
    claims: number;
    communications: number;
  };
}

interface CareJourneyMap {
  [key: string]: CareJourney;
}

// Mock data for care journeys
const mockCareJourneys: CareJourneyMap = {
  'CJ001': {
    id: 'CJ001',
    title: 'Diabetes Management',
    startDate: '2024-01-15',
    status: 'Active',
    primaryCondition: 'Type 2 Diabetes',
    riskLevel: 'High',
    lastUpdated: '2024-03-15',
    metrics: {
      reviews: 8,
      activePlans: 3,
      claims: 12,
      communications: 25
    }
  },
  'CJ002': {
    id: 'CJ002',
    title: 'Hypertension Control',
    startDate: '2024-02-01',
    status: 'Active',
    primaryCondition: 'Hypertension',
    riskLevel: 'Medium',
    lastUpdated: '2024-03-14',
    metrics: {
      reviews: 5,
      activePlans: 2,
      claims: 8,
      communications: 15
    }
  },
  'CJ003': {
    id: 'CJ003',
    title: 'Weight Management',
    startDate: '2024-02-15',
    status: 'Active',
    primaryCondition: 'Obesity',
    riskLevel: 'Medium',
    lastUpdated: '2024-03-13',
    metrics: {
      reviews: 4,
      activePlans: 2,
      claims: 6,
      communications: 12
    }
  },
  'CJ004': {
    id: 'CJ004',
    title: 'Cardiac Rehabilitation',
    startDate: '2024-01-30',
    status: 'Active',
    primaryCondition: 'Coronary Artery Disease',
    riskLevel: 'High',
    lastUpdated: '2024-03-15',
    metrics: {
      reviews: 10,
      activePlans: 4,
      claims: 15,
      communications: 30
    }
  },
  'CJ005': {
    id: 'CJ005',
    title: 'Nutrition Counseling',
    startDate: '2024-02-10',
    status: 'Active',
    primaryCondition: 'Dietary Management',
    riskLevel: 'Low',
    lastUpdated: '2024-03-12',
    metrics: {
      reviews: 3,
      activePlans: 1,
      claims: 4,
      communications: 8
    }
  }
};

export function EnhancedCareJourney() {
  const { journeyId, id: memberId } = useParams<{ journeyId: string; id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>(TABS.OVERVIEW);
  const [showNewReviewModal, setShowNewReviewModal] = useState(false);
  const [isDark] = useState(document.documentElement.classList.contains('dark'));
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [patientLoading, setPatientLoading] = useState<boolean>(true);

  // Load patient data from mock FHIR bundle
  useEffect(() => {
    const loadPatient = async () => {
      try {
        setPatientLoading(true);
        const data = await loadPatientFromFHIR('/mockData/patientBundle.json');
        setPatientData(data);
      } catch (error) {
        console.error('Error loading patient data:', error);
      } finally {
        setPatientLoading(false);
      }
    };
    
    loadPatient();
  }, []);

  // Get the care journey data
  const careJourney = journeyId ? mockCareJourneys[journeyId] : null;

  if (!careJourney || !journeyId) {
    return (
      <div className={`p-6 text-center ${isDark ? 'text-white' : 'text-dark-gun-metal'}`}>
        Care Journey not found. Please select a valid care journey.
      </div>
    );
  }

  const handleBack = () => {
    navigate(`/members/${memberId}`);
  };

  const handleCareJourneySelected = (selectedJourneyId: string) => {
    // Find the journey in mock journeys, or use the one from FHIR data
    if (mockCareJourneys[selectedJourneyId]) {
      navigate(`/members/${memberId}/journey/${selectedJourneyId}`);
    } else if (patientData?.careJourneys) {
      const selectedJourney = patientData.careJourneys.find(journey => journey.id === selectedJourneyId);
      if (selectedJourney) {
        // TODO: In a real implementation, we would create a new care journey record 
        // and navigate to it. For now, just show an alert.
        alert(`Selected care journey: ${selectedJourney.title}`);
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.PATIENT_PROFILE:
        return (
          <div className="mt-6">
            {patientLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            ) : (
              <PatientDashboard 
                patientFhirUrl="/mockData/patientBundle.json"
                isDark={isDark}
                onCareJourneySelected={handleCareJourneySelected}
              />
            )}
          </div>
        );
      case TABS.CLINICAL_REVIEWS:
        return <ClinicalReviewsTable 
          careJourneyId={careJourney.id} 
          onNewReview={() => setShowNewReviewModal(true)} 
        />;
      case TABS.PLANS_OF_CARE:
        return <PlansOfCare careJourneyId={careJourney.id} />;
      case TABS.CLAIMS:
        return <Claims careJourneyId={careJourney.id} />;
      case TABS.OVERVIEW:
      default:
        return <Overview careJourneyId={careJourney.id} />;
    }
  };

  return (
    <div className="px-6 py-8">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className={`flex items-center gap-2 mb-4 ${
          isDark ? 'text-white/60 hover:text-white' : 'text-dark-gun-metal/60 hover:text-dark-gun-metal'
        } transition-colors`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Member</span>
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-dark-gun-metal'}`}>
            {careJourney.title}
          </h2>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-sm rounded-full ${
              isDark ? 'bg-emerald-400/10 text-emerald-400' : 'bg-emerald-50 text-emerald-500'
            }`}>
              {careJourney.status}
            </span>
            <span className={`text-sm ${isDark ? 'text-white/60' : 'text-dark-gun-metal/60'}`}>
              Started {careJourney.startDate}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-ron-divider dark:border-white/10 mt-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab(TABS.OVERVIEW)}
            className={`py-3 border-b-2 font-medium transition-colors ${
              activeTab === TABS.OVERVIEW
                ? isDark
                  ? 'border-white text-white'
                  : 'border-ron-primary text-ron-primary'
                : isDark
                ? 'border-transparent text-white/60 hover:text-white'
                : 'border-transparent text-dark-gun-metal/60 hover:text-dark-gun-metal'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Overview</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab(TABS.PATIENT_PROFILE)}
            className={`py-3 border-b-2 font-medium transition-colors ${
              activeTab === TABS.PATIENT_PROFILE
                ? isDark
                  ? 'border-white text-white'
                  : 'border-ron-primary text-ron-primary'
                : isDark
                ? 'border-transparent text-white/60 hover:text-white'
                : 'border-transparent text-dark-gun-metal/60 hover:text-dark-gun-metal'
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Patient Profile</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab(TABS.CLINICAL_REVIEWS)}
            className={`py-3 border-b-2 font-medium transition-colors ${
              activeTab === TABS.CLINICAL_REVIEWS
                ? isDark
                  ? 'border-white text-white'
                  : 'border-ron-primary text-ron-primary'
                : isDark
                ? 'border-transparent text-white/60 hover:text-white'
                : 'border-transparent text-dark-gun-metal/60 hover:text-dark-gun-metal'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Clinical Reviews ({careJourney.metrics.reviews})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab(TABS.PLANS_OF_CARE)}
            className={`py-3 border-b-2 font-medium transition-colors ${
              activeTab === TABS.PLANS_OF_CARE
                ? isDark
                  ? 'border-white text-white'
                  : 'border-ron-primary text-ron-primary'
                : isDark
                ? 'border-transparent text-white/60 hover:text-white'
                : 'border-transparent text-dark-gun-metal/60 hover:text-dark-gun-metal'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Plans of Care ({careJourney.metrics.activePlans})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab(TABS.CLAIMS)}
            className={`py-3 border-b-2 font-medium transition-colors ${
              activeTab === TABS.CLAIMS
                ? isDark
                  ? 'border-white text-white'
                  : 'border-ron-primary text-ron-primary'
                : isDark
                ? 'border-transparent text-white/60 hover:text-white'
                : 'border-transparent text-dark-gun-metal/60 hover:text-dark-gun-metal'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Claims ({careJourney.metrics.claims})</span>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
