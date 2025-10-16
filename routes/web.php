<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LoginController;

//*First route
Route::get('/', [LoginController::class, 'index']);

//*Authentication routes
Route::post('/login', [LoginController::class, 'login']);

//*User Authenticated routes
Route::middleware('auth')->group(function () {
    Route::get('/logout', [LoginController::class, 'logout']);

    Route::get('/dashboard', function () {
        return Inertia::render('Pages/Dashboard', ['auth' => auth()->user()]);
    })->name('dashboard');
});

