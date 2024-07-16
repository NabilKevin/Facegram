<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GetFollowingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->followingUser->id,
            'full_name' => $this->followingUser->full_name,
            'username' => $this->followingUser->username,
            'bio' => $this->followingUser->bio,
            'created_at' => $this->followingUser->created_at,
            'is_requested' => $this->followingUser->is_private === 0 ? false : true,
        ];
    }
}
