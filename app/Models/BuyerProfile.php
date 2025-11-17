<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuyerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id',
        'business_name',
        'business_type',
        'tax_number',
        'preferred_suppliers',
        'average_order_value'
    ];

    protected $casts = [
        'preferred_suppliers' => 'array',
        'average_order_value' => 'decimal:2',
    ];

    // Relationships
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }
}
