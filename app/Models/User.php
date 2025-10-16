<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, HasUuids, SoftDeletes, Notifiable;

    protected $fillable = [
        'email',
        'phone_number',
        'name',
        'password',  // Changed from password_hash
        'user_type',
        'profile_image_url',
        'location',
        'address',
        'is_verified',
        'rating',
        'review_count',
        'status'
    ];

    protected $hidden = [
        'password',  // Changed from password_hash
        'remember_token'
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'rating' => 'decimal:1',
        'review_count' => 'integer',
        'email_verified_at' => 'datetime',
        'password' => 'hashed',  // Laravel 11 auto-hashing
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // Relationships
    public function products()
    {
        return $this->hasMany(Product::class, 'farmer_id');
    }

    public function buyerOrders()
    {
        return $this->hasMany(Order::class, 'buyer_id');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'farmer_id');
    }

    public function coordinatedCooperatives()
    {
        return $this->hasMany(Cooperative::class, 'coordinator_id');
    }

    public function cooperativeMemberships()
    {
        return $this->hasMany(CooperativeMember::class, 'farmer_id');
    }

    public function cooperatives()
    {
        return $this->belongsToMany(Cooperative::class, 'cooperative_members', 'farmer_id', 'cooperative_id')
            ->withPivot(['role', 'contribution_percentage', 'status', 'joined_at', 'left_at'])
            ->withTimestamps();
    }

    public function sentPayments()
    {
        return $this->hasMany(Payment::class, 'payer_id');
    }

    public function receivedPayments()
    {
        return $this->hasMany(Payment::class, 'payee_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function farmerProfile()
    {
        return $this->hasOne(FarmerProfile::class, 'farmer_id');
    }

    public function buyerProfile()
    {
        return $this->hasOne(BuyerProfile::class, 'buyer_id');
    }

    public function deliveryTracking()
    {
        return $this->hasMany(DeliveryTracking::class, 'transporter_id');
    }

    // Scopes
    public function scopeFarmers($query)
    {
        return $query->where('user_type', 'farmer');
    }

    public function scopeBuyers($query)
    {
        return $query->where('user_type', 'buyer');
    }

    public function scopeTransporters($query)
    {
        return $query->where('user_type', 'transporter');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
