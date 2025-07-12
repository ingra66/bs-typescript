<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Cinturones de Cuero',
                'description' => 'Cinturones de cuero genuino de alta calidad',
                'slug' => 'cinturones-cuero',
                'is_active' => true,
            ],
            [
                'name' => 'Cinturones de Tela',
                'description' => 'Cinturones deportivos y casuales de tela',
                'slug' => 'cinturones-tela',
                'is_active' => true,
            ],
            [
                'name' => 'Cinturones Formales',
                'description' => 'Cinturones elegantes para ocasiones formales',
                'slug' => 'cinturones-formales',
                'is_active' => true,
            ],
            [
                'name' => 'Hebillas',
                'description' => 'Hebillas decorativas y funcionales',
                'slug' => 'hebillas',
                'is_active' => true,
            ],
            [
                'name' => 'Accesorios',
                'description' => 'Accesorios complementarios para cinturones',
                'slug' => 'accesorios',
                'is_active' => true,
            ],
            [
                'name' => 'Ofertas',
                'description' => 'Productos en oferta especial',
                'slug' => 'ofertas',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
} 