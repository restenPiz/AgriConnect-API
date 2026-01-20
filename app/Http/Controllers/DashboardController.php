<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProducts = Product::count();

        // Count farmers
        $totalFarmers = User::where('user_type', 'farmer')->count();

        // Count cooperatives
        $totalCooperatives = DB::table('cooperatives')->count();

        return inertia('Pages/Dashboard', [
            'totalProducts' => $totalProducts,
            'totalFarmers' => $totalFarmers,
            'totalCooperatives' => $totalCooperatives,
        ]);
    }
}
