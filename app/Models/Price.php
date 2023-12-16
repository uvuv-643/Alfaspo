<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Price extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $fillable = [
        'width', 'height', 'margin', 'material_id', 'color_id', 'price', 'weight'
    ];

    protected $attributes = [
        'price' => 0,
        'weight' => 0,
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
        return $this->price * PricePercent::where('material_id', $this->material()->first()->id)->first()->percent / 100;
    }

}
