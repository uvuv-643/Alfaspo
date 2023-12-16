<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PriceStringer extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $fillable = [
        'stringer_color_id', 'price_stringer', 'weight_stringer', 'material_id'
    ];

    protected $attributes = [
        'price_stringer' => 0,
        'weight_stringer' => 0,
    ];

    public function color() : BelongsTo
    {
        return $this->belongsTo(StringerColor::class, 'stringer_color_id');
    }

    public function material() : BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    public function getPrice() : float
    {
        return $this->price_stringer * PricePercent::where('material_id', $this->material()->first()->id)->first()->percent_stringers / 100;
    }

}
