<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed dữ liệu người dùng:
     *  - 1 Admin
     *  - 2 Owner (chủ sân)
     *  - 5 Player (người chơi)
     * Tất cả dùng mật khẩu 'password' để dễ test.
     */
    public function run(): void
    {
        // =====================================================================
        // 1. TÀI KHOẢN ADMIN
        // =====================================================================
        User::create([
            'name'              => 'Admin SmashMatch',
            'email'             => 'admin@smashmatch.vn',
            'password'          => Hash::make('password'),
            'role'              => 'admin',
            'rating_score'      => 5.0,
            'matches_played'    => 0,
            'email_verified_at' => now(),
        ]);

        $this->command->info('✅ Đã tạo tài khoản Admin: admin@smashmatch.vn / password');

        // =====================================================================
        // 2. TÀI KHOẢN OWNER (Chủ sân)
        // =====================================================================
        User::create([
            'name'              => 'Trần Văn Phúc',
            'email'             => 'owner1@smashmatch.vn',
            'password'          => Hash::make('password'),
            'role'              => 'owner',
            'rating_score'      => 4.8,
            'matches_played'    => 0,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name'              => 'Nguyễn Thị Hương',
            'email'             => 'owner2@smashmatch.vn',
            'password'          => Hash::make('password'),
            'role'              => 'owner',
            'rating_score'      => 4.6,
            'matches_played'    => 0,
            'email_verified_at' => now(),
        ]);

        $this->command->info('✅ Đã tạo 2 tài khoản Owner: owner1@smashmatch.vn, owner2@smashmatch.vn / password');

        // =====================================================================
        // 3. TÀI KHOẢN PLAYER (Người chơi)
        // =====================================================================
        $players = [
            [
                'name'           => 'Lê Minh Tuấn',
                'email'          => 'player1@smashmatch.vn',
                'rating_score'   => 4.5,
                'matches_played' => 23,
            ],
            [
                'name'           => 'Phạm Thị Lan',
                'email'          => 'player2@smashmatch.vn',
                'rating_score'   => 3.8,
                'matches_played' => 10,
            ],
            [
                'name'           => 'Hoàng Văn Đức',
                'email'          => 'player3@smashmatch.vn',
                'rating_score'   => 4.2,
                'matches_played' => 35,
            ],
            [
                'name'           => 'Võ Thị Bích Ngọc',
                'email'          => 'player4@smashmatch.vn',
                'rating_score'   => 4.7,
                'matches_played' => 48,
            ],
            [
                'name'           => 'Đinh Quốc Bảo',
                'email'          => 'player5@smashmatch.vn',
                'rating_score'   => 3.5,
                'matches_played' => 5,
            ],
        ];

        foreach ($players as $playerData) {
            User::create([
                ...$playerData,
                'password'          => Hash::make('password'),
                'role'              => 'player',
                'email_verified_at' => now(),
            ]);
        }

        $this->command->info('✅ Đã tạo 5 tài khoản Player: player1-5@smashmatch.vn / password');
    }
}
