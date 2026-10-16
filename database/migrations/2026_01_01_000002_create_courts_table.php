<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tạo bảng courts - phụ thuộc users (owner_id).
     */
    public function up(): void
    {
        Schema::create('courts', function (Blueprint $table) {
            $table->id();

            // Chủ sân - FK đến users
            $table->foreignId('owner_id')
                  ->constrained('users')
                  ->cascadeOnUpdate()
                  ->restrictOnDelete();

            $table->string('name');
            $table->string('address');
            $table->text('description')->nullable();

            // Trạng thái hoạt động của sân
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courts');
    }
};
