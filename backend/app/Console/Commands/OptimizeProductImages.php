<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Services\ImageService;
use Illuminate\Console\Command;

class OptimizeProductImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:optimize {--product-id= : Optimizar un producto específico} {--all : Optimizar todos los productos}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimizar imágenes de productos existentes';

    protected $imageService;

    /**
     * Create a new command instance.
     */
    public function __construct(ImageService $imageService)
    {
        parent::__construct();
        $this->imageService = $imageService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $productId = $this->option('product-id');
        $optimizeAll = $this->option('all');

        if ($productId) {
            $this->optimizeSingleProduct($productId);
        } elseif ($optimizeAll) {
            $this->optimizeAllProducts();
        } else {
            $this->error('Debes especificar --product-id o --all');
            return 1;
        }

        return 0;
    }

    /**
     * Optimizar un producto específico
     */
    private function optimizeSingleProduct($productId)
    {
        $product = Product::find($productId);
        
        if (!$product) {
            $this->error("Producto con ID {$productId} no encontrado");
            return;
        }

        $this->info("Optimizando imágenes del producto: {$product->name}");
        
        if (!$product->images) {
            $this->warn("El producto no tiene imágenes");
            return;
        }

        $bar = $this->output->createProgressBar(count($product->images));
        $bar->start();

        foreach ($product->images as $imagePath) {
            $this->imageService->optimizeExistingImage($imagePath);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Imágenes del producto optimizadas correctamente");
    }

    /**
     * Optimizar todos los productos
     */
    private function optimizeAllProducts()
    {
        $products = Product::whereNotNull('images')->get();
        
        if ($products->isEmpty()) {
            $this->warn("No hay productos con imágenes para optimizar");
            return;
        }

        $this->info("Optimizando imágenes de {$products->count()} productos");
        
        $bar = $this->output->createProgressBar($products->count());
        $bar->start();

        foreach ($products as $product) {
            if ($product->images) {
                foreach ($product->images as $imagePath) {
                    $this->imageService->optimizeExistingImage($imagePath);
                }
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Todas las imágenes han sido optimizadas correctamente");
    }
} 