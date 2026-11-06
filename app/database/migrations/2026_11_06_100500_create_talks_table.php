<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Los datos del ponente van integrados en la charla (no hay tabla speakers).
// Si hay foto del ponente, el texto alternativo es obligatorio (accesibilidad).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('talks', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('location_id');
            $table->integer('created_by');                 // usuario de organización que la crea
            $table->integer('category_id');
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->string('speaker_name', 150);
            $table->string('speaker_company', 150)->nullable();
            $table->text('speaker_bio')->nullable();
            $table->string('speaker_photo', 255)->nullable();
            $table->string('speaker_photo_alt', 255)->nullable();
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->integer('capacity');
            $table->integer('seats_taken')->default(0);    // plazas ocupadas (aforo)
            $table->integer('is_published')->default(0);   // 1 = publicada, 0 = borrador
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();

            $table->index('location_id', 'idx_talks_location');
            $table->index('created_by', 'idx_talks_created_by');
            $table->index('category_id', 'idx_talks_category');
            $table->index('starts_at', 'idx_talks_starts_at');

            $table->foreign('location_id', 'fk_talks_location')->references('id')->on('locations')
                ->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('created_by', 'fk_talks_created_by')->references('id')->on('users')
                ->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('category_id', 'fk_talks_category')->references('id')->on('categories')
                ->restrictOnDelete()->cascadeOnUpdate();
        });

        DB::statement('ALTER TABLE talks ADD CONSTRAINT chk_talks_dates CHECK (ends_at > starts_at)');
        DB::statement('ALTER TABLE talks ADD CONSTRAINT chk_talks_capacity CHECK (capacity > 0)');
        DB::statement('ALTER TABLE talks ADD CONSTRAINT chk_talks_seats_taken
            CHECK (seats_taken >= 0 AND seats_taken <= capacity)');
        DB::statement('ALTER TABLE talks ADD CONSTRAINT chk_talks_is_published CHECK (is_published IN (0, 1))');
        DB::statement('ALTER TABLE talks ADD CONSTRAINT chk_talks_photo_alt
            CHECK (speaker_photo IS NULL OR speaker_photo_alt IS NOT NULL)');

        // Triggers: el aforo de la charla no puede superar la capacidad de la sala
        // (un CHECK no puede mirar otra tabla, por eso se usa un trigger)
        DB::unprepared("
            CREATE TRIGGER trg_talks_capacity_ins BEFORE INSERT ON talks
            FOR EACH ROW
            BEGIN
                IF NEW.capacity > (SELECT room_capacity FROM locations WHERE id = NEW.location_id) THEN
                    SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'El aforo de la charla supera la capacidad de la sala';
                END IF;
            END
        ");
        DB::unprepared("
            CREATE TRIGGER trg_talks_capacity_upd BEFORE UPDATE ON talks
            FOR EACH ROW
            BEGIN
                IF NEW.capacity > (SELECT room_capacity FROM locations WHERE id = NEW.location_id) THEN
                    SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'El aforo de la charla supera la capacidad de la sala';
                END IF;
            END
        ");
    }

    public function down(): void
    {
        // Al borrar la tabla también se borran sus triggers
        Schema::dropIfExists('talks');
    }
};
