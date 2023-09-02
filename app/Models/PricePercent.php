<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PricePercent extends Model
{
    use HasFactory;

    protected $primaryKey = 'material_id';
    public $timestamps = false;
    protected $guarded = [];
    protected $fillable = ['material_id', 'percent'];

    public function material() : BelongsTo
    {
        return $this->belongsTo(Material::class);
    }


}
