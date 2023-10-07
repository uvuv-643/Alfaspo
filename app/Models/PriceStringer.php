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
        'color_id', 'price_stringer', 'weight_stringer',
    ];

    protected $attributes = [
        'price_stringer' => 0,
        'weight_stringer' => 0,
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
