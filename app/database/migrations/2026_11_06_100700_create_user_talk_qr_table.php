<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Registro de asistencia y valoración. Solo existe fila cuando hay check-in.
// El QR rotativo NO se guarda: el servidor lo calcula a partir de talk_user.qr_secret.
// La asistencia exige una reserva (user_id, talk_id) en talk_user (clave foránea compuesta);
// que esa reserva esté 'confirmada' lo comprueba el servidor.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_talk_qr', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('user_id');
            $table->integer('talk_id');
            $table->dateTime('checked_in_at')->useCurrent();         // BIG DATA: momento real de entrada
            $table->integer('validated_by')->nullable();             // personal_acceso que validó
            $table->string('method', 10)->default('qr')
                ->comment('qr = escaneado; manual = validado por personal sin QR');
            $table->integer('qr_window')->nullable()
                ->comment('Ventana de 30 s (epoch/30) del token aceptado; NULL si manual');
            $table->integer('rating')->nullable();                   // puntuación de 1 a 5
            $table->text('feedback_comment')->nullable();

            $table->unique(['user_id', 'talk_id'], 'uq_user_talk_qr'); // asistencia única por persona y charla
            $table->index('talk_id', 'idx_user_talk_qr_talk');
            $table->index('validated_by', 'idx_user_talk_qr_validated_by');

            $table->foreign(['user_id', 'talk_id'], 'fk_utq_reservation')
                ->references(['user_id', 'talk_id'])->on('talk_user')
                ->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('validated_by', 'fk_utq_validated_by')->references('id')->on('users')
                ->nullOnDelete()->cascadeOnUpdate();
        });

        DB::statement('ALTER TABLE user_talk_qr ADD CONSTRAINT chk_utq_rating
            CHECK (rating IS NULL OR rating BETWEEN 1 AND 5)');
        DB::statement("ALTER TABLE user_talk_qr ADD CONSTRAINT chk_utq_method CHECK (method IN ('qr', 'manual'))");
        DB::statement("ALTER TABLE user_talk_qr ADD CONSTRAINT chk_utq_window
            CHECK (method = 'manual' OR qr_window IS NOT NULL)");

        // Triggers: quien valida una asistencia debe tener el rol personal_acceso
        DB::unprepared("
            CREATE TRIGGER trg_utq_validator_ins BEFORE INSERT ON user_talk_qr
            FOR EACH ROW
            BEGIN
                IF NEW.validated_by IS NOT NULL AND NOT EXISTS (
                    SELECT 1 FROM role_user ru JOIN roles r ON r.id = ru.role_id
                    WHERE ru.user_id = NEW.validated_by AND r.name = 'personal_acceso') THEN
                    SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'validated_by debe tener el rol personal_acceso';
                END IF;
            END
        ");
        DB::unprepared("
            CREATE TRIGGER trg_utq_validator_upd BEFORE UPDATE ON user_talk_qr
            FOR EACH ROW
            BEGIN
                IF NEW.validated_by IS NOT NULL AND NOT EXISTS (
                    SELECT 1 FROM role_user ru JOIN roles r ON r.id = ru.role_id
                    WHERE ru.user_id = NEW.validated_by AND r.name = 'personal_acceso') THEN
                    SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'validated_by debe tener el rol personal_acceso';
                END IF;
            END
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('user_talk_qr');
    }
};
