<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('name', 150);
            $table->string('address', 255);
            $table->integer('room_capacity');
        });

        DB::statement('ALTER TABLE locations ADD CONSTRAINT chk_locations_room_capacity CHECK (room_capacity > 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
