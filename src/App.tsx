import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ThemeProvider } from './hooks/useTheme.tsx';
import { AppShell } from './components/Layout/AppShell';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppShell>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppShell>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
