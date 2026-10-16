<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Các thuộc tính có thể gán hàng loạt (mass assignment).
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'rating_score',
        'matches_played',
    ];

    /**
     * Các thuộc tính ẩn khi serialization (trả về JSON).
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Các thuộc tính cần ép kiểu.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'rating_score'      => 'decimal:1',
            'matches_played'    => 'integer',
            'is_active'         => 'boolean', // dùng khi check user active
        ];
    }

    // =========================================================================
    // RELATIONSHIPS
    // =========================================================================

    /**
     * Một user (owner) có nhiều sân.
     * Relation: User (owner) -> courts
     */
    public function courts(): HasMany
    {
        return $this->hasMany(Court::class, 'owner_id');
    }

    /**
     * Một user có nhiều lượt đặt sân.
     * Relation: User -> bookings
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'user_id');
    }

    /**
     * Một user có nhiều bài đăng ghép kèo.
     * Relation: User -> match_posts
     */
    public function matchPosts(): HasMany
    {
        return $this->hasMany(MatchPost::class, 'user_id');
    }

    /**
     * Một user có nhiều yêu cầu tham gia ghép kèo (với tư cách người xin vào).
     * Relation: User -> match_requests (as requester)
     */
    public function matchRequests(): HasMany
    {
        return $this->hasMany(MatchRequest::class, 'requester_id');
    }

    /**
     * Các đánh giá mà user này đã VIẾT.
     * Relation: User -> reviews (as reviewer)
     */
    public function reviewsGiven(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    /**
     * Các đánh giá mà user này NHẬN ĐƯỢC (từ người khác).
     * Relation: User -> reviews (as reviewee)
     */
    public function reviewsReceived(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewee_id');
    }

    // =========================================================================
    // HELPER METHODS (Fat Model)
    // =========================================================================

    /**
     * Kiểm tra user có phải là chủ sân không.
     */
    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }

    /**
     * Kiểm tra user có phải là admin không.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Tính lại và cập nhật rating_score dựa trên các review nhận được.
     */
    public function recalculateRating(): void
    {
        $avgScore = $this->reviewsReceived()->avg('score');
        if ($avgScore !== null) {
            $this->update(['rating_score' => round($avgScore, 1)]);
        }
    }
}
