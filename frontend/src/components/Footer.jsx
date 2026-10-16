// src/components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-100/90 text-slate-600 dark:border-white/10 dark:bg-slate-950/90 dark:text-slate-400 py-12 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold">
                🏸
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white">SmashMatch</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Nền tảng đặt sân và ghép kèo cầu lông thông minh số 1 tại Cố đô Huế.
              Chống trùng lịch với Row Locking, tìm bạn chơi cầu lông theo trình độ,
              sẵn sàng hỗ trợ mượn vợt xịn (Kumpoo K520 Pro, VS Titan 7).
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Hỗ trợ 24/7 tại khu vực Thừa Thiên Huế
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Liên kết nhanh
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/courts" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Danh sách sân cầu lông
                </Link>
              </li>
              <li>
                <Link to="/matches" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Bảng ghép kèo (Matchmaking)
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Lịch sử đặt sân
                </Link>
              </li>
              <li>
                <Link to="/demo/court-schedule" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Xem lưới lịch mẫu
                </Link>
              </li>
            </ul>
          </div>

          {/* Sân tiêu biểu */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Sân cầu lông tại Huế
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>🏸 Sân Hương Giang (Lý Thường Kiệt)</li>
              <li>🏸 Sân An Cựu Sport (Đinh Tiên Hoàng)</li>
              <li>🏸 CLB Thuận Hóa (Bà Triệu)</li>
              <li>🏸 CLB Cầu Lông Kim Long</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 dark:border-white/5 pt-6 flex items-center justify-center text-center text-xs text-slate-500 dark:text-slate-500">
          <p>© 2026 SmashMatch Platform. Hệ thống Đặt sân & Ghép kèo Cầu lông tại Thừa Thiên Huế.</p>
        </div>
      </div>
    </footer>
  );
}
