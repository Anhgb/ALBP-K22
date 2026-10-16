<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    /**
     * Các thuộc tính có thể gán hàng loạt.
     *
     * @var list<string>
     */
    protected $fillable = [
        'reviewer_id',
        'reviewee_id',
        'court_id',
        'score',
        'comment',
    ];

    /**
     * Ép kiểu thuộc tính.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'score' => 'integer',
        ];
    }

    // =========================================================================
    // RELATIONSHIPS
    // =========================================================================

    /**
     * Đánh giá do người này viết.
     * Relation: Review -> User (reviewer)
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    /**
     * Đánh giá nhắm đến người chơi này (nullable).
     * Relation: Review -> User (reviewee)
     */
    public function reviewee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewee_id');
    }

    /**
     * Đánh giá nhắm đến sân này (nullable).
     * Relation: Review -> Court
     */
    public function court(): BelongsTo
    {
        return $this->belongsTo(Court::class, 'court_id');
    }

    // =========================================================================
    // HELPER METHODS (Fat Model)
    // =========================================================================

    /**
     * Kiểm tra đây là đánh giá người chơi (reviewee_id không null).
     */
    public function isPlayerReview(): bool
    {
        return !is_null($this->reviewee_id);
    }

    /**
     * Kiểm tra đây là đánh giá sân (court_id không null).
     */
    public function isCourtReview(): bool
    {
        return !is_null($this->court_id);
    }

    /**
     * Scope lọc các đánh giá sân.
     */
    public function scopeForCourt($query, int $courtId)
    {
        return $query->where('court_id', $courtId);
    }

    /**
     * Scope lọc các đánh giá người chơi.
     */
    public function scopeForPlayer($query, int $userId)
    {
        return $query->where('reviewee_id', $userId);
    }

    /**
     * Hook: Sau khi tạo review cho người chơi, tự động cập nhật rating_score của họ.
     */
    protected static function booted(): void
    {
        static::created(function (Review $review) {
            if ($review->isPlayerReview() && $review->reviewee) {
                $review->reviewee->recalculateRating();
            }
        });
    }
}
