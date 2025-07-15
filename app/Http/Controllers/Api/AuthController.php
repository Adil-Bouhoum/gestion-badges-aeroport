<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'fonction' => [
                'required',
                'string',
                Rule::in([
                    'Security Officer',
                    'Operations Manager',
                    'Baggage Handler',
                    'Customs Agent',
                    'Air Traffic Controller',
                    'Maintenance Technician'
                ])
            ],
            'service' => [
                'required',
                'string',
                Rule::in([
                    'Security',
                    'Operations',
                    'Passenger Services',
                    'Customs',
                    'Air Traffic Control',
                    'Maintenance'
                ])
            ],
            'password' => 'required|string|min:8|confirmed',
            'isAdmin' => 'sometimes|boolean', // Optional field for admin creation
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'fonction' => $request->fonction,
                'service' => $request->service,
                'password' => $request->password, // Will be hashed by the model
                'is_admin' => $request->isAdmin ?? false, // Default to false if not provided
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = User::where('email', $request->email)->first();

        // Check if user is active
        if (!$user->is_active) {
            return response()->json([
                'message' => 'Account is deactivated. Please contact administrator.'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Determine redirect URL based on admin status
        $redirectUrl = $user->is_admin ? '/dashboard' : '/home';

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
            'redirect_url' => $redirectUrl
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    /**
     * Toggle user admin status (only for admins)
     */
    public function toggleAdmin(Request $request, User $user)
    {
        // Check if current user is admin
        if (!$request->user()->is_admin) {
            return response()->json([
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }

        $user->is_admin = !$user->is_admin;
        $user->save();

        return response()->json([
            'message' => 'Admin status updated successfully',
            'user' => $user
        ]);
    }
}
