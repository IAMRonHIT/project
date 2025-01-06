import React from 'react';
import { FileText, Activity, Heart, Brain } from 'lucide-react';

const clinicalData = [
  {
    category: 'Primary Diagnosis',
    value: 'Type 2 Diabetes Mellitus (E11.9)',
    details: 'Diagnosed 2 years ago',
    icon: FileText,
  },
  {
    category: 'Recent HbA1c',
    value: '7.2%',
    details: '▼ 0.3 from last reading',
    trend: 'positive',
    icon: Activity,
  },
  {
    category: 'Blood Pressure',
    value: '128/82 mmHg',
    details: 'Well controlled',
    trend: 'stable',
    icon: Heart,
  },
  {
    category: 'Risk Assessment',
    value: 'Moderate',
    details: 'Based on AI analysis',
    icon: Brain,
  },
];

export function CaseOverview() {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));

  return (
    <div className={`${
      isDark
        ? 'bg-white/5 backdrop-blur-lg border-white/10'
        : 'bg-white border-ron-divider'
    } rounded-xl p-6 shadow-soft`}>
      <h3 className={`text-lg font-medium mb-6 ${
        isDark ? 'text-white' : 'text-dark-gun-metal'
      }`}>Clinical Overview</h3>
      
      <div className="space-y-6">
        {clinicalData.map((item, index) => (
          <div key={index} className={`p-4 rounded-lg ${
            isDark ? 'bg-white/5' : 'bg-ron-primary/5'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`}>{item.category}</p>
                <p className={`text-lg font-medium mt-1 ${
                  isDark ? 'text-white' : 'text-dark-gun-metal'
                }`}>{item.value}</p>
                <p className={`text-sm mt-1 ${
                  item.trend === 'positive'
                    ? 'text-emerald-400'
                    : item.trend === 'negative'
                    ? 'text-red-400'
                    : isDark
                    ? 'text-white/40'
                    : 'text-dark-gun-metal/40'
                }`}>{item.details}</p>
              </div>
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-white/10' : 'bg-ron-primary/10'
              }`}>
                <item.icon className={`w-5 h-5 ${
                  isDark ? 'text-white' : 'text-ron-primary'
                }`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}