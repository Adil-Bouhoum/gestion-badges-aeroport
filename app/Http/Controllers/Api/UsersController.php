<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UsersController extends Controller
{
    // List all users (GET /api/users)
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    // Store a new user (POST /api/users)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'fonction' => 'nullable|string|max:255',
            'service' => 'nullable|string|max:255',
            'password' => 'required|string|min:6',
            'is_active' => 'boolean',
            'is_admin' => 'boolean',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'fonction' => $validated['fonction'] ?? '',
            'service' => $validated['service'] ?? '',
            'password' => Hash::make($validated['password']),
            'is_active' => $validated['is_active'] ?? true,
            'is_admin' => $validated['is_admin'] ?? false,
        ]);

        return response()->json($user, 201);
    }

    // Show single user (GET /api/users/{id})
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    // Update user (PUT /api/users/{id})
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'fonction' => 'nullable|string|max:255',
            'service' => 'nullable|string|max:255',
            'password' => 'nullable|string|min:6',
            'is_active' => 'boolean',
            'is_admin' => 'boolean',
        ]);

        $user->name = $validated['name'] ?? $user->name;
        $user->email = $validated['email'] ?? $user->email;
        $user->fonction = $validated['fonction'] ?? $user->fonction;
        $user->service = $validated['service'] ?? $user->service;

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        if (isset($validated['is_active'])) {
            $user->is_active = $validated['is_active'];
        }

        if (isset($validated['is_admin'])) {
            $user->is_admin = $validated['is_admin'];
        }

        $user->save();

        return response()->json($user);
    }

    // Delete user (DELETE /api/users/{id})
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }
}
