<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MatchPostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $acceptedCount = $this->matchRequests ? $this->matchRequests->where('status', 'accepted')->count() : 0;
        $slotsRemaining = max(0, $this->slots_needed - $acceptedCount);

        return [
            'id'                        => $this->id,
            'user_id'                   => $this->user_id,
            'creator'                   => new UserResource($this->whenLoaded('user')),
            'booking_id'                => $this->booking_id,
            'booking'                   => new BookingResource($this->whenLoaded('booking')),
            'level_required'            => $this->level_required,
            'slots_needed'              => (int) $this->slots_needed,
            'slots_accepted_count'      => $acceptedCount,
            'slots_remaining'           => $slotsRemaining,
            'estimated_cost_per_person' => (float) $this->estimated_cost_per_person,
            'note'                      => $this->note,
            'status'                    => $this->status, // open, closed, completed
            'requests_count'            => $this->match_requests_count ?? ($this->matchRequests ? $this->matchRequests->count() : 0),
            'requests'                  => MatchRequestResource::collection($this->whenLoaded('matchRequests')),
            'created_at'                => $this->created_at?->toISOString(),
            'updated_at'                => $this->updated_at?->toISOString(),
        ];
    }
}
