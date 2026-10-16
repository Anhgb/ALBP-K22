<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\MatchPost;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MatchPost>
 */
class MatchPostFactory extends Factory
{
    protected $model = MatchPost::class;

    /**
     * Trạng thái mặc định: Bài đăng đang mở, chưa có sân.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Trình độ phổ biến trong cộng đồng cầu lông Việt
        $levels = ['Mới bắt đầu', 'Tay ngang', 'Trung bình', 'Khá', 'Cao thủ'];

        // Các ghi chú thực tế có đề cập thiết bị cầu lông
        $notes = [
            'Đang thiếu 1 người nữa. Mình có sẵn vợt Kumpoo K520 Pro và cầu VS Titan 7 cho mượn!',
            'Ghép kèo thứ 7. Ai có vợt Yonex Astrox 88D hoặc Victor DriveX Nano 9 thì càng tốt.',
            'Cần thêm 2 bạn chơi đôi. Sân đã đặt sẵn, mang vợt theo nha. Có nước uống miễn phí.',
            'Tìm bạn chơi buổi tối thứ 6. Trình độ không quan trọng, vui là chính. Cho mượn vợt Li-Ning.',
            'Ghép 4 người chơi đôi. Cầu dùng Felet TK70 Speed. Ai có giày non-marking thì mang theo.',
            'Team thiếu người, cần 1 bạn nữ hoặc nam đều được. Đang dùng cầu Yonex AS-05 chính hãng.',
        ];

        return [
            'user_id'                   => User::factory(),
            'booking_id'                => null, // Mặc định chưa có sân
            'level_required'            => $this->faker->randomElement($levels),
            'slots_needed'              => $this->faker->numberBetween(1, 3),
            'estimated_cost_per_person' => $this->faker->randomElement([25000, 30000, 35000, 40000, 50000]),
            'note'                      => $this->faker->randomElement($notes),
            'status'                    => 'open',
        ];
    }

    /**
     * Trạng thái: Bài đăng có kèm booking (đã đặt sân sẵn).
     */
    public function withBooking(Booking $booking): static
    {
        return $this->state(fn (array $attributes) => [
            'booking_id' => $booking->id,
        ]);
    }

    /**
     * Trạng thái: Bài đăng đã đóng.
     */
    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status'      => 'closed',
            'slots_needed' => 0,
        ]);
    }

    /**
     * Trạng thái: Bài đăng đã hoàn thành.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status'      => 'completed',
            'slots_needed' => 0,
        ]);
    }
}
