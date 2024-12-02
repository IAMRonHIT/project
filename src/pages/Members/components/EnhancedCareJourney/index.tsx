import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClinicalReviewsTable } from './ClinicalReviewsTable';
import { PlansOfCare } from './PlansOfCare';
import { Claims } from './Claims';
import { Activity, AlertCircle, FileText, MessageSquare } from 'lucide-react';

const TABS = {
  OVERVIEW: 'overview',
  CLINICAL_REVIEWS: 'clinical-reviews',
  PLANS_OF_CARE: 'plans-of-care',
  CLAIMS: 'claims',
  COMMUNICATIONS: 'communications'
};

export function EnhancedCareJourney() {
  const { careJourneyId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);
  const [showNewReviewModal, setShowNewReviewModal] = useState(false);
  const [isDark] = useState(document.documentElement.classList.contains('dark'));

  // Mock data for a specific care journey
  const careJourney = {
    id: careJourneyId,
    title: 'Cardiac Care Journey',
    startDate: '2024-01-15',
    status: 'Active',
    primaryCondition: 'Congestive Heart Failure',
    riskLevel: 'High',
    lastUpdated: '2024-03-15',
    summary: 'Patient admitted for CHF exacerbation. Currently following treatment plan with medication adjustments.',
    metrics: {
      reviews: 8,
      activePlans: 3,
      claims: 12,
      communications: 25
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.CLINICAL_REVIEWS:
        return <ClinicalReviewsTable careJourneyId={careJourneyId} onNewReview={() => setShowNewReviewModal(true)} />;
      case TABS.PLANS_OF_CARE:
        return <PlansOfCare careJourneyId={careJourneyId} />;
      case TABS.CLAIMS:
        return <Claims careJourneyId={careJourneyId} />;
      case TABS.OVERVIEW:
      default:
        return (
          <div className={`p-6 ${isDark ? 'text-white' : 'text-ron-dark-navy'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white'} border ${isDark ? 'border-white/10' : 'border-ron-divider'}`}>
                <h3 className="text-lg font-medium mb-4">Journey Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>Primary Condition</label>
                    <p className="font-medium">{careJourney.primaryCondition}</p>
                  </div>
                  <div>
                    <label className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>Risk Level</label>
                    <p className="font-medium">{careJourney.riskLevel}</p>
                  </div>
                  <div>
                    <label className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>Start Date</label>
                    <p className="font-medium">{careJourney.startDate}</p>
                  </div>
                  <div>
                    <label className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>Last Updated</label>
                    <p className="font-medium">{careJourney.lastUpdated}</p>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white'} border ${isDark ? 'border-white/10' : 'border-ron-divider'}`}>
                <h3 className="text-lg font-medium mb-4">Journey Summary</h3>
                <p className={`text-sm ${isDark ? 'text-white/80' : 'text-ron-dark-navy/80'}`}>
                  {careJourney.summary}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white'} border ${isDark ? 'border-white/10' : 'border-ron-divider'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className={isDark ? 'text-[#CCFF00]' : 'text-ron-primary'} />
                  <h4 className="font-medium">Clinical Reviews</h4>
                </div>
                <p className="text-2xl font-semibold">{careJourney.metrics.reviews}</p>
              </div>
              <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white'} border ${isDark ? 'border-white/10' : 'border-ron-divider'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className={isDark ? 'text-[#CCFF00]' : 'text-ron-primary'} />
                  <h4 className="font-medium">Active Plans</h4>
                </div>
                <p className="text-2xl font-semibold">{careJourney.metrics.activePlans}</p>
              </div>
              <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white'} border ${isDark ? 'border-white/10' : 'border-ron-divider'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className={isDark ? 'text-[#CCFF00]' : 'text-ron-primary'} />
                  <h4 className="font-medium">Claims</h4>
                </div>
                <p className="text-2xl font-semibold">{careJourney.metrics.claims}</p>
              </div>
              <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white'} border ${isDark ? 'border-white/10' : 'border-ron-divider'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className={isDark ? 'text-[#CCFF00]' : 'text-ron-primary'} />
                  <h4 className="font-medium">Communications</h4>
                </div>
                <p className="text-2xl font-semibold">{careJourney.metrics.communications}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-ron-dark-navy'}`}>
            {careJourney.title}
          </h2>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-sm rounded-full ${
              isDark ? 'bg-emerald-400/10 text-emerald-400' : 'bg-emerald-50 text-emerald-500'
            }`}>
              {careJourney.status}
            </span>
            <span className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>
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
                    : `border-transparent ${isDark ? 'text-white hover:text-white/80' : 'text-ron-dark-navy/60 hover:text-ron-dark-navy'}`
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