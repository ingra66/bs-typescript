<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['percentage', 'fixed']); // Porcentaje o monto fijo
            $table->decimal('value', 10, 2); // Valor del descuento
            $table->decimal('minimum_amount', 10, 2)->default(0); // Monto mínimo para aplicar
            $table->integer('max_uses')->nullable(); // Usos máximos
            $table->integer('used_count')->default(0); // Veces usado
            $table->date('starts_at')->nullable();
            $table->date('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('applicable_categories')->nullable(); // Categorías específicas
            $table->json('excluded_products')->nullable(); // Productos excluidos
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
}; 