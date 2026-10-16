// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState('player');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== passwordConfirmation) {
      setError('Mật khẩu xác nhận không khớp.');
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
        role,
      });

      const { token, user } = response.data?.data;
      setAuth({ token, user });
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        'Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.'
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
          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Tạo tài khoản mới</h2>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
            Tham gia cộng đồng cầu lông và đặt sân tiện lợi tại Huế
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-3 text-center text-xs text-red-800 dark:text-red-300 font-medium">
            {error}
          </div>
        )}

        {/* Card */}
        <div className="glass-card p-8 border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Họ và tên
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-sm"
              />
            </div>

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

            {/* Role selection */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Bạn là
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('player')}
                  className={`rounded-xl border p-2.5 text-xs font-bold transition-all ${
                    role === 'player'
                      ? 'border-emerald-500 bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 shadow-sm'
                      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  🏸 Người chơi (Player)
                </button>
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`rounded-xl border p-2.5 text-xs font-bold transition-all ${
                    role === 'owner'
                      ? 'border-teal-500 bg-teal-500/15 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 shadow-sm'
                      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  🏟️ Chủ sân (Owner)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Mật khẩu (tối thiểu 8 ký tự)
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
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
                  Đang tạo tài khoản...
                </>
              ) : (
                'Đăng ký ngay'
              )}
            </button>
          </form>
        </div>

        {/* Link to login */}
        <p className="text-center text-xs text-slate-600 dark:text-slate-400">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
