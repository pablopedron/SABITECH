<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Uso en rutas: ->middleware(['auth:sanctum', 'role:organizacion,personal_acceso'])
 * Deja pasar si el usuario tiene AL MENOS uno de los roles indicados.
 */
class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! $user->hasRole(...$roles)) {
            return response()->json(['message' => 'No tienes permiso para esta acción.'], 403);
        }

        return $next($request);
    }
}
