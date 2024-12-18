import React, { useState, ReactNode } from 'react';
import { 
  Activity, AlertCircle, FileText, MessageSquare, 
  User, Heart, Pill, Calendar, Users, Home,
  Phone, Bell, ArrowUpRight, Clock, Brain,
  LucideIcon
} from 'lucide-react';
import { Badge } from '../../../../../components/Badge';

interface OverviewProps {
  careJourneyId?: string;
}

interface CardWrapperProps {
  children: ReactNode;
  className?: string;
}

interface SectionTitleProps {
  icon: LucideIcon;
  title: string;
}

type AlertType = 'High' | 'Medium' | 'Low';

interface AlertBadgeProps {
  type: AlertType;
}

export function Overview({ careJourneyId }: OverviewProps) {
  const [isDark] = useState(document.documentElement.classList.contains('dark'));

  // Mock data - in production this would come from an API
  const patientData = {
    profile: {
      name: "John Doe",
      age: 65,
      gender: "Male",
      contact: "(555) 123-4567",
      primaryDiagnosis: "Congestive Heart Failure (ICD-10: I50.9)",
      triggerEvent: "Emergency Room Visit - 03/15/2024",
      goals: [
        "Reduce hospital readmissions",
        "Improve medication adherence",
        "Maintain stable blood pressure"
      ]
    },
    clinicalSnapshot: {
      conditions: [
        { name: "Hypertension", code: "ICD-10: I10" },
        { name: "Type 2 Diabetes", code: "ICD-10: E11.9" }
      ],
      medications: [
        { name: "Lisinopril", status: "Active", adherence: "85%" },
        { name: "Metformin", status: "Active", adherence: "90%" }
      ],
      recentProcedures: [
        { name: "Echocardiogram", code: "CPT: 93306", date: "2024-03-10" }
      ]
    },
    aiInsights: {
      alerts: [
        { type: "High" as AlertType, message: "Elevated readmission risk based on recent vital trends" },
        { type: "Medium" as AlertType, message: "Potential medication interaction detected" }
      ],
      actionItems: [
        "Schedule follow-up appointment within 7 days",
        "Review medication adherence plan"
      ],
      priorities: [
        "Address transportation barriers to appointments",
        "Monitor daily weight fluctuations"
      ]
    },
    careTeam: {
      primary: [
        { role: "Primary Care", name: "Dr. Sarah Johnson", contact: "(555) 234-5678" },
        { role: "Cardiologist", name: "Dr. Michael Chen", contact: "(555) 345-6789" }
      ],
      appointments: [
        { type: "Follow-up", date: "2024-03-25", provider: "Dr. Johnson" },
        { type: "Cardiology", date: "2024-04-01", provider: "Dr. Chen" }
      ]
    },
    sdoh: {
      risks: [
        { type: "Transportation", status: "High Risk" },
        { type: "Food Security", status: "Medium Risk" },
        { type: "Social Support", status: "Low Risk" }
      ]
    },
    engagement: {
      adherence: "75%",
      lastContact: "2024-03-14",
      preferredContact: "Phone",
      recentInteractions: [
        { date: "2024-03-14", type: "Phone Call", summary: "Medication review" },
        { date: "2024-03-10", type: "Text Message", summary: "Appointment reminder" }
      ]
    },
    trigger: {
      source: "Emergency Department Visit",
      date: "2024-03-15",
      details: "Admitted with shortness of breath and edema",
      aiUpdates: [
        "Automated care plan adjustment suggested",
        "Risk factors reassessed based on new data"
      ]
    }
  };

  const CardWrapper = ({ children, className = "" }: CardWrapperProps) => (
    <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white'} border ${
      isDark ? 'border-white/10' : 'border-ron-divider'
    } ${className}`}>
      {children}
    </div>
  );

  const SectionTitle = ({ icon: Icon, title }: SectionTitleProps) => (
    <div className="flex items-center gap-2 mb-4">
      <Icon className={isDark ? 'text-[#CCFF00]' : 'text-ron-primary'} />
      <h3 className="text-lg font-medium">{title}</h3>
    </div>
  );

  const getAlertVariant = (type: AlertType): 'error' | 'warning' | 'success' => {
    switch (type) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'warning';
    }
  };

  return (
    <div className={`p-6 space-y-6 ${isDark ? 'text-white' : 'text-ron-dark-navy'}`}>
      {/* Patient Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardWrapper>
          <SectionTitle icon={User} title="Patient Profile" />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>
                  Name
                </label>
                <p className="font-medium">{patientData.profile.name}</p>
              </div>
              <div>
                <label className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>
                  Age/Gender
                </label>
                <p className="font-medium">{patientData.profile.age} / {patientData.profile.gender}</p>
              </div>
            </div>
            <div>
              <label className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>
                Primary Diagnosis
              </label>
              <p className="font-medium">{patientData.profile.primaryDiagnosis}</p>
            </div>
            <div>
              <label className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>
                Trigger Event
              </label>
              <p className="font-medium">{patientData.profile.triggerEvent}</p>
            </div>
          </div>
        </CardWrapper>

        <CardWrapper>
          <SectionTitle icon={Brain} title="Healthcare Goals" />
          <ul className="space-y-2">
            {patientData.profile.goals.map((goal, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${
                  isDark ? 'bg-[#CCFF00]' : 'bg-ron-primary'
                }`} />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </CardWrapper>
      </div>

      {/* Clinical Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CardWrapper>
          <SectionTitle icon={Heart} title="Current Conditions" />
          <div className="space-y-3">
            {patientData.clinicalSnapshot.conditions.map((condition, index) => (
              <div key={index}>
                <p className="font-medium">{condition.name}</p>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>
                  {condition.code}
                </p>
              </div>
            ))}
          </div>
        </CardWrapper>

        <CardWrapper>
          <SectionTitle icon={Pill} title="Medications" />
          <div className="space-y-3">
            {patientData.clinicalSnapshot.medications.map((med, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{med.name}</p>
                  <p className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>
                    {med.status}
                  </p>
                </div>
                <Badge 
                  variant="success" 
                  size="sm"
                  glow
                >
                  {med.adherence}
                </Badge>
              </div>
            ))}
          </div>
        </CardWrapper>

        <CardWrapper>
          <SectionTitle icon={Calendar} title="Recent Procedures" />
          <div className="space-y-3">
            {patientData.clinicalSnapshot.recentProcedures.map((procedure, index) => (
              <div key={index}>
                <p className="font-medium">{procedure.name}</p>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>
                  {procedure.code}
                </p>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>
                  {procedure.date}
                </p>
              </div>
            ))}
          </div>
        </CardWrapper>
      </div>

      {/* AI Insights & Care Coordination */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CardWrapper>
            <SectionTitle icon={Bell} title="AI Alerts & Priorities" />
            <div className="space-y-4">
              {patientData.aiInsights.alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge 
                    variant={getAlertVariant(alert.type)} 
                    size="sm"
                    glow
                  >
                    {alert.type}
                  </Badge>
                  <p className={`text-sm ${isDark ? 'text-white/80' : 'text-ron-dark-navy/80'}`}>
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          </CardWrapper>

          <CardWrapper>
            <SectionTitle icon={Clock} title="Action Items" />
            <ul className="space-y-2">
              {patientData.aiInsights.actionItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${
                    isDark ? 'bg-[#CCFF00]' : 'bg-ron-primary'
                  }`} />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </CardWrapper>
        </div>

        <div className="space-y-6">
          <CardWrapper>
            <SectionTitle icon={Users} title="Care Team" />
            <div className="space-y-3">
              {patientData.careTeam.primary.map((member, index) => (
                <div key={index}>
                  <p className="font-medium">{member.name}</p>
                  <p className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>
                    {member.role} • {member.contact}
                  </p>
                </div>
              ))}
            </div>
          </CardWrapper>

          <CardWrapper>
            <SectionTitle icon={Calendar} title="Upcoming Appointments" />
            <div className="space-y-3">
              {patientData.careTeam.appointments.map((apt, index) => (
                <div key={index}>
                  <p className="font-medium">{apt.type}</p>
                  <p className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>
                    {apt.date} with {apt.provider}
                  </p>
                </div>
              ))}
            </div>
          </CardWrapper>
        </div>
      </div>

      {/* SDOH & Patient Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardWrapper>
          <SectionTitle icon={Home} title="Social Determinants of Health" />
          <div className="space-y-3">
            {patientData.sdoh.risks.map((risk, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{risk.type}</span>
                <Badge 
                  variant={getAlertVariant(risk.status.split(' ')[0] as AlertType)} 
                  size="sm"
                  glow
                >
                  {risk.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardWrapper>

        <CardWrapper>
          <SectionTitle icon={Phone} title="Patient Engagement" />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>
                  Adherence Rate
                </label>
                <p className="font-medium">{patientData.engagement.adherence}</p>
              </div>
              <div>
                <label className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>
                  Preferred Contact
                </label>
                <p className="font-medium">{patientData.engagement.preferredContact}</p>
              </div>
            </div>
            <div>
              <label className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>
                Recent Interactions
              </label>
              <div className="space-y-2 mt-2">
                {patientData.engagement.recentInteractions.map((interaction, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{interaction.date}</span> - {interaction.type}:
                    <span className={isDark ? 'text-white/80' : 'text-ron-dark-navy/80'}>
                      {' '}{interaction.summary}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardWrapper>
      </div>

      {/* Trigger Information */}
      <CardWrapper>
        <SectionTitle icon={AlertCircle} title="Journey Trigger & Updates" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>
              Trigger Source
            </label>
            <p className="font-medium mb-2">{patientData.trigger.source}</p>
            <p className={`text-sm ${isDark ? 'text-white/80' : 'text-ron-dark-navy/80'}`}>
              {patientData.trigger.details}
            </p>
          </div>
          <div>
            <label className={`text-sm ${isDark ? 'text-white/60' : 'text-ron-dark-navy/60'}`}>
              AI-Generated Updates
            </label>
            <ul className="space-y-2 mt-2">
              {patientData.trigger.aiUpdates.map((update, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${
                    isDark ? 'bg-[#CCFF00]' : 'bg-ron-primary'
                  }`} />
                  <span className="text-sm">{update}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardWrapper>
    </div>
  );
}
