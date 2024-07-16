<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GetDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'username' => $this->username,
            'bio' => $this->bio,
            'created_at' => $this->created_at,
            'is_private' => $this->is_private,
            'is_your_account' => $this->is_your_account,
            'following_status' => $this->following_status,
            'posts_count' => $this->posts_count,
            'followers_count' => $this->followers_count,
            'followings_count' => $this->followings_count,
            'posts' => $this->posts
        ];
    }
}
