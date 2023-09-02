<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Material extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function price() : HasOne
    {
        return $this->hasOne(Price::class);
    }

    public function pricePercent() : HasOne
    {
        return $this->hasOne(PricePercent::class);
    }

}
