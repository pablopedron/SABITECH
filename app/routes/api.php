<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/health', function () {
    DB::connection()->getPdo();
    return response()->json([
        'estado' => 'ok',
        'base_de_datos' => DB::connection()->getDatabaseName(),
    ]);
});

