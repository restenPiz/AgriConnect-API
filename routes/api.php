<?php

use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//*Start with the api Routes
Route::get('/createAccount', [UserController::class, 'store'])->name('createAccount');
