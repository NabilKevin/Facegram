<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Follow extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $table = 'follow';

    public function followerUser()
    {
        return $this->belongsTo(User::class, 'follower_id', 'id');
    }
    public function followingUser()
    {
        return $this->belongsTo(User::class, 'following_id', 'id');
    }
}
