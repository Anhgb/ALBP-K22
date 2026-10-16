// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useCourts } from '../hooks/useCourts';
import { useMatches } from '../hooks/useMatches';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const { data: courts = [] } = useCourts();
  const { data: matches = [] } = useMatches({ status: 'open' });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-200">
      {/* ── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 py-20 px-4 sm:px-6 lg:px-8 dark:border-white/10 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        {/* Glow background effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent dark:from-emerald-500/15 pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-6 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Hệ thống đặt sân & ghép kèo cầu lông thông minh tại Huế
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Chơi Cầu Lông Đỉnh Cao <br />
            <span className="gradient-text">Không Lo Trùng Lịch & Thiếu Người</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            Hệ thống tự động hóa đặt sân theo thời gian thực với công nghệ khoá dòng
            (Row-locking Transaction). Dễ dàng tìm bạn cùng trình độ, giao lưu vui vẻ,
            hỗ trợ sẵn vợt Kumpoo K520 Pro và VS Titan 7.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/courts"
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-0.5"
            >
              <span>📅</span> Đặt sân ngay
            </Link>

            <Link
              to="/matches"
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm hover:border-emerald-500 hover:text-emerald-600 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/10 transition-all transform hover:-translate-y-0.5"
            >
              <span>🤝</span> Bảng ghép kèo ({matches.length} kèo mở)
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200 dark:border-white/10 pt-10 text-left">
            <div className="glass-card p-5">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">Chống Race Condition (Trùng lịch)</div>
            </div>
            <div className="glass-card p-5">
              <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">4+ Sân</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">Khu vực trung tâm TP. Huế</div>
            </div>
            <div className="glass-card p-5">
              <div className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400">10 Phút</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">Giữ chỗ thanh toán an toàn</div>
            </div>
            <div className="glass-card p-5">
              <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">5.0 ★</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">Đánh giá uy tín người chơi & sân</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Courts Section ─────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Sân Cầu Lông Huế
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Sân Tiêu Biểu & Đang Hoạt Động
            </h2>
          </div>
          <Link
            to="/courts"
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
          >
            Xem tất cả sân →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courts.slice(0, 3).map((court) => (
            <div
              key={court.id}
              className="glass-card-interactive flex flex-col justify-between p-6"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 px-3 py-0.5 text-xs font-semibold">
                    Đang hoạt động
                  </span>
                  <span className="text-amber-500 dark:text-amber-400 text-sm font-bold">★ {court.average_rating ?? 4.9}</span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                  {court.name}
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span>📍</span> {court.address}
                </p>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {court.description || 'Sân cầu lông đạt chuẩn thi đấu, mặt thảm PVC cao cấp chống trơn trượt, hệ thống đèn chiếu sáng chống chói mắt.'}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-200 dark:border-white/5 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">Giá từ</span>
                  <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">50.000đ - 120.000đ</div>
                </div>
                <Link
                  to={`/courts/${court.id}`}
                  className="rounded-xl bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500 hover:text-slate-950 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500 dark:hover:text-slate-950 px-4 py-2 text-xs font-bold transition-all shadow-sm"
                >
                  Xem lịch sân
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Open Matches Preview Section ────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl border-t border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/30 rounded-3xl mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              Cộng đồng cầu lông Huế
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Kèo Đấu Đang Cần Ghép Người
            </h2>
          </div>
          <Link
            to="/matches"
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
          >
            Xem toàn bộ bảng ghép kèo →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.slice(0, 3).map((match) => (
            <div
              key={match.id}
              className="glass-card-interactive p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-teal-100 text-teal-800 border border-teal-200 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-500/30 px-2.5 py-0.5 text-xs font-bold">
                    Cần {match.slots_remaining ?? match.slots_needed} người
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
                    {match.level_required}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-emerald-700 dark:bg-slate-800 dark:text-emerald-400 font-bold border border-emerald-500/30">
                    {match.creator?.name?.charAt(0) ?? 'P'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{match.creator?.name}</h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Đã chơi {match.creator?.matches_played ?? 0} trận • Rating {match.creator?.rating_score ?? 5.0}★
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 italic border-l-4 border-emerald-500/60 pl-3 leading-relaxed bg-white/40 dark:bg-transparent py-1 rounded-r">
                  "{match.note}"
                </p>
              </div>

              <div className="mt-6 border-t border-slate-200 dark:border-white/5 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Chi phí dự kiến</span>
                  <div className="text-sm font-black text-teal-700 dark:text-teal-300">
                    {Number(match.estimated_cost_per_person).toLocaleString('vi-VN')} đ/người
                  </div>
                </div>
                <Link
                  to="/matches"
                  className="rounded-xl bg-teal-500/15 text-teal-800 hover:bg-teal-500 hover:text-slate-950 dark:bg-teal-500/20 dark:text-teal-300 dark:hover:bg-teal-500 dark:hover:text-slate-950 px-4 py-2 text-xs font-bold transition-all shadow-sm"
                >
                  Xin vào kèo
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
