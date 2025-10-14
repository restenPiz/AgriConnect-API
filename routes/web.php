<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LoginController;

Route::get('/', [LoginController::class, 'index']);
