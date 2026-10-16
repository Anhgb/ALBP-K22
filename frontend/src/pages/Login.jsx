// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const isExpired = searchParams.get('expired') === 'true';

  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/auth/login', {
        email: email.trim(),
        password,
      });

      const { token, user } = response.data?.data;
      setAuth({ token, user });
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        'Đăng nhập không thành công. Vui lòng kiểm tra lại email và mật khẩu.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-2xl text-slate-950 font-bold shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              🏸
            </span>
            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Smash<span className="text-emerald-500 dark:text-emerald-400">Match</span>
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Đăng nhập tài khoản</h2>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
            Hệ thống đặt sân & ghép kèo cầu lông tại Thừa Thiên Huế
          </p>
        </div>

        {isExpired && (
          <div className="rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-3 text-center text-xs text-amber-800 dark:text-amber-300 font-semibold">
            ⚠️ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-3 text-center text-xs text-red-800 dark:text-red-300 font-medium">
            {error}
          </div>
        )}

        {/* Card */}
        <div className="glass-card p-8 border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"></span>
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập ngay'
              )}
            </button>
          </form>
        </div>

        {/* Link to register */}
        <p className="text-center text-xs text-slate-600 dark:text-slate-400">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
