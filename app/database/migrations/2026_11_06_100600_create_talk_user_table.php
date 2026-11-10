<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Reservas (inscripciones). Las claves foráneas son RESTRICT para no perder el histórico:
// los usuarios se dan de baja con is_active, no se borran.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('talk_user', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('reference', 20)
                ->comment('Referencia legible de la reserva (aparece en el correo)');
            $table->integer('user_id');
            $table->integer('talk_id');
            $table->string('status', 20)->default('confirmada');   // confirmada | cancelada
            $table->char('qr_secret', 64)
                ->comment('Secreto por reserva (hex). El token QR = HMAC(secret, ventana de 30 s). Nunca se expone');
            $table->string('cancellation_reason', 255)->nullable(); // BIG DATA: motivo de cancelación
            $table->dateTime('cancelled_at')->nullable();
            $table->dateTime('registered_at')->useCurrent();

            $table->unique(['user_id', 'talk_id'], 'uq_talk_user');   // una inscripción por usuario y charla
            $table->unique('reference', 'uq_talk_user_reference');
            $table->index(['talk_id', 'status'], 'idx_talk_user_talk_status');
            $table->index('status', 'idx_talk_user_status');

            $table->foreign('user_id', 'fk_talk_user_user')->references('id')->on('users')
                ->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('talk_id', 'fk_talk_user_talk')->references('id')->on('talks')
                ->restrictOnDelete()->cascadeOnUpdate();
        });

        DB::statement("ALTER TABLE talk_user ADD CONSTRAINT chk_talk_user_status
            CHECK (status IN ('confirmada', 'cancelada'))");
        DB::statement("ALTER TABLE talk_user ADD CONSTRAINT chk_talk_user_cancel
            CHECK (cancelled_at IS NULL OR status = 'cancelada')");
    }

    public function down(): void
    {
        Schema::dropIfExists('talk_user');
    }
};
