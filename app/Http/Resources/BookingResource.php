<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Biến đổi Booking model thành JSON response chuẩn.
     * Luôn eager load: courtSlot.court, user khi dùng Resource này.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'checkin_code'   => $this->checkin_code,
            'total_price'    => (float) $this->total_price,
            'payment_status' => $this->payment_status,
            'created_at'     => $this->created_at?->toISOString(),

            // Thông tin người đặt
            'user' => $this->whenLoaded('user', fn () => [
                'id'   => $this->user->id,
                'name' => $this->user->name,
            ], [
                'id'   => $this->user_id,
                'name' => null,
            ]),

            // Thông tin slot & sân
            'court_slot' => $this->whenLoaded('courtSlot', fn () => [
                'id'         => $this->courtSlot->id,
                'play_date'  => $this->courtSlot->play_date instanceof \DateTimeInterface
                    ? $this->courtSlot->play_date->format('Y-m-d')
                    : $this->courtSlot->play_date,
                'start_time' => $this->courtSlot->start_time,
                'end_time'   => $this->courtSlot->end_time,
                'status'     => $this->courtSlot->status,
                'court'      => $this->courtSlot->relationLoaded('court') && $this->courtSlot->court ? [
                    'id'      => $this->courtSlot->court->id,
                    'name'    => $this->courtSlot->court->name,
                    'address' => $this->courtSlot->court->address,
                ] : null,
            ]),
        ];
    }
}
