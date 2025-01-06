import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClinicalReviewsTable } from './ClinicalReviewsTable';
import { PlansOfCare } from './PlansOfCare';
import { Claims } from './Claims';
import { Overview } from './Overview';
import { Activity, AlertCircle, FileText, MessageSquare, ArrowLeft } from 'lucide-react';

const TABS = {
  OVERVIEW: 'overview',
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

  const renderTabContent = () => {
    switch (activeTab) {
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

      {/* Main Navigation */}
      <div className="mb-8 border-b border-ron-divider">
        <nav className="flex gap-6">
          {[
            { id: TABS.OVERVIEW, label: 'Overview', icon: Activity },
            { id: TABS.CLINICAL_REVIEWS, label: 'Clinical Reviews', icon: FileText },
            { id: TABS.PLANS_OF_CARE, label: 'Plans of Care', icon: FileText },
            { id: TABS.CLAIMS, label: 'Claims', icon: AlertCircle },
            { id: TABS.COMMUNICATIONS, label: 'Communications', icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? `${isDark ? 'border-[#CCFF00] text-[#CCFF00]' : 'border-ron-primary text-ron-primary'}`
                    : `border-transparent ${isDark ? 'text-white hover:text-white/80' : 'text-dark-gun-metal/60 hover:text-dark-gun-metal'}`
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
}
