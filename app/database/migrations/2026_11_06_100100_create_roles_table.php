<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('name', 50);            // asistente, organizacion, personal_acceso
            $table->string('description', 255)->nullable();

            $table->unique('name', 'uq_roles_name');
        });

        // Roles por defecto: la aplicación no funciona sin ellos, por eso van aquí y no en el seeder
        DB::table('roles')->insert([
            ['name' => 'asistente',       'description' => 'Usuario que se inscribe y asiste a las charlas'],
            ['name' => 'organizacion',    'description' => 'Gestiona charlas, ubicaciones y consulta estadísticas'],
            ['name' => 'personal_acceso', 'description' => 'Valida el acceso de los asistentes mediante QR'],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
