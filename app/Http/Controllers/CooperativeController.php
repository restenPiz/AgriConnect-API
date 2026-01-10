<?php

namespace App\Http\Controllers;
use App\Models\Cooperative;
use Illuminate\Http\Request;

class CooperativeController extends Controller
{
    public function index()
    {
        $cooperatives = Cooperative::with('coordinator')
            ->withCount('members')
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('Pages/Cooperative', [
            'cooperatives' => $cooperatives,
        ]);
    }
}
