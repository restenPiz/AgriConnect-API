<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FarmerProfile extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'farmer_id',
        'farm_name',
        'farm_size_hectares',
        'farming_experience_years',
        'certifications',
        'specializations',
        'preferred_crops',
        'farming_methods'
    ];

    protected $casts = [
        'farm_size_hectares' => 'decimal:2',
        'farming_experience_years' => 'integer',
        'certifications' => 'array',
        'specializations' => 'array',
        'preferred_crops' => 'array',
        'farming_methods' => 'array',
    ];

    // Relationships
    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }
}
