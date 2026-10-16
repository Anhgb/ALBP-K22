<?php

namespace Database\Factories;

use App\Models\MatchPost;
use App\Models\MatchRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MatchRequest>
 */
class MatchRequestFactory extends Factory
{
    protected $model = MatchRequest::class;

    /**
     * Trạng thái mặc định: Yêu cầu đang chờ duyệt.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'post_id'      => MatchPost::factory(),
            'requester_id' => User::factory(),
            'status'       => 'pending',
        ];
    }

    /**
     * Trạng thái: Đã được chấp nhận.
     */
    public function accepted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'accepted',
        ]);
    }

    /**
     * Trạng thái: Đã bị từ chối.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
        ]);
    }
}
