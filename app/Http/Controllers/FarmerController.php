<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class FarmerController extends Controller
{
    public function index()
    {
        $farmers = User::where('user_type', 'farmer')
            ->where('name', '!=', 'Admin')
            ->get();


        return inertia('Pages/Farmer', [
            'farmers' => $farmers,
        ]);
    }
}
