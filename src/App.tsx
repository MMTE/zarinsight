import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnalysisProvider } from './contexts/AnalysisContext';
import { AppShell } from './components/layout/AppShell';
import { Overview } from './pages/Overview';
import { Insights } from './pages/Insights';
import { InsightDetail } from './pages/InsightDetail';
import { Sales } from './pages/Sales';
import { Customers } from './pages/Customers';
import { Payments } from './pages/Payments';
import { Benchmarks } from './pages/Benchmarks';
import { Explore } from './pages/Explore';
import { DataQuality } from './pages/DataQuality';
import { Methodology } from './pages/Methodology';
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
            <Route path="/sales" element={<Sales />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/benchmarks" element={<Benchmarks />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/data-quality" element={<DataQuality />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/ask" element={<Ask />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/more" element={<More />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AnalysisProvider>);

}