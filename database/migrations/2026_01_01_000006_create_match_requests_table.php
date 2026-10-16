<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tạo bảng match_requests - phụ thuộc match_posts và users.
     * Đây là yêu cầu xin tham gia một bài đăng ghép kèo.
     */
    public function up(): void
    {
        Schema::create('match_requests', function (Blueprint $table) {
            $table->id();

            // Bài đăng ghép kèo - FK đến match_posts
            $table->foreignId('post_id')
                  ->constrained('match_posts')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete(); // Xóa bài đăng thì xóa toàn bộ yêu cầu

            // Người gửi yêu cầu tham gia - FK đến users
            $table->foreignId('requester_id')
                  ->constrained('users')
                  ->cascadeOnUpdate()
                  ->restrictOnDelete();

            // Trạng thái yêu cầu
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');

            $table->timestamps();

            // Đảm bảo mỗi người chỉ gửi 1 yêu cầu cho 1 bài đăng
            $table->unique(['post_id', 'requester_id']);

            // Index để tìm yêu cầu theo người gửi
            $table->index('requester_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('match_requests');
    }
};
