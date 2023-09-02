<?php

namespace Database\Seeders\CustomSeeders;

use App\Models\Material;
use Illuminate\Database\Seeder;

class MaterialSeeder extends Seeder
{

    private function getMaterials() : array
    {
        return [
            ['title' => 'Цинкована Сталь'],
            ['title' => 'Алюміній'],
            ['title' => 'Акустична Повсть'],
        ];
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Material::query()->delete();
        $materials = $this->getMaterials();
        foreach ($materials as $material) {
            Material::query()->create($material);
        }
    }

}
