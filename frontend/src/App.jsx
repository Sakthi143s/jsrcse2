import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';

import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import Bottlenecks from './pages/Bottlenecks';
import Queries from './pages/Queries';
import Profiling from './pages/Profiling';
import Regressions from './pages/Regressions';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/bottlenecks" element={<Bottlenecks />} />
          <Route path="/queries" element={<Queries />} />
          <Route path="/profiling" element={<Profiling />} />
          <Route path="/regressions" element={<Regressions />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
