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
    public function show(Cooperative $cooperative)
    {
        $cooperative = Cooperative::with(['members.farmer', 'coordinator'])
            ->findOrFail($cooperative->id);

        // Map members into the shape the frontend expects
        $members = $cooperative->members->map(function ($m) {
            $farmer = $m->farmer;
            return [
                'id' => $m->id,
                'farmer_id' => $m->farmer_id,
                'name' => $farmer ? $farmer->name : null,
                'email' => $farmer ? $farmer->email : null,
                'phone' => $farmer ? $farmer->phone_number : null,
                'role' => $m->role,
                'contribution_percentage' => $m->contribution_percentage,
                'status' => $m->status,
                'joinedAt' => $m->joined_at ? $m->joined_at->toDateTimeString() : null,
                'leftAt' => $m->left_at ? $m->left_at->toDateTimeString() : null,
                'avatarUrl' => $farmer ? $farmer->profile_image_url : null,
                'notes' => null,
            ];
        })->values();

        return inertia('Pages/CooperativeMember', [
            'cooperative' => $cooperative,
            'members' => $members,
        ]);
    }
}
