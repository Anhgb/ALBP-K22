<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'reviewer_id' => $this->reviewer_id,
            'reviewer'    => new UserResource($this->whenLoaded('reviewer')),
            'reviewee_id' => $this->reviewee_id,
            'reviewee'    => new UserResource($this->whenLoaded('reviewee')),
            'court_id'    => $this->court_id,
            'court'       => new CourtResource($this->whenLoaded('court')),
            'score'       => (int) $this->score,
            'comment'     => $this->comment,
            'created_at'  => $this->created_at?->toISOString(),
        ];
    }
}
