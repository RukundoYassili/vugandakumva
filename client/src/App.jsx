import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Awareness from './pages/Awareness';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import ReportWizard from './pages/ReportWizard';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Standalone pages (own Navbar/Footer or none) */}
        <Route path="/report" element={<ReportWizard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Main site layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
        </Route>
      </Routes>
    </>
  );
}
