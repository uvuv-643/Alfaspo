<?php

namespace App\Http\Controllers;

use App\Http\Requests\PriceRequest;
use App\Http\Requests\PriceStringerRequest;
use App\Models\Color;
use App\Models\Material;
use App\Models\Price;
use App\Models\PriceStringer;
use Illuminate\Contracts\View\View;

class PriceStringersController extends Controller
{

    public function create($id) : View
    {
        $material = Material::query()->findOrFail($id);
        $colors = Color::query()->where('material_id', $material->id)->orderBy('title')->get();
        return view('stringers.create', compact('material', 'colors'));
    }

    public function store(PriceStringerRequest $request)
    {
        $price = new PriceStringer();
        $price->fill($request->only($price->getFillable()));
        $price->save();
        return redirect()->route('stringers');
    }

    public function edit(string $id)
    {
        $price = PriceStringer::query()->findOrFail($id);
        $colors = Color::query()->where('material_id', $price->material->id)->orderBy('title')->get();
        return view('price.edit', compact('colors', 'price'));
    }

    public function update(PriceStringerRequest $request, string $id)
    {
        $price = PriceStringer::query()->findOrFail($id);
        $price->update($request->only($price->getFillable()));
        return redirect()->route('stringers');
    }

}
