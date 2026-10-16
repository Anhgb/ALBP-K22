<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Đăng ký các service vào container.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap các service của ứng dụng.
     */
    public function boot(): void
    {
        // ── Eloquent Strict Mode ──────────────────────────────────────────────
        // Bật strict mode trong development để phát hiện sớm các lỗi N+1,
        // lazy loading, và mass assignment không khai báo trong $fillable.
        Model::shouldBeStrict(! app()->isProduction());

        // ── Ngăn lazy loading (N+1 problem) ──────────────────────────────────
        // Bắt buộc phải eager load relationships, tránh truy vấn N+1.
        Model::preventLazyLoading(! app()->isProduction());

        // ── Ngăn truy cập thuộc tính không tồn tại trong Model ───────────────
        Model::preventAccessingMissingAttributes(! app()->isProduction());
    }
}
