<?php

use Illuminate\Support\Facades\Route;

// Route mặc định cho web (không dùng nhiều vì đây là API-only project)
Route::get('/', function () {
    return response()->json([
        'app'     => config('app.name'),
        'version' => '1.0.0',
        'docs'    => url('/api/v1'),
        'status'  => 'running',
    ]);
});
