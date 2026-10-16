// src/pages/CourtList.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourts } from '../hooks/useCourts';

export default function CourtList() {
  const { data: courts = [], isLoading, error } = useCourts();
  const [search, setSearch] = useState('');

  const filteredCourts = courts.filter((court) => {
    const q = search.toLowerCase();
    return (
      court.name.toLowerCase().includes(q) ||
      court.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-2xl border border-emerald-500/20">
                🏸
              </span>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Danh Sách Sân Cầu Lông
              </h1>
            </div>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Chọn sân tại khu vực Thừa Thiên Huế để xem lịch trống và đặt sân tức thì
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-80">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên sân, địa chỉ..."
                className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-24 text-center">
            <span className="inline-block h-9 w-9 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></span>
            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Đang tải danh sách sân...</p>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-600 dark:text-red-300">
            Không thể tải danh sách sân. Vui lòng kiểm tra lại kết nối API Backend.
          </div>
        ) : filteredCourts.length === 0 ? (
          <div className="py-20 text-center text-slate-500 dark:text-slate-400">
            Không tìm thấy sân phù hợp với từ khóa "{search}".
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourts.map((court) => (
              <div
                key={court.id}
                className="glass-card flex flex-col justify-between p-6 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                      🟢 Đang mở cửa
                    </span>
                    <span className="text-sm font-bold text-amber-500 dark:text-amber-400">★ 4.9</span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {court.name}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                    <span className="text-sm">📍</span>
                    <span>{court.address}</span>
                  </p>

                  <p className="mt-3.5 text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {court.description ||
                      'Cụm sân cầu lông tiêu chuẩn thi đấu, mặt sân thảm cao cấp chống trơn, hệ thống đèn LED chuyên dụng, có quầy nước giải khát và cho thuê vợt.'}
                  </p>

                  {/* Amenities */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {['Thảm tiêu chuẩn', 'Đèn LED chống chói', 'Gửi xe miễn phí', 'Wifi'].map((badge) => (
                      <span
                        key={badge}
                        className="rounded-md bg-slate-100 dark:bg-white/5 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5"
                      >
                        ✓ {badge}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 dark:border-white/10 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Khung giờ đặt</span>
                    <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">Từ 50.000đ / slot</div>
                  </div>

                  <Link
                    to={`/courts/${court.id}`}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
                  >
                    Xem lịch & Đặt sân →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
