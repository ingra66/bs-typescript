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
                'shipping_cost' => 5.00,
                'free_shipping_threshold' => 100.00,
                'estimated_days' => '1-2 días',
                'is_active' => true,
            ],
            [
                'name' => 'Zona Nacional',
                'description' => 'Envío a todo el país',
                'countries' => ['AR'],
                'states' => ['Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán'],
                'cities' => [],
                'postal_codes' => [],
                'shipping_cost' => 12.00,
                'free_shipping_threshold' => 150.00,
                'estimated_days' => '3-5 días',
                'is_active' => true,
            ],
            [
                'name' => 'Zona Sur',
                'description' => 'Envío a provincias del sur',
                'countries' => ['AR'],
                'states' => ['Río Negro', 'Neuquén', 'Chubut', 'Santa Cruz'],
                'cities' => [],
                'postal_codes' => [],
                'shipping_cost' => 18.00,
                'free_shipping_threshold' => 200.00,
                'estimated_days' => '5-7 días',
                'is_active' => true,
            ],
            [
                'name' => 'Zona Norte',
                'description' => 'Envío a provincias del norte',
                'countries' => ['AR'],
                'states' => ['Salta', 'Jujuy', 'Santiago del Estero', 'Chaco'],
                'cities' => [],
                'postal_codes' => [],
                'shipping_cost' => 20.00,
                'free_shipping_threshold' => 250.00,
                'estimated_days' => '7-10 días',
                'is_active' => true,
            ],
            [
                'name' => 'Envío Express',
                'description' => 'Envío prioritario en 24 horas',
                'countries' => ['AR'],
                'states' => ['Buenos Aires'],
                'cities' => ['Buenos Aires'],
                'postal_codes' => ['1000', '2000'],
                'shipping_cost' => 25.00,
                'free_shipping_threshold' => 300.00,
                'estimated_days' => '24 horas',
                'is_active' => true,
            ],
        ];

        foreach ($zones as $zone) {
            ShippingZone::create($zone);
        }
    }
} 