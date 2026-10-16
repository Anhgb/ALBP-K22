<?php

namespace Database\Factories;

use App\Models\Court;
use App\Models\CourtSlot;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CourtSlot>
 */
class CourtSlotFactory extends Factory
{
    protected $model = CourtSlot::class;

    /**
     * Trạng thái mặc định: Slot ngẫu nhiên, trạng thái available.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Các khung giờ phổ biến tại sân cầu lông (sáng + chiều + tối)
        $timeSlots = [
            ['start' => '06:00:00', 'end' => '07:30:00'],
            ['start' => '07:30:00', 'end' => '09:00:00'],
            ['start' => '09:00:00', 'end' => '10:30:00'],
            ['start' => '15:00:00', 'end' => '16:30:00'],
            ['start' => '16:30:00', 'end' => '18:00:00'],
            ['start' => '18:00:00', 'end' => '19:30:00'],
            ['start' => '19:30:00', 'end' => '21:00:00'],
        ];

        $slot = $this->faker->randomElement($timeSlots);

        return [
            'court_id'   => Court::factory(),
            'play_date'  => now()->toDateString(),
            'start_time' => $slot['start'],
            'end_time'   => $slot['end'],
            'price'      => $this->faker->randomElement([80000, 100000, 120000, 150000]),
            'status'     => 'available',
        ];
    }

    /**
     * Trạng thái: Slot đang bị giữ chỗ (pending).
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Trạng thái: Slot đã được đặt hoàn tất (booked).
     */
    public function booked(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'booked',
        ]);
    }

    /**
     * Tạo slot cho một ngày cụ thể.
     */
    public function forDate(string $date): static
    {
        return $this->state(fn (array $attributes) => [
            'play_date' => $date,
        ]);
    }
}
