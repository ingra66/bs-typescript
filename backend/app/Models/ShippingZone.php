<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingZone extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'countries',
        'states',
        'cities',
        'postal_codes',
        'base_rate',
        'free_shipping_threshold',
        'estimated_days_min',
        'estimated_days_max',
        'is_active',
    ];

    protected $casts = [
        'countries' => 'array',
        'states' => 'array',
        'cities' => 'array',
        'postal_codes' => 'array',
        'base_rate' => 'decimal:2',
        'free_shipping_threshold' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Métodos
    public function calculateShippingCost($subtotal, $weight = 0)
    {
        if ($this->free_shipping_threshold && $subtotal >= $this->free_shipping_threshold) {
            return 0;
        }

        return $this->base_rate;
    }

    public function isApplicable($country = null, $state = null, $city = null, $postalCode = null)
    {
        if (!$this->is_active) {
            return false;
        }

        if ($country && $this->countries && !in_array($country, $this->countries)) {
            return false;
        }

        if ($state && $this->states && !in_array($state, $this->states)) {
            return false;
        }

        if ($city && $this->cities && !in_array($city, $this->cities)) {
            return false;
        }

        if ($postalCode && $this->postal_codes && !in_array($postalCode, $this->postal_codes)) {
            return false;
        }

        return true;
    }

    public function getEstimatedDeliveryDaysAttribute()
    {
        if ($this->estimated_days_min && $this->estimated_days_max) {
            return "{$this->estimated_days_min}-{$this->estimated_days_max} días";
        }
        return null;
    }

    public function getFormattedBaseRateAttribute()
    {
        return '$' . number_format($this->base_rate, 2);
    }

    public function getFormattedFreeShippingThresholdAttribute()
    {
        if ($this->free_shipping_threshold) {
            return '$' . number_format($this->free_shipping_threshold, 2);
        }
        return null;
    }
} 