<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('name', 100);

            $table->unique('name', 'uq_categories_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
