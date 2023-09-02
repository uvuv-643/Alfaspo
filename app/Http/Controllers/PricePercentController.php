<?php

namespace App\Http\Controllers;

use App\Http\Requests\PricePercentRequest;
use App\Models\PricePercent;

class PricePercentController extends Controller
{

    public function index()
    {
        return view('percent.index');
    }

    public function edit(string $id)
    {
        $percent = PricePercent::query()->findOrFail($id);
        return view('percent.edit', compact('percent'));
    }

    public function update(PricePercentRequest $request, string $id)
    {
        $percent = PricePercent::query()->findOrFail($id);
        $percent->update($request->only($percent->getFillable()));
        return redirect()->route('percent.index');
    }

}
