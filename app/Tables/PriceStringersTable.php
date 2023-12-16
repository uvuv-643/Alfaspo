<?php

namespace App\Tables;

use App\Models\Price;
use App\Models\PriceStringer;
use Okipa\LaravelTable\Abstracts\AbstractTableConfiguration;
use Okipa\LaravelTable\Column;
use Okipa\LaravelTable\Formatters\DateFormatter;
use Okipa\LaravelTable\RowActions\DestroyRowAction;
use Okipa\LaravelTable\RowActions\EditRowAction;
use Okipa\LaravelTable\Table;

class PriceStringersTable extends AbstractTableConfiguration
{
    protected function table(): Table
    {
        return Table::make()
            ->model(PriceStringer::class)
            ->rowActions(fn(PriceStringer $price) => [
                new EditRowAction(route('price.stringers.edit', $price)),
                new DestroyRowAction(),
            ])->enableNumberOfRowsPerPageChoice(false);
    }

    protected function columns(): array
    {
        return [
            Column::make('stringer_color_id')->title('Колiр')->format(function ($item) {
                return $item->color->title;
            })->sortable(),
            Column::make('price_stringer')->title('Вартiсть стр.')->sortable(),
            Column::make('price_percent')->title('Вартiсть стр. (з нацiнкою)')->format(function ($item) {
                return $item->getPrice();
            })->sortable(),
            Column::make('weight_stringer')->title('Вага стр.')->sortable(),
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
