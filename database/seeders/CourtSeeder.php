<?php

namespace Database\Seeders;

use App\Models\Court;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourtSeeder extends Seeder
{
    /**
     * Seed 6 sân cầu lông tại TP. Huế.
     * - Sân 1, 2, 4, 6: thuộc Owner 1 (Trần Văn Phúc)
     * - Sân 3, 5: thuộc Owner 2 (Nguyễn Thị Hương)
     */
    public function run(): void
    {
        $owner1 = User::where('email', 'owner1@smashmatch.vn')->first();
        $owner2 = User::where('email', 'owner2@smashmatch.vn')->first();

        $courts = [
            [
                'id'          => 1,
                'owner_id'    => $owner1->id,
                'name'        => 'Sân Cầu Lông Hương Giang',
                'address'     => '14 Lý Thường Kiệt, Phường Vĩnh Ninh, TP. Huế, Thừa Thiên Huế',
                'description' => 'Sân cầu lông chất lượng cao nằm ngay trung tâm TP. Huế. '
                               . 'Nền sàn gỗ tổng hợp PVC chống trơn trượt, hệ thống đèn LED chiếu sáng đồng đều 500 Lux. '
                               . 'Trang bị đầy đủ phòng thay đồ, tủ khóa cá nhân, có máy lạnh và cho thuê vợt Kumpoo, Yonex.',
                'is_active'   => true,
            ],
            [
                'id'          => 2,
                'owner_id'    => $owner1->id,
                'name'        => 'CLB Cầu Lông Thuận Hóa',
                'address'     => '56 Bà Triệu, Phường Phú Hòa, TP. Huế, Thừa Thiên Huế',
                'description' => 'Câu lạc bộ cầu lông lớn nhất khu vực Phú Hòa, gồm 4 sân tiêu chuẩn BWF. '
                               . 'Huấn luyện viên chuyên nghiệp hỗ trợ giao lưu. Hỗ trợ mượn vợt VS Titan 7 và cầu Yonex chất lượng.',
                'is_active'   => true,
            ],
            [
                'id'          => 3,
                'owner_id'    => $owner2->id,
                'name'        => 'Nhà Thi Đấu An Cựu Sport',
                'address'     => '88 Đinh Tiên Hoàng, Phường An Cựu, TP. Huế, Thừa Thiên Huế',
                'description' => 'Khu thể thao tổng hợp An Cựu Sport – điểm đến quen thuộc của các tay vợt phong trào Huế. '
                               . 'Sân cầu lông 3 ô, quạt trần công nghiệp đối lưu không khí, bãi đậu xe ô tô và xe máy rộng rãi.',
                'is_active'   => true,
            ],
            [
                'id'          => 4,
                'owner_id'    => $owner1->id,
                'name'        => 'Sân Cầu Lông Xuân Phú',
                'address'     => '22 Hoàng Quốc Việt, Phường Xuân Phú, TP. Huế, Thừa Thiên Huế',
                'description' => 'Sân mới khai trương thảm vân cát chống lật cổ chân cực êm. '
                               . 'Phục vụ trà đá miễn phí, có phòng tắm nóng lạnh cho vận động viên.',
                'is_active'   => true,
            ],
            [
                'id'          => 5,
                'owner_id'    => $owner2->id,
                'name'        => 'Sân Cầu Lông Vĩ Dạ Sport',
                'address'     => '102 Nguyễn Sinh Cung, Phường Vĩ Dạ, TP. Huế, Thừa Thiên Huế',
                'description' => 'Không gian thể thao thoáng đãng gần cồn Hến ven sông Hương. '
                               . '4 sân thảm Enlio nhập khẩu, trần cao 9m đạt chuẩn thi đấu giải phong trào.',
                'is_active'   => true,
            ],
            [
                'id'          => 6,
                'owner_id'    => $owner1->id,
                'name'        => 'CLB Cầu Lông Tây Lộc',
                'address'     => '75 Lê Duẩn, Phường Tây Lộc, TP. Huế, Thừa Thiên Huế',
                'description' => 'Gần cửa Thượng Tứ và Đại Nội Huế. Sân sàn gỗ Maple kết hợp thảm thi đấu chuẩn BWF, '
                               . 'phong trào giao lưu sôi nổi từ sáng sớm tới đêm muộn.',
                'is_active'   => true,
            ],
        ];

        foreach ($courts as $courtData) {
            Court::updateOrCreate(['id' => $courtData['id']], $courtData);
        }

        $this->command->info('✅ Đã tạo/cập nhật 6 sân cầu lông tại TP. Huế');
    }
}
