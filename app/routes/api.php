<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    DB::connection()->getPdo();
    return response()->json([
        'estado' => 'ok',
        'base_de_datos' => DB::connection()->getDatabaseName(),
    ]);
});

// --- Autenticación (feature/auth) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// --- Catálogo (feature/catalogo) ---
