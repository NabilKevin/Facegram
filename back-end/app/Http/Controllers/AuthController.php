<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Cookie;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'full_name' => 'required',
            'bio' => 'required|max:100',
            'username' => 'required|min:3|unique:users,username',
            'password' => 'required|min:6',
            'is_private' => 'boolean'
        ]);

        if($validate->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validate->errors()
            ], 422);
        }

        $data = $validate->getData();
        $data['password'] = bcrypt($data['password']);

        $user = User::create($data);

        $token = $user->createToken('user login')->plainTextToken;

        $cookie = cookie('sessionToken', json_encode([hash('md5', 'token') => $token, hash('md5', 'username') => $user->username]), 60 * 24);

        return response()->json([
            'message' => 'Login success',
            'token' => $token,
            'user' => $user->only(['full_name', 'bio', 'username', 'is_private', 'id'])
        ], 200)->cookie($cookie);
    }

    public function login(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required',
        ]);
        if($validate->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validate->errors()
            ], 422);
        }
        $data = $validate->getData();
        if(Auth::validate($data)) {
            $user = User::firstWhere('username', $data['username']);
            $token = $user->createToken('user login')->plainTextToken;

            $cookie = cookie('sessionToken', json_encode([hash('md5', 'token') => $token, hash('md5', 'username') => $user->username]), 60 * 24);

            return response()->json([
                'message' => 'Login success',
                'token' => $token,
                'user' => $user->only(['id', 'full_name', 'username', 'bio', 'is_private', 'created_at'])
            ], 200)->cookie($cookie);
        }
        return response()->json([
            'message' => 'Wrong username or password'
        ], 401);
    }

    public function logout(Request $request)
    {
        PersonalAccessToken::findToken($request->token)->delete();

        return response()->json([
            'message' => 'Logout success'
        ], 200)->cookie('sessionToken', null, 0);
    }

    public function checkAuth()
    {
        return response()->json([], 200);
    }
}
