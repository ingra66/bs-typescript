<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear 1 administrador
        User::create([
            'name' => 'Admin',
            'email' => 'admin@beltspot.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        // Crear 1 usuario normal
        User::create([
            'name' => 'Usuario',
            'email' => 'user@beltspot.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
            'email_verified_at' => now(),
        ]);

        $this->command->info('Usuarios creados exitosamente: 1 admin y 1 usuario');
    }
} 