<?php

use App\Http\Controllers\AnalyticController;
use App\Http\Controllers\FarmerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CooperativeController;

//*First route
Route::get('/', [LoginController::class, 'index'])->name('login');

//*Authentication routes
Route::post('/login', [LoginController::class, 'login']);

//*User Authenticated routes
Route::middleware('auth')->group(function () {
    Route::get('/logout', [LoginController::class, 'logout']);

    Route::get('/dashboard', function () {
        return Inertia::render('Pages/Dashboard');
    })->name('dashboard');

    //*Product, Farmers, Anylitcs and Cooperative routs
    Route::get('/product', [ProductController::class, 'index']);

    Route::get('/farmers', [FarmerController::class, 'index']);

    Route::get('/analytics', [AnalyticController::class, 'index']);

    Route::get('/cooperatives', [CooperativeController::class, 'index']);

    Route::get('/cooperativesM/{cooperative}', [CooperativeController::class, 'show']);
});

