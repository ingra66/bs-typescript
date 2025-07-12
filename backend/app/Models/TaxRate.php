<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaxRate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'rate',
        'country',
        'state',
        'city',
        'postal_code',
        'is_compound',
        'is_shipping',
        'priority',
        'is_active',
    ];

    protected $casts = [
        'rate' => 'decimal:2',
        'is_compound' => 'boolean',
        'is_shipping' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByLocation($query, $country = null, $state = null, $city = null, $postalCode = null)
    {
        return $query->where(function ($q) use ($country, $state, $city, $postalCode) {
            $q->whereNull('country')
              ->orWhere('country', $country);
        })->where(function ($q) use ($state) {
            $q->whereNull('state')
              ->orWhere('state', $state);
        })->where(function ($q) use ($city) {
            $q->whereNull('city')
              ->orWhere('city', $city);
        })->where(function ($q) use ($postalCode) {
            $q->whereNull('postal_code')
              ->orWhere('postal_code', $postalCode);
        });
    }

    public function scopeForShipping($query)
    {
        return $query->where('is_shipping', true);
    }

    public function scopeCompound($query)
    {
        return $query->where('is_compound', true);
    }

    // Métodos
    public function calculateTax($amount)
    {
        return ($amount * $this->rate) / 100;
    }

    public function isApplicable($country = null, $state = null, $city = null, $postalCode = null)
    {
        if (!$this->is_active) {
            return false;
        }

        if ($country && $this->country && $this->country !== $country) {
            return false;
        }

        if ($state && $this->state && $this->state !== $state) {
            return false;
        }

        if ($city && $this->city && $this->city !== $city) {
            return false;
        }

        if ($postalCode && $this->postal_code && $this->postal_code !== $postalCode) {
            return false;
        }

        return true;
    }

    public function getFormattedRateAttribute()
    {
        return $this->rate . '%';
    }

    public function getTypeLabelAttribute()
    {
        $labels = [];
        
        if ($this->is_shipping) {
            $labels[] = 'Envío';
        }
        
        if ($this->is_compound) {
            $labels[] = 'Compuesto';
        }
        
        return implode(', ', $labels) ?: 'Producto';
    }
} 