// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Sân cầu lông', path: '/courts' },
    { name: 'Bảng ghép kèo', path: '/matches' },
    { name: 'Đặt sân của tôi', path: '/my-bookings', requireAuth: true },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-colors duration-200 dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-xl shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-105">
            🏸
          </span>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Smash<span className="text-emerald-500 dark:text-emerald-400">Match</span>
            </span>
            <span className="block text-[10px] font-medium tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              Huế Badminton Hub
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            if (link.requireAuth && !user) return null;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200/80 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme Toggle & User Auth */}
        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all dark:border-white/10 dark:bg-slate-900 dark:text-amber-300 dark:hover:bg-slate-800 shadow-sm cursor-pointer"
            title={theme === 'dark' ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <>
                <span className="text-sm">☀️</span>
                <span className="hidden sm:inline text-[11px] font-bold text-amber-300">Sáng</span>
              </>
            ) : (
              <>
                <span className="text-sm">🌙</span>
                <span className="hidden sm:inline text-[11px] font-bold text-slate-700">Tối</span>
              </>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</span>
                <div className="flex items-center justify-end gap-1.5 text-xs">
                  <span className="inline-block rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 px-1.5 py-0.5 text-[10px] font-medium capitalize">
                    {user.role === 'owner' ? 'Chủ sân' : user.role === 'admin' ? 'Admin' : 'Người chơi'}
                  </span>
                  {user.rating_score && (
                    <span className="text-amber-500 dark:text-amber-400 font-bold">★ {user.rating_score}</span>
                  )}
                </div>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 dark:bg-slate-800 border border-emerald-500/40 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-all"
                title="Đăng xuất"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5 transition-all"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
