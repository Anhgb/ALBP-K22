<?php

namespace Database\Factories;

use App\Models\Court;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Court>
 */
class CourtFactory extends Factory
{
    protected $model = Court::class;

    /**
     * Trạng thái mặc định: Sân cầu lông đang hoạt động.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Tên sân cầu lông ở Huế
        $courtNames = [
            'Nhà Thi Đấu Cầu Lông Hương Giang',
            'Sân Cầu Lông Thuận Hóa',
            'CLB Cầu Lông Bạch Đằng',
            'Sân Thi Đấu An Cựu Sport',
            'Nhà Thi Đấu Tư Thục Phú Vang',
        ];

        // Địa chỉ thực tế ở Huế
        $addresses = [
            '14 Lý Thường Kiệt, Phường Vĩnh Ninh, TP. Huế',
            '56 Bà Triệu, Phường Phú Hòa, TP. Huế',
            '23 Nguyễn Huệ, Phường Phú Nhuận, TP. Huế',
            '88 Đinh Tiên Hoàng, Phường An Cựu, TP. Huế',
            '12 Phan Bội Châu, Phường Phú Hội, TP. Huế',
        ];

        $nameIndex = $this->faker->unique()->numberBetween(0, count($courtNames) - 1);

        return [
            'owner_id'    => User::factory()->owner(),
            'name'        => $courtNames[$nameIndex],
            'address'     => $addresses[$nameIndex],
            'description' => $this->faker->randomElement([
                'Sân cầu lông chất lượng cao, nền sàn gỗ tổng hợp chống trơn, hệ thống chiếu sáng LED hiện đại. Có gửi xe và phòng thay đồ.',
                'CLB cầu lông uy tín tại Huế, không gian thoáng mát, có bán nước và cho thuê vợt. Phù hợp cho mọi trình độ.',
                'Sân thi đấu tiêu chuẩn BWF, thích hợp tập luyện và thi đấu giao hữu. Có huấn luyện viên riêng theo yêu cầu.',
            ]),
            'is_active' => true,
        ];
    }

    /**
     * Trạng thái: Sân đang tạm đóng cửa.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
