<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Court extends Model
{
    use HasFactory;

    /**
     * Các thuộc tính có thể gán hàng loạt.
     *
     * @var list<string>
     */
    protected $fillable = [
        'owner_id',
        'name',
        'address',
        'description',
        'is_active',
    ];

    /**
     * Ép kiểu thuộc tính.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    // =========================================================================
    // RELATIONSHIPS
    // =========================================================================

    /**
     * Sân thuộc về một chủ sân (User với role = owner).
     * Relation: Court -> User (owner)
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Một sân có nhiều khung giờ (slots).
     * Relation: Court -> CourtSlots
     */
    public function courtSlots(): HasMany
    {
        return $this->hasMany(CourtSlot::class, 'court_id');
    }

    /**
     * Các đánh giá về sân này.
     * Relation: Court -> Reviews
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'court_id');
    }

    // =========================================================================
    // HELPER METHODS (Fat Model)
    // =========================================================================

    /**
     * Scope lọc chỉ lấy các sân đang hoạt động.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Lấy các slot của sân theo ngày cụ thể.
     *
     * @param string $date Định dạng YYYY-MM-DD
     */
    public function slotsByDate(string $date): HasMany
    {
        return $this->courtSlots()->where('play_date', $date);
    }

    /**
     * Tính điểm đánh giá trung bình của sân.
     */
    public function averageRating(): float|null
    {
        return $this->reviews()->avg('score');
    }
}
