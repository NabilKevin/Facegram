<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Like;
use App\Models\Comment;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $faker = Faker::create();
        for($i = 1; $i <= 50; $i++) {
            $max = mt_rand(0, 50);
            for($ii = 1; $ii <= $max; $ii++) {
                Like::create([
                    'user_id' => $ii,
                    'post_id' => $i
                ]);
            }
        }
        for($i = 1; $i <= 50; $i++) {
            $max = mt_rand(0, 50);
            for($ii = 1; $ii <= $max; $ii++) {
                Comment::create([
                    'user_id' => $ii,
                    'post_id' => $i,
                    'comment_body' => $faker->sentence
                ]);
            }
        }
    }
}
