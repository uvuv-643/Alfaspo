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
        'width', 'height', 'margin', 'material_id', 'color_id', 'price', 'price_stringer', 'weight', 'weight_stringer',
        'price_connector', 'price_screw', 'price_pin', 'price_anchor', 'weight_connector'
    ];

    protected $attributes = [
        'price' => 0,
        'price_stringer' => 0,
        'weight' => 0,
        'weight_stringer' => 0,
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

}
