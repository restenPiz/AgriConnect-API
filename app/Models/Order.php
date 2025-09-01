<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'buyer_id',
        'cooperative_id',
        'total_amount',
        'status',
        'delivery_address',
        'delivery_location',
        'delivery_date',
        'payment_method',
        'payment_status',
        'notes',
        'delivery_fee',
        'service_fee'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'delivery_address' => 'array',
        'delivery_date' => 'datetime',
        'delivery_fee' => 'decimal:2',
        'service_fee' => 'decimal:2',
    ];

    // Relationships
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function cooperative()
    {
        return $this->belongsTo(Cooperative::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function deliveryTracking()
    {
        return $this->hasOne(DeliveryTracking::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'delivered');
    }

    public function scopeActive($query)
    {
        return $query->whereNotIn('status', ['cancelled', 'delivered']);
    }

    // Accessors
    public function getSubtotalAttribute()
    {
        return $this->total_amount - $this->delivery_fee - $this->service_fee;
    }
}
