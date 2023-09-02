<?php

namespace App\Http\Controllers;

use App\Http\Requests\PriceRequest;
use App\Models\Color;
use App\Models\Material;
use App\Models\Price;
use Illuminate\Contracts\View\View;

class PriceController extends Controller
{

    public function create($id) : View
    {
        $material = Material::query()->findOrFail($id);
        $colors = Color::query()->where('material_id', $material->id)->orderBy('title')->get();
        return view('price.create', compact('material', 'colors'));
    }

    public function store(PriceRequest $request)
    {
        $price = new Price();
        $price->fill($request->only($price->getFillable()));
        $price->save();
        return redirect()->route('dashboard');
    }

    public function edit(string $id)
    {
        $price = Price::query()->findOrFail($id);
        $colors = Color::query()->where('material_id', $price->material->id)->orderBy('title')->get();
        return view('price.edit', compact('colors', 'price'));
    }

    public function update(PriceRequest $request, string $id)
    {
        $price = Price::query()->findOrFail($id);
        $price->update($request->only($price->getFillable()));
        return redirect()->route('dashboard');
    }

}
