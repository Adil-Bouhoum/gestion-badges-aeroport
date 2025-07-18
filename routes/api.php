<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UsersController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BadgeRequestController;
use App\Http\Controllers\Api\BadgeController;

// Public routes (login/register)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes (Sanctum authenticated)
Route::middleware('auth:sanctum')->group(function () {

    // Authenticated user profile
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // ✅ User badge request routes
    Route::get('/badge-requests', [BadgeRequestController::class, 'index']);
    Route::post('/badge-requests', [BadgeRequestController::class, 'store']);

    // ✅ Badge creation route (Admin only)
    Route::post('/badges', [BadgeController::class, 'store']);

    // ✅ Admin-only routes
    Route::middleware('admin')->group(function () {
        // User management (Admin only)
        Route::apiResource('users', UsersController::class);

        // Badge request status validation (Admin only)
        Route::put('/badge-requests/{id}/status', [BadgeRequestController::class, 'updateStatus']);
    });
});
