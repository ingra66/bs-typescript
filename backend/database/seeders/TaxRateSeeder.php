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
                'rate' => 21.00,
                'country' => 'AR',
                'state' => 'Buenos Aires',
                'city' => null,
                'postal_code' => null,
                'is_compound' => false,
                'is_shipping' => false,
                'priority' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'IVA 10.5%',
                'rate' => 10.50,
                'country' => 'AR',
                'state' => 'Buenos Aires',
                'city' => null,
                'postal_code' => null,
                'is_compound' => false,
                'is_shipping' => false,
                'priority' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'IVA 27%',
                'rate' => 27.00,
                'country' => 'AR',
                'state' => 'Buenos Aires',
                'city' => null,
                'postal_code' => null,
                'is_compound' => false,
                'is_shipping' => false,
                'priority' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Impuesto Provincial 3%',
                'rate' => 3.00,
                'country' => 'AR',
                'state' => 'Buenos Aires',
                'city' => null,
                'postal_code' => null,
                'is_compound' => true,
                'is_shipping' => false,
                'priority' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Impuesto Municipal 1%',
                'rate' => 1.00,
                'country' => 'AR',
                'state' => 'Buenos Aires',
                'city' => 'Buenos Aires',
                'postal_code' => null,
                'is_compound' => true,
                'is_shipping' => false,
                'priority' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($taxRates as $taxRate) {
            TaxRate::create($taxRate);
        }
    }
} 