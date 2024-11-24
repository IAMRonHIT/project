import React, { useState } from 'react';
import { MessageSquare, Plus, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { CareJourneys } from './CareJourneys';
import { ClinicalReviewsTable } from './ClinicalReviewsTable';

const TABS = {
  OVERVIEW: 'overview',
  CLINICAL_REVIEWS: 'clinical_reviews',
  PLANS_OF_CARE: 'plans_of_care',
  CLAIMS: 'claims',
  COMMUNICATION: 'communication'
};

export function EnhancedCareJourney() {
  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);
  const [showNewReviewModal, setShowNewReviewModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isDark] = useState(document.documentElement.classList.contains('dark'));
  const { id: memberId, journeyId } = useParams();
  const navigate = useNavigate();

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.CLINICAL_REVIEWS:
        return <ClinicalReviewsTable onNewReview={() => setShowNewReviewModal(true)} />;
      case TABS.OVERVIEW:
      default:
        return <CareJourneys />;
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/members/${memberId}`)}
            className={`flex items-center gap-2 mb-4 ${
              isDark ? 'text-white/60 hover:text-white' : 'text-ron-dark-navy/60 hover:text-ron-dark-navy'
            } transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Member Profile</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-light ${
                isDark ? 'text-white' : 'text-ron-dark-navy'
              }`}>Care Journey Details</h1>
              <div className="mt-1 flex items-center gap-3">
                <p className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                }`}>Journey ID: {journeyId}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowChat(true)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  isDark
                    ? 'bg-[#CCFF00] text-ron-dark-navy hover:bg-[#CCFF00]/90'
                    : 'bg-ron-primary text-white hover:bg-ron-primary/90'
                } transition-colors`}
              >
                <MessageSquare className="w-4 h-4" />
                Ron AI Assistant
              </button>
              <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                isDark
                  ? 'bg-white/10 text-white'
                  : 'bg-ron-primary/10 text-ron-primary'
              }`}>
                ACTIVE REVIEW
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="mb-8 border-b border-ron-divider">
          <nav className="flex gap-6">
            {[
              { id: TABS.OVERVIEW, label: 'Overview' },
              { id: TABS.CLINICAL_REVIEWS, label: 'Clinical Reviews' },
              { id: TABS.PLANS_OF_CARE, label: 'Plans of Care' },
              { id: TABS.CLAIMS, label: 'Claims' },
              { id: TABS.COMMUNICATION, label: 'Communication Hub' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-1 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? isDark
                      ? 'text-[#CCFF00] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#CCFF00]'
                      : 'text-ron-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-ron-primary'
                    : isDark
                      ? 'text-white/60 hover:text-white'
                      : 'text-ron-dark-navy/60 hover:text-ron-dark-navy'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}