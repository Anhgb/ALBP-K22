<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tạo bảng reviews - phụ thuộc users và courts.
     * Hỗ trợ 2 loại đánh giá: đánh giá người chơi (reviewee_id) hoặc đánh giá sân (court_id).
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();

            // Người viết đánh giá - FK đến users
            $table->foreignId('reviewer_id')
                  ->constrained('users')
                  ->cascadeOnUpdate()
                  ->restrictOnDelete();

            // Người được đánh giá (nullable - chỉ dùng khi đánh giá người chơi)
            $table->foreignId('reviewee_id')
                  ->nullable()
                  ->constrained('users')
                  ->cascadeOnUpdate()
                  ->nullOnDelete();

            // Sân được đánh giá (nullable - chỉ dùng khi đánh giá sân)
            $table->foreignId('court_id')
                  ->nullable()
                  ->constrained('courts')
                  ->cascadeOnUpdate()
                  ->nullOnDelete();

            // Điểm đánh giá từ 1 đến 5
            $table->unsignedTinyInteger('score');

            // Nội dung đánh giá
            $table->text('comment')->nullable();

            $table->timestamps();

            // Index để tìm đánh giá theo người/sân
            $table->index('reviewee_id');
            $table->index('court_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
