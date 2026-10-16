// src/pages/MyBookings.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyBookings, useMockPayment } from '../hooks/useBookings';
import { useAuthStore } from '../store/authStore';

export default function MyBookings() {
  const user = useAuthStore((s) => s.user);
  const { data: bookings = [], isLoading, error } = useMyBookings();
  const mockPaymentMutation = useMockPayment();
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleMockPay = async (booking) => {
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await mockPaymentMutation.mutateAsync({
        bookingId: booking.id,
        checkinCode: booking.checkin_code,
        paymentStatus: 'paid',
      });
      setSuccessMsg(`🎉 Thanh toán thành công cho đơn đặt #${booking.id}! Mã check-in (${booking.checkin_code}) đã được kích hoạt.`);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Có lỗi khi thực hiện mô phỏng thanh toán.');
      setTimeout(() => setErrorMsg(null), 5000);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center text-slate-900 dark:text-white transition-colors duration-300">
        <span className="text-6xl">🔒</span>
        <h2 className="mt-4 text-2xl font-bold">Vui lòng đăng nhập</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Bạn cần đăng nhập để xem lịch sử và danh sách đặt sân.</p>
        <Link
          to="/login"
          className="mt-6 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-2xl border border-emerald-500/20">
                🎫
              </span>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Lịch Sử Đặt Sân
              </h1>
            </div>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Quản lý các lượt đặt sân, mã check-in và trạng thái thanh toán
            </p>
          </div>

          <Link
            to="/courts"
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 self-start sm:self-auto transition-all shadow-md shadow-emerald-500/20"
          >
            <span>➕</span> Đặt thêm sân mới
          </Link>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mt-6 rounded-2xl border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/15 p-4 text-sm text-emerald-800 dark:text-emerald-300 shadow-sm flex items-center justify-between">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg(null)} className="text-xs text-emerald-700 dark:text-emerald-400 hover:text-slate-900 dark:hover:text-white font-bold ml-2">✕</button>
          </div>
        )}

        {errorMsg && (
          <div className="mt-6 rounded-2xl border border-red-300 dark:border-red-500/40 bg-red-50 dark:bg-red-500/15 p-4 text-sm text-red-800 dark:text-red-300 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-xs text-red-700 dark:text-red-400 hover:text-slate-900 dark:hover:text-white font-bold ml-2">✕</button>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="py-24 text-center">
            <span className="inline-block h-9 w-9 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></span>
            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Đang tải lịch sử đặt sân...</p>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-600 dark:text-red-300">
            Có lỗi khi tải danh sách đặt sân. Vui lòng thử lại sau.
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-card mt-8 p-12 text-center text-slate-500 dark:text-slate-400">
            <span className="text-5xl">📅</span>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Bạn chưa có lượt đặt sân nào</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Hãy chọn sân cầu lông và khung giờ phù hợp để bắt đầu thi đấu!</p>
            <Link
              to="/courts"
              className="mt-6 inline-block rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all"
            >
              Xem danh sách sân tại Huế
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {bookings.map((booking) => {
              const isPaid = booking.payment_status === 'paid';
              const isPending = booking.payment_status === 'pending' || booking.payment_status === 'unpaid';

              return (
                <div
                  key={booking.id}
                  className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300"
                >
                  {/* Left: Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {booking.court_slot?.court?.name ?? 'Sân Cầu Lông'}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          isPaid
                            ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                            : isPending
                            ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-400'
                        }`}
                      >
                        {isPaid ? '✓ Đã thanh toán' : isPending ? '⏳ Chờ thanh toán' : 'Đã hoàn tiền'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                      <div>
                        📅 Ngày: <strong className="text-slate-900 dark:text-white">{booking.court_slot?.play_date}</strong>
                      </div>
                      <div>
                        ⏰ Giờ:{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          {booking.court_slot?.start_time?.slice(0, 5)} - {booking.court_slot?.end_time?.slice(0, 5)}
                        </strong>
                      </div>
                      <div>
                        💰 Tổng tiền:{' '}
                        <strong className="text-teal-600 dark:text-teal-300">
                          {Number(booking.total_price).toLocaleString('vi-VN')} đ
                        </strong>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 dark:text-slate-500">
                      Mã đặt chỗ: #{booking.id} • Đặt lúc: {new Date(booking.created_at).toLocaleString('vi-VN')}
                    </div>
                  </div>

                  {/* Right: Checkin Code & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-white/10">
                    {/* Checkin code box */}
                    <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-center shadow-sm">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">
                        Mã Check-in sân
                      </span>
                      <span className="text-base font-black tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">
                        {booking.checkin_code}
                      </span>
                    </div>

                    {/* Mock payment trigger button */}
                    {isPending && (
                      <button
                        onClick={() => handleMockPay(booking)}
                        disabled={mockPaymentMutation.isPending}
                        className="rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 disabled:opacity-50 transition-all flex items-center gap-1.5"
                        title="Mô phỏng thanh toán qua Webhook"
                      >
                        {mockPaymentMutation.isPending ? (
                          <>
                            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"></span>
                            Đang xử lý...
                          </>
                        ) : (
                          '⚡ Mock Pay (Webhook)'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
