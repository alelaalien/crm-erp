<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class UpdateUserLastSeen
{
    public function handle(Request $request, Closure $next): Response
    { 
        if (Auth::check()) {
            $user = Auth::user();
            $user->last_seen_at = now();
            
          
            $user->timestamps = false; 
            $user->save();
        }

        return $next($request);
    }
}