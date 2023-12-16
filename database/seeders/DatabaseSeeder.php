<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\CustomSeeders\ColorSeeder;
use Database\Seeders\CustomSeeders\MaterialSeeder;
use Database\Seeders\CustomSeeders\PricePercentSeeder;
use Database\Seeders\CustomSeeders\StringerColorSeeder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->create(
            [
                'name' => 'dev',
                'email' => 'dev@gmail.com',
                'password' => Hash::make('5NI15o32fJ5g')
            ]
        );
        $this->call([
            MaterialSeeder::class,
            ColorSeeder::class,
            StringerColorSeeder::class,
            PricePercentSeeder::class,
        ]);
    }
}
