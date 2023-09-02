<?php

namespace Database\Seeders\CustomSeeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::query()->delete();
        User::query()->create([
            'email' => 'dev@gmail.com',
            'password' => Hash::make('5NI15o32fJ5g'),
            'name' => 'admin'
        ]);
    }
}
