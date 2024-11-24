import React from 'react';
import { MembersMetrics } from './components/MembersMetrics';
import { MembersTable } from './components/MembersTable';
import { useNavigate } from 'react-router-dom';

export function MembersPage() {
  const navigate = useNavigate();

  const handleMemberClick = (memberId: string) => {
    navigate(`/members/${memberId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-ron-dark-navy dark:text-white">Members Overview</h1>
        <p className="text-ron-dark-navy/60 dark:text-white/60 mt-1">
          Comprehensive view of all member activities and metrics
        </p>
      </div>

      <MembersMetrics />
      
      <div className="mt-8">
        <MembersTable onMemberClick={handleMemberClick} />
      </div>
    </div>
  );
}