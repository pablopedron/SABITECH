<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\TalkController;
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

    // --- Reservas (feature/reservas) ---
    Route::post('/talks/{id}/inscribe', [ReservationController::class, 'store'])->whereNumber('id');
    Route::get('/me/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations/{id}/cancel', [ReservationController::class, 'cancel'])->whereNumber('id');

    // --- QR de asistencia (prototipo del checkpoint) ---
    Route::get('/reservations/{id}/qr', [AttendanceController::class, 'qr'])->whereNumber('id');
    Route::post('/attendances/scan', [AttendanceController::class, 'scan'])->middleware('role:personal_acceso');

    // --- Organización: el permiso se comprueba aquí, en el servidor ---
    Route::get('/talks/{id}/reservations', [TalkController::class, 'reservations'])
        ->whereNumber('id')
        ->middleware('role:organizacion');
});

// --- Catálogo (feature/catalogo): público, sin token ---
Route::get('/talks', [TalkController::class, 'index']);
Route::get('/talks/{id}', [TalkController::class, 'show'])->whereNumber('id');
