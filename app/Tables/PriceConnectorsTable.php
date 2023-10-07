<?php

namespace App\Tables;

use App\Models\Price;
use App\Models\PriceConnector;
use Okipa\LaravelTable\Abstracts\AbstractTableConfiguration;
use Okipa\LaravelTable\Column;
use Okipa\LaravelTable\Formatters\DateFormatter;
use Okipa\LaravelTable\RowActions\DestroyRowAction;
use Okipa\LaravelTable\RowActions\EditRowAction;
use Okipa\LaravelTable\Table;

class PriceConnectorsTable extends AbstractTableConfiguration
{
    protected function table(): Table
    {
        return Table::make()
            ->model(PriceConnector::class)
            ->rowActions(fn(PriceConnector $price) => [
                new EditRowAction(route('price.connectors.edit', $price)),
                new DestroyRowAction(),
            ])->enableNumberOfRowsPerPageChoice(false);
    }

    protected function columns(): array
    {
        return [
            Column::make('price_connector')->title("Вартiсть з'єдн.")->sortable(),
            Column::make('price_anchor')->title("Вартiсть анкер")->sortable(),
            Column::make('price_screw')->title("Вартiсть гайка")->sortable(),
            Column::make('price_pin')->title("Вартiсть шпилька")->sortable(),
            Column::make('weight_connector')->title("Вага з'єдн.")->sortable(),
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
