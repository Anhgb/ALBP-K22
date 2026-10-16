<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    | Cấu hình CORS để cho phép frontend React (Vite :5173) gọi API Laravel.
    | Trong production, thay 'localhost:5173' bằng domain thật của frontend.
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'webhooks/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',      // Vite dev server
        'http://localhost:3000',      // Dự phòng nếu dùng CRA
        'http://127.0.0.1:5173',
        // Production: thêm 'https://smashmatch.vn' ở đây
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // false vì dùng Token-based (Sanctum), không phải cookie/session
    'supports_credentials' => false,

];
