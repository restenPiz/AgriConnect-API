<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cooperative extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'coordinator_id',
        'name',
        'description',
        'type',
        'status',
        'member_count',
        'total_orders',
        'total_revenue',
        'governance_rules',
        'primary_location'
    ];

    protected $casts = [
        'member_count' => 'integer',
        'total_orders' => 'integer',
        'total_revenue' => 'decimal:2',
        'governance_rules' => 'array',
    ];

    // Relationships
    public function coordinator()
    {
        return $this->belongsTo(User::class, 'coordinator_id');
    }

    public function members()
    {
        return $this->hasMany(CooperativeMember::class);
    }

    public function farmers()
    {
        return $this->belongsToMany(User::class, 'cooperative_members', 'cooperative_id', 'farmer_id')
            ->withPivot(['role', 'contribution_percentage', 'status', 'joined_at', 'left_at'])
            ->withTimestamps();
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopePermanent($query)
    {
        return $query->where('type', 'permanent');
    }

    public function scopeTemporary($query)
    {
        return $query->where('type', 'temporary');
    }
}
