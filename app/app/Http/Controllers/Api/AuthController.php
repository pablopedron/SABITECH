<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /** POST /api/register */
    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'zip_code' => $data['zip_code'] ?? null,
                // Solo se guarda si hay consentimiento (la validación ya lo exige)
                'accessibility_needs' => $data['accessibility_needs'] ?? null,
                'accessibility_consent_at' => ! empty($data['accessibility_needs']) ? now() : null,
            ]);

            // Todo usuario nuevo es asistente
            $user->roles()->attach(Role::where('name', 'asistente')->value('id'));

            return $user;
        });

        return $this->respondWithToken($user, 201);
    }

    /** POST /api/login */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        // Mismo mensaje para email inexistente, contraseña mala o usuario inactivo:
        // así no se revela qué emails existen.
        if (! $user || ! $user->is_active || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Credenciales incorrectas.'], 401);
        }

        return $this->respondWithToken($user);
    }

    /** POST /api/logout (revoca solo el token actual) */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada.']);
    }

    /** GET /api/me */
    public function me(Request $request): JsonResponse
    {
        return response()->json($this->userData($request->user(), true));
    }

    private function respondWithToken(User $user, int $status = 200): JsonResponse
    {
        return response()->json([
            'user' => $this->userData($user),
            'token' => $user->createToken('api')->plainTextToken,
        ], $status);
    }

    private function userData(User $user, bool $full = false): array
    {
        $data = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->roles()->pluck('name')->values(),
        ];

        if ($full) {
            $data['zip_code'] = $user->zip_code;
            $data['accessibility_needs'] = $user->accessibility_needs;
        }

        return $data;
    }
}
