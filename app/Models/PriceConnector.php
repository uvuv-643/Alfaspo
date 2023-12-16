<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PriceConnector extends Model
{

    use HasFactory;

    protected $guarded = [];

    protected $fillable = [
        'price_connector', 'price_screw', 'price_pin', 'price_anchor', 'weight_connector'
    ];

    protected $attributes = [
        'price_connector' => 0,
        'price_screw' => 0,
        'price_pin' => 0,
        'price_anchor' => 0,
        'weight_connector' => 0
    ];

    public function color() : BelongsTo
    {
        return $this->belongsTo(Color::class);
    }

    public function material() : BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    public function getPrice() : float
    {
        return $this->price_connectors * PricePercent::where('material_id', $this->material()->first()->id)->first()->percent / 100;
    }

}
