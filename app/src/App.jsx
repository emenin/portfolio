import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProjectPage } from './pages/ProjectPage';
import { DesignSystemCalendarRedirect } from './pages/DesignSystemCalendarRedirect';

function App() {
  // Re-run interactions init after React has mounted (script loads before root content exists)
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.Webflow &&
      window.Webflow.require
    ) {
      try {
        window.Webflow.require('ix2').init();
      } catch (_) {}
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/project/:slug" element={<ProjectPage />} />
      <Route
        path="/design-system-calendar"
        element={<DesignSystemCalendarRedirect />}
      />
    </Routes>
  );
}

export default App;
