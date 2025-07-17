<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'compare_price',
        'stock',
        'sku',
        'images',
        'is_active',
        'is_featured',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'images' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    // Relaciones
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    // Métodos para manejo de imágenes
    public function getMainImageAttribute()
    {
        if ($this->images && count($this->images) > 0) {
            return asset('storage/' . $this->images[0]);
        }
        return asset('images/default-product.jpg');
    }

    public function getThumbnailAttribute()
    {
        if ($this->images && count($this->images) > 0) {
            $imagePath = $this->images[0];
            $thumbnailPath = str_replace('.', '_thumb.', $imagePath);
            
            // Verificar si existe el thumbnail
            if (Storage::disk('public')->exists($thumbnailPath)) {
                return asset('storage/' . $thumbnailPath);
            }
            
            // Si no existe, crear el thumbnail
            return $this->createThumbnail($imagePath, $thumbnailPath);
        }
        return asset('images/default-product-thumb.jpg');
    }

    public function getMediumImageAttribute()
    {
        if ($this->images && count($this->images) > 0) {
            $imagePath = $this->images[0];
            $mediumPath = str_replace('.', '_medium.', $imagePath);
            
            if (Storage::disk('public')->exists($mediumPath)) {
                return asset('storage/' . $mediumPath);
            }
            
            return $this->createMediumImage($imagePath, $mediumPath);
        }
        return asset('images/default-product-medium.jpg');
    }

    public function getAllImagesAttribute()
    {
        if (!$this->images) {
            return [];
        }

        $images = [];
        foreach ($this->images as $image) {
            $images[] = [
                'original' => asset('storage/' . $image),
                'thumbnail' => asset('storage/' . str_replace('.', '_thumb.', $image)),
                'medium' => asset('storage/' . str_replace('.', '_medium.', $image)),
            ];
        }
        return $images;
    }

    private function createThumbnail($originalPath, $thumbnailPath)
    {
        try {
            $imageManager = new ImageManager(new Driver());
            $image = $imageManager->read(Storage::disk('public')->path($originalPath));
            $image->cover(300, 300);
            
            Storage::disk('public')->put($thumbnailPath, $image->encode());
            return asset('storage/' . $thumbnailPath);
        } catch (\Exception $e) {
            return asset('images/default-product-thumb.jpg');
        }
    }

    private function createMediumImage($originalPath, $mediumPath)
    {
        try {
            $imageManager = new ImageManager(new Driver());
            $image = $imageManager->read(Storage::disk('public')->path($originalPath));
            $image->scaleDown(600, 600);
            
            Storage::disk('public')->put($mediumPath, $image->encode());
            return asset('storage/' . $mediumPath);
        } catch (\Exception $e) {
            return asset('images/default-product-medium.jpg');
        }
    }

    public function optimizeImages()
    {
        if (!$this->images) {
            return;
        }

        $imageManager = new ImageManager(new Driver());

        foreach ($this->images as $imagePath) {
            try {
                $image = $imageManager->read(Storage::disk('public')->path($imagePath));
                
                // Optimizar calidad
                $image->toJpeg(85);
                
                Storage::disk('public')->put($imagePath, $image->encode());
            } catch (\Exception $e) {
                // Log error pero no fallar
                \Log::error("Error optimizing image: " . $e->getMessage());
            }
        }
    }

    public function getDiscountPercentageAttribute()
    {
        if ($this->compare_price && $this->compare_price > $this->price) {
            return round((($this->compare_price - $this->price) / $this->compare_price) * 100);
        }
        return 0;
    }

    public function getAverageRatingAttribute()
    {
        return $this->reviews()->avg('rating') ?? 0;
    }

    public function getReviewsCountAttribute()
    {
        return $this->reviews()->count();
    }

    public function isInStock()
    {
        return $this->stock > 0;
    }

    public function hasDiscount()
    {
        return $this->compare_price && $this->compare_price > $this->price;
    }
} 