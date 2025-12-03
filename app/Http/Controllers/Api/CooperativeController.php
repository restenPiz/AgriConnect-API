<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cooperative;
use App\Models\CooperativeMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CooperativeController extends Controller
{
    public function getAvailableFarmers()
    {
        try {
            $farmers = \App\Models\User::where('user_type', 'farmer')
                ->where('name', '!=', 'Admin')
                ->select('id', 'name', 'email')
                ->get();

            return response()->json(['success' => true, 'data' => $farmers]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch available farmers',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function index()
    {
        try {
            $cooperatives = Cooperative::with('coordinator')
                ->withCount('members')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $cooperatives
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch cooperatives',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new cooperative
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'coordinator_id' => 'required|exists:users,id',
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'type' => 'required|in:temporary,permanent',
            'status' => 'required|in:forming,active,completed,dissolved',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $cooperative = Cooperative::create([
                'coordinator_id' => $request->coordinator_id,
                'name' => $request->name,
                'description' => $request->description,
                'type' => $request->type,
                'status' => $request->status,
                'member_count' => 0,
                'total_orders' => 0,
                'total_revenue' => 0,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Cooperative created successfully',
                'data' => $cooperative
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create cooperative',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific cooperative
     */
    public function show($id)
    {
        try {
            $cooperative = Cooperative::with(['coordinator', 'members.farmer'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $cooperative
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cooperative not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update a cooperative
     */
    public function update(Request $request, $id)
    {
        $cooperative = Cooperative::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'type' => 'sometimes|in:temporary,permanent',
            'status' => 'sometimes|in:forming,active,completed,dissolved',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $cooperative->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Cooperative updated successfully',
                'data' => $cooperative
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update cooperative',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a cooperative
     */
    public function destroy($id)
    {
        try {
            $cooperative = Cooperative::findOrFail($id);
            $cooperative->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cooperative deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete cooperative',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get members of a cooperative
     */
    public function getMembers($cooperativeId)
    {
        try {
            $members = CooperativeMember::where('cooperative_id', $cooperativeId)
                ->with('farmer')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $members
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch members',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add a member to cooperative
     */
    public function addMember(Request $request, $cooperativeId)
    {
        $validator = Validator::make($request->all(), [
            'farmer_id' => 'required|exists:users,id',
            'role' => 'required|in:member,coordinator,treasurer,secretary',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if already a member
            $exists = CooperativeMember::where('cooperative_id', $cooperativeId)
                ->where('farmer_id', $request->farmer_id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Farmer is already a member of this cooperative'
                ], 400);
            }

            $member = CooperativeMember::create([
                'cooperative_id' => $cooperativeId,
                'farmer_id' => $request->farmer_id,
                'role' => $request->role,
                'joined_at' => now(),
                'status' => 'active',
            ]);

            // Update member count
            $cooperative = Cooperative::findOrFail($cooperativeId);
            $cooperative->increment('member_count');

            return response()->json([
                'success' => true,
                'message' => 'Member added successfully',
                'data' => $member->load('farmer')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove a member from cooperative
     */
    public function removeMember($cooperativeId, $memberId)
    {
        try {
            $member = CooperativeMember::where('cooperative_id', $cooperativeId)
                ->where('id', $memberId)
                ->firstOrFail();

            $member->delete();

            // Update member count
            $cooperative = Cooperative::findOrFail($cooperativeId);
            $cooperative->decrement('member_count');

            return response()->json([
                'success' => true,
                'message' => 'Member removed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove member',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
