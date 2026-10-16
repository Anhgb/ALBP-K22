<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourtResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'address'        => $this->address,
            'description'    => $this->description,
            'is_active'      => $this->is_active,
            'average_rating' => $this->reviews_avg_score
                                    ? round((float) $this->reviews_avg_score, 1)
                                    : null,
            'reviews_count'  => $this->reviews_count ?? 0,
            'owner'          => $this->whenLoaded('owner', fn () => [
                'id'   => $this->owner->id,
                'name' => $this->owner->name,
            ]),
        ];
    }
}
