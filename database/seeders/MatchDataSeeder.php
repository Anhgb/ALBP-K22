<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\CourtSlot;
use App\Models\MatchPost;
use App\Models\MatchRequest;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MatchDataSeeder extends Seeder
{
    /**
     * Seed dữ liệu Bookings, MatchPosts và MatchRequests để tạo
     * một hệ sinh thái ghép kèo thực tế cho mục đích demo.
     *
     * Kịch bản:
     *  - Player 1 & 3 đặt sân thành công (booked + paid)
     *  - Player 1 tạo bài đăng ghép kèo kèm booking
     *  - Player 3 tạo bài đăng ghép kèo không có sân
     *  - Player 2, 4, 5 gửi yêu cầu tham gia
     */
    public function run(): void
    {
        $player1 = User::where('email', 'player1@smashmatch.vn')->first();
        $player2 = User::where('email', 'player2@smashmatch.vn')->first();
        $player3 = User::where('email', 'player3@smashmatch.vn')->first();
        $player4 = User::where('email', 'player4@smashmatch.vn')->first();
        $player5 = User::where('email', 'player5@smashmatch.vn')->first();

        // =====================================================================
        // BOOKING 1: Player 1 đặt slot tối hôm nay của Sân 1 - đã thanh toán
        // =====================================================================
        $slot1 = CourtSlot::where('court_id', 1)
                           ->where('start_time', '18:30:00')
                           ->whereDate('play_date', today())
                           ->first();

        $booking1 = null;
        if ($slot1) {
            $booking1 = Booking::create([
                'user_id'        => $player1->id,
                'court_slot_id'  => $slot1->id,
                'total_price'    => $slot1->price,
                'payment_status' => 'paid',
                'checkin_code'   => 'SMASH-' . strtoupper(Str::random(8)),
            ]);
            // Cập nhật status slot thành booked
            $slot1->update(['status' => 'booked']);
            $this->command->info("  ✅ Booking 1: Player 1 đặt sân tối hôm nay (đã thanh toán)");
        }

        // =====================================================================
        // BOOKING 2: Player 3 đặt slot chiều hôm nay của Sân 2 - đã thanh toán
        // =====================================================================
        $slot2 = CourtSlot::where('court_id', 2)
                           ->where('start_time', '17:00:00')
                           ->whereDate('play_date', today())
                           ->first();

        $booking2 = null;
        if ($slot2) {
            $booking2 = Booking::create([
                'user_id'        => $player3->id,
                'court_slot_id'  => $slot2->id,
                'total_price'    => $slot2->price,
                'payment_status' => 'paid',
                'checkin_code'   => 'SMASH-' . strtoupper(Str::random(8)),
            ]);
            $slot2->update(['status' => 'booked']);
            $this->command->info("  ✅ Booking 2: Player 3 đặt sân chiều hôm nay (đã thanh toán)");
        }

        // =====================================================================
        // BOOKING 3: Player 2 đặt slot sáng ngày mai của Sân 3 - chưa thanh toán
        // =====================================================================
        $slot3 = CourtSlot::where('court_id', 3)
                           ->where('start_time', '07:00:00')
                           ->whereDate('play_date', today()->addDay())
                           ->first();

        if ($slot3) {
            Booking::create([
                'user_id'        => $player2->id,
                'court_slot_id'  => $slot3->id,
                'total_price'    => $slot3->price,
                'payment_status' => 'unpaid',
                'checkin_code'   => 'SMASH-' . strtoupper(Str::random(8)),
            ]);
            $slot3->update(['status' => 'pending']);
            $this->command->info("  ⏳ Booking 3: Player 2 đặt sân sáng ngày mai (chưa thanh toán - pending)");
        }

        // =====================================================================
        // MATCH POST 1: Player 1 tạo bài ghép kèo có sân (kèm Booking 1)
        // =====================================================================
        $matchPost1 = MatchPost::create([
            'user_id'                   => $player1->id,
            'booking_id'                => $booking1?->id,
            'level_required'            => 'Khá',
            'slots_needed'              => 2,
            'estimated_cost_per_person' => 50000,
            'note'                      => 'Tối nay mình đã đặt sân Hương Giang khung 18:30-20:00. '
                                         . 'Đang thiếu 2 người nữa để chơi đôi. '
                                         . 'Có sẵn vợt Kumpoo K520 Pro và cầu VS Titan 7 cho mượn!',
            'status'                    => 'open',
        ]);

        // Player 4 và Player 5 gửi yêu cầu tham gia Match Post 1
        MatchRequest::create([
            'post_id'      => $matchPost1->id,
            'requester_id' => $player4->id,
            'status'       => 'accepted', // Player 4 đã được chấp nhận
        ]);

        MatchRequest::create([
            'post_id'      => $matchPost1->id,
            'requester_id' => $player5->id,
            'status'       => 'pending', // Player 5 đang chờ duyệt
        ]);

        $this->command->info("  ✅ Match Post 1: Player 1 ghép kèo tối nay (có sân, 2 request)");

        // =====================================================================
        // MATCH POST 2: Player 3 tạo bài ghép kèo có sân (kèm Booking 2)
        // =====================================================================
        $matchPost2 = MatchPost::create([
            'user_id'                   => $player3->id,
            'booking_id'                => $booking2?->id,
            'level_required'            => 'Trung bình',
            'slots_needed'              => 1,
            'estimated_cost_per_person' => 35000,
            'note'                      => 'Chiều nay cần 1 người chơi đôi, sân Thuận Hóa 17:00-18:30. '
                                         . 'Trình độ trung bình là ổn, vui là chính. '
                                         . 'Đang dùng cầu Yonex AS-05 chính hãng.',
            'status'                    => 'open',
        ]);

        // Player 2 gửi yêu cầu
        MatchRequest::create([
            'post_id'      => $matchPost2->id,
            'requester_id' => $player2->id,
            'status'       => 'pending',
        ]);

        $this->command->info("  ✅ Match Post 2: Player 3 ghép kèo chiều nay (có sân, 1 request)");

        // =====================================================================
        // MATCH POST 3: Player 5 tạo bài ghép kèo KHÔNG có sân (tự do)
        // =====================================================================
        MatchPost::create([
            'user_id'                   => $player5->id,
            'booking_id'                => null, // Chưa đặt sân
            'level_required'            => 'Mới bắt đầu',
            'slots_needed'              => 3,
            'estimated_cost_per_person' => 30000,
            'note'                      => 'Mới học chơi cầu, tìm bạn cùng trình độ tập luyện cuối tuần. '
                                         . 'Chưa chọn sân, mọi người vote sân nào thì đặt sân đó. '
                                         . 'Có thể cho mượn vợt Li-Ning nếu ai chưa có.',
            'status'                    => 'open',
        ]);

        $this->command->info("  ✅ Match Post 3: Player 5 tìm người (chưa có sân, 0 request)");
        $this->command->info("✅ Hoàn thành seed Bookings, MatchPosts, MatchRequests");
    }
}
