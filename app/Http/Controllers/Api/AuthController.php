<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'phone_number' => 'required|string|max:20|unique:users,phone_number',
            'user_type' => 'required|in:farmer,buyer,transporter',
            'address' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'], // Will be auto-hashed by model
            'phone_number' => $validated['phone_number'],
            'user_type' => $validated['user_type'],
            'address' => $validated['address'] ?? null,
            'status' => 'active',
        ]);

        // Create token - Sanctum salva automaticamente na tabela personal_access_tokens
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,  // ✅ ADICIONE isso
            'message' => 'Conta criada com sucesso',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'user_type' => $user->user_type,
                'status' => $user->status,
            ],
            'token' => $token,  // ✅ Este token será salvo pelo Flutter
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciais inválidas',
            ], 401);
        }

        // Check if user is active
        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'Sua conta não está ativa',
            ], 403);
        }

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login realizado com sucesso',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'user_type' => $user->user_type,
                'status' => $user->status,
                // 'auth_token' => $token,
            ],
            'token' => $token,
        ], 200);
    }

    public function logout(Request $request)
    {
        \Log::info('=== LOGOUT DEBUG ===');
        \Log::info('Token Bearer: ' . $request->bearerToken());

        // Verificar se o token existe no banco
        $tokenHash = hash('sha256', explode('|', $request->bearerToken())[1] ?? '');
        \Log::info('Token Hash: ' . $tokenHash);

        $tokenExists = \DB::table('personal_access_tokens')
            ->where('token', $tokenHash)
            ->first();

        \Log::info('Token existe no banco? ' . ($tokenExists ? 'SIM' : 'NÃO'));

        if ($tokenExists) {
            \Log::info('Token encontrado - User ID: ' . $tokenExists->tokenable_id);

            // Verificar se o usuário existe
            $user = \App\Models\User::find($tokenExists->tokenable_id);
            \Log::info('Usuário encontrado? ' . ($user ? 'SIM' : 'NÃO'));
        }

        \Log::info('User via $request->user(): ' . json_encode($request->user()));

        if (!$request->user()) {
            \Log::error('Usuário não autenticado no logout');
            return response()->json([
                'success' => false,
                'message' => 'Usuário não autenticado. Faça login novamente.',
            ], 401);
        }

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout realizado com sucesso',
        ], 200);
    }

    public function user($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'user' => $user,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'phone_number' => 'sometimes|string|max:20|unique:users,phone_number,' . $user->id,
            'address' => 'nullable|string',
            'profile_image_url' => 'nullable|string|max:500',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Perfil atualizado com sucesso',
            'user' => $user,
        ]);
    }
}
