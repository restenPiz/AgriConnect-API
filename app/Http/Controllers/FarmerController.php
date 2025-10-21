<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FarmerController extends Controller
{
    public function index()
    {
        return inertia('Pages/Farmer');
    }
}
