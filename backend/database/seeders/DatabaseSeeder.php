<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            OrderSeeder::class,
            CouponSeeder::class,
            ShippingZoneSeeder::class,
            TaxRateSeeder::class,
            WishlistSeeder::class,
        ]);
    }
}
