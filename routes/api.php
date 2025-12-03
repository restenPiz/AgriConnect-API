<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CooperativeController;

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
Route::get('/productEdit/{id}', [ProductController::class, 'edit']);
Route::post('/productUpdate/{id}', [ProductController::class, 'update']);
Route::delete('/productDelete/{id}', [ProductController::class, 'destroy']);

//*Cooperative Routes
Route::get('/cooperative', [CooperativeController::class, 'index']);
Route::post('/cooperatives', [CooperativeController::class, 'store']);
Route::get('/cooperatives/{id}', [CooperativeController::class, 'show']);
Route::post('/cooperatives/{id}', [CooperativeController::class, 'update']);
Route::delete('/cooperatives/{id}', [CooperativeController::class, 'destroy']);

// Cooperative Members
Route::get('/cooperatives/{id}/members', [CooperativeController::class, 'getMembers']);
Route::post('/cooperatives/{id}/members', [CooperativeController::class, 'addMember']);
Route::delete('/cooperatives/{id}/members/{memberId}', [CooperativeController::class, 'removeMember']);

// Available Farmers (for adding to cooperatives)
Route::get('/farmers/available', function () {
    $farmers = \App\Models\User::where('user_type', 'farmer')
        ->select('id', 'name', 'email')
        ->get();
    return response()->json(['success' => true, 'data' => $farmers]);
});
