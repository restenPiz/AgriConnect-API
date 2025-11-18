<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;

//*Start with the api Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//* Protected routes - Requires authentication
Route::middleware('auth:sanctum')->group(function () {

    //*Authentication Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/userData/{id}', [AuthController::class, 'user']);
    Route::post('/user/profile', [AuthController::class, 'updateProfile']);

});

//*Product Routes
Route::post('/storeProduct', [ProductController::class, 'store']);
Route::get('/product/{id}', [ProductController::class, 'getByFarmer']);
