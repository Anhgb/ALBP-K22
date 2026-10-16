<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed toàn bộ dữ liệu cho ứng dụng SmashMatch.
     *
     * THỨ TỰ CHẠY PHẢI TUÂN THEO FOREIGN KEY CONSTRAINTS:
     * ┌─────────────────────┬──────────────────────────────────────────────┐
     * │ Bước │ Seeder        │ Lý do thứ tự                                │
     * ├──────┼───────────────┼──────────────────────────────────────────────┤
     * │  1   │ UserSeeder    │ Không có FK, tạo trước                       │
     * │  2   │ CourtSeeder   │ FK → users (owner_id)                        │
     * │  3   │ CourtSlotSeeder│ FK → courts (court_id)                      │
     * │  4   │ MatchDataSeeder│ FK → users, court_slots, bookings, match_posts│
     * │  5   │ ReviewSeeder  │ FK → users, courts (cần data ở trên)         │
     * └──────┴───────────────┴──────────────────────────────────────────────┘
     *
     * TÀI KHOẢN DEMO (tất cả dùng password: 'password'):
     * ─────────────────────────────────────────────────
     *   Admin  : admin@smashmatch.vn
     *   Owner 1: owner1@smashmatch.vn   (sở hữu Sân 1 & 2)
     *   Owner 2: owner2@smashmatch.vn   (sở hữu Sân 3)
     *   Player : player1-5@smashmatch.vn
     */
    public function run(): void
    {
        $this->command->info('');
        $this->command->info('╔══════════════════════════════════════════╗');
        $this->command->info('║   🏸  SmashMatch - Database Seeding      ║');
        $this->command->info('╚══════════════════════════════════════════╝');
        $this->command->info('');

        // ── Bước 1: Users ────────────────────────────────────────────────────
        $this->command->info('📌 [1/5] Seeding Users...');
        $this->call(UserSeeder::class);
        $this->command->info('');

        // ── Bước 2: Courts ───────────────────────────────────────────────────
        $this->command->info('📌 [2/5] Seeding Courts (sân tại TP. Huế)...');
        $this->call(CourtSeeder::class);
        $this->command->info('');

        // ── Bước 3: Court Slots ──────────────────────────────────────────────
        $this->command->info('📌 [3/5] Seeding Court Slots (hôm nay & ngày mai)...');
        $this->call(CourtSlotSeeder::class);
        $this->command->info('');

        // ── Bước 4: Bookings, MatchPosts, MatchRequests ──────────────────────
        $this->command->info('📌 [4/5] Seeding Bookings, Match Posts & Requests...');
        $this->call(MatchDataSeeder::class);
        $this->command->info('');

        // ── Bước 5: Reviews ──────────────────────────────────────────────────
        $this->command->info('📌 [5/5] Seeding Reviews...');
        $this->call(ReviewSeeder::class);
        $this->command->info('');

        // ── Tổng kết ─────────────────────────────────────────────────────────
        $this->command->info('╔══════════════════════════════════════════╗');
        $this->command->info('║   ✅  Seeding hoàn thành thành công!     ║');
        $this->command->info('╠══════════════════════════════════════════╣');
        $this->command->info('║  Chạy lệnh để test:                      ║');
        $this->command->info('║  php artisan migrate:fresh --seed         ║');
        $this->command->info('╠══════════════════════════════════════════╣');
        $this->command->info('║  Tài khoản demo (password: password):    ║');
        $this->command->info('║  • admin@smashmatch.vn  (Admin)          ║');
        $this->command->info('║  • owner1@smashmatch.vn (Owner - 2 sân) ║');
        $this->command->info('║  • owner2@smashmatch.vn (Owner - 1 sân) ║');
        $this->command->info('║  • player1@smashmatch.vn ... player5     ║');
        $this->command->info('╚══════════════════════════════════════════╝');
    }
}
