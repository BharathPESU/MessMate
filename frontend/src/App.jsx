import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminScannerPage from './pages/AdminScannerPage.jsx';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="px-4">
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
