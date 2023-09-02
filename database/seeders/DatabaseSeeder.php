<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Database\Seeders\CustomSeeders\AdminSeeder;
use Database\Seeders\CustomSeeders\ColorSeeder;
use Database\Seeders\CustomSeeders\MaterialSeeder;
use Database\Seeders\CustomSeeders\PricePercentSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            MaterialSeeder::class,
            ColorSeeder::class,
            PricePercentSeeder::class,
        ]);
    }
}
