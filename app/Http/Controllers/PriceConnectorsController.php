<?php

namespace App\Http\Controllers;

use App\Http\Requests\PriceConnectorRequest;
use App\Http\Requests\PriceRequest;
use App\Models\Color;
use App\Models\Material;
use App\Models\Price;
use App\Models\PriceConnector;
use Illuminate\Contracts\View\View;

class PriceConnectorsController extends Controller
{

    public function create($id) : View
    {
        $material = Material::query()->findOrFail($id);
        $colors = Color::query()->where('material_id', $material->id)->orderBy('title')->get();
        return view('connectors.create', compact('material', 'colors'));
    }

    public function store(PriceConnectorRequest $request)
    {
        $price = new PriceConnector();
        $price->fill($request->only($price->getFillable()));
        $price->save();
        return redirect()->route('connectors');
    }

    public function edit(string $id)
    {
        $price = PriceConnector::query()->findOrFail($id);
        $colors = Color::query()->where('material_id', $price->material->id)->orderBy('title')->get();
        return view('connectors.edit', compact('colors', 'price'));
    }

    public function update(PriceConnectorRequest $request, string $id)
    {
        $price = PriceConnector::query()->findOrFail($id);
        $price->update($request->only($price->getFillable()));
        return redirect()->route('connectors');
    }

}
