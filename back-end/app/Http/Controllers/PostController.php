<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Models\PostAttachments;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Drivers\Imagick\Driver;
use Intervention\Image\ImageManager;

class PostController extends Controller
{
    public function store(Request $request)
    {
        $validate = validator::make($request->all(), [
            'caption' => 'required',
            'attachments' => 'required|array',
            'attachments.*' => 'image'
        ]);

        if($validate->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validate->errors()
            ], 422);
        }

        $data = $validate->getData();

        $data['user_id'] = $request->user->id;

        $post = Post::create($data);

        foreach($data['attachments'] as $image) {

            $name = time() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('/posts', $name);

            PostAttachments::create([
                'storage_path' => "posts/$name",
                'post_id' => $post->id]);
        }

        return response()->json([
            'message' => 'Create post success'
        ], 200);
    }

    public function destroy($id, Request $request)
    {
        $post = Post::find($id);
        if($post) {
            if($post->user_id === $request->user->id) {
                $post->delete();
                return response()->json([], 204);
            } else {
                return response()->json([
                    'message' => 'Forbidden access'
                ], 403);
            }
        }
        return response()->json([
            'message' => 'Post not found'
        ], 404);
    }

    public function index(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'page' => 'integer|min:0',
            'size' => 'integer|min:1|max:10'
        ]);

        if($validate->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validate->errors()
            ], 422);
        }

        $data = $validate->getData();

        $data['page'] = $data['page'] ?? 0;
        $data['size'] = $data['size'] ?? 10;

        $id = [];
        foreach($request->user->followers as $f) {
            if($f->is_accepted === 1) {
                array_push($id, $f->following_id);
            }
        }
        array_push($id, $request->user->id);

        $posts = Post::with(['user', 'attachments', 'likes', 'comments'])->whereIn('user_id', $id)->get()->sortBy('created_at', SORT_NATURAL, 'ASC');
        $data['size'] = Count($posts) < $data['size'] ? Count($posts) : $data['size'];

        foreach($posts as $post) {
            $post['total_like'] = Count($post->likes);
            $post['total_comment'] = Count($post->comments);
            $post['you_liked'] = $post->likes->firstWhere('user_id', $request->user->id) ? true : false;
        }

        return response()->json([
            'page' => $data['page'],
            'size' => $data['size'],
            'posts' => $posts->skip($data['page'] * $data['size'])->take($data['size'])->values()
        ], 200);
    }
    public function show(Request $request, $id)
    {
        $post = Post::with(['user', 'attachments', 'likes', 'comments'])->find($id);
        if($post) {
            $post['total_like'] = Count($post->likes);
            $post['total_comment'] = Count($post->comments);
            $post['you_liked'] = $post->likes->firstWhere('user_id', $request->user->id) ? true : false;
            return response()->json([
                'post' => $post
            ], 200);
        }
        return response()->json([
            'message' => 'Post not found'
        ], 404);
    }
    public function like(Request $request, $id)
    {
        $post = Post::find($id);
        if(!$post) {
            return response()->json([
                'message' => 'Post not found'
            ], 200);
        }
        $data = [
            'user_id' => $request->user->id,
            'post_id' => $id
        ];
        Like::create($data);
        return response()->json([
            'message' => 'like post success'
        ], 200);
    }
    public function unlike(Request $request, $id)
    {
        $post = Post::find($id);
        if(!$post) {
            return response()->json([
                'message' => 'Post not found'
            ], 200);
        }
        $like = Like::where('user_id', $request->user->id)->firstWhere('post_id', $id);
        if($like) {
            $like->delete();
            return response()->json([
                'message' => 'unlike post success'
            ], 200);
        }
        return response()->json([
            'message' => 'You are not like a post'
        ], 422);
    }
    public function comment(Request $request, $id)
    {
        $post = Post::find($id);
        if(!$post) {
            return response()->json([
                'message' => 'Post not found'
            ], 200);
        }
        $validator = Validator::make($request->all(), [
            'comment_body' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->getData();

        $data['post_id'] = $id;
        $data['user_id'] = $request->user->id;

        Comment::create($data);

        return response()->json([
            'message' => 'Comment success'
        ], 200);
    }
    public function getComment($id)
    {
        $post = Post::find($id);
        if(!$post) {
            return response()->json([
                'message' => 'Post not found'
            ], 200);
        }
        $comments = Comment::with('user')->where('post_id', $id)->get()->sortBy('created_at', SORT_NATURAL, 'ASC')->values();
        return response()->json([
            'message' => 'Get comment success',
            'comments' => $comments
        ], 200);
    }
}

