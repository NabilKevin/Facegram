<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Post;
use App\Models\PostAttachments;
use Illuminate\Support\Facades\Auth;

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

        $data['user_id'] = Auth::user()->id;

        $post = Post::create($data);

        foreach($data['attachments'] as $pic) {
            $name = $pic->getClientOriginalName();
            $pic->storeAs('/posts', $name);
            PostAttachments::create([
                'storage_path' => "posts/$name",
                'post_id' => $post->id]);
        }

        return response()->json([
            'message' => 'Create post success'
        ], 200);
    }

    public function destroy($id)
    {
        $post = Post::find($id);
        if($post) {
            if($post->user_id === Auth::user()->id) {
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
        foreach(Auth::user()->followers as $f) {
            if($f->is_accepted === 1) {
                array_push($id, $f->following_id);
            }
        }
        array_push($id, Auth::user()->id);

        $posts = Post::with(['user', 'attachments'])->whereIn('user_id', $id)->get()->sortBy('created_at', SORT_NATURAL, 'ASC');
        $data['size'] = Count($posts) < $data['size'] ? Count($posts) : $data['size'];

        return response()->json([
            'page' => $data['page'],
            'size' => $data['size'],
            'posts' => $posts->skip($data['page'] * $data['size'])->take($data['size'])->values()
        ], 200);
    }
}