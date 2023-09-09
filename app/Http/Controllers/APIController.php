<?php

namespace App\Http\Controllers;

use App\Models\Price;
use App\Models\PricePercent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class APIController extends Controller
{

    public function price(Request $request) : JsonResponse
    {
        $price = Price::with(['material', 'color'])
            ->whereHas('material', function ($query) use ($request) {
                $query->where('title', trim($request->material));
            })
            ->whereHas('color', function ($query) use ($request) {
                $query->where('title', trim($request->color));
            })
            ->where('width', trim($request->width))
            ->where('height', $request->height)
            ->where(function ($query) use ($request) {
                if (Str::contains($request->material, 'повсть', true)) {
                    $query->where('margin', $request->margin);
                }
            })->first();

        if ($price) {
            $pricePercent = PricePercent::find($price->material->id);
            if ($pricePercent) {
                $price->price *= $pricePercent->percent / 100;
                $price->price_stringer *= $pricePercent->percent / 100;
                $price->price_connector *= $pricePercent->percent / 100;
                $price->price_anchor *= $pricePercent->percent / 100;
                $price->price_screw *= $pricePercent->percent / 100;
                $price->price_pin *= $pricePercent->percent / 100;
            }
            return response()->json($price);
        }
        return response()->json(null, 404);
    }

}
