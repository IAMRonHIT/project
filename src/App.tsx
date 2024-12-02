import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard/index';
import { ThemeProvider } from './hooks/useTheme.tsx';
import { AppShell } from './components/Layout/AppShell';
import { MembersPage } from './pages/Members/MembersPage';
import { ProvidersPage } from './pages/Providers';
import { UtilizationReview } from './pages/UtilizationReview';
import CommunicationHub from './components/Communication Hub/CommunicationHub';
import { Member360View } from './pages/Members/Member360View';
import { EnhancedCareJourney } from './pages/Members/components/EnhancedCareJourney';

function App() {
  console.log('App rendering');
  
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppShell>
          <Routes>
            <Route 
              path="/dashboard" 
              element={<Dashboard />} 
            />
            <Route 
              path="/members" 
              element={<MembersPage />} 
            />
            <Route 
              path="/members/:id" 
              element={<Member360View />} 
            />
            <Route 
              path="/members/:id/care-journey/:journeyId" 
              element={<EnhancedCareJourney />} 
            />
            <Route 
              path="/providers" 
              element={<ProvidersPage />} 
            />
            <Route 
              path="/utilization" 
              element={<UtilizationReview />} 
            />
            <Route 
              path="/communication" 
              element={<CommunicationHub />} 
            />
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />} 
            />
          </Routes>
        </AppShell>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
