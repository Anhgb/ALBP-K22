<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\CourtSlot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class BookingController extends Controller
{
    /**
     * Lấy danh sách booking của user đang đăng nhập.
     * GET /api/v1/bookings
     */
    public function index(Request $request): JsonResponse
    {
        $bookings = Booking::with(['courtSlot.court', 'user'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => BookingResource::collection($bookings),
            'meta'    => [
                'current_page' => $bookings->currentPage(),
                'last_page'    => $bookings->lastPage(),
                'total'        => $bookings->total(),
            ],
        ]);
    }

    /**
     * Xử lý đặt sân - LUỒNG CHÍNH với Transaction & Row Locking.
     * POST /api/v1/bookings
     *
     * ┌─────────────────────────────────────────────────────────────────┐
     * │  CHIẾN LƯỢC CHỐNG RACE CONDITION                                │
     * │  Vấn đề: 2 user cùng đặt 1 slot trong cùng 1 thời điểm.       │
     * │                                                                  │
     * │  Giải pháp: Kết hợp DB Transaction + lockForUpdate()           │
     * │  ─────────────────────────────────────────────────────────────  │
     * │  1. Mở transaction (BEGIN)                                       │
     * │  2. SELECT ... FOR UPDATE → MySQL khóa row này lại.            │
     * │     → Request thứ 2 phải CHỜ cho đến khi request 1 COMMIT.    │
     * │  3. Kiểm tra status === 'available'                             │
     * │  4. Nếu có: UPDATE status = 'pending' + INSERT booking         │
     * │  5. COMMIT → Request 2 được thực thi, thấy status='pending'   │
     * │     → Trả về lỗi 409 Conflict ngay lập tức.                    │
     * └─────────────────────────────────────────────────────────────────┘
     */
    public function store(StoreBookingRequest $request): JsonResponse
    {
        $userId      = $request->user()->id;
        $courtSlotId = $request->validated()['court_slot_id'];

        try {
            $booking = DB::transaction(function () use ($userId, $courtSlotId) {

                // ── BƯỚC 1: Lock row để ngăn race condition ───────────────
                // lockForUpdate() = SELECT ... FOR UPDATE trong MySQL.
                // Tất cả transaction khác muốn đọc/ghi row này phải CHỜ.
                /** @var CourtSlot $slot */
                $slot = CourtSlot::lockForUpdate()->findOrFail($courtSlotId);

                // ── BƯỚC 2: Kiểm tra trạng thái slot SAU KHI đã có lock ──
                // Lúc này chắc chắn không có transaction nào khác can thiệp.
                if (! $slot->isAvailable()) {
                    // Ném exception để rollback transaction và trả lỗi về client
                    throw new \RuntimeException(
                        match ($slot->status) {
                            'pending' => 'Slot này đang được người khác giữ chỗ. Vui lòng thử lại sau ít phút.',
                            'booked'  => 'Slot này đã được đặt. Vui lòng chọn khung giờ khác.',
                            default   => 'Slot này không khả dụng.',
                        },
                        409 // Dùng code để map ra HTTP status code bên ngoài
                    );
                }

                // ── BƯỚC 3: Đánh dấu slot là 'pending' (đang giữ chỗ) ───
                // Slot sẽ tự động expire sau 10 phút nếu chưa thanh toán
                // (xử lý bởi Scheduled Job: app/Console/Commands/ExpirePendingBookings)
                $slot->update(['status' => 'pending']);

                // ── BƯỚC 4: Tạo bản ghi Booking ──────────────────────────
                // checkin_code được auto-generate trong Booking::booted()
                $booking = Booking::create([
                    'user_id'        => $userId,
                    'court_slot_id'  => $slot->id,
                    'total_price'    => $slot->price,
                    'payment_status' => 'unpaid',
                ]);

                // ── BƯỚC 5: Load relationships để trả về response đầy đủ ─
                $booking->load(['user', 'courtSlot.court']);

                return $booking;

            }); // ← COMMIT transaction tại đây

            // Trả về 201 Created với BookingResource
            return response()->json([
                'success' => true,
                'message' => 'Đặt sân thành công! Bạn có 10 phút để hoàn tất thanh toán.',
                'data'    => new BookingResource($booking),
            ], 201);

        } catch (\RuntimeException $e) {
            // Lỗi nghiệp vụ (slot không available) → 409 Conflict
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 409);

        } catch (Throwable $e) {
            // Lỗi hệ thống không mong muốn → log để debug, trả 500
            Log::error('BookingController@store - Unexpected error', [
                'user_id'       => $userId,
                'court_slot_id' => $courtSlotId,
                'error'         => $e->getMessage(),
                'trace'         => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại.',
            ], 500);
        }
    }

    /**
     * Xem chi tiết một booking.
     * GET /api/v1/bookings/{id}
     */
    public function show(Request $request, Booking $booking): JsonResponse
    {
        // Chỉ chủ nhân booking mới được xem
        if ($booking->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền xem booking này.',
            ], 403);
        }

        $booking->load(['user', 'courtSlot.court']);

        return response()->json([
            'success' => true,
            'data'    => new BookingResource($booking),
        ]);
    }

    /**
     * Webhook từ cổng thanh toán - xác nhận thanh toán thành công.
     * POST /api/v1/webhooks/payment
     *
     * Đây là mock webhook cho mục đích demo.
     * Production: cần verify chữ ký HMAC từ payment gateway.
     */
    public function paymentWebhook(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'booking_id'     => ['nullable', 'required_without:checkin_code', 'exists:bookings,id'],
            'checkin_code'   => ['nullable', 'required_without:booking_id', 'string'],
            'payment_status' => ['required', 'in:paid,refunded'],
        ]);

        $booking = ! empty($validated['booking_id'])
            ? Booking::find($validated['booking_id'])
            : Booking::where('checkin_code', $validated['checkin_code'])->first();

        if (! $booking) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy lượt đặt sân tương ứng.',
            ], 404);
        }

        if ($booking->isPaid()) {
            return response()->json([
                'success' => false,
                'message' => 'Lượt đặt sân này đã được thanh toán trước đó.',
            ], 409);
        }

        DB::transaction(function () use ($booking, $validated) {
            if ($validated['payment_status'] === 'paid') {
                // confirmPayment() cập nhật booking + slot → 'booked' (trong Model)
                $booking->confirmPayment();
            } else {
                // processRefund() hoàn tiền + giải phóng slot → 'available' (trong Model)
                $booking->processRefund();
            }
        });

        $booking->load(['user', 'courtSlot.court']);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái thanh toán thành công!',
            'data'    => new BookingResource($booking),
        ]);
    }
}
