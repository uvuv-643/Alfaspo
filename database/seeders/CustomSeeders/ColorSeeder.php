<?php

namespace Database\Seeders\CustomSeeders;

use App\Models\Color;
use App\Models\Material;
use Illuminate\Database\Seeder;

class ColorSeeder extends Seeder
{
    private function getZincColors(): array
    {
        return [
            ['title' => 'RAL 9003'],
            ['title' => 'RAL 8017'],
            ['title' => 'RAL 9006'],
            ['title' => 'Дерево 1'],
            ['title' => 'RAL 7024'],
            ['title' => 'Дерево 2'],
            ['title' => 'RAL 9005'],
            ['title' => 'Дерево 3'],
        ];
    }

    private function getAluminiumColors(): array
    {
        return [
            ['title' => 'RAL 9003'],
            ['title' => 'RAL 9006'],
            ['title' => 'Дерево 1'],
            ['title' => 'RAL 7024'],
            ['title' => 'Дерево 2'],
            ['title' => 'RAL 9005'],
            ['title' => 'Дерево 3'],
        ];
    }

    private function getFeltColors(): array
    {
        return [
            ['title' => 'Білий 7593'],
            ['title' => 'Св. Сірий 7596'],
            ['title' => 'Т. Сірий 7598'],
            ['title' => 'Сірий 7597'],
            ['title' => 'Чорний 7594'],
            ['title' => 'Кремовий 7575'],
            ['title' => 'Св. Коричневий 7576'],
            ['title' => 'Коричневий 7577'],
            ['title' => 'Т. Коричневий 7578'],
            ['title' => 'Умбра 7579'],
        ];
    }


    public function run(): void
    {

        Color::query()->delete();

        $zincColors = $this->getZincColors();
        $aluminiumColors = $this->getAluminiumColors();
        $feltColors = $this->getFeltColors();
        $zincMaterial = Material::query()->where('title', 'Цинкована Сталь')->first();
        $aluminiumMaterial = Material::query()->where('title', 'Алюміній')->first();
        $feltMaterial = Material::query()->where('title', 'Акустична Повсть')->first();

        if ($zincMaterial && $aluminiumMaterial && $feltMaterial) {
            foreach ($zincColors as $color) {
                Color::query()->create([
                    ...$color,
                    'material_id' => $zincMaterial->id
                ]);
            }
            foreach ($aluminiumColors as $color) {
                Color::query()->create([
                    ...$color,
                    'material_id' => $aluminiumMaterial->id
                ]);
            }
            foreach ($feltColors as $color) {
                Color::query()->create([
                    ...$color,
                    'material_id' => $feltMaterial->id
                ]);
            }
        }

    }
}
