<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\CourtSlot;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    protected $model = Booking::class;

    /**
     * Trạng thái mặc định: Booking chưa thanh toán.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id'        => User::factory(),
            'court_slot_id'  => CourtSlot::factory()->booked(),
            'total_price'    => $this->faker->randomElement([80000, 100000, 120000, 150000]),
            'payment_status' => 'unpaid',
            'checkin_code'   => 'SMASH-' . strtoupper(Str::random(8)),
        ];
    }

    /**
     * Trạng thái: Đã thanh toán.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => 'paid',
        ]);
    }

    /**
     * Trạng thái: Đã hoàn tiền.
     */
    public function refunded(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => 'refunded',
        ]);
    }
}
