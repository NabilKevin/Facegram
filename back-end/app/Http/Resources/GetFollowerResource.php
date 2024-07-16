<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GetFollowerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->followerUser->id,
            'full_name' => $this->followerUser->full_name,
            'username' => $this->followerUser->username,
            'bio' => $this->followerUser->bio,
            'created_at' => $this->followerUser->created_at,
            'is_requested' => $this->is_accepted === 1 ? false : true,
        ];
    }
}
