<?php

define('LARAVEL_START', microtime(true));

// Tắt hiển thị deprecation warning để tránh làm hỏng JSON response trong PHP 8.5+
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);
ini_set('display_errors', '0');

// Kiểm tra maintenance mode...
if (file_exists($maintenance = __DIR__ . '/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Nạp Composer autoloader...
require __DIR__ . '/../vendor/autoload.php';

// Bootstrap Laravel và xử lý request...
(require_once __DIR__ . '/../bootstrap/app.php')
    ->handleRequest(Illuminate\Http\Request::capture());
