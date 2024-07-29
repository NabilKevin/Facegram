<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Like;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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

        for($i = 1; $i <= 99; $i++) {
            Like::create([
                'user_id' => $i,
                'post_id' => 602
            ]);
        }
        for($i = 1; $i <= 51; $i++) {
            Like::create([
                'user_id' => $i,
                'post_id' => 603
            ]);
        }
    }
}
