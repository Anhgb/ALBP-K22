<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatchRequest extends Model
{
    use HasFactory;

    /**
     * Các thuộc tính có thể gán hàng loạt.
     *
     * @var list<string>
     */
    protected $fillable = [
        'post_id',
        'requester_id',
        'status',
    ];

    // =========================================================================
    // RELATIONSHIPS
    // =========================================================================

    /**
     * Yêu cầu tham gia thuộc về một bài đăng ghép kèo.
     * Relation: MatchRequest -> MatchPost
     */
    public function matchPost(): BelongsTo
    {
        return $this->belongsTo(MatchPost::class, 'post_id');
    }

    /**
     * Yêu cầu tham gia thuộc về người gửi yêu cầu.
     * Relation: MatchRequest -> User (requester)
     */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    // =========================================================================
    // HELPER METHODS (Fat Model)
    // =========================================================================

    /**
     * Kiểm tra yêu cầu đang ở trạng thái chờ duyệt.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Kiểm tra yêu cầu đã được chấp nhận.
     */
    public function isAccepted(): bool
    {
        return $this->status === 'accepted';
    }

    /**
     * Kiểm tra yêu cầu đã bị từ chối.
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Scope lọc các yêu cầu đang chờ duyệt.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope lọc các yêu cầu đã được chấp nhận.
     */
    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }
}
