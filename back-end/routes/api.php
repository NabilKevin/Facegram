<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\FollowController;
use App\Http\Middleware\checkAuth;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::prefix('v1')->group(function() {
    Route::prefix('auth')->group(function() {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/logout', [AuthController::class, 'logout'])->middleware(checkAuth::class);
    });
    Route::middleware(checkAuth::class)->group(function () {
        Route::get('/checkAuth', [AuthController::class, 'checkAuth']);
        Route::resource('posts', PostController::class);

        Route::prefix('posts')->group(function() {
            Route::post('/{id}/like', [PostController::class, 'like']);
            Route::post('/{id}/unlike', [PostController::class, 'unlike']);
            Route::post('/{id}/comment', [PostController::class, 'comment']);
        });

        Route::prefix('users')->group(function() {
            Route::post('/{username}/follow', [FollowController::class, 'followUser']);
            Route::delete('/{username}/unfollow', [FollowController::class, 'unFollow']);
            Route::get('/{username}/following', [FollowController::class, 'getFollowingUser']);
            Route::put('/{username}/accept', [FollowController::class, 'acceptRequest']);
            Route::get('/{username}/followers', [FollowController::class, 'getFollowerUser']);
            Route::get('/', [FollowController::class, 'index']);
            Route::get('/{username}', [FollowController::class, 'getDetailUser']);
        });
    });
});
