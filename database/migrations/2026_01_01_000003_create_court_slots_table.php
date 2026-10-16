<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tạo bảng court_slots - phụ thuộc courts (court_id).
     * Một slot là một khung giờ cụ thể của một sân vào một ngày.
     */
    public function up(): void
    {
        Schema::create('court_slots', function (Blueprint $table) {
            $table->id();

            // Sân - FK đến courts
            $table->foreignId('court_id')
                  ->constrained('courts')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete(); // Xóa sân thì xóa toàn bộ slot

            // Ngày chơi
            $table->date('play_date');

            // Giờ bắt đầu và kết thúc
            $table->time('start_time');
            $table->time('end_time');

            // Giá thuê sân cho slot này
            $table->decimal('price', 10, 2);

            // Trạng thái: available (còn trống), pending (đang giữ chỗ), booked (đã đặt)
            $table->enum('status', ['available', 'pending', 'booked'])->default('available');

            $table->timestamps();

            // Index tổng hợp để tìm kiếm lịch sân theo ngày nhanh hơn
            $table->index(['court_id', 'play_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('court_slots');
    }
};
