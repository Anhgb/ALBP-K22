<?php

error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);
ini_set('display_errors', '0');

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        // File routes/web.php cho web (nếu có)
        web: __DIR__ . '/../routes/web.php',
        // File routes/api.php cho API với prefix /api tự động
        api: __DIR__ . '/../routes/api.php',
        // File routes/console.php cho scheduled commands
        commands: __DIR__ . '/../routes/console.php',
        // Health check endpoint tích hợp sẵn
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // ── API Middleware ────────────────────────────────────────────────────
        $middleware->api(prepend: [
            // Cho phép Sanctum stateful requests (cookie-based) nếu cần
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        // ── Alias Middleware ──────────────────────────────────────────────────
        $middleware->alias([
            'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        ]);

        // ── CORS: Cho phép frontend React (localhost:5173) gọi API ────────────
        $middleware->validateCsrfTokens(except: [
            'api/*',          // Bỏ CSRF cho toàn bộ API routes
            'webhooks/*',     // Bỏ CSRF cho webhook từ payment gateway
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // ── Tùy chỉnh response lỗi cho API (trả JSON thay vì HTML) ───────────
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ.',
                    'errors'  => $e->errors(),
                ], 422);
            }
        });

        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chưa xác thực. Vui lòng đăng nhập.',
                ], 401);
            }
        });

        $exceptions->render(function (\Illuminate\Auth\Access\AuthorizationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn không có quyền thực hiện hành động này.',
                ], 403);
            }
        });

        $exceptions->render(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e, Request $request) {
            if ($request->is('api/*')) {
                $model = class_basename($e->getModel());
                return response()->json([
                    'success' => false,
                    'message' => "Không tìm thấy {$model}.",
                ], 404);
            }
        });
    })
    ->create();
