<?php

namespace Database\Seeders;

use App\Models\TaxRate;
use Illuminate\Database\Seeder;

class TaxRateSeeder extends Seeder
{
    public function run(): void
    {
        $taxRates = [
            [
                'name' => 'IVA 21%',
                'description' => 'Impuesto al Valor Agregado estándar',
                'rate' => 21.00,
                'countries' => ['AR'],
                'states' => ['Buenos Aires', 'Córdoba', 'Santa Fe'],
                'cities' => [],
                'is_active' => true,
                'is_compound' => false,
            ],
            [
                'name' => 'IVA 10.5%',
                'description' => 'IVA reducido para productos básicos',
                'rate' => 10.50,
                'countries' => ['AR'],
                'states' => ['Buenos Aires', 'Córdoba', 'Santa Fe'],
                'cities' => [],
                'is_active' => true,
                'is_compound' => false,
            ],
            [
                'name' => 'IVA 27%',
                'description' => 'IVA aumentado para productos de lujo',
                'rate' => 27.00,
                'countries' => ['AR'],
                'states' => ['Buenos Aires', 'Córdoba', 'Santa Fe'],
                'cities' => [],
                'is_active' => true,
                'is_compound' => false,
            ],
            [
                'name' => 'Impuesto Provincial 3%',
                'description' => 'Impuesto provincial de Buenos Aires',
                'rate' => 3.00,
                'countries' => ['AR'],
                'states' => ['Buenos Aires'],
                'cities' => [],
                'is_active' => true,
                'is_compound' => true,
            ],
            [
                'name' => 'Impuesto Municipal 1%',
                'description' => 'Impuesto municipal de CABA',
                'rate' => 1.00,
                'countries' => ['AR'],
                'states' => ['Buenos Aires'],
                'cities' => ['Buenos Aires'],
                'is_active' => true,
                'is_compound' => true,
            ],
        ];

        foreach ($taxRates as $taxRate) {
            TaxRate::create($taxRate);
        }
    }
} 