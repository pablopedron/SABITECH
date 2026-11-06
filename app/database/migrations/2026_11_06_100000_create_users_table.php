<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Regla del proyecto: solo se usa INT para los enteros.
// Por eso se usa integer('id', true) y NO id() (id() crea BIGINT UNSIGNED y las claves foráneas no encajarían).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('name', 150);
            $table->string('email', 190);
            $table->string('password', 255);                       // hash (bcrypt)
            $table->integer('is_active')->default(1);              // 1 = activo, 0 = inactivo
            $table->string('zip_code', 10)->nullable();            // BIG DATA: procedencia geográfica
            $table->string('accessibility_needs', 255)->nullable(); // BIG DATA: accesibilidad
            $table->dateTime('accessibility_consent_at')->nullable()
                ->comment('Fecha en que el usuario consintió guardar accessibility_needs');
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();

            $table->unique('email', 'uq_users_email');
            $table->index('zip_code', 'idx_users_zip_code');
        });

        // Laravel no tiene método para CHECK: se añaden con SQL
        DB::statement('ALTER TABLE users ADD CONSTRAINT chk_users_is_active CHECK (is_active IN (0, 1))');
        DB::statement('ALTER TABLE users ADD CONSTRAINT chk_users_accessibility_consent
            CHECK (accessibility_needs IS NULL OR accessibility_consent_at IS NOT NULL)');
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
