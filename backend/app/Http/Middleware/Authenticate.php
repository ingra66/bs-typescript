<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Para APIs, no redirigimos, devolvemos null
        // El middleware manejará la respuesta JSON automáticamente
        return null;
    }

    /**
     * Handle an unauthenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $guards
     * @return void
     *
     * @throws \Illuminate\Auth\AuthenticationException
     */
    protected function unauthenticated($request, array $guards)
    {
        // Para APIs, devolvemos una respuesta JSON en lugar de redirigir
        abort(response()->json([
            'success' => false,
            'message' => 'No autenticado',
            'error' => 'UNAUTHENTICATED'
        ], 401));
    }
} 