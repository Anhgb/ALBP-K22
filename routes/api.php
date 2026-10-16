<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BookingController;
use App\Http\Controllers\Api\V1\CourtController;
use App\Http\Controllers\Api\V1\MatchPostController;
use App\Http\Controllers\Api\V1\MatchRequestController;
use App\Http\Controllers\Api\V1\ReviewController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - SmashMatch v1
|--------------------------------------------------------------------------
| Tiền tố: /api/v1
| Authentication: Laravel Sanctum (Bearer Token)
|
| PHÂN QUYỀN:
|   - Public: Không cần đăng nhập
|   - auth:sanctum: Bắt buộc đăng nhập
|
*/

Route::prefix('v1')->name('v1.')->group(function () {

    // =========================================================================
    // 🔓 PUBLIC ROUTES - Không cần đăng nhập
    // =========================================================================

    // ── Authentication ───────────────────────────────────────────────────────
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('register', [AuthController::class, 'register'])->name('register');
        Route::post('login',    [AuthController::class, 'login'])->name('login');
    });

    // ── Courts (Xem danh sách sân, chi tiết & lịch khung giờ) ─────────────────
    Route::prefix('courts')->name('courts.')->group(function () {
        Route::get('/',                  [CourtController::class, 'index'])->name('index');
        Route::get('/{court}',           [CourtController::class, 'show'])->name('show');
        Route::get('/{court}/slots',     [CourtController::class, 'slots'])->name('slots');
    });

    // ── Matchmaking Board (Xem danh sách kèo đang mở) ────────────────────────
    Route::prefix('matches')->name('matches.')->group(function () {
        Route::get('/',      [MatchPostController::class, 'index'])->name('index');
        Route::get('/{id}',  [MatchPostController::class, 'show'])->whereNumber('id')->name('show');
    });

    // ── Reviews (Xem đánh giá sân hoặc người chơi) ───────────────────────────
    Route::get('reviews', [ReviewController::class, 'index'])->name('reviews.index');


    // =========================================================================
    // 🔒 PROTECTED ROUTES - Bắt buộc đăng nhập (Sanctum)
    // =========================================================================
    Route::middleware('auth:sanctum')->group(function () {

        // ── Auth cá nhân ─────────────────────────────────────────────────────
        Route::prefix('auth')->name('auth.')->group(function () {
            Route::post('logout', [AuthController::class, 'logout'])->name('logout');
            Route::get('me',      [AuthController::class, 'me'])->name('me');
        });

        // ── Bookings ─────────────────────────────────────────────────────────
        Route::prefix('bookings')->name('bookings.')->group(function () {
            Route::get('/',          [BookingController::class, 'index'])->name('index');
            Route::post('/',         [BookingController::class, 'store'])->name('store');
            Route::get('/{booking}', [BookingController::class, 'show'])->name('show');
        });

        // ── Matchmaking Flow (Tạo kèo, Tham gia & Phê duyệt) ─────────────────
        Route::prefix('matches')->name('matches.')->group(function () {
            // Tạo bài đăng ghép kèo mới
            Route::post('/', [MatchPostController::class, 'store'])->name('store');

            // Gửi yêu cầu tham gia (Join request)
            Route::post('/{post_id}/requests', [MatchRequestController::class, 'store'])
                ->whereNumber('post_id')
                ->name('requests.store');

            // Chủ kèo duyệt / từ chối yêu cầu tham gia
            Route::put('/{post_id}/requests/{request_id}', [MatchRequestController::class, 'updateStatus'])
                ->whereNumber('post_id')
                ->whereNumber('request_id')
                ->name('requests.update_status');
        });

        // Xem các bài đăng & yêu cầu của chính user hiện tại
        Route::get('my-matches',        [MatchPostController::class, 'myPosts'])->name('my_matches');
        Route::get('my-match-requests', [MatchRequestController::class, 'myRequests'])->name('my_match_requests');

        // ── Reviews ──────────────────────────────────────────────────────────
        Route::post('reviews', [ReviewController::class, 'store'])->name('reviews.store');

    });

    // =========================================================================
    // 🔔 WEBHOOK ROUTES - Payment Gateway (Momo, VNPAY, VNPost...)
    // =========================================================================
    Route::prefix('webhooks')->name('webhooks.')->group(function () {
        Route::post('payment', [BookingController::class, 'paymentWebhook'])->name('payment');
    });

});
