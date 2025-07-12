<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tax_rates', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // IVA, GST, etc.
            $table->decimal('rate', 5, 2); // Porcentaje (ej: 21.00)
            $table->string('country')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            $table->boolean('is_compound')->default(false); // Impuesto compuesto
            $table->boolean('is_shipping')->default(false); // Aplicar a envío
            $table->integer('priority')->default(1); // Prioridad de aplicación
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tax_rates');
    }
}; 