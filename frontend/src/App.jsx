// src/App.jsx
import { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CourtList from './pages/CourtList';
import CourtDetail from './pages/CourtDetail';
import MatchmakingBoard from './pages/MatchmakingBoard';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import CourtSchedule from './components/CourtSchedule';
import { useThemeStore } from './store/themeStore';

// ── Trang Demo: Hiển thị riêng lẻ CourtSchedule ──────────────────────────────
const DemoPage = () => (
  <div className="min-h-screen bg-slate-50 p-6 transition-colors duration-200 dark:bg-slate-950">
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <Link to="/" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
          ← Về trang chủ
        </Link>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">DEMO MODE</span>
      </div>
      <CourtSchedule
        courtId={1}
        courtName="Sân Cầu Lông Hương Giang (Huế)"
        onBookingSuccess={(booking) => {
          console.log('Đặt sân thành công:', booking);
        }}
      />
    </div>
  </div>
);

// ── 404 Page ──────────────────────────────────────────────────────────────────
const NotFoundPage = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center px-4 transition-colors duration-200">
    <span className="text-7xl">🏸</span>
    <h1 className="mt-4 text-5xl font-black text-slate-900 dark:text-white">404</h1>
    <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
      Trang bạn tìm kiếm không tồn tại hoặc đã được chuyển đi.
    </p>
    <Link
      to="/"
      className="mt-6 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
    >
      Quay về trang chủ
    </Link>
  </div>
);

// ── Layout Wrapper (Có Navbar & Footer) ───────────────────────────────────────
const MainLayout = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

// ── Root App Routing ──────────────────────────────────────────────────────────
export default function App() {
  const initTheme = useThemeStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <Routes>
      {/* Các trang chính có Navbar & Footer */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/courts"
        element={
          <MainLayout>
            <CourtList />
          </MainLayout>
        }
      />
      <Route
        path="/courts/:courtId"
        element={
          <MainLayout>
            <CourtDetail />
          </MainLayout>
        }
      />
      <Route
        path="/matches"
        element={
          <MainLayout>
            <MatchmakingBoard />
          </MainLayout>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <MainLayout>
            <MyBookings />
          </MainLayout>
        }
      />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Standalone Demo Page */}
      <Route path="/demo/court-schedule" element={<DemoPage />} />

      {/* 404 */}
      <Route
        path="*"
        element={
          <MainLayout>
            <NotFoundPage />
          </MainLayout>
        }
      />
    </Routes>
  );
}
