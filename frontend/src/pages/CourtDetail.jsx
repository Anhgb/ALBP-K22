// src/pages/CourtDetail.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourt } from '../hooks/useCourts';
import CourtSchedule from '../components/CourtSchedule';

export default function CourtDetail() {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const { data: court, isLoading, error } = useCourt(courtId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <div className="text-center">
          <span className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></span>
          <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Đang tải thông tin sân...</p>
        </div>
      </div>
    );
  }

  if (error || !court) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center text-slate-900 dark:text-white transition-colors duration-300">
        <span className="text-6xl">⚠️</span>
        <h2 className="mt-4 text-2xl font-bold">Không tìm thấy sân cầu lông này</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sân có thể đã ngưng hoạt động hoặc ID không hợp lệ.</p>
        <Link
          to="/courts"
          className="mt-6 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
        >
          ← Quay lại danh sách sân
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">Trang chủ</Link>
          <span>/</span>
          <Link to="/courts" className="hover:text-emerald-600 dark:hover:text-emerald-400">Danh sách sân</Link>
          <span>/</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{court.name}</span>
        </div>

        {/* Court Banner Card */}
        <div className="glass-card mb-8 p-6 sm:p-8 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/60 border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-2xl border border-emerald-500/20 dark:border-emerald-500/30">
                  🏸
                </span>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{court.name}</h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span>📍</span> {court.address}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {court.description ||
                  'Sân cầu lông chất lượng cao tại Huế. Mặt sân thảm PVC tiêu chuẩn, chống trơn trượt, hệ thống chiếu sáng chuẩn thi đấu, chỗ để xe rộng rãi và an ninh.'}
              </p>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <div className="rounded-xl border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 text-center">
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Trạng thái sân</span>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Đang mở đặt slot</div>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800/60 px-4 py-2 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400">Chống Race Condition</span>
                <div className="text-sm font-bold text-teal-600 dark:text-teal-300">Row-Locking Enabled</div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Grid Component */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 p-4 sm:p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
          <CourtSchedule
            courtId={Number(courtId)}
            courtName={court.name}
            onBookingSuccess={(booking) => {
              navigate('/my-bookings');
            }}
          />
        </div>
      </div>
    </div>
  );
}
