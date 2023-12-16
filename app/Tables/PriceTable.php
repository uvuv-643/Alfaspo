<?php

namespace App\Tables;

use App\Models\Material;
use App\Models\Price;
use Okipa\LaravelTable\Abstracts\AbstractTableConfiguration;
use Okipa\LaravelTable\Column;
use Okipa\LaravelTable\Formatters\DateFormatter;
use Okipa\LaravelTable\RowActions\DestroyRowAction;
use Okipa\LaravelTable\RowActions\EditRowAction;
use Okipa\LaravelTable\Table;

class PriceTable extends AbstractTableConfiguration
{
    protected function table(): Table
    {
        return Table::make()
            ->model(Price::class)
            ->rowActions(fn(Price $price) => [
                new EditRowAction(route('price.panels.edit', $price)),
                new DestroyRowAction(),
            ])->enableNumberOfRowsPerPageChoice(false);
    }

    protected function columns(): array
    {
        return [
            Column::make('width')->title('Ширина')->sortable(),
            Column::make('height')->title('Висота')->sortable(),
            Column::make('margin')->title('Вiдступ для акустичноi повстi')->sortable(),
            Column::make('material_id')->title('Матерiал')->format(function ($item) {
                return $item->material->title;
            })->sortable(),
            Column::make('color_id')->title('Колiр')->format(function ($item) {
                return $item->color->title;
            })->sortable(),
            Column::make('price')->title('Вартiсть панель')->sortable(),
            Column::make('price_percent')->title('Вартiсть панель (з нацiнкою)')->format(function ($item) {
                return $item->getPrice();
            })->sortable(),
            Column::make('weight')->title('Вага панель (або за м^2 для ак. повстi)')->sortable(),
            Column::make('created_at')->title('Створено')->format(new DateFormatter('d.m.Y H:i:s'))->sortable(),
        ];
    }

    protected function results(): array
    {
        return [
            // The table results configuration.
            // As results are optional on tables, you may delete this method if you do not use it.
        ];
    }
}
