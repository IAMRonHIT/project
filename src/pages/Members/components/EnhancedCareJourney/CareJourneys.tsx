import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, ChevronDown, Activity, Calendar, Clock, FileText, ArrowUpRight, Check, AlertTriangle, X } from 'lucide-react';
import { mockCareJourneys } from './mockData';
import { JourneyTimeline } from './JourneyTimeline';

export function CareJourneys() {
  const [isDark] = useState(document.documentElement.classList.contains('dark'));
  const [selectedJourney, setSelectedJourney] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const journeysPerPage = 5;

  const totalPages = Math.ceil(mockCareJourneys.length / journeysPerPage);
  const currentJourneys = mockCareJourneys.slice(
    currentPage * journeysPerPage,
    (currentPage + 1) * journeysPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setSelectedJourney(null);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setSelectedJourney(null);
    }
  };

  const handleCriterionToggle = (criterionId: string) => {
    // Handle criterion toggle logic
  };

  return (
    <div className={`${
      isDark
        ? 'bg-white/5 backdrop-blur-lg border-white/10'
        : 'bg-white border-ron-divider'
    } rounded-xl shadow-soft`}>
      <div className="p-6 border-b border-ron-divider">
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-medium flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-dark-gun-metal'
          }`}>
            <Activity className="w-4 h-4 text-ron-primary dark:text-[#CCFF00]" />
            Care Journeys
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className={`p-2 rounded-lg ${
                isDark
                  ? 'hover:bg-white/10 disabled:text-white/20'
                  : 'hover:bg-ron-primary/10 disabled:text-dark-gun-metal/20'
              } transition-colors disabled:cursor-not-allowed`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className={`text-sm ${
              isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
            }`}>
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className={`p-2 rounded-lg ${
                isDark
                  ? 'hover:bg-white/10 disabled:text-white/20'
                  : 'hover:bg-ron-primary/10 disabled:text-dark-gun-metal/20'
              } transition-colors disabled:cursor-not-allowed`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-ron-divider">
        {currentJourneys.map((journey) => (
          <div key={journey.id}>
            <button
              onClick={() => setSelectedJourney(selectedJourney === journey.id ? null : journey.id)}
              className={`w-full px-6 py-4 flex items-center justify-between ${
                isDark ? 'hover:bg-white/5' : 'hover:bg-ron-primary/5'
              } transition-colors`}
            >
              <div className="flex items-center gap-6">
                <div className={`w-10 h-10 rounded-lg ${
                  isDark ? 'bg-white/10' : 'bg-ron-primary/10'
                } flex items-center justify-center`}>
                  {journey.type === 'surgery' ? (
                    <Activity className={isDark ? 'text-[#CCFF00]' : 'text-ron-primary'} />
                  ) : (
                    <Calendar className={isDark ? 'text-[#CCFF00]' : 'text-ron-primary'} />
                  )}
                </div>
                <div className="text-left">
                  <h4 className={`font-medium ${
                    isDark ? 'text-white' : 'text-dark-gun-metal'
                  }`}>{journey.title}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className={`w-4 h-4 ${
                        isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
                      }`} />
                      <span className={`text-sm ${
                        isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
                      }`}>{journey.startDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className={`w-4 h-4 ${
                        isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
                      }`} />
                      <span className={`text-sm ${
                        isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
                      }`}>{journey.provider}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`
                  inline-flex items-center justify-center
                  min-w-[140px] px-3 py-1 text-xs font-medium
                  rounded-full backdrop-blur-sm border
                  transition-all duration-200
                  bg-gradient-glossy
                  shadow-glow hover:shadow-glow-hover
                  ${journey.status === 'active'
                    ? isDark
                      ? 'bg-ron-mint-400/10 border-ron-mint-400/20 text-ron-mint-200'
                      : 'bg-ron-mint-50 border-ron-mint-200 text-ron-mint-700'
                    : journey.status === 'completed'
                      ? isDark
                        ? 'bg-ron-teal-400/10 border-ron-teal-400/20 text-ron-teal-200'
                        : 'bg-ron-teal-50 border-ron-teal-200 text-ron-teal-700'
                      : isDark
                        ? 'bg-ron-lime-400/10 border-ron-lime-400/20 text-ron-lime-200'
                        : 'bg-ron-lime-50 border-ron-lime-200 text-ron-lime-700'
                  }
                `}>
                  {journey.status.toUpperCase()}
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpRight className={`w-4 h-4 ${
                    isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
                  }`} />
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    selectedJourney === journey.id ? 'rotate-180' : ''
                  } ${isDark ? 'text-white/40' : 'text-dark-gun-metal/40'}`} />
                </div>
              </div>
            </button>

            <AnimatePresence>
              {selectedJourney === journey.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <JourneyTimeline journey={journey} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}