<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Models\Court;
use App\Models\CourtSlot;
use App\Models\MatchPost;
use App\Models\MatchRequest;
use App\Models\Review;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class GenerateMockDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:mock-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Tạo dữ liệu giả lập (Mock Data) phong phú cho hệ thống SmashMatch';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info("🏸 Bắt đầu tạo dữ liệu giả lập cho SmashMatch...");

        // 1. Tạo thêm các người chơi tại Huế
        $playersData = [
            ['name' => 'Nguyễn Quốc Anh', 'email' => 'quocanh.hue@gmail.com', 'rating' => 4.8, 'matches' => 32],
            ['name' => 'Trần Thị Thu Thảo', 'email' => 'thuthao.badminton@gmail.com', 'rating' => 4.2, 'matches' => 19],
            ['name' => 'Đặng Hữu Phước', 'email' => 'huuphuoc.k22@gmail.com', 'rating' => 4.9, 'matches' => 54],
            ['name' => 'Bùi Minh Trí', 'email' => 'minhtri.clb@gmail.com', 'rating' => 3.9, 'matches' => 12],
        ];

        foreach ($playersData as $p) {
            User::firstOrCreate(
                ['email' => $p['email']],
                [
                    'name'           => $p['name'],
                    'password'       => Hash::make('password'),
                    'role'           => 'player',
                    'rating_score'   => $p['rating'],
                    'matches_played' => $p['matches'],
                ]
            );
        }
        $this->line("✅ Đã bổ sung 4 người chơi giả lập tại Huế.");

        // 2. Tạo thêm sân thứ 4: CLB Cầu Lông Kim Long
        $owner = User::where('role', 'owner')->first() ?? User::first();
        $kimLongCourt = Court::firstOrCreate(
            ['name' => 'CLB Cầu Lông Kim Long'],
            [
                'owner_id'    => $owner->id,
                'address'     => '105 Kim Long, Phường Kim Long, TP. Huế, Thừa Thiên Huế',
                'description' => 'Sân cầu lông ven bờ sông Hương thoáng mát. Mặt thảm PVC êm ái, bãi đỗ xe rộng rãi, phục vụ nước mía và nước dừa tươi giải khát sau trận đấu.',
                'is_active'   => true,
            ]
        );

        // Tạo slots cho 3 ngày liên tiếp
        for ($i = 0; $i < 3; $i++) {
            $date = Carbon::today()->addDays($i)->format('Y-m-d');
            $slots = [
                ['05:30:00', '07:00:00', 60000, 'available'],
                ['07:00:00', '08:30:00', 70000, 'booked'],
                ['17:30:00', '19:00:00', 120000, 'available'],
                ['19:00:00', '20:30:00', 120000, 'pending'],
                ['20:30:00', '22:00:00', 90000, 'available'],
            ];

            foreach ($slots as $s) {
                CourtSlot::firstOrCreate(
                    [
                        'court_id'   => $kimLongCourt->id,
                        'play_date'  => $date,
                        'start_time' => $s[0],
                    ],
                    [
                        'end_time' => $s[1],
                        'price'    => $s[2],
                        'status'   => $s[3],
                    ]
                );
            }
        }
        $this->line("✅ Đã bổ sung Sân Kim Long và các khung giờ slot hôm nay, ngày mai, ngày kia.");

        // 3. Tạo bài đăng ghép kèo giả lập đa dạng
        $player = User::where('role', 'player')->first();
        if ($player) {
            MatchPost::create([
                'user_id'                   => $player->id,
                'booking_id'                => null,
                'level_required'            => 'Khá',
                'slots_needed'              => 2,
                'estimated_cost_per_person' => 45000,
                'note'                      => 'Cuối tuần này giao lưu tại sân Kim Long hoặc Hương Giang. Nhóm có sẵn 2 cây vợt Kumpoo K520 Pro và Yonex Astrox 88D cho ai chưa có vợt mượn trải nghiệm.',
                'status'                    => 'open',
            ]);
        }
        $this->line("✅ Đã bổ sung bài đăng ghép kèo mẫu kèm dụng cụ vợt cầu lông.");

        $this->info("🎉 Dữ liệu giả lập (Mock Data) đã được tạo thành công!");
        return Command::SUCCESS;
    }
}
