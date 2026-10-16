// src/components/CourtSchedule.jsx
//
// Component hiển thị lưới lịch sân cầu lông theo ngày.
// Hỗ trợ: chọn ngày, hiển thị màu trạng thái, auto-refresh, và đặt sân.
//
import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useCourtSlots, { courtSlotKeys } from '../hooks/useCourtSlots';
import apiClient from '../api/axios';
import { useAuthStore } from '../store/authStore';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Format ngày YYYY-MM-DD thành string readable */
const formatDate = (dateStr) =>
  new Date(dateStr + 'T00:00:00').toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

/** Format giá tiền VNĐ */
const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

/** Trả về ngày hôm nay dạng YYYY-MM-DD theo múi giờ local */
const todayString = () => new Date().toLocaleDateString('sv-SE'); // sv-SE cho YYYY-MM-DD

// ── Cấu hình màu sắc theo trạng thái slot ────────────────────────────────────
const STATUS_CONFIG = {
  available: {
    bg:       'bg-emerald-50 dark:bg-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/35',
    border:   'border-emerald-300 dark:border-emerald-500/50 hover:border-emerald-500 dark:hover:border-emerald-400',
    text:     'text-emerald-700 dark:text-emerald-300',
    badge:    'bg-emerald-100 dark:bg-emerald-500/30 text-emerald-800 dark:text-emerald-300',
    dot:      'bg-emerald-600 dark:bg-emerald-400',
    label:    'Còn trống',
    cursor:   'cursor-pointer',
    ring:     'hover:ring-2 hover:ring-emerald-500/30 dark:hover:ring-emerald-400/50',
  },
  pending: {
    bg:       'bg-amber-50 dark:bg-amber-500/15',
    border:   'border-amber-300 dark:border-amber-500/40',
    text:     'text-amber-700 dark:text-amber-400',
    badge:    'bg-amber-100 dark:bg-amber-500/25 text-amber-800 dark:text-amber-300',
    dot:      'bg-amber-500 dark:bg-amber-400 animate-pulse',
    label:    'Đang giữ chỗ',
    cursor:   'cursor-not-allowed',
    ring:     '',
  },
  booked: {
    bg:       'bg-rose-50 dark:bg-rose-500/15',
    border:   'border-rose-200 dark:border-rose-500/40',
    text:     'text-rose-700 dark:text-rose-400',
    badge:    'bg-rose-100 dark:bg-rose-500/25 text-rose-800 dark:text-rose-300',
    dot:      'bg-rose-500',
    label:    'Đã đặt',
    cursor:   'cursor-not-allowed',
    ring:     '',
  },
};

// ── Sub-components ────────────────────────────────────────────────────────────

/** Skeleton card hiển thị trong lúc loading */
const SlotSkeleton = () => (
  <div className="animate-pulse rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 p-4">
    <div className="mb-3 h-3 w-20 rounded bg-slate-200 dark:bg-white/10" />
    <div className="mb-2 h-5 w-32 rounded bg-slate-200 dark:bg-white/10" />
    <div className="h-3 w-16 rounded bg-slate-200 dark:bg-white/10" />
  </div>
);

/** Badge trạng thái slot */
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.booked;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

/** Card từng slot trong lưới */
const SlotCard = ({ slot, onBook, isBooking }) => {
  const cfg = STATUS_CONFIG[slot.status] ?? STATUS_CONFIG.booked;
  const isAvailable = slot.status === 'available';

  return (
    <div
      role={isAvailable ? 'button' : undefined}
      tabIndex={isAvailable ? 0 : undefined}
      onClick={() => isAvailable && onBook(slot)}
      onKeyDown={(e) => e.key === 'Enter' && isAvailable && onBook(slot)}
      className={[
        'group relative flex flex-col justify-between rounded-xl border p-4 shadow-sm',
        'transition-all duration-200',
        cfg.bg, cfg.border, cfg.cursor, cfg.ring,
        isAvailable ? 'active:scale-95' : 'opacity-70',
      ].join(' ')}
    >
      {/* Thời gian */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            Khung giờ
          </p>
          {slot.label && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[110px]" title={slot.label}>
              {slot.label}
            </span>
          )}
        </div>
        <p className={`mt-1 text-lg font-bold ${cfg.text}`}>
          {slot.start_time.slice(0, 5)}
          <span className="mx-1 text-slate-400 dark:text-slate-500">–</span>
          {slot.end_time.slice(0, 5)}
        </p>
      </div>

      {/* Badge trạng thái & Giá */}
      <div className="mt-3 flex items-center justify-between">
        <StatusBadge status={slot.status} />
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {formatPrice(slot.price)}
        </span>
      </div>

      {/* Nút đặt sân (chỉ hiện khi hover và available) */}
      {isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-emerald-600/90 dark:bg-emerald-600/90 opacity-0 transition-opacity duration-150 group-hover:opacity-100 shadow-md">
          {isBooking ? (
            <span className="flex items-center gap-2 text-sm font-bold text-white">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Đang đặt...
            </span>
          ) : (
            <span className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>🏸</span> Đặt ngay
            </span>
          )}
        </div>
      )}
    </div>
  );
};

