<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;

class ProductController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    /**
     * Display a listing of products with advanced filtering
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query();

        // Cargar relaciones
        $query->with(['category', 'variants', 'reviews']);

        // Filtros básicos
        if ($request->has('active')) {
            $query->active();
        }

        if ($request->has('featured')) {
            $query->featured();
        }

        if ($request->has('in_stock')) {
            $query->inStock();
        }

        // Filtro por categoría
        if ($request->has('category_id')) {
            $query->byCategory($request->category_id);
        }

        if ($request->has('category_slug')) {
            $category = Category::where('slug', $request->category_slug)->first();
            if ($category) {
                $query->byCategory($category->id);
            }
        }

        // Búsqueda por texto
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // Filtro por precio
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filtro por rating
        if ($request->has('min_rating')) {
            $query->whereHas('reviews', function (Builder $q) use ($request) {
                $q->where('rating', '>=', $request->min_rating);
            });
        }

        // Ordenamiento
        $orderBy = $request->get('order_by', 'created_at');
        $orderDirection = $request->get('order_direction', 'desc');
        
        // Ordenamiento especial para rating
        if ($orderBy === 'rating') {
            $query->withAvg('reviews', 'rating')->orderBy('reviews_avg_rating', $orderDirection);
        } else {
            $query->orderBy($orderBy, $orderDirection);
        }

        // Paginación
        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    /**
     * Store a newly created product
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'sku' => 'required|string|unique:products,sku',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Generar slug único
        $validated['slug'] = Str::slug($validated['name']);
        $counter = 1;
        while (Product::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . $counter;
            $counter++;
        }

        // Manejar imágenes usando el servicio
        if ($request->hasFile('images')) {
            $validated['images'] = $this->imageService->processProductImages($request->file('images'));
        }

        $product = Product::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Producto creado exitosamente',
            'data' => $product->load(['category', 'variants']),
        ], 201);
    }

    /**
     * Display the specified product
     */
    public function show(Product $product): JsonResponse
    {
        $product->load([
            'category',
            'variants' => function ($query) {
                $query->active();
            },
            'reviews' => function ($query) {
                $query->approved()->with('user');
            },
        ]);

        // Productos relacionados
        $relatedProducts = Product::active()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with(['category', 'reviews'])
            ->limit(4)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $product,
            'related_products' => $relatedProducts,
        ]);
    }

    /**
     * Update the specified product
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'sku' => 'sometimes|required|string|unique:products,sku,' . $product->id,
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Generar slug único si el nombre cambió
        if (isset($validated['name']) && $validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']);
            $counter = 1;
            while (Product::where('slug', $validated['slug'])
                          ->where('id', '!=', $product->id)
                          ->exists()) {
                $validated['slug'] = Str::slug($validated['name']) . '-' . $counter;
                $counter++;
            }
        }

        // Manejar imágenes usando el servicio
        if ($request->hasFile('images')) {
            // Eliminar imágenes anteriores si existen
            if ($product->images) {
                foreach ($product->images as $image) {
                    $this->imageService->deleteImage($image);
                }
            }
            
            $validated['images'] = $this->imageService->processProductImages($request->file('images'));
        }

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Producto actualizado exitosamente',
            'data' => $product->fresh()->load(['category', 'variants']),
        ]);
    }

    /**
     * Remove the specified product
     */
    public function destroy(Product $product): JsonResponse
    {
        // Eliminar imágenes si existen
        if ($product->images) {
            foreach ($product->images as $image) {
                $this->imageService->deleteImage($image);
            }
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Producto eliminado exitosamente',
        ]);
    }

    /**
     * Get featured products
     */
    public function featured(): JsonResponse
    {
        $products = Product::active()
            ->featured()
            ->inStock()
            ->with(['category', 'reviews'])
            ->limit(8)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Get products by category
     */
    public function byCategory(Category $category, Request $request): JsonResponse
    {
        $query = $category->products()->active();

        // Aplicar filtros adicionales
        if ($request->has('in_stock')) {
            $query->inStock();
        }

        if ($request->has('featured')) {
            $query->featured();
        }

        // Ordenamiento
        $orderBy = $request->get('order_by', 'created_at');
        $orderDirection = $request->get('order_direction', 'desc');
        $query->orderBy($orderBy, $orderDirection);

        // Paginación
        $perPage = $request->get('per_page', 12);
        $products = $query->with(['variants', 'reviews'])->paginate($perPage);

        return response()->json([
            'success' => true,
            'category' => $category,
            'data' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    /**
     * Search products
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:2',
        ]);

        $query = Product::active()->inStock();

        $search = $request->q;
        $query->where(function (Builder $q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('sku', 'like', "%{$search}%");
        });

        $products = $query->with(['category', 'reviews'])
                         ->orderBy('name')
                         ->paginate(12);

        return response()->json([
            'success' => true,
            'search_term' => $search,
            'data' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }
} 