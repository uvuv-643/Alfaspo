<?php

namespace App\Tables;

use App\Models\PricePercent;
use Okipa\LaravelTable\Abstracts\AbstractTableConfiguration;
use Okipa\LaravelTable\Column;
use Okipa\LaravelTable\RowActions\EditRowAction;
use Okipa\LaravelTable\Table;

class PricePercentTable extends AbstractTableConfiguration
{
    protected function table(): Table
    {
        return Table::make()
            ->model(PricePercent::class)
            ->rowActions(fn(PricePercent $percent) => [
                new EditRowAction(route('percent.edit', $percent)),
            ])->enableNumberOfRowsPerPageChoice(false);
    }

    protected function columns(): array
    {
        return [
            Column::make('material_id')->title('Матерiал')->format(function ($item) {
                return $item->material->title;
            })->sortable(),
            Column::make('percent')->title('Відсоток націнки')->sortable(),
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
