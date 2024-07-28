<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class checkAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $cookie = $_COOKIE['sessionToken'];
        if(!$cookie) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        $cookie = json_decode($cookie);

        $personalAccessToken = PersonalAccessToken::findToken($cookie->{hash('md5', 'token')});

        if (!$personalAccessToken || !$personalAccessToken->can('access-scope')) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        $request['user'] = User::firstWhere('username', $cookie->{hash('md5', 'username')});
        $request['token'] = $cookie->{hash('md5', 'token')};

        return $next($request);


    }
}
