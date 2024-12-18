import React from 'react';
import { Activity } from 'lucide-react';
import { PieChart } from './charts/PieChart';

export function CareDistribution() {
  const data = [
    { label: 'Primary Care', value: 45, color: '#00F0FF' },
    { label: 'Specialty Care', value: 30, color: '#00B8CC' },
    { label: 'Emergency', value: 15, color: '#00D6D0' },
    { label: 'Preventive', value: 10, color: '#008299' }
  ];

  return (
    <div className="bg-gradient-to-br from-[#2C3037] to-[#1E2024] rounded-xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-leather mix-blend-overlay" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-[#00F0FF]" />
          <h2 className="text-xl font-bold text-white">Care Distribution</h2>
        </div>

        <PieChart data={data} height={350} />
      </div>
    </div>
  );
}