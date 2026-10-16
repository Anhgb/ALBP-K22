<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MatchPost extends Model
{
    use HasFactory;

    /**
     * Các thuộc tính có thể gán hàng loạt.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'booking_id',
        'level_required',
        'slots_needed',
        'estimated_cost_per_person',
        'note',
        'status',
    ];

    /**
     * Ép kiểu thuộc tính.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'slots_needed'              => 'integer',
            'estimated_cost_per_person' => 'decimal:2',
        ];
    }

    // =========================================================================
    // RELATIONSHIPS
    // =========================================================================

    /**
     * Bài đăng ghép kèo thuộc về một người tạo.
     * Relation: MatchPost -> User (creator)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Bài đăng ghép kèo có thể liên kết với một booking (nullable).
     * Relation: MatchPost -> Booking
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    /**
     * Bài đăng ghép kèo có nhiều yêu cầu tham gia.
     * Relation: MatchPost -> MatchRequests
     */
    public function matchRequests(): HasMany
    {
        return $this->hasMany(MatchRequest::class, 'post_id');
    }

    /**
     * Chỉ lấy các yêu cầu đã được chấp nhận.
     */
    public function acceptedRequests(): HasMany
    {
        return $this->matchRequests()->where('status', 'accepted');
    }

    // =========================================================================
    // HELPER METHODS (Fat Model)
    // =========================================================================

    /**
     * Scope lọc bài đăng đang mở.
     */
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    /**
     * Kiểm tra bài đăng còn đang mở không.
     */
    public function isOpen(): bool
    {
        return $this->status === 'open';
    }

    /**
     * Chấp nhận một yêu cầu tham gia.
     * Tự động đóng bài đăng nếu slots_needed về 0 (theo spec API).
     *
     * @param MatchRequest $request Yêu cầu cần chấp nhận
     */
    public function acceptRequest(MatchRequest $request): void
    {
        $request->update(['status' => 'accepted']);

        // Giảm số slot cần thêm
        $this->decrement('slots_needed');

        // Reload lại model để lấy giá trị mới nhất
        $this->refresh();

        // Nếu không còn slot nào cần thêm => tự động đóng bài đăng
        if ($this->slots_needed <= 0) {
            $this->update(['status' => 'closed']);
        }
    }

    /**
     * Từ chối một yêu cầu tham gia.
     *
     * @param MatchRequest $request Yêu cầu cần từ chối
     */
    public function rejectRequest(MatchRequest $request): void
    {
        $request->update(['status' => 'rejected']);
    }
}
