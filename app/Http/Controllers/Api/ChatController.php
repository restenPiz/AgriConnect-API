<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    /**
     * Get all farmers for chat
     */
    public function getFarmers(Request $request)
    {
        try {
            $search = $request->query('search', '');

            $farmers = User::farmers()
                ->active()
                ->where('is_verified', true)
                ->when($search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('phone_number', 'like', "%{$search}%")
                          ->orWhere('location', 'like', "%{$search}%");
                    });
                })
                ->select([
                    'id',
                    'name',
                    'email',
                    'phone_number',
                    'profile_image_url',
                    'location',
                    'rating',
                    'review_count'
                ])
                ->orderBy('rating', 'desc')
                ->paginate(20);

            return response()->json([
                'success' => true,
                'data' => $farmers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar agricultores',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all buyers (for farmers to contact)
     */
    public function getBuyers(Request $request)
    {
        try {
            $search = $request->query('search', '');

            $buyers = User::buyers()
                ->active()
                ->when($search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('phone_number', 'like', "%{$search}%")
                          ->orWhere('location', 'like', "%{$search}%");
                    });
                })
                ->select([
                    'id',
                    'name',
                    'email',
                    'phone_number',
                    'profile_image_url',
                    'location',
                    'rating',
                    'review_count'
                ])
                ->orderBy('name')
                ->paginate(20);

            return response()->json([
                'success' => true,
                'data' => $buyers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar compradores',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user details by ID
     */
    public function getUserDetails($userId)
    {
        try {
            $user = User::findOrFail($userId);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number,
                    'profile_image_url' => $user->profile_image_url,
                    'location' => $user->location,
                    'user_type' => $user->user_type,
                    'rating' => $user->rating,
                    'review_count' => $user->review_count,
                    'is_verified' => $user->is_verified
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Usuário não encontrado'
            ], 404);
        }
    }

    /**
     * Get chat conversations for current user
     */
    public function getConversations(Request $request)
    {
        try {
            $userId = $request->user()->id;

            // This would typically query a conversations table
            // For now, we'll return an empty array as Firebase handles this

            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'Use Firebase para mensagens em tempo real'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar conversas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
