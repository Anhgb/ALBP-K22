<?php

namespace Database\Seeders;

use App\Models\Court;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Seed dữ liệu đánh giá:
     *  - Đánh giá các sân từ player
     *  - Đánh giá người chơi lẫn nhau
     */
    public function run(): void
    {
        $player1 = User::where('email', 'player1@smashmatch.vn')->first();
        $player2 = User::where('email', 'player2@smashmatch.vn')->first();
        $player3 = User::where('email', 'player3@smashmatch.vn')->first();
        $player4 = User::where('email', 'player4@smashmatch.vn')->first();
        $player5 = User::where('email', 'player5@smashmatch.vn')->first();

        $court1 = Court::find(1);
        $court2 = Court::find(2);
        $court3 = Court::find(3);

        // =====================================================================
        // ĐÁNH GIÁ CÁC SÂN
        // =====================================================================
        $courtReviews = [
            // Sân 1 - Hương Giang
            [
                'reviewer_id' => $player1->id,
                'court_id'    => $court1->id,
                'score'       => 5,
                'comment'     => 'Sân xịn nhất Huế mình từng đặt! Sàn gỗ chất lượng, ánh sáng cực tốt. Nhân viên thân thiện và nhiệt tình hỗ trợ.',
            ],
            [
                'reviewer_id' => $player2->id,
                'court_id'    => $court1->id,
                'score'       => 4,
                'comment'     => 'Sân đẹp, sạch sẽ. Vị trí đắc địa ở trung tâm Huế. Chỉ tiếc bãi xe hơi nhỏ vào giờ cao điểm.',
            ],
            [
                'reviewer_id' => $player4->id,
                'court_id'    => $court1->id,
                'score'       => 5,
                'comment'     => 'Hệ thống đặt sân qua app rất tiện. Vô sân là biết check-in ngay, không cần chờ đợi. 10 điểm.',
            ],
            // Sân 2 - Thuận Hóa
            [
                'reviewer_id' => $player3->id,
                'court_id'    => $court2->id,
                'score'       => 4,
                'comment'     => 'CLB uy tín, có HLV hỗ trợ nếu cần. Phù hợp tập luyện nghiêm túc. Cầu dùng VS Titan 7 chất lượng ổn.',
            ],
            [
                'reviewer_id' => $player5->id,
                'court_id'    => $court2->id,
                'score'       => 3,
                'comment'     => 'Sân ổn nhưng điều hòa hơi yếu vào buổi chiều. Hy vọng cải thiện sớm.',
            ],
            // Sân 3 - An Cựu Sport
            [
                'reviewer_id' => $player2->id,
                'court_id'    => $court3->id,
                'score'       => 5,
                'comment'     => 'Mở cửa từ 5:30 sáng, rất hợp cho dân hay tập buổi sáng như mình. Không gian rộng, thoáng mát. Gần chợ An Cựu.',
            ],
            [
                'reviewer_id' => $player1->id,
                'court_id'    => $court3->id,
                'score'       => 4,
                'comment'     => 'Vị trí thuận tiện, bãi đậu xe rộng. Sân đạt chuẩn thi đấu, phù hợp cho cả giải phong trào.',
            ],
        ];

        foreach ($courtReviews as $reviewData) {
            Review::create(array_merge($reviewData, ['reviewee_id' => null]));
        }

        $this->command->info("  ✅ Đã tạo " . count($courtReviews) . " đánh giá sân");

        // =====================================================================
        // ĐÁNH GIÁ NGƯỜI CHƠI
        // =====================================================================
        $playerReviews = [
            // Player 4 đánh giá Player 1 (sau trận ghép kèo)
            [
                'reviewer_id' => $player4->id,
                'reviewee_id' => $player1->id,
                'court_id'    => null,
                'score'       => 5,
                'comment'     => 'Anh Tuấn chơi cầu rất fair-play, smash mạnh và phòng thủ tốt. Thái độ thể thao rất đẹp. Hẹn lần sau!',
            ],
            // Player 1 đánh giá Player 4 (sau trận)
            [
                'reviewer_id' => $player1->id,
                'reviewee_id' => $player4->id,
                'court_id'    => null,
                'score'       => 5,
                'comment'     => 'Bạn Ngọc chơi rất ổn, đúng như trình độ mô tả. Đúng giờ, nhiệt tình. Đội mình đấu rất vui!',
            ],
            // Player 2 đánh giá Player 3
            [
                'reviewer_id' => $player2->id,
                'reviewee_id' => $player3->id,
                'court_id'    => null,
                'score'       => 4,
                'comment'     => 'Anh Đức chơi khá, kỹ thuật tốt ở lưới. Cần cải thiện thêm phần di chuyển phía sau.',
            ],
        ];

        foreach ($playerReviews as $reviewData) {
            Review::create($reviewData);
        }

        $this->command->info("  ✅ Đã tạo " . count($playerReviews) . " đánh giá người chơi");
        $this->command->info("✅ Hoàn thành seed Reviews");
    }
}
