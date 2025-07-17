<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ImageService;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class OptimizeImagesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:process {--dry-run : Show what would be optimized without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process and optimize existing product images with multiple sizes';

    /**
     * Execute the console command.
     */
    public function handle(ImageService $imageService)
    {
        $this->info('Starting image optimization process...');

        // Buscar productos que tengan imágenes en el campo JSON
        $products = Product::whereNotNull('images')->get();
        
        if ($products->isEmpty()) {
            $this->warn('No products with images found.');
            return;
        }

        $this->info("Found {$products->count()} products with images.");

        $totalImages = 0;
        $optimized = 0;
        $errors = 0;

        foreach ($products as $product) {
            $images = $product->images ?? [];
            
            if (empty($images)) {
                continue;
            }

            $this->info("\nProcessing product: {$product->name}");
            $this->line("Found " . count($images) . " images");

            foreach ($images as $index => $imagePath) {
                $totalImages++;
                
                try {
                    if ($this->option('dry-run')) {
                        $this->line("  Would optimize: {$imagePath}");
                    } else {
                        $this->line("  Optimizing: {$imagePath}");
                        
                        // Verificar si la imagen existe
                        if (!Storage::disk('public')->exists($imagePath)) {
                            $this->warn("    Image not found: {$imagePath}");
                            continue;
                        }

                        // Optimizar la imagen
                        $success = $imageService->optimizeExistingImage($imagePath);
                        
                        if ($success) {
                            $optimized++;
                            $this->info("    ✓ Optimized successfully");
                        } else {
                            $this->warn("    ⚠ Could not optimize image");
                        }
                    }
                } catch (\Exception $e) {
                    $this->error("    Error optimizing {$imagePath}: " . $e->getMessage());
                    $errors++;
                }
            }

            // Las imágenes se optimizan in-place, no necesitamos actualizar el array
            if (!$this->option('dry-run') && $optimized > 0) {
                $this->info("    Updated product: {$product->name}");
            }
        }

        if ($this->option('dry-run')) {
            $this->info("\nDry run completed. No changes were made.");
            $this->info("Would process {$totalImages} images from {$products->count()} products.");
        } else {
            $this->info("\nOptimization completed:");
            $this->info("- Products processed: {$products->count()}");
            $this->info("- Total images found: {$totalImages}");
            $this->info("- Images optimized: {$optimized}");
            $this->info("- Errors: {$errors}");
        }
    }
} 