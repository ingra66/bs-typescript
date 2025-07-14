<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();

        $products = [
            [
                'name' => 'Cinturón de Cuero Marrón Clásico',
                'description' => 'Cinturón de cuero genuino marrón, perfecto para uso diario y formal',
                'sku' => 'BELT-001',
                'price' => 15999.99,
                'stock' => 50,
                'category_id' => $categories->where('slug', 'cinturones-cuero')->first()->id,
                'is_active' => true,
                'is_featured' => true,
                'images' => ['belt-1.jpg', 'belt-1-2.jpg'],
            ],
            [
                'name' => 'Cinturón de Cuero Negro Elegante',
                'description' => 'Cinturón negro elegante con hebilla plateada, ideal para eventos formales',
                'sku' => 'BELT-002',
                'price' => 18999.99,
                'stock' => 30,
                'category_id' => $categories->where('slug', 'cinturones-formales')->first()->id,
                'is_active' => true,
                'is_featured' => true,
                'images' => ['belt-2.jpg', 'belt-2-2.jpg'],
            ],
            [
                'name' => 'Cinturón Deportivo Azul',
                'description' => 'Cinturón deportivo de tela azul, cómodo y resistente para actividades físicas',
                'sku' => 'BELT-003',
                'price' => 8999.99,
                'stock' => 75,
                'category_id' => $categories->where('slug', 'cinturones-tela')->first()->id,
                'is_active' => true,
                'is_featured' => false,
                'images' => ['belt-3.jpg'],
            ],
            [
                'name' => 'Hebilla Decorativa Plateada',
                'description' => 'Hebilla decorativa plateada con diseño moderno, compatible con cinturones estándar',
                'sku' => 'BUCKLE-001',
                'price' => 5999.99,
                'stock' => 100,
                'category_id' => $categories->where('slug', 'hebillas')->first()->id,
                'is_active' => true,
                'is_featured' => false,
                'images' => ['buckle-1.jpg'],
            ],
            [
                'name' => 'Cinturón de Cuero Marrón Vintage',
                'description' => 'Cinturón vintage con acabado envejecido, perfecto para looks retro',
                'sku' => 'BELT-004',
                'price' => 21999.99,
                'stock' => 25,
                'category_id' => $categories->where('slug', 'cinturones-cuero')->first()->id,
                'is_active' => true,
                'is_featured' => false,
                'images' => ['belt-4.jpg'],
            ],
            [
                'name' => 'Cinturón Formal Gris',
                'description' => 'Cinturón formal gris con hebilla dorada, elegante para trajes',
                'sku' => 'BELT-005',
                'price' => 24999.99,
                'stock' => 20,
                'category_id' => $categories->where('slug', 'cinturones-formales')->first()->id,
                'is_active' => true,
                'is_featured' => true,
                'images' => ['belt-5.jpg'],
            ],
            [
                'name' => 'Cinturón Deportivo Rojo',
                'description' => 'Cinturón deportivo rojo con cierre de velcro, ideal para gimnasio',
                'sku' => 'BELT-006',
                'price' => 7999.99,
                'stock' => 60,
                'category_id' => $categories->where('slug', 'cinturones-tela')->first()->id,
                'is_active' => true,
                'is_featured' => false,
                'images' => ['belt-6.jpg'],
            ],
            [
                'name' => 'Organizador de Cinturones',
                'description' => 'Organizador de pared para mantener tus cinturones ordenados',
                'sku' => 'ACC-001',
                'price' => 12999.99,
                'stock' => 40,
                'category_id' => $categories->where('slug', 'accesorios')->first()->id,
                'is_active' => true,
                'is_featured' => false,
                'images' => ['acc-1.jpg'],
            ],
            [
                'name' => 'Cinturón de Cuero Negro Básico',
                'description' => 'Cinturón negro básico de cuero, versátil para cualquier ocasión',
                'sku' => 'BELT-007',
                'price' => 13999.99,
                'stock' => 45,
                'category_id' => $categories->where('slug', 'cinturones-cuero')->first()->id,
                'is_active' => true,
                'is_featured' => false,
                'images' => ['belt-7.jpg'],
            ],
            [
                'name' => 'Hebilla Dorada Decorativa',
                'description' => 'Hebilla dorada con diseño clásico, perfecta para cinturones formales',
                'sku' => 'BUCKLE-002',
                'price' => 9999.99,
                'stock' => 80,
                'category_id' => $categories->where('slug', 'hebillas')->first()->id,
                'is_active' => true,
                'is_featured' => false,
                'images' => ['buckle-2.jpg'],
            ],
        ];

        foreach ($products as $product) {
            // Generar slug automáticamente basado en el nombre
            $product['slug'] = \Illuminate\Support\Str::slug($product['name']);
            Product::create($product);
        }

        // Crear algunos productos adicionales con factory
        Product::factory(15)->create();
    }
} 