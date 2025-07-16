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
        // Crear usuarios administradores
        User::create([
            'name' => 'Admin Principal',
            'email' => 'admin@beltspot.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Admin Secundario',
            'email' => 'admin2@beltspot.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        // Crear usuarios clientes verificados
        User::create([
            'name' => 'Juan Pérez',
            'email' => 'juan.perez@email.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'María García',
            'email' => 'maria.garcia@email.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Carlos López',
            'email' => 'carlos.lopez@email.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Ana Rodríguez',
            'email' => 'ana.rodriguez@email.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Luis Martínez',
            'email' => 'luis.martinez@email.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
            'email_verified_at' => now(),
        ]);

        // Crear usuarios clientes no verificados
        User::create([
            'name' => 'Pedro Sánchez',
            'email' => 'pedro.sanchez@email.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
            'email_verified_at' => null,
        ]);

        User::create([
            'name' => 'Laura Fernández',
            'email' => 'laura.fernandez@email.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
            'email_verified_at' => null,
        ]);

        User::create([
            'name' => 'Roberto Silva',
            'email' => 'roberto.silva@email.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
            'email_verified_at' => null,
        ]);

        // Crear usuarios adicionales para tener más datos
        for ($i = 1; $i <= 20; $i++) {
            $isVerified = rand(0, 1) === 1;
            $isAdmin = rand(0, 10) === 1; // 10% de probabilidad de ser admin
            
            User::create([
                'name' => 'Usuario ' . $i,
                'email' => 'usuario' . $i . '@email.com',
                'password' => Hash::make('password'),
                'is_admin' => $isAdmin,
                'email_verified_at' => $isVerified ? now() : null,
            ]);
        }

        $this->command->info('Usuarios creados exitosamente');
    }
} 