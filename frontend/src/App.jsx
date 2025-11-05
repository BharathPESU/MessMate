import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminScannerPage from './pages/AdminScannerPage.jsx';
import ParticlesBackground from './components/ParticlesBackground.jsx';
import './App.css';

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticlesBackground />
      <div className="dashboard-backdrop"></div>
      <div className="liquid-blob-1"></div>
      <div className="liquid-blob-2"></div>
      <div className="liquid-blob-3"></div>

      <Navbar />
      <main className="relative z-10 px-4 pb-12 pt-6 lg:px-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>

          <Route element={<ProtectedRoute requireAdmin />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/scanner" element={<AdminScannerPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
