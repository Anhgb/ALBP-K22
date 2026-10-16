<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    /**
     * Trạng thái mặc định của model.
     * Tạo tài khoản Player với dữ liệu ngẫu nhiên.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Danh sách tên tiếng Việt phổ biến
        $vietnameseNames = [
            'Nguyễn Văn Hùng', 'Trần Thị Mai', 'Lê Minh Tuấn', 'Phạm Thị Lan',
            'Hoàng Văn Đức', 'Võ Thị Hoa', 'Đặng Minh Khoa', 'Bùi Thị Thu',
            'Đinh Văn Thắng', 'Ngô Thị Hằng', 'Trương Minh Tú', 'Lý Thị Bích',
        ];

        return [
            'name'              => $this->faker->randomElement($vietnameseNames),
            'email'             => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => Hash::make('password'), // Mật khẩu mặc định dễ nhớ
            'role'              => 'player',
            'rating_score'      => $this->faker->randomFloat(1, 3.0, 5.0),
            'matches_played'    => $this->faker->numberBetween(0, 50),
            'remember_token'    => Str::random(10),
        ];
    }

    /**
     * Trạng thái: Tài khoản chủ sân (owner).
     */
    public function owner(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'owner',
        ]);
    }

    /**
     * Trạng thái: Tài khoản quản trị viên (admin).
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role'           => 'admin',
            'rating_score'   => 5.0,
            'matches_played' => 0,
        ]);
    }

    /**
     * Trạng thái: Email chưa được xác minh.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
