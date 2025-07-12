<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'WELCOME10',
                'name' => 'Descuento de Bienvenida',
                'description' => '10% de descuento en tu primera compra',
                'type' => 'percentage',
                'value' => 10,
                'minimum_amount' => 50.00,
                'max_uses' => 100,
                'starts_at' => now(),
                'expires_at' => now()->addMonths(3),
                'is_active' => true,
            ],
            [
                'code' => 'FREESHIP',
                'name' => 'Envío Gratis',
                'description' => 'Envío gratis en compras superiores a $100',
                'type' => 'fixed',
                'value' => 15.00,
                'minimum_amount' => 100.00,
                'max_uses' => 50,
                'starts_at' => now(),
                'expires_at' => now()->addMonths(2),
                'is_active' => true,
            ],
            [
                'code' => 'SUMMER20',
                'name' => 'Oferta de Verano',
                'description' => '20% de descuento en cinturones deportivos',
                'type' => 'percentage',
                'value' => 20,
                'minimum_amount' => 30.00,
                'max_uses' => 75,
                'starts_at' => now(),
                'expires_at' => now()->addMonths(1),
                'is_active' => true,
            ],
            [
                'code' => 'FLASH25',
                'name' => 'Oferta Relámpago',
                'description' => '25% de descuento por tiempo limitado',
                'type' => 'percentage',
                'value' => 25,
                'minimum_amount' => 75.00,
                'max_uses' => 25,
                'starts_at' => now(),
                'expires_at' => now()->addDays(7),
                'is_active' => true,
            ],
            [
                'code' => 'LOYALTY15',
                'name' => 'Descuento para Clientes Fieles',
                'description' => '15% de descuento para clientes recurrentes',
                'type' => 'percentage',
                'value' => 15,
                'minimum_amount' => 60.00,
                'max_uses' => 200,
                'starts_at' => now(),
                'expires_at' => now()->addMonths(6),
                'is_active' => true,
            ],
        ];

        foreach ($coupons as $coupon) {
            Coupon::create($coupon);
        }
    }
} 