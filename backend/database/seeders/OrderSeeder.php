<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $products = Product::all();

        if ($users->isEmpty() || $products->isEmpty()) {
            return;
        }

        $orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        $paymentStatuses = ['pending', 'paid', 'failed'];

        for ($i = 1; $i <= 15; $i++) {
            $user = $users->random();
            $status = $orderStatuses[array_rand($orderStatuses)];
            $paymentStatus = $paymentStatuses[array_rand($paymentStatuses)];
            
            // Generar número de pedido único
            $orderNumber = 'ORD-' . str_pad($i, 6, '0', STR_PAD_LEFT);
            
            // Crear pedido
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => $orderNumber,
                'total_amount' => 0, // Se calculará después
                'tax_amount' => 0,
                'shipping_amount' => rand(500, 2000) / 100,
                'status' => $status,
                'payment_status' => $paymentStatus,
                'payment_method' => $paymentStatus === 'paid' ? 'mercadopago' : null,
                'mp_payment_id' => $paymentStatus === 'paid' ? 'MP-' . rand(100000, 999999) : null,
                'mp_preference_id' => $paymentStatus === 'paid' ? 'MP-PREF-' . rand(100000, 999999) : null,
                'shipping_address' => [
                    'name' => $user->name,
                    'address' => 'Calle ' . rand(1, 999) . ' #' . rand(100, 999),
                    'city' => 'Buenos Aires',
                    'state' => 'Buenos Aires',
                    'postal_code' => str_pad(rand(1000, 9999), 4, '0', STR_PAD_LEFT),
                    'country' => 'Argentina',
                    'phone' => '+54 9 11 ' . rand(10000000, 99999999),
                ],
                'billing_address' => [
                    'name' => $user->name,
                    'address' => 'Calle ' . rand(1, 999) . ' #' . rand(100, 999),
                    'city' => 'Buenos Aires',
                    'state' => 'Buenos Aires',
                    'postal_code' => str_pad(rand(1000, 9999), 4, '0', STR_PAD_LEFT),
                    'country' => 'Argentina',
                    'phone' => '+54 9 11 ' . rand(10000000, 99999999),
                ],
                'notes' => rand(0, 1) ? 'Nota de ejemplo para el pedido' : null,
                'created_at' => now()->subDays(rand(1, 30)),
                'updated_at' => now()->subDays(rand(0, 29)),
            ]);

            // Crear items del pedido
            $totalAmount = 0;
            $numItems = rand(1, 4);
            
            for ($j = 0; $j < $numItems; $j++) {
                $product = $products->random();
                $quantity = rand(1, 3);
                $unitPrice = $product->price;
                $totalPrice = $unitPrice * $quantity;
                $totalAmount += $totalPrice;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                    'product_data' => [
                        'images' => $product->images ?? [],
                        'category' => $product->category->name ?? 'Sin categoría',
                    ],
                ]);
            }

            // Calcular impuestos (21% IVA)
            $taxAmount = $totalAmount * 0.21;
            $finalTotal = $totalAmount + $taxAmount + $order->shipping_amount;

            // Actualizar totales del pedido
            $order->update([
                'total_amount' => $finalTotal,
                'tax_amount' => $taxAmount,
            ]);
        }
    }
} 