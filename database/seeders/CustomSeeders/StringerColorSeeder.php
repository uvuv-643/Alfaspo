<?php

namespace Database\Seeders\CustomSeeders;

use App\Models\Material;
use App\Models\StringerColor;
use Illuminate\Database\Seeder;

class StringerColorSeeder extends Seeder
{
    private function getZincColors(): array
    {
        return [
            ['title' => 'RAL 9003'],
            ['title' => 'Стандарт'],
            ['title' => 'RAL 9005'],
        ];
    }

    private function getAluminiumColors(): array
    {
        return [
            ['title' => 'RAL 9003'],
            ['title' => 'RAL 9005'],
        ];
    }

    private function getFeltColors(): array
    {
        return [
            ['title' => 'RAL 9005'],
        ];
    }


    public function run(): void
    {

        StringerColor::query()->delete();

        $zincColors = $this->getZincColors();
        $aluminiumColors = $this->getAluminiumColors();
        $feltColors = $this->getFeltColors();
        $zincMaterial = Material::query()->where('title', 'Цинкована Сталь')->first();
        $aluminiumMaterial = Material::query()->where('title', 'Алюміній')->first();
        $feltMaterial = Material::query()->where('title', 'Акустична Повсть')->first();

        if ($zincMaterial && $aluminiumMaterial && $feltMaterial) {
            foreach ($zincColors as $color) {
                StringerColor::query()->create([
                    ...$color,
                    'material_id' => $zincMaterial->id
                ]);
            }
            foreach ($aluminiumColors as $color) {
                StringerColor::query()->create([
                    ...$color,
                    'material_id' => $aluminiumMaterial->id
                ]);
            }
            foreach ($feltColors as $color) {
                StringerColor::query()->create([
                    ...$color,
                    'material_id' => $feltMaterial->id
                ]);
            }
        }

    }
}
