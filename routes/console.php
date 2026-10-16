<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// ── Artisan Commands ──────────────────────────────────────────────────────────
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ── Scheduled Tasks ───────────────────────────────────────────────────────────

/**
 * Expire các Booking ở trạng thái 'pending' quá 10 phút.
 * Giải phóng lại CourtSlot về 'available'.
 *
 * Chạy mỗi phút để đảm bảo độ chính xác.
 *
 * Logic:
 *   - Tìm tất cả Booking có payment_status = 'unpaid'
 *     và created_at < now() - 10 phút
 *   - Update courtSlot.status = 'available'
 *   - Xoá Booking (hoặc update status = 'expired' nếu muốn giữ log)
 */
Schedule::call(function () {
    $expiredBookings = \App\Models\Booking::where('payment_status', 'unpaid')
        ->where('created_at', '<', now()->subMinutes(10))
        ->with('courtSlot')
        ->get();

    foreach ($expiredBookings as $booking) {
        \Illuminate\Support\Facades\DB::transaction(function () use ($booking) {
            // Giải phóng slot
            $booking->courtSlot()->update(['status' => 'available']);
            // Xoá booking đã hết hạn
            $booking->delete();
        });
    }

    if ($expiredBookings->count() > 0) {
        \Illuminate\Support\Facades\Log::info(
            "[Scheduler] Đã giải phóng {$expiredBookings->count()} slot hết hạn pending."
        );
    }
})->everyMinute()->name('expire-pending-bookings')->withoutOverlapping();
