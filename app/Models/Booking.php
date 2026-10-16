<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory;

    /**
     * Các thuộc tính có thể gán hàng loạt.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'court_slot_id',
        'total_price',
        'payment_status',
        'checkin_code',
    ];

    /**
     * Ép kiểu thuộc tính.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'total_price' => 'decimal:2',
        ];
    }

    /**
     * Hook tự động sinh checkin_code khi tạo booking mới.
     */
    protected static function booted(): void
    {
        static::creating(function (Booking $booking) {
            if (empty($booking->checkin_code)) {
                // Tạo mã check-in dạng: SMASH-XXXXXXXX (viết hoa)
                $booking->checkin_code = 'SMASH-' . strtoupper(Str::random(8));
            }
        });
    }

    // =========================================================================
    // RELATIONSHIPS
    // =========================================================================

    /**
     * Booking thuộc về một người dùng.
     * Relation: Booking -> User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Booking thuộc về một slot cụ thể.
     * Relation: Booking -> CourtSlot
     */
    public function courtSlot(): BelongsTo
    {
        return $this->belongsTo(CourtSlot::class, 'court_slot_id');
    }

    /**
     * Booking có thể được liên kết với một bài đăng ghép kèo.
     * Relation: Booking -> MatchPost (hasOne, có thể null)
     */
    public function matchPost(): HasOne
    {
        return $this->hasOne(MatchPost::class, 'booking_id');
    }

    // =========================================================================
    // HELPER METHODS (Fat Model)
    // =========================================================================

    /**
     * Kiểm tra booking đã được thanh toán chưa.
     */
    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    /**
     * Kiểm tra booking đã được hoàn tiền chưa.
     */
    public function isRefunded(): bool
    {
        return $this->payment_status === 'refunded';
    }

    /**
     * Xử lý xác nhận thanh toán thành công (từ webhook).
     * Cập nhật trạng thái booking và slot liên quan.
     */
    public function confirmPayment(): void
    {
        $this->update(['payment_status' => 'paid']);

        // Cập nhật trạng thái slot thành 'booked'
        $this->courtSlot()->update(['status' => 'booked']);
    }

    /**
     * Xử lý hoàn tiền và giải phóng lại slot.
     */
    public function processRefund(): void
    {
        $this->update(['payment_status' => 'refunded']);

        // Giải phóng slot về trạng thái available
        $this->courtSlot()->update(['status' => 'available']);
    }

    /**
     * Lấy thông tin sân thông qua slot (eager load thông minh).
     */
    public function getCourt(): Court|null
    {
        return $this->courtSlot?->court;
    }
}
