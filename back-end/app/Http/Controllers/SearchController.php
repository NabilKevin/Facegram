<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\SearchResource;

class SearchController extends Controller
{
    public function search(Request $request, $key)
    {
        if($key === '') {
            return response()->json(['users' => ''], 200);
        }
        $users = SearchResource::collection(User::with('followings')->where('username', 'LIKE', "{$key}%")->orWhere('full_name', 'LIKE', "{$key}%")->get()->take(20))->values();

        if(Count($users) === 0) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
        return response()->json([
            'users' => $users
        ], 200);
    }
}
