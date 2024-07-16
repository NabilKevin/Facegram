<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Follow;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\GetFollowingResource;
use App\Http\Resources\GetFollowerResource;
use App\Http\Resources\GetDetailResource;

// Follower ID = yang follow
// Following ID = yang di follow

class FollowController extends Controller
{
    public function followUser($username)
    {
        $me = Auth::user();
        $user = User::firstWhere('username', $username);

        if(!$user) return response()->json([
            'message' => 'User not found'
        ], 404);

        if($me->username === $user->username)  return response()->json([
            'message' => 'You are not allowed to follow yourself'
        ], 422);

        $alreadyFollowing = Follow::where('follower_id', $me->id)->firstWhere('following_id', $user->id);
        if($alreadyFollowing) return response()->json([
            'message' => 'You are already followed',
            'status' => $user->is_private === 1 ? 'requested' : 'following'
        ], 422);

        $follow = Follow::create([
            'follower_id' => $me->id,
            'following_id' => $user->id,
            'is_accepted' => $user->is_private === 1 ? 0 : 1
        ]);

        return response()->json([
            'message' => 'Follow success',
            'status' => $follow->is_accepted === 1 ? 'following' : 'requested'
        ], 200);
    }

    public function unFollow($username)
    {
        $me = Auth::user();
        $user = User::firstWhere('username', $username);

        if(!$user) return response()->json([
            'message' => 'User not found'
        ], 404);

        $alreadyFollowing = Follow::where('follower_id', $me->id)->firstWhere('following_id', $user->id);
        if($alreadyFollowing) {
            $alreadyFollowing->delete();
            return response()->json([], 204);
        } else {
            return response()->json([
                'message' => 'You are not following the user',
            ], 422);
        }
    }

    public function getFollowingUser($username)
    {
        $user = User::firstWhere('username', $username);
        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $following = GetFollowingResource::collection(Follow::with('followingUser')->where('follower_id', $user->id)->get());

        return response()->json([
            'following' => $following
        ], 200);
    }
    public function acceptRequest($username)
    {
        $me = Auth::user();
        $user = User::firstWhere('username', $username);

        if(!$user) return response()->json([
            'message' => 'User not found'
        ], 404);

        $alreadyFollowing = Follow::where('follower_id', $user->id)->firstWhere('following_id', $me->id);
        if(!$alreadyFollowing) return response()->json(['message' => 'The user is not following you'], 422);

        if($alreadyFollowing->is_accepted === 1) {
            return response()->json(['message' => 'Follow request is already accepted'], 422);
        } else {
            $alreadyFollowing->update(['is_accepted' => 1]);
            return response()->json(['message' => 'Follow request accepted'], 200);
        }
    }
    public function getFollowerUser($username)
    {
        $user = User::firstWhere('username', $username);
        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $follower = GetFollowerResource::collection(Follow::with('followerUser')->where('following_id', $user->id)->get());

        return response()->json([
            'followers' => $follower
        ], 200);
    }
    public function index()
    {
        $me = Auth::user();
        $id = [];
        foreach($me->followers as $f) {
            array_push($id, $f->following_id);
        }
        return response()->json([
            'users' => User::whereNot('username', $me->username )->whereNotIn('id', $id)->get()
        ], 200);
    }
    public function getDetailUser($username)
    {
        $me = Auth::user();
        $user = User::with(['posts.attachments', 'followings', 'followers'])->firstWhere('username', $username);

        if(!$user) return response()->json([
            'message' => 'User not found'
        ], 404);

        $user['is_private'] = $user['is_private'] === 1 ? true : false;

        $alreadyFollowing = Follow::where('follower_id', $me->id)->firstWhere('following_id', $user->id);

        $user['is_your_account'] = $me->username === $user->username ? true : false;
        $user['following_status'] = $alreadyFollowing ? $alreadyFollowing->is_accepted ? 'following' : 'requested' : 'not-following';
        $user['posts_count'] = Count($user->posts);
        $user['followers_count'] = Count($user->followings);
        $user['followings_count'] = Count($user->followers);

        return response()->json([
            new GetDetailResource($user)
        ], 200);
    }
}
