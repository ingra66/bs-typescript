<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Wishlist;
use App\Models\User;
use App\Models\Product;

class WishlistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener algunos usuarios y productos existentes
        $users = User::take(5)->get();
        $products = Product::take(10)->get();

        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->info('No hay usuarios o productos suficientes para crear wishlist de prueba.');
            return;
        }

        // Crear wishlist items de prueba
        foreach ($users as $user) {
            // Agregar 1-3 productos aleatorios a la wishlist de cada usuario
            $randomProducts = $products->random(rand(1, 3));
            
            foreach ($randomProducts as $product) {
                Wishlist::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'notes' => rand(0, 1) ? 'Producto favorito' : null,
                    'is_public' => rand(0, 1),
                ]);
            }
        }

        $this->command->info('Wishlist de prueba creada exitosamente.');
    }
} 