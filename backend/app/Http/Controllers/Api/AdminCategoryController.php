<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminCategoryController extends Controller
{
    /**
     * Display a listing of categories with pagination
     */
    public function index(Request $request): JsonResponse
    {
        $query = Category::query();

        // Filtros
        if ($request->has('active')) {
            $query->active();
        }

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        // Incluir conteo de productos
        $query->withProducts();

        // Ordenamiento
        $orderBy = $request->get('order_by', 'name');
        $orderDirection = $request->get('order_direction', 'asc');
        $query->orderBy($orderBy, $orderDirection);

        // Paginación
        $perPage = $request->get('per_page', 15);
        $categories = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $categories->items(),
            'pagination' => [
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
            ],
        ]);
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'nullable|in:true,false,0,1',
        ]);

        // Convertir is_active a boolean si está presente
        if (isset($validated['is_active'])) {
            $validated['is_active'] = filter_var($validated['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        // Generar slug único
        $validated['slug'] = Str::slug($validated['name']);
        $counter = 1;
        while (Category::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . $counter;
            $counter++;
        }

        // Manejar imagen
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Categoría creada exitosamente',
            'data' => $category,
        ], 201);
    }

    /**
     * Display the specified category
     */
    public function show(Category $category): JsonResponse
    {
        $category->load(['products' => function ($query) {
            $query->select('id', 'name', 'category_id', 'is_active', 'created_at');
        }]);

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    /**
     * Update the specified category
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        // Debug: Log request data
        \Log::info('Category update request', [
            'has_file' => $request->hasFile('image'),
            'files' => $request->allFiles(),
            'data' => $request->all(),
            'content_type' => $request->header('Content-Type'),
            'method' => $request->method(),
            'url' => $request->url()
        ]);

        $validated = $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('categories')->ignore($category->id)
            ],
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'nullable|in:true,false,0,1',
        ]);

        // Convertir is_active a boolean si está presente
        if (isset($validated['is_active'])) {
            $validated['is_active'] = filter_var($validated['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        // Generar slug único si el nombre cambió
        if (isset($validated['name']) && $validated['name'] !== $category->name) {
            $validated['slug'] = Str::slug($validated['name']);
            $counter = 1;
            while (Category::where('slug', $validated['slug'])
                          ->where('id', '!=', $category->id)
                          ->exists()) {
                $validated['slug'] = Str::slug($validated['name']) . '-' . $counter;
                $counter++;
            }
        }

        // Manejar imagen
        if ($request->hasFile('image')) {
            \Log::info('Processing image upload', [
                'original_name' => $request->file('image')->getClientOriginalName(),
                'size' => $request->file('image')->getSize(),
                'mime_type' => $request->file('image')->getMimeType()
            ]);

            // Eliminar imagen anterior si existe
            if ($category->image) {
                \Storage::disk('public')->delete($category->image);
                \Log::info('Deleted old image: ' . $category->image);
            }
            
            $validated['image'] = $request->file('image')->store('categories', 'public');
            \Log::info('Saved new image: ' . $validated['image']);
        } else {
            \Log::info('No image file in request');
        }

        \Log::info('Updating category with data:', $validated);
        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Categoría actualizada exitosamente',
            'data' => $category->fresh()->load('products'),
        ]);
    }

    /**
     * Remove the specified category
     */
    public function destroy(Category $category): JsonResponse
    {
        $productsCount = $category->products()->count();
        
        if ($productsCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "No se puede eliminar la categoría porque tiene {$productsCount} productos asociados",
                'data' => [
                    'products_count' => $productsCount,
                    'products' => $category->products()->select('id', 'name', 'sku')->get()
                ]
            ], 422);
        }

        // Eliminar imagen si existe
        if ($category->image) {
            \Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Categoría eliminada exitosamente',
        ]);
    }

    /**
     * Toggle category status (active/inactive)
     */
    public function toggleStatus(Category $category): JsonResponse
    {
        $category->update(['is_active' => !$category->is_active]);

        return response()->json([
            'success' => true,
            'message' => $category->is_active ? 'Categoría activada' : 'Categoría desactivada',
            'data' => $category->fresh(),
        ]);
    }

    /**
     * Upload category image
     */
    public function uploadImage(Request $request, Category $category): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Eliminar imagen anterior si existe
        if ($category->image) {
            \Storage::disk('public')->delete($category->image);
        }

        // Guardar nueva imagen
        $imagePath = $request->file('image')->store('categories', 'public');
        $category->update(['image' => $imagePath]);

        return response()->json([
            'success' => true,
            'message' => 'Imagen de categoría actualizada exitosamente',
            'data' => [
                'image_url' => $category->image_url,
                'category' => $category->fresh()
            ],
        ]);
    }

    /**
     * Get categories for dropdown/select
     */
    public function forSelect(): JsonResponse
    {
        $categories = Category::active()
            ->select('id', 'name', 'slug')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Get category statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_categories' => Category::count(),
            'active_categories' => Category::active()->count(),
            'categories_with_products' => Category::has('products')->count(),
            'categories_without_products' => Category::doesntHave('products')->count(),
            'total_products' => \App\Models\Product::count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
} 