<?php

namespace App\Http\Controllers;

use Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


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
            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
            ]);
        }

        return response()->json([
            'message' => 'Invalid credentials',
        ], 401);
    }

    /**
     * Log the user out of the application.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
