<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Order;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CleanupUsersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:cleanup {--dry-run : Ejecutar sin hacer cambios}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Limpia usuarios huérfanos y verifica la integridad de los datos';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $isDryRun = $this->option('dry-run');
        
        $this->info('🔍 Iniciando limpieza de usuarios...');
        if ($isDryRun) {
            $this->warn('⚠️  MODO DRY-RUN: No se realizarán cambios');
        }

        // 1. Verificar usuarios sin email
        $this->info('📧 Verificando usuarios sin email...');
        $usersWithoutEmail = User::whereNull('email')->orWhere('email', '')->get();
        
        if ($usersWithoutEmail->count() > 0) {
            $this->warn("Encontrados {$usersWithoutEmail->count()} usuarios sin email:");
            foreach ($usersWithoutEmail as $user) {
                $this->line("  - ID: {$user->id}, Nombre: {$user->name}");
            }
            
            if (!$isDryRun) {
                $deletedCount = $usersWithoutEmail->count();
                $usersWithoutEmail->each->delete();
                $this->info("✅ Eliminados {$deletedCount} usuarios sin email");
                Log::info("CleanupUsersCommand: Eliminados {$deletedCount} usuarios sin email");
            }
        } else {
            $this->info('✅ No se encontraron usuarios sin email');
        }

        // 2. Verificar usuarios duplicados por email
        $this->info('🔄 Verificando usuarios duplicados...');
        $duplicateEmails = User::select('email')
            ->whereNotNull('email')
            ->groupBy('email')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('email');

        if ($duplicateEmails->count() > 0) {
            $this->warn("Encontrados emails duplicados:");
            foreach ($duplicateEmails as $email) {
                $duplicates = User::where('email', $email)->get();
                $this->line("  - Email: {$email} ({$duplicates->count()} usuarios)");
                
                if (!$isDryRun) {
                    // Mantener el usuario más reciente
                    $keepUser = $duplicates->sortByDesc('created_at')->first();
                    $deleteUsers = $duplicates->where('id', '!=', $keepUser->id);
                    
                    $deleteUsers->each->delete();
                    $this->info("    ✅ Mantenido usuario ID: {$keepUser->id}, eliminados " . $deleteUsers->count() . " duplicados");
                    Log::info("CleanupUsersCommand: Eliminados " . $deleteUsers->count() . " usuarios duplicados para email: {$email}");
                }
            }
        } else {
            $this->info('✅ No se encontraron emails duplicados');
        }

        // 3. Verificar usuarios con órdenes huérfanas
        $this->info('📦 Verificando órdenes huérfanas...');
        $orphanOrders = Order::whereNotIn('user_id', User::pluck('id'))->get();
        
        if ($orphanOrders->count() > 0) {
            $this->warn("Encontradas {$orphanOrders->count()} órdenes huérfanas:");
            foreach ($orphanOrders as $order) {
                $this->line("  - Orden ID: {$order->id}, User ID: {$order->user_id}");
            }
            
            if (!$isDryRun) {
                $orphanOrders->each->delete();
                $this->info("✅ Eliminadas {$orphanOrders->count()} órdenes huérfanas");
                Log::info("CleanupUsersCommand: Eliminadas {$orphanOrders->count()} órdenes huérfanas");
            }
        } else {
            $this->info('✅ No se encontraron órdenes huérfanas');
        }

        // 4. Estadísticas finales
        $this->info('📊 Estadísticas finales:');
        $this->line("  - Total usuarios: " . User::count());
        $this->line("  - Usuarios admin: " . User::where('is_admin', true)->count());
        $this->line("  - Usuarios con email verificado: " . User::whereNotNull('email_verified_at')->count());
        $this->line("  - Usuarios con órdenes: " . User::whereHas('orders')->count());
        $this->line("  - Total órdenes: " . Order::count());

        // 5. Verificar integridad de datos
        $this->info('🔍 Verificando integridad de datos...');
        
        $usersWithInvalidData = User::where(function ($query) {
            $query->whereNull('name')
                  ->orWhere('name', '')
                  ->orWhereNull('email')
                  ->orWhere('email', '');
        })->get();

        if ($usersWithInvalidData->count() > 0) {
            $this->warn("Encontrados {$usersWithInvalidData->count()} usuarios con datos inválidos:");
            foreach ($usersWithInvalidData as $user) {
                $this->line("  - ID: {$user->id}, Nombre: '{$user->name}', Email: '{$user->email}'");
            }
        } else {
            $this->info('✅ Todos los usuarios tienen datos válidos');
        }

        $this->info('🎉 Limpieza completada exitosamente');
        
        if ($isDryRun) {
            $this->warn('💡 Para aplicar los cambios, ejecuta sin --dry-run');
        }
        
        return 0;
    }
} 