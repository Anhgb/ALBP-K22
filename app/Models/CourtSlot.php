<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CourtSlot extends Model
{
    use HasFactory;

    /**
     * Các thuộc tính có thể gán hàng loạt.
     *
     * @var list<string>
     */
    protected $fillable = [
        'court_id',
        'play_date',
        'start_time',
        'end_time',
        'price',
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
            'play_date' => 'date:Y-m-d',
            'price'     => 'decimal:2',
        ];
    }

    // =========================================================================
    // RELATIONSHIPS
    // =========================================================================

    /**
     * Slot này thuộc về một sân.
     * Relation: CourtSlot -> Court
     */
    public function court(): BelongsTo
    {
        return $this->belongsTo(Court::class, 'court_id');
    }

    /**
     * Slot này có thể có một booking (mỗi slot chỉ được đặt 1 lần).
     * Relation: CourtSlot -> Booking (hasOne vì unique constraint)
     */
    public function booking(): HasOne
    {
        return $this->hasOne(Booking::class, 'court_slot_id');
    }

    // =========================================================================
    // HELPER METHODS (Fat Model)
    // =========================================================================

    /**
     * Kiểm tra slot còn trống không.
     */
    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }

    /**
     * Kiểm tra slot đang ở trạng thái pending (đang giữ chỗ).
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Kiểm tra slot đã được đặt hoàn tất.
     */
    public function isBooked(): bool
    {
        return $this->status === 'booked';
    }

    /**
     * Scope lọc các slot theo ngày.
     */
    public function scopeOnDate($query, string $date)
    {
        return $query->where('play_date', $date);
    }

    /**
     * Scope lọc các slot đang available.
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }
}
