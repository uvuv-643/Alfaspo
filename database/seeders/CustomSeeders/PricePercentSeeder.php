<?php

namespace Database\Seeders\CustomSeeders;

use App\Models\Material;
use App\Models\PricePercent;
use Illuminate\Database\Seeder;

class PricePercentSeeder extends Seeder
{

    public function run(): void
    {
        $materials = Material::all();
        foreach ($materials as $material) {
            PricePercent::query()->insert([
                'material_id' => $material->id
            ]);
        }
    }

}
