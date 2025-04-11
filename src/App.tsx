import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard/index';
import { ThemeProvider } from './hooks/useTheme';
import { AppShell } from './components/Layout/AppShell';
import { MembersPage } from './pages/Members/MembersPage';
import { ProvidersPage } from './pages/Providers';
import { RonAIPage } from './pages/RonAI/RonAIPage';
import CommunicationHub from './components/Communication Hub/CommunicationHub';
import { Member360View } from './pages/Members/Member360View';
import { EnhancedCareJourney } from './pages/Members/components/EnhancedCareJourney';
import KanbanPage from './pages/Kanban/KanbanPage';
import NoteDemo from './pages/NoteDemo';

function AppRoutes() {
  return (
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
          path="/communication" 
          element={<CommunicationHub />} 
        />
        <Route
          path="/ron-ai"
          element={<RonAIPage />}
        />
        <Route 
          path="/kanban" 
          element={<KanbanPage />}
        />
        <Route 
          path="/note-demo" 
          element={<NoteDemo />}
        />
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </AppShell>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
