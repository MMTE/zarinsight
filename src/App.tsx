import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnalysisProvider } from './contexts/AnalysisContext';
import { AppShell } from './components/layout/AppShell';
import { Overview } from './pages/Overview';
import { Insights } from './pages/Insights';
import { InsightDetail } from './pages/InsightDetail';
import { Analysis } from './pages/Analysis';
import { Ask } from './pages/Ask';
import { Notifications } from './pages/Notifications';
import { More } from './pages/More';

export function App() {
  return (
    <AnalysisProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Overview />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/:insightId" element={<InsightDetail />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/analysis/:tab" element={<Analysis />} />
            <Route path="/ask" element={<Ask />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/more" element={<More />} />
            {/* merged or removed pages keep their old paths working */}
            <Route path="/panel" element={<Navigate to="/" replace />} />
            <Route path="/sales" element={<Navigate to="/analysis/sales" replace />} />
            <Route path="/customers" element={<Navigate to="/analysis/customers" replace />} />
            <Route path="/payments" element={<Navigate to="/analysis/payments" replace />} />
            <Route path="/benchmarks" element={<Navigate to="/analysis/benchmarks" replace />} />
            <Route path="/explore" element={<Navigate to="/analysis" replace />} />
            <Route path="/data-quality" element={<Navigate to="/more" replace />} />
            <Route path="/methodology" element={<Navigate to="/insights" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AnalysisProvider>);
}
