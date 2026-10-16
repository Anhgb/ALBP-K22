<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'email'          => $this->email,
            'role'           => $this->role,
            'rating_score'   => (float) $this->rating_score,
            'matches_played' => (int) $this->matches_played,
            'created_at'     => $this->created_at?->toISOString(),
        ];
    }
}
