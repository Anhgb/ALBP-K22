<?php

namespace Database\Factories;

use App\Models\Court;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    protected $model = Review::class;

    /**
     * Trạng thái mặc định: Đánh giá sân.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Nhận xét mẫu về sân
        $courtComments = [
            'Sân rộng rãi, sạch sẽ, ánh sáng tốt. Nhân viên thân thiện và nhiệt tình.',
            'Sàn gỗ chất lượng, không bị trơn. Có chỗ để xe rộng rãi. Sẽ quay lại.',
            'Giá cả hợp lý, sân thoáng mát. Chỉ có điều thiếu phòng thay đồ rộng hơn một chút.',
            'Hệ thống đặt sân trực tuyến rất tiện. Sân đạt chuẩn, phù hợp tập luyện nghiêm túc.',
            'Vị trí đẹp, gần trung tâm. Sân sạch nhưng hệ thống điều hòa không đủ mát vào buổi trưa.',
        ];

        return [
            'reviewer_id' => User::factory(),
            'reviewee_id' => null,
            'court_id'    => Court::factory(),
            'score'       => $this->faker->numberBetween(3, 5),
            'comment'     => $this->faker->randomElement($courtComments),
        ];
    }

    /**
     * Trạng thái: Đánh giá người chơi (thay vì đánh giá sân).
     */
    public function forPlayer(User $reviewee): static
    {
        // Nhận xét mẫu về người chơi
        $playerComments = [
            'Bạn chơi cầu lông rất fair-play, tinh thần thể thao tốt. Rất vui được đấu cùng.',
            'Kỹ thuật tốt, smash mạnh. Nhưng cần cải thiện phần phòng thủ ở lưới.',
            'Người chơi nhiệt tình, hòa đồng. Rất đáng để ghép kèo lần sau.',
            'Trình độ ổn, đúng như mô tả. Đúng giờ và chơi đẹp.',
        ];

        return $this->state(fn (array $attributes) => [
            'reviewee_id' => $reviewee->id,
            'court_id'    => null,
            'score'       => $this->faker->numberBetween(3, 5),
            'comment'     => $this->faker->randomElement($playerComments),
        ]);
    }
}
