<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Silakan login terlebih dahulu.',
                'code'    => 'UNAUTHENTICATED',
            ], 401);
        }

        if (! $request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. Halaman ini hanya untuk Admin.',
                'code'    => 'FORBIDDEN',
            ], 403);
        }

        return $next($request);
    }
}

