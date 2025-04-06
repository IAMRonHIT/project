import React, { useState } from 'react';
import { Activity, Heart, AlertCircle, Clock, ArrowLeft, UserCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { luxuryEffects } from '../../lib/themes';
import { CareJourneysTable } from './components/CareJourneysTable';
import { PatientDetailsView } from '../../components';
import { useNotePanel } from '../../hooks';

export function Member360View() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const motionVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          when: "beforeChildren",
          staggerChildren: 0.1
        }
      }
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30
        }
      }
    }
  };
  const [showPatientDetails, setShowPatientDetails] = useState(false);

  // Mock data for member overview
  const memberData = {
    id: '1',
    name: 'Sarah Wilson',
    healthPlan: 'Premium Care Plus',
    riskScore: 41.13,
    careStatus: 'Active',
    lastUpdated: '2h ago'
  };

  // Mock data for patient details
  const patientDetails = {
    careTeam: [
      {
        id: '1',
        name: 'Dr. Emily Chen',
        role: 'Primary Care Physician',
        lastContact: '2025-02-08T15:30:00',
        nextAvailable: '2025-02-15T10:00:00'
      },
      {
        id: '2',
        name: 'James Wilson',
        role: 'Care Coordinator',
        lastContact: '2025-02-09T11:00:00',
        nextAvailable: '2025-02-12T14:00:00'
      }
    ],
    interventions: [
      {
        id: '1',
        date: '2025-02-01T09:00:00',
        type: 'Medication Review',
        provider: 'Dr. Emily Chen',
        outcome: 'Completed',
        followUpDate: '2025-03-01T09:00:00',
        notes: 'Adjusted blood pressure medication dosage'
      }
    ],
    appointments: {
      past: [
        {
          date: '2025-01-15',
          type: 'Check-up',
          provider: 'Dr. Emily Chen',
          outcome: 'Completed'
        }
      ],
      upcoming: [
        {
          date: '2025-02-15',
          type: 'Follow-up',
          provider: 'Dr. Emily Chen'
        }
      ]
    },
    adherence: {
      medications: 85,
      appointments: 90,
      overall: 87
    },
    careGaps: [
      {
        issue: 'Annual Eye Exam',
        priority: 'High' as const,
        dueDate: '2025-03-01'
      },
      {
        issue: 'Flu Shot',
        priority: 'Medium' as const,
        dueDate: '2025-02-28'
      }
    ],
    medications: [
      {
        id: '1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        refillDate: '2025-02-20',
        adherenceRate: 92,
        lastTaken: '2025-02-10T08:00:00',
        nextDue: '2025-02-11T08:00:00',
        status: 'ACTIVE' as const
      },
      {
        id: '2',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        refillDate: '2025-02-15',
        adherenceRate: 78,
        lastTaken: '2025-02-10T20:00:00',
        nextDue: '2025-02-11T08:00:00',
        status: 'PENDING_REFILL' as const
      }
    ],
    clinicalTrends: [
      {
        metric: 'Blood Pressure',
        values: [
          { date: '2025-01-01', value: 130, unit: 'mmHg' },
          { date: '2025-01-15', value: 128, unit: 'mmHg' },
          { date: '2025-02-01', value: 125, unit: 'mmHg' }
        ],
        trend: 'DOWN' as const,
        unit: 'mmHg',
        normalRange: {
          min: 90,
          max: 120
        }
      },
      {
        metric: 'Blood Glucose',
        values: [
          { date: '2025-01-01', value: 140, unit: 'mg/dL' },
          { date: '2025-01-15', value: 145, unit: 'mg/dL' },
          { date: '2025-02-01', value: 142, unit: 'mg/dL' }
        ],
        trend: 'STABLE' as const,
        unit: 'mg/dL',
        normalRange: {
          min: 70,
          max: 130
        }
      }
    ],
    socialFactors: {
      transportation: true,
      housing: true,
      foodSecurity: false,
      financialStability: true
    }
  };

  const metrics = [
    {
      title: 'Risk Score',
      value: memberData.riskScore.toFixed(2),
      trend: { value: 3.2, isPositive: true },
      icon: Heart,
      color: 'emerald',
      details: '▼ 3.2% from last month'
    },
    {
      title: 'Care Timeline',
      value: '6 mo',
      icon: Clock,
      color: 'blue',
      details: '2 upcoming appointments'
    },
    {
      title: 'Activity Level',
      value: 'High',
      icon: Activity,
      color: 'purple',
      details: 'Daily monitoring active'
    },
    {
      title: 'Alerts',
      value: '2',
      icon: AlertCircle,
      color: 'amber',
      details: '1 requires attention'
    }
  ];

  const { openNote } = useNotePanel();

  const handleOpenNotes = () => {
    openNote(`Member Notes: ${memberData?.name}\n\nMember ID: ${id}\nDate: ${new Date().toLocaleDateString()}\n\n`);
  };

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <motion.div
        variants={motionVariants.container}
        initial="hidden"
        animate="visible"
        className={`
          ${luxuryEffects.glassmorphism[isDark ? 'dark' : 'light']}
          ${luxuryEffects.neonGlow.cyan}
          mb-6 rounded-xl
        `}
      >
        <div className="p-6">
          <button
            onClick={() => navigate('/members')}
            className={`flex items-center gap-2 mb-4 ${
              isDark ? 'text-white/60 hover:text-white' : 'text-dark-gun-metal/60 hover:text-dark-gun-metal'
            } transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Members</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-4">
                <h1 className={`text-3xl font-light ${
                  isDark ? 'text-white' : 'text-dark-gun-metal'
                }`}>{memberData.name}</h1>
                <button
                  onClick={() => setShowPatientDetails(true)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg
                    ${isDark 
                      ? 'bg-white/10 hover:bg-white/20 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }
                    transition-colors
                  `}
                >
                  <UserCircle className="w-5 h-5" />
                  <span>View Details</span>
                </button>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">●</span>
                  <span className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                  }`}>{memberData.careStatus} Care Plan</span>
                </div>
                <span className={isDark ? 'text-white/20' : 'text-dark-gun-metal/20'}>|</span>
                <span className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`}>ID: {id}</span>
                <span className={isDark ? 'text-white/20' : 'text-dark-gun-metal/20'}>|</span>
                <span className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`}>Last Updated: {memberData.lastUpdated}</span>
                <button
                  onClick={handleOpenNotes}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Add Notes
                </button>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                variants={motionVariants.item}
                whileHover={{ scale: 1.02 }}
                className={`
                  ${luxuryEffects.glassmorphism[isDark ? 'dark' : 'light']}
                  ${luxuryEffects.interaction.hover}
                  rounded-xl p-6
                `}
              >
                <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  {metric.title}
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {metric.title}
                    </p>
                    <p className="text-3xl font-light mt-1 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                      {metric.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-${metric.color}-500/20 flex items-center justify-center`}>
                    <metric.icon className={`w-6 h-6 text-${metric.color}-400`} />
                  </div>
                </div>
                {metric.details && (
                  <div className={`mt-4 pt-4 border-t ${
                    isDark ? 'border-white/10' : 'border-ron-divider'
                  }`}>
                    <p className={`text-sm ${
                      isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
                    }`}>{metric.details}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Care Journeys */}
          <motion.div
            variants={motionVariants.item}
            className={`
              mt-6
              ${luxuryEffects.glassmorphism[isDark ? 'dark' : 'light']}
              ${luxuryEffects.interaction.hover}
              rounded-xl p-6
            `}
          >
            <h2 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-dark-gun-metal'
            }`}>Care Journeys</h2>
            <CareJourneysTable />
          </motion.div>
        </div>
      </motion.div>

      {/* Patient Details Modal */}
      {showPatientDetails && (
        <PatientDetailsView
          details={patientDetails}
          onClose={() => setShowPatientDetails(false)}
        />
      )}
    </div>
  );
}
