<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);
        
        return [
            'category_id' => Category::inRandomOrder()->first()->id,
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 5000, 50000),
            'compare_price' => fake()->optional()->randomFloat(2, 7500, 60000),
            'stock' => fake()->numberBetween(0, 100),
            'sku' => 'SKU-' . fake()->unique()->numberBetween(1000, 9999),
            'images' => ['product-' . fake()->numberBetween(1, 5) . '.jpg'],
            'is_active' => fake()->boolean(80),
            'is_featured' => fake()->boolean(20),
        ];
    }

    /**
     * Indicate that the product is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the product is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the product is in stock.
     */
    public function inStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => fake()->numberBetween(1, 100),
        ]);
    }
} 