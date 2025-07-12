<?php

namespace Database\Seeders;

use App\Models\ShippingZone;
use Illuminate\Database\Seeder;

class ShippingZoneSeeder extends Seeder
{
    public function run(): void
    {
        $zones = [
            [
                'name' => 'Zona Local',
                'description' => 'Envío dentro de la ciudad',
                'countries' => ['AR'],
                'states' => ['Buenos Aires'],
                'cities' => ['Buenos Aires', 'La Plata'],
                'postal_codes' => ['1000', '2000', '3000'],
                'base_rate' => 5.00,
                'free_shipping_threshold' => 100.00,
                'estimated_days_min' => 1,
                'estimated_days_max' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Zona Nacional',
                'description' => 'Envío a todo el país',
                'countries' => ['AR'],
                'states' => ['Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán'],
                'cities' => [],
                'postal_codes' => [],
                'base_rate' => 12.00,
                'free_shipping_threshold' => 150.00,
                'estimated_days_min' => 3,
                'estimated_days_max' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Zona Sur',
                'description' => 'Envío a provincias del sur',
                'countries' => ['AR'],
                'states' => ['Río Negro', 'Neuquén', 'Chubut', 'Santa Cruz'],
                'cities' => [],
                'postal_codes' => [],
                'base_rate' => 18.00,
                'free_shipping_threshold' => 200.00,
                'estimated_days_min' => 5,
                'estimated_days_max' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Zona Norte',
                'description' => 'Envío a provincias del norte',
                'countries' => ['AR'],
                'states' => ['Salta', 'Jujuy', 'Santiago del Estero', 'Chaco'],
                'cities' => [],
                'postal_codes' => [],
                'base_rate' => 20.00,
                'free_shipping_threshold' => 250.00,
                'estimated_days_min' => 7,
                'estimated_days_max' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Envío Express',
                'description' => 'Envío prioritario en 24 horas',
                'countries' => ['AR'],
                'states' => ['Buenos Aires'],
                'cities' => ['Buenos Aires'],
                'postal_codes' => ['1000', '2000'],
                'base_rate' => 25.00,
                'free_shipping_threshold' => 300.00,
                'estimated_days_min' => 1,
                'estimated_days_max' => 1,
                'is_active' => true,
            ],
        ];

        foreach ($zones as $zone) {
            ShippingZone::create($zone);
        }
    }
} 