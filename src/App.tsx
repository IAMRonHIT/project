import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/Layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { MembersPage } from './pages/Members/MembersPage';
import { Member360View } from './pages/Members/Member360View';
import { EnhancedCareJourney } from './pages/Members/components/EnhancedCareJourney';
import { UtilizationReview } from './pages/UtilizationReview';
import { ProvidersPage } from './pages/Providers';

export default function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/members/:id" element={<Member360View />} />
          <Route path="/members/:id/care-journey/:journeyId" element={<EnhancedCareJourney />} />
          <Route path="/utilization" element={<UtilizationReview />} />
          <Route path="/providers" element={<ProvidersPage />} />
        </Routes>
      </AppShell>
    </Router>
  );
}