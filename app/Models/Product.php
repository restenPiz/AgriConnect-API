<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'farmer_id',
        'name',
        'description',
        'price',
        'unit',
        'available_quantity',
        'image_urls',
        'category',
        'location',
        'harvest_date',
        'expiry_date',
        'is_organic',
        'status',
        'rating',
        'review_count',
        'tags',
        'total_sold'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'available_quantity' => 'decimal:2',
        'image_urls' => 'array',
        'harvest_date' => 'date',
        'expiry_date' => 'date',
        'is_organic' => 'boolean',
        'rating' => 'decimal:1',
        'tags' => 'array',
        'total_sold' => 'decimal:2',
    ];

    // Relationships
    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function priceHistory()
    {
        return $this->hasMany(PriceHistory::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeAvailable($query)
    {
        return $query->where('available_quantity', '>', 0)
            ->where('status', 'active');
    }

    public function scopeOrganic($query)
    {
        return $query->where('is_organic', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeNotExpired($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expiry_date')
                ->orWhere('expiry_date', '>', now());
        });
    }
}
