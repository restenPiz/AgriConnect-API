<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CooperativeMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'cooperative_id',
        'farmer_id',
        'role',
        'contribution_percentage',
        'status',
        'joined_at',
        'left_at'
    ];

    protected $casts = [
        'contribution_percentage' => 'decimal:2',
        'joined_at' => 'datetime',
        'left_at' => 'datetime',
    ];

    // Relationships
    public function cooperative()
    {
        return $this->belongsTo(Cooperative::class);
    }

    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeCoordinators($query)
    {
        return $query->where('role', 'coordinator');
    }
}
