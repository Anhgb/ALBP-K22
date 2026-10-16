<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourtSlotResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'play_date'  => $this->play_date->format('Y-m-d'),
            'start_time' => $this->start_time,
            'end_time'   => $this->end_time,
            'price'      => (float) $this->price,
            'status'     => $this->status,
            // Gợi ý cho frontend để disable nút "Đặt sân"
            'is_bookable' => $this->status === 'available',
        ];
    }
}
