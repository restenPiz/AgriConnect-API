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
        // Validate input
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ], [
            'email.required' => 'Email is required',
            'email.email' => 'Please enter a valid email address',
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 6 characters',
        ]);

        // Attempt authentication
        if (Auth::attempt($request->only('email', 'password'), $request->remember)) {
            $request->session()->regenerate();
            return redirect()->intended('/dashboard');
        }

        // Authentication failed - redirect back with error
        return back()
            ->withErrors([
                'email' => 'Invalid credentials. Please check your email.',
                'password' => 'Invalid credentials. Please check your password.',
            ])
            ->withInput($request->only('email', 'password'));
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
