<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, HasUuids, SoftDeletes, Notifiable;

    protected $fillable = [
        'email',
        'phone_number',
        'name',
        'password_hash',
        'user_type',
        'profile_image_url',
        'location',
        'address',
        'is_verified',
        'rating',
        'review_count',
        'status'
    ];

    protected $hidden = ['password_hash'];

    protected $casts = [
        'is_verified' => 'boolean',
        'rating' => 'decimal:1',
        'review_count' => 'integer',
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

    // Accessors & Mutators
    public function setPasswordHashAttribute($value)
    {
        $this->attributes['password_hash'] = bcrypt($value);
    }

    public function getPasswordAttribute()
    {
        return $this->password_hash;
    }
}

// app/Models/Product.php
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

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
