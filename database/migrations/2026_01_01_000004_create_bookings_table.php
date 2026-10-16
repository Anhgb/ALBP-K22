<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tạo bảng bookings - phụ thuộc users và court_slots.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            // Người đặt sân - FK đến users
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnUpdate()
                  ->restrictOnDelete();

            // Slot được đặt - FK đến court_slots (mỗi slot chỉ được đặt 1 lần)
            $table->foreignId('court_slot_id')
                  ->unique() // Đảm bảo mỗi slot chỉ có 1 booking
                  ->constrained('court_slots')
                  ->cascadeOnUpdate()
                  ->restrictOnDelete();

            // Tổng tiền thanh toán
            $table->decimal('total_price', 10, 2);

            // Trạng thái thanh toán
            $table->enum('payment_status', ['unpaid', 'paid', 'refunded'])->default('unpaid');

            // Mã check-in duy nhất (dùng UUID hoặc chuỗi ngẫu nhiên)
            $table->string('checkin_code')->unique()->nullable();

            $table->timestamps();

            // Index để tìm booking theo user nhanh hơn
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
