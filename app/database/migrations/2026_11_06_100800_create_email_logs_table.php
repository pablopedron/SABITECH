<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Control de correos. Enlaza con la reserva; el estado 'pendiente' y el contador
// de intentos permiten reintentar el envío sin crear otra reserva.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_logs', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('user_id')->nullable();
            $table->integer('talk_id')->nullable();
            $table->integer('talk_user_id')->nullable();
            $table->string('type', 50);                              // confirmacion, cancelacion, recordatorio...
            $table->string('recipient', 190);
            $table->string('subject', 255);
            $table->string('status', 20)->default('enviado');        // pendiente | enviado | fallido
            $table->string('error_message', 255)->nullable();
            $table->integer('attempts')->default(1);
            $table->dateTime('sent_at')->useCurrent();

            $table->index('user_id', 'idx_email_logs_user');
            $table->index('talk_id', 'idx_email_logs_talk');
            $table->index('talk_user_id', 'idx_email_logs_talk_user');
            $table->index('type', 'idx_email_logs_type');
            $table->index('status', 'idx_email_logs_status');

            $table->foreign('user_id', 'fk_email_logs_user')->references('id')->on('users')
                ->nullOnDelete()->cascadeOnUpdate();
            $table->foreign('talk_id', 'fk_email_logs_talk')->references('id')->on('talks')
                ->nullOnDelete()->cascadeOnUpdate();
            $table->foreign('talk_user_id', 'fk_email_logs_talk_user')->references('id')->on('talk_user')
                ->nullOnDelete()->cascadeOnUpdate();
        });

        DB::statement("ALTER TABLE email_logs ADD CONSTRAINT chk_email_logs_status
            CHECK (status IN ('pendiente', 'enviado', 'fallido'))");
        DB::statement('ALTER TABLE email_logs ADD CONSTRAINT chk_email_logs_attempts CHECK (attempts >= 1)');
    }

    public function down(): void
    {
        Schema::dropIfExists('email_logs');
    }
};
