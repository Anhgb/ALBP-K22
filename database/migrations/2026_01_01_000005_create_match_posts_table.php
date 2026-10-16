<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tạo bảng match_posts - phụ thuộc users và bookings.
     * Đây là bài đăng ghép kèo của người chơi.
     */
    public function up(): void
    {
        Schema::create('match_posts', function (Blueprint $table) {
            $table->id();

            // Người tạo bài đăng - FK đến users
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnUpdate()
                  ->restrictOnDelete();

            // Booking kèm theo (nullable - có thể đăng ghép kèo mà chưa có sân)
            $table->foreignId('booking_id')
                  ->nullable()
                  ->constrained('bookings')
                  ->cascadeOnUpdate()
                  ->nullOnDelete();

            // Trình độ yêu cầu (VD: "Mới bắt đầu", "Trung bình", "Cao thủ")
            $table->string('level_required');

            // Số slot còn cần thêm người
            $table->unsignedTinyInteger('slots_needed');

            // Chi phí ước tính mỗi người
            $table->decimal('estimated_cost_per_person', 10, 2)->nullable();

            // Ghi chú thêm (VD: có vợt Kumpoo K520 Pro cho mượn)
            $table->text('note')->nullable();

            // Trạng thái bài đăng
            $table->enum('status', ['open', 'closed', 'completed'])->default('open');

            $table->timestamps();

            // Index để lọc bài đăng theo trạng thái nhanh hơn
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('match_posts');
    }
};
