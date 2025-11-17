<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'price',
        'date_recorded',
        'market_conditions'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'date_recorded' => 'date',
        'market_conditions' => 'array',
    ];

    // Relationships
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Scopes
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('date_recorded', '>=', now()->subDays($days));
    }

    public function scopeForProduct($query, $productId)
    {
        return $query->where('product_id', $productId)
            ->orderBy('date_recorded', 'desc');
    }
}
