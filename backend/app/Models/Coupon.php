<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Coupon extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'description',
        'type',
        'value',
        'minimum_amount',
        'max_uses',
        'used_count',
        'starts_at',
        'expires_at',
        'is_active',
        'applicable_categories',
        'excluded_products',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'minimum_amount' => 'decimal:2',
        'starts_at' => 'date',
        'expires_at' => 'date',
        'is_active' => 'boolean',
        'applicable_categories' => 'array',
        'excluded_products' => 'array',
    ];

    const TYPE_PERCENTAGE = 'percentage';
    const TYPE_FIXED = 'fixed';

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeValid($query)
    {
        $now = Carbon::now();
        return $query->where('is_active', true)
                    ->where(function ($q) use ($now) {
                        $q->whereNull('starts_at')
                          ->orWhere('starts_at', '<=', $now);
                    })
                    ->where(function ($q) use ($now) {
                        $q->whereNull('expires_at')
                          ->orWhere('expires_at', '>=', $now);
                    });
    }

    // Métodos
    public function isValid()
    {
        $now = Carbon::now();
        
        if (!$this->is_active) {
            return false;
        }

        if ($this->starts_at && $now->lt($this->starts_at)) {
            return false;
        }

        if ($this->expires_at && $now->gt($this->expires_at)) {
            return false;
        }

        if ($this->max_uses && $this->used_count >= $this->max_uses) {
            return false;
        }

        return true;
    }

    public function calculateDiscount($subtotal)
    {
        if ($subtotal < $this->minimum_amount) {
            return 0;
        }

        if ($this->type === self::TYPE_PERCENTAGE) {
            return ($subtotal * $this->value) / 100;
        }

        return $this->value;
    }

    public function canApplyToProduct($productId)
    {
        if ($this->excluded_products && in_array($productId, $this->excluded_products)) {
            return false;
        }

        return true;
    }

    public function canApplyToCategory($categoryId)
    {
        if ($this->applicable_categories && !in_array($categoryId, $this->applicable_categories)) {
            return false;
        }

        return true;
    }

    public function incrementUsage()
    {
        $this->increment('used_count');
    }

    public function getFormattedValueAttribute()
    {
        if ($this->type === self::TYPE_PERCENTAGE) {
            return $this->value . '%';
        }
        return '$' . number_format($this->value, 2);
    }

    public function getTypeLabelAttribute()
    {
        return [
            self::TYPE_PERCENTAGE => 'Porcentaje',
            self::TYPE_FIXED => 'Monto fijo',
        ][$this->type] ?? $this->type;
    }
} 