/** Bộ chọn ngày (hôm nay + 6 ngày tiếp theo) */
const DatePicker = ({ selectedDate, onChange }) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString('sv-SE');
  });

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {days.map((day) => {
        const d = new Date(day + 'T00:00:00');
        const isSelected = day === selectedDate;
        const isToday = day === todayString();

        return (
          <button
            key={day}
            onClick={() => onChange(day)}
            className={[
              'flex min-w-[64px] flex-col items-center rounded-xl border px-3 py-2.5 text-center transition-all duration-150 shadow-sm',
              isSelected
                ? 'border-emerald-500 bg-emerald-500/15 dark:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/25 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-slate-200',
            ].join(' ')}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              {isToday ? 'Hôm nay' : d.toLocaleDateString('vi-VN', { weekday: 'short' })}
            </span>
            <span className={`text-lg font-black ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}`}>
              {d.getDate()}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Tháng {d.getMonth() + 1}
            </span>
          </button>
        );
      })}
    </div>
  );
};

/** Modal xác nhận đặt sân */
const ConfirmModal = ({ slot, courtName, onConfirm, onCancel, isLoading }) => {
  if (!slot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 shadow-2xl text-slate-900 dark:text-white animate-in zoom-in-95 duration-200">
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white">
          <h3 className="text-lg font-bold">Xác nhận đặt sân</h3>
          <p className="mt-0.5 text-sm text-emerald-100">{courtName}</p>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-white/5 px-4 py-3 border border-slate-200/60 dark:border-transparent">
              <span className="text-sm text-slate-500 dark:text-slate-400">Khung giờ</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-white/5 px-4 py-3 border border-slate-200/60 dark:border-transparent">
              <span className="text-sm text-slate-500 dark:text-slate-400">Giá thuê</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{formatPrice(slot.price)}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center pt-1">
              ⏳ Bạn có <strong className="text-amber-600 dark:text-amber-400 font-bold">10 phút</strong> để hoàn tất thanh toán sau khi đặt.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-slate-100 dark:border-white/10 p-4 bg-slate-50/50 dark:bg-transparent">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-50"
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-emerald-400 disabled:opacity-60 shadow-md shadow-emerald-500/20"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Đang xử lý...
              </span>
            ) : 'Xác nhận đặt'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

/**
 * CourtSchedule - Lưới lịch đặt sân cầu lông.
 */
const CourtSchedule = ({ courtId, courtName: propCourtName, onBookingSuccess }) => {
  const [selectedDate, setSelectedDate] = useState(todayString);
  const [pendingSlot, setPendingSlot]   = useState(null);
  const [toast, setToast]               = useState(null);

  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // ── Fetch slots ─────────────────────────────────────────────────────────────
  const { slots, courtName: fetchedCourtName, isLoading, isFetching, isError, refetch } =
    useCourtSlots({ courtId, date: selectedDate });

  const displayCourtName = propCourtName || fetchedCourtName;

  // ── Booking mutation ─────────────────────────────────────────────────────────
  const bookingMutation = useMutation({
    mutationFn: (slotId) =>
      apiClient.post('/bookings', { court_slot_id: slotId }),

    onSuccess: (response) => {
      const booking = response.data?.data;

      // Invalidate cache để refetch slots → slot vừa đặt hiển thị 'pending'
      queryClient.invalidateQueries({ queryKey: courtSlotKeys.byDate(courtId, selectedDate) });

      setPendingSlot(null);
      showToast('success', `🎉 Đặt sân thành công! Mã check-in: ${booking?.checkin_code}`);
      onBookingSuccess?.(booking);
    },

    onError: (error) => {
      setPendingSlot(null);
      const msg = error.response?.data?.message ?? 'Đặt sân thất bại. Vui lòng thử lại.';
      showToast('error', msg);
    },
  });

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const handleSlotClick = useCallback((slot) => {
    if (!user) {
      showToast('warning', '⚠️ Vui lòng đăng nhập để đặt sân.');
      return;
    }
    setPendingSlot(slot);
  }, [user, showToast]);

  const handleConfirmBooking = useCallback(() => {
    if (pendingSlot) {
      bookingMutation.mutate(pendingSlot.id);
    }
  }, [pendingSlot, bookingMutation]);

  // ── Nhóm slots theo buổi ────────────────────────────────────────────────────
  const groupedSlots = {
    'Buổi sáng (05:30 – 11:30)': slots.filter((s) => s.start_time < '12:00:00'),
    'Buổi chiều (12:30 – 18:30)': slots.filter((s) => s.start_time >= '12:00:00' && s.start_time < '18:30:00'),
    'Buổi tối & Đêm (18:30 – 23:45)': slots.filter((s) => s.start_time >= '18:30:00'),
  };

  // ── Thống kê nhanh ──────────────────────────────────────────────────────────
  const stats = {
    available: slots.filter((s) => s.status === 'available').length,
    pending:   slots.filter((s) => s.status === 'pending').length,
    booked:    slots.filter((s) => s.status === 'booked').length,
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full font-sans text-slate-900 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-4xl">

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Lịch đặt sân
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {displayCourtName || 'Đang tải...'}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {formatDate(selectedDate)}
              </p>
            </div>

            {/* Auto-refresh indicator */}
            <button
              onClick={() => refetch()}
              title="Làm mới dữ liệu"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 transition-colors hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white shadow-sm"
            >
              <svg
                className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin text-emerald-500' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              {isFetching ? 'Đang cập nhật...' : 'Làm mới'}
            </button>
          </div>

          {/* Stats bar */}
          {!isLoading && slots.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4 pt-1">
              {[
                { label: 'Còn trống', count: stats.available, color: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500 dark:bg-emerald-400' },
                { label: 'Đang giữ',  count: stats.pending,   color: 'text-amber-600 dark:text-amber-400',   dot: 'bg-amber-500 dark:bg-amber-400 animate-pulse' },
                { label: 'Đã đặt',    count: stats.booked,    color: 'text-rose-600 dark:text-rose-400',    dot: 'bg-rose-500' },
              ].map(({ label, count, color, dot }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <span className={`h-2 w-2 rounded-full ${dot}`} />
                  <span className="text-slate-500 dark:text-slate-400">{label}:</span>
                  <span className={`font-bold ${color}`}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── DATE PICKER ─────────────────────────────────────────────────── */}
        <div className="mb-6">
          <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
        </div>

        {/* ── LEGEND ──────────────────────────────────────────────────────── */}
        <div className="mb-5 flex flex-wrap items-center gap-3 text-xs">
          {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span className={`h-3 w-3 rounded-sm border ${cfg.border.split(' ')[0]} ${cfg.bg.split(' ')[0]}`} />
              <span className="text-slate-600 dark:text-slate-400">{cfg.label}</span>
            </div>
          ))}
          <span className="ml-auto text-[11px] text-slate-400 dark:text-slate-600">Tự động cập nhật sau 30s</span>
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
        {isError ? (
          <div className="flex flex-col items-center rounded-2xl border border-rose-500/30 bg-rose-500/10 py-16 text-center">
            <span className="text-4xl">⚠️</span>
            <p className="mt-3 font-bold text-rose-600 dark:text-rose-400">Không thể tải lịch sân</p>
            <p className="mt-1 text-sm text-slate-500">Kiểm tra kết nối mạng và thử lại</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-500/30 transition-all"
            >
              Thử lại
            </button>
          </div>
        ) : isLoading ? (
          /* Skeleton loading */
          <div className="space-y-8">
            {['Buổi sáng', 'Buổi chiều', 'Buổi tối'].map((session) => (
              <div key={session}>
                <div className="mb-3 h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {Array.from({ length: 2 }).map((_, i) => <SlotSkeleton key={i} />)}
                </div>
              </div>
            ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/3 py-16 text-center">
            <span className="text-5xl">📅</span>
            <p className="mt-4 font-bold text-slate-700 dark:text-slate-300">Không có lịch cho ngày này</p>
            <p className="mt-1 text-sm text-slate-500">Vui lòng chọn ngày khác</p>
          </div>
        ) : (
          /* Slot grid theo buổi */
          <div className="space-y-8">
            {Object.entries(groupedSlots).map(([session, sessionSlots]) => {
              if (sessionSlots.length === 0) return null;
              return (
                <div key={session}>
                  {/* Session header */}
                  <div className="mb-3 flex items-center gap-3">
                    <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400">{session}</h3>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                    <span className="text-xs text-slate-400 dark:text-slate-600">{sessionSlots.length} khung giờ</span>
                  </div>

                  {/* Slot cards */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {sessionSlots.map((slot) => (
                      <SlotCard
                        key={slot.id}
                        slot={slot}
                        onBook={handleSlotClick}
                        isBooking={bookingMutation.isPending && pendingSlot?.id === slot.id}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── CONFIRM MODAL ─────────────────────────────────────────────────── */}
      <ConfirmModal
        slot={pendingSlot}
        courtName={displayCourtName}
        onConfirm={handleConfirmBooking}
        onCancel={() => setPendingSlot(null)}
        isLoading={bookingMutation.isPending}
      />

      {/* ── TOAST NOTIFICATION ────────────────────────────────────────────── */}
      {toast && (
        <div
          className={[
            'fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border p-4 shadow-2xl backdrop-blur-md',
            'animate-in slide-in-from-bottom-4 duration-300',
            toast.type === 'success'
              ? 'border-emerald-500/40 bg-white/95 dark:bg-slate-900/95 text-emerald-700 dark:text-emerald-300'
              : toast.type === 'warning'
              ? 'border-amber-500/40 bg-white/95 dark:bg-slate-900/95 text-amber-700 dark:text-amber-300'
              : 'border-rose-500/40 bg-white/95 dark:bg-slate-900/95 text-rose-700 dark:text-rose-300',
          ].join(' ')}
        >
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
      )}
    </div>
  );
};

export default CourtSchedule;
