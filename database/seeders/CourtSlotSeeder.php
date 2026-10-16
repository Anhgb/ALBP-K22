<?php

namespace Database\Seeders;

use App\Models\Court;
use App\Models\CourtSlot;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class CourtSlotSeeder extends Seeder
{
    /**
     * Seed CourtSlot cho 14 ngày liên tiếp (hôm nay + 13 ngày tới), cho tất cả các sân.
     *
     * 12 khung giờ cố định từ sáng sớm tới đêm muộn:
     *   - Buổi sáng:  05:30-07:00, 07:00-08:30, 08:30-10:00, 10:00-11:30
     *   - Buổi chiều: 12:30-14:00, 14:00-15:30, 15:30-17:00, 17:00-18:30
     *   - Buổi tối:   18:30-20:00, 20:00-21:30, 21:30-22:45, 22:45-23:45
     */
    public function run(): void
    {
        $timeSlots = [
            // Buổi sáng - giá ưu đãi thể dục
            ['start' => '05:30:00', 'end' => '07:00:00', 'price' => 60000,  'session' => 'morning'],
            ['start' => '07:00:00', 'end' => '08:30:00', 'price' => 70000,  'session' => 'morning'],
            ['start' => '08:30:00', 'end' => '10:00:00', 'price' => 70000,  'session' => 'morning'],
            ['start' => '10:00:00', 'end' => '11:30:00', 'price' => 60000,  'session' => 'morning'],

            // Buổi chiều
            ['start' => '12:30:00', 'end' => '14:00:00', 'price' => 60000,  'session' => 'afternoon'],
            ['start' => '14:00:00', 'end' => '15:30:00', 'price' => 80000,  'session' => 'afternoon'],
            ['start' => '15:30:00', 'end' => '17:00:00', 'price' => 90000,  'session' => 'afternoon'],
            ['start' => '17:00:00', 'end' => '18:30:00', 'price' => 120000, 'session' => 'afternoon'], // Giờ tan tầm

            // Buổi tối - giờ vàng cao điểm
            ['start' => '18:30:00', 'end' => '20:00:00', 'price' => 140000, 'session' => 'evening'],
            ['start' => '20:00:00', 'end' => '21:30:00', 'price' => 140000, 'session' => 'evening'],
            ['start' => '21:30:00', 'end' => '22:45:00', 'price' => 90000,  'session' => 'evening'],
            ['start' => '22:45:00', 'end' => '23:45:00', 'price' => 70000,  'session' => 'evening'],
        ];

        // 14 ngày từ hôm nay
        $dates = [];
        for ($i = 0; $i < 14; $i++) {
            $dates[] = Carbon::today()->addDays($i)->toDateString();
        }

        $courts = Court::all();
        $totalCreated = 0;

        foreach ($courts as $court) {
            foreach ($dates as $dayIndex => $date) {
                foreach ($timeSlots as $slotIndex => $slot) {
                    // Tạo status chân thực (available, booked, pending)
                    $isPeak = ($slot['session'] === 'evening') || ($slot['start'] === '17:00:00');
                    $seed = ($court->id * 17 + $dayIndex * 13 + $slotIndex * 7) % 100;

                    $status = 'available';
                    if ($dayIndex <= 2) {
                        // 3 ngày đầu tiên có tỷ lệ đặt và giữ chỗ cao hơn
                        if ($isPeak) {
                            if ($seed < 40) $status = 'booked';
                            elseif ($seed < 60) $status = 'pending';
                        } else {
                            if ($seed < 20) $status = 'booked';
                            elseif ($seed < 30) $status = 'pending';
                        }
                    }

                    CourtSlot::updateOrCreate(
                        [
                            'court_id'   => $court->id,
                            'play_date'  => $date,
                            'start_time' => $slot['start'],
                        ],
                        [
                            'end_time'   => $slot['end'],
                            'price'      => $slot['price'],
                            'status'     => $status,
                        ]
                    );

                    $totalCreated++;
                }
            }

            $this->command->info("  → Đã tạo slots 14 ngày cho sân: {$court->name}");
        }

        $this->command->info("✅ Tổng cộng đã cập nhật {$totalCreated} court slots cho 14 ngày.");
    }
}
