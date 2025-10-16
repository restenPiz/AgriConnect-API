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
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Debug: Check if user exists
        $user = \App\Models\User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found with this email',
                'email' => $request->email,
            ], 404);
        }

        if (Auth::attempt($request->only('email', 'password'))) {
            return redirect()->intended('/dashboard');
        } else {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }
    }
    public function logout(Request $request)
    {
        Auth::logout();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
