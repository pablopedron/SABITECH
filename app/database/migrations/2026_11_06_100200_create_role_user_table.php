<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Tabla intermedia de la relación N:M entre usuarios y roles
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('role_user', function (Blueprint $table) {
            $table->integer('user_id');
            $table->integer('role_id');

            $table->primary(['user_id', 'role_id']);   // evita duplicados en la N:M
            $table->index('role_id', 'idx_role_user_role');

            $table->foreign('user_id', 'fk_role_user_user')->references('id')->on('users')
                ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('role_id', 'fk_role_user_role')->references('id')->on('roles')
                ->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('role_user');
    }
};
