<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;


class LoginController extends Controller
{
    public function index()
    {
        return Inertia::render('Pages/Auth/Login');
    }
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            // Generate token or session as needed
            return Inertia::render('Pages/Dashboard', ['user' => $user]);
        }

        return response()->json([
            'message' => 'Invalid credentials',
        ], 401);
    }
    public function logout(Request $request)
    {
        Auth::logout();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
