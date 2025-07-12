<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Usuario administrador
        User::create([
            'name' => 'Admin BeltSpot',
            'email' => 'admin@beltspot.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        // Usuario de prueba
        User::create([
            'name' => 'Usuario Prueba',
            'email' => 'user@beltspot.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
            'email_verified_at' => now(),
        ]);

        // Usuarios adicionales
        User::factory(8)->create();
    }
} 