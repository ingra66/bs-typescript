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
        // Debug: Log request data
        \Log::info('Category store request', [
            'has_file' => $request->hasFile('image'),
            'files' => $request->allFiles(),
            'data' => $request->all(),
            'content_type' => $request->header('Content-Type'),
            'storage_path' => storage_path('app/public'),
            'storage_exists' => \Storage::disk('public')->exists('categories'),
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_active' => 'nullable|in:true,false,0,1,"true","false","0","1"',
        ]);

        // Convertir is_active a boolean si está presente
        if (isset($validated['is_active'])) {
            if (is_string($validated['is_active'])) {
                $validated['is_active'] = in_array(strtolower($validated['is_active']), ['true', '1', 'yes']);
            } else {
                $validated['is_active'] = (bool) $validated['is_active'];
            }
        } else {
            // Si no se proporciona, establecer como true por defecto
            $validated['is_active'] = true;
        }

        // Generar slug único
        $validated['slug'] = Str::slug($validated['name']);
        $counter = 1;
        while (Category::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . $counter;
            $counter++;
        }

        // Manejar imagen con método alternativo
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            
            // Verificar que el archivo sea válido
            if ($file && $file->isValid() && $file->getSize() > 0) {
                try {
                    // Método alternativo: usar move() en lugar de store()
                    $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                    $destinationPath = storage_path('app/public/categories');
                    
                    // Crear directorio si no existe
                    if (!file_exists($destinationPath)) {
                        mkdir($destinationPath, 0755, true);
                        \Log::info('Created categories directory: ' . $destinationPath);
                    }
                    
                    $fullPath = $destinationPath . '/' . $fileName;
                    
                    \Log::info('Attempting to move file', [
                        'fileName' => $fileName,
                        'destinationPath' => $destinationPath,
                        'fullPath' => $fullPath,
                    ]);
                    
                    // Mover archivo usando move()
                    if ($file->move($destinationPath, $fileName)) {
                        $validated['image'] = 'categories/' . $fileName;
                        \Log::info('Image moved successfully: ' . $validated['image']);
                    } else {
                        \Log::error('Failed to move image file');
                        return response()->json([
                            'success' => false,
                            'message' => 'Error al mover la imagen',
                        ], 422);
                    }
                } catch (\Exception $e) {
                    \Log::error('Error moving image: ' . $e->getMessage());
                    return response()->json([
                        'success' => false,
                        'message' => 'Error al subir la imagen: ' . $e->getMessage(),
                    ], 422);
                }
            } else {
                \Log::warning('Invalid image file provided', [
                    'file_exists' => $file ? 'yes' : 'no',
                    'is_valid' => $file ? $file->isValid() : 'no',
                    'size' => $file ? $file->getSize() : 'no',
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'El archivo de imagen no es válido',
                ], 422);
            }
        } else {
            // Si no hay imagen, no incluir el campo
            unset($validated['image']);
            \Log::info('No image provided');
        }

        try {
            $category = Category::create($validated);
            
            \Log::info('Category created successfully', ['category_id' => $category->id]);

            return response()->json([
                'success' => true,
                'message' => 'Categoría creada exitosamente',
                'data' => $category,
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creating category: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la categoría: ' . $e->getMessage(),
            ], 500);
        }
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_active' => 'nullable|in:true,false,0,1,"true","false","0","1"',
        ]);

        // Convertir is_active a boolean si está presente
        if (isset($validated['is_active'])) {
            if (is_string($validated['is_active'])) {
                $validated['is_active'] = in_array(strtolower($validated['is_active']), ['true', '1', 'yes']);
            } else {
                $validated['is_active'] = (bool) $validated['is_active'];
            }
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

        // Manejar imagen con método alternativo
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            
            // Verificar que el archivo sea válido
            if ($file && $file->isValid() && $file->getSize() > 0) {
                \Log::info('Processing image upload', [
                    'original_name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType()
                ]);

                try {
                    // Eliminar imagen anterior si existe
                    if ($category->image) {
                        $oldImagePath = storage_path('app/public/' . $category->image);
                        if (file_exists($oldImagePath)) {
                            unlink($oldImagePath);
                            \Log::info('Deleted old image: ' . $category->image);
                        }
                    }
                    
                    // Método alternativo: usar move() en lugar de store()
                    $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                    $destinationPath = storage_path('app/public/categories');
                    
                    // Crear directorio si no existe
                    if (!file_exists($destinationPath)) {
                        mkdir($destinationPath, 0755, true);
                        \Log::info('Created categories directory: ' . $destinationPath);
                    }
                    
                    $fullPath = $destinationPath . '/' . $fileName;
                    
                    \Log::info('Attempting to move file', [
                        'fileName' => $fileName,
                        'destinationPath' => $destinationPath,
                        'fullPath' => $fullPath,
                    ]);
                    
                    // Mover archivo usando move()
                    if ($file->move($destinationPath, $fileName)) {
                        $validated['image'] = 'categories/' . $fileName;
                        \Log::info('Image moved successfully: ' . $validated['image']);
                    } else {
                        \Log::error('Failed to move image file');
                        return response()->json([
                            'success' => false,
                            'message' => 'Error al mover la imagen',
                        ], 422);
                    }
                } catch (\Exception $e) {
                    \Log::error('Error moving image: ' . $e->getMessage());
                    return response()->json([
                        'success' => false,
                        'message' => 'Error al subir la imagen: ' . $e->getMessage(),
                    ], 422);
                }
            } else {
                \Log::warning('Invalid image file provided', [
                    'file_exists' => $file ? 'yes' : 'no',
                    'is_valid' => $file ? $file->isValid() : 'no',
                    'size' => $file ? $file->getSize() : 'no',
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'El archivo de imagen no es válido',
                ], 422);
            }
        } else {
            // Si no hay imagen, no incluir el campo
            unset($validated['image']);
            \Log::info('No image provided');
        }

        try {
            \Log::info('Updating category with data:', $validated);
            $category->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Categoría actualizada exitosamente',
                'data' => $category->fresh()->load('products'),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating category: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la categoría: ' . $e->getMessage(),
            ], 500);
        }
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