<?php

namespace Tests\Feature;

use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\Concerns\CreaDatos;
use Tests\TestCase;

/**
 * Pruebas de la BASE DE DATOS (MySQL): comprueban que sus reglas (UNIQUE, CHECK, claves
 * foráneas y triggers) rechazan los datos incorrectos, aunque la aplicación se saltara
 * sus propias validaciones. En cada prueba de rechazo se mira el NOMBRE de la regla que
 * ha saltado, para estar seguros de que falla por la razón correcta.
 */
class BaseDeDatosTest extends TestCase
{
    use CreaDatos, RefreshDatabase;

    /** La acción debe ser rechazada por la base de datos con un mensaje que contenga $regla. */
    private function debeFallar(callable $accion, string $regla): void
    {
        try {
            $accion();
        } catch (QueryException $e) {
            $this->assertStringContainsString($regla, $e->getMessage());

            return;
        }

        $this->fail("La base de datos aceptó algo que debía rechazar ({$regla}).");
    }

    private function insertarUsuario(array $extra = []): int
    {
        return DB::table('users')->insertGetId(array_merge([
            'name' => 'Usuario de prueba',
            'email' => uniqid().'@sabitech.test',
            'password' => 'no-importa',
        ], $extra));
    }

    // ---------------------------------------------------------------- usuarios

    public function test_el_email_de_un_usuario_no_se_puede_repetir(): void
    {
        $this->insertarUsuario(['email' => 'repetido@sabitech.test']);

        $this->debeFallar(
            fn () => $this->insertarUsuario(['email' => 'repetido@sabitech.test']),
            'uq_users_email'
        );
    }

    public function test_is_active_solo_admite_0_o_1(): void
    {
        $this->debeFallar(fn () => $this->insertarUsuario(['is_active' => 2]), 'chk_users_is_active');
    }

    public function test_las_necesidades_de_accesibilidad_exigen_consentimiento(): void
    {
        $this->debeFallar(
            fn () => $this->insertarUsuario(['accessibility_needs' => 'Movilidad reducida']),
            'chk_users_accessibility_consent'
        );

        // Con consentimiento sí se guarda
        $id = $this->insertarUsuario([
            'accessibility_needs' => 'Movilidad reducida',
            'accessibility_consent_at' => now(),
        ]);
        $this->assertDatabaseHas('users', ['id' => $id, 'accessibility_needs' => 'Movilidad reducida']);
    }

    public function test_un_usuario_no_puede_tener_el_mismo_rol_dos_veces(): void
    {
        $usuario = $this->usuario('asistente');
        $rol = DB::table('roles')->where('name', 'asistente')->value('id');

        $this->debeFallar(
            fn () => DB::table('role_user')->insert(['user_id' => $usuario->id, 'role_id' => $rol]),
            'role_user.PRIMARY'
        );
    }

    // ---------------------------------------------------------------- charlas

    public function test_una_charla_valida_se_guarda(): void
    {
        $charla = $this->charla(['capacity' => 30]);

        $this->assertDatabaseHas('talks', ['id' => $charla->id, 'capacity' => 30, 'seats_taken' => 0]);
    }

    public function test_el_aforo_de_una_charla_debe_ser_mayor_que_cero(): void
    {
        $this->debeFallar(fn () => $this->charla(['capacity' => 0]), 'chk_talks_capacity');
    }

    public function test_una_charla_debe_terminar_despues_de_empezar(): void
    {
        $this->debeFallar(
            fn () => $this->charla(['starts_at' => now()->addDay(), 'ends_at' => now()->addDay()]),
            'chk_talks_dates'
        );
    }

    public function test_las_plazas_ocupadas_no_pueden_superar_el_aforo(): void
    {
        $this->debeFallar(
            fn () => $this->charla(['capacity' => 5, 'seats_taken' => 6]),
            'chk_talks_seats_taken'
        );

        $charla = $this->charla(['capacity' => 5]);
        $this->debeFallar(
            fn () => DB::table('talks')->where('id', $charla->id)->update(['seats_taken' => 6]),
            'chk_talks_seats_taken'
        );
    }

    public function test_las_plazas_ocupadas_no_pueden_ser_negativas(): void
    {
        $charla = $this->charla();

        $this->debeFallar(
            fn () => DB::table('talks')->where('id', $charla->id)->update(['seats_taken' => -1]),
            'chk_talks_seats_taken'
        );
    }

    public function test_is_published_solo_admite_0_o_1(): void
    {
        $this->debeFallar(fn () => $this->charla(['is_published' => 2]), 'chk_talks_is_published');
    }

    public function test_una_foto_de_ponente_exige_texto_alternativo(): void
    {
        $this->debeFallar(
            fn () => $this->charla(['speaker_photo' => 'ponentes/foto.webp']),
            'chk_talks_photo_alt'
        );

        $charla = $this->charla([
            'speaker_photo' => 'ponentes/foto.webp',
            'speaker_photo_alt' => 'Retrato del ponente',
        ]);
        $this->assertDatabaseHas('talks', ['id' => $charla->id]);
    }

    public function test_el_aforo_de_una_charla_no_puede_superar_la_capacidad_de_la_sala(): void
    {
        // Trigger al insertar: sala de 30 personas, charla de 31
        $this->debeFallar(
            fn () => $this->charla(['capacity' => 31, 'location_id' => $this->sala(30)]),
            'El aforo de la charla supera la capacidad de la sala'
        );

        // Trigger al modificar: charla de 20 en una sala de 30, se sube a 31
        $charla = $this->charla(['capacity' => 20, 'location_id' => $this->sala(30)]);
        $this->debeFallar(
            fn () => DB::table('talks')->where('id', $charla->id)->update(['capacity' => 31]),
            'El aforo de la charla supera la capacidad de la sala'
        );
    }

    // ---------------------------------------------------------------- reservas

    public function test_una_persona_no_puede_reservar_la_misma_charla_dos_veces(): void
    {
        $usuario = $this->usuario();
        $charla = $this->charla();
        $this->reserva($usuario, $charla);

        $this->debeFallar(fn () => $this->reserva($usuario, $charla), 'uq_talk_user');
    }

    public function test_la_referencia_de_una_reserva_es_unica(): void
    {
        $charla = $this->charla();
        $this->reserva($this->usuario(), $charla, ['reference' => 'SBT-IGUAL1']);

        $this->debeFallar(
            fn () => $this->reserva($this->usuario(), $charla, ['reference' => 'SBT-IGUAL1']),
            'uq_talk_user_reference'
        );
    }

    public function test_el_estado_de_una_reserva_solo_puede_ser_confirmada_o_cancelada(): void
    {
        $this->debeFallar(
            fn () => $this->reserva($this->usuario(), $this->charla(), ['status' => 'rara']),
            'chk_talk_user_status'
        );
    }

    public function test_solo_una_reserva_cancelada_puede_tener_fecha_de_cancelacion(): void
    {
        $this->debeFallar(
            fn () => $this->reserva($this->usuario(), $this->charla(), [
                'status' => 'confirmada',
                'cancelled_at' => now(),
            ]),
            'chk_talk_user_cancel'
        );
    }

    public function test_no_se_puede_reservar_con_un_usuario_que_no_existe(): void
    {
        $charla = $this->charla();

        $this->debeFallar(
            fn () => DB::table('talk_user')->insert([
                'reference' => 'SBT-NOUSER',
                'user_id' => 999999,
                'talk_id' => $charla->id,
                'qr_secret' => str_repeat('a', 64),
            ]),
            'fk_talk_user_user'
        );
    }

    public function test_no_se_puede_borrar_una_charla_ni_un_usuario_con_reservas(): void
    {
        $usuario = $this->usuario();
        $charla = $this->charla();
        $this->reserva($usuario, $charla);

        $this->debeFallar(fn () => DB::table('talks')->where('id', $charla->id)->delete(), 'fk_talk_user_talk');
        $this->debeFallar(fn () => DB::table('users')->where('id', $usuario->id)->delete(), 'fk_talk_user_user');
    }

    // ---------------------------------------------------------------- asistencias

    private function asistencia(int $usuario, int $charla, array $extra = []): int
    {
        return DB::table('user_talk_qr')->insertGetId(array_merge([
            'user_id' => $usuario,
            'talk_id' => $charla,
            'method' => 'manual',
        ], $extra));
    }

    public function test_no_se_puede_registrar_asistencia_sin_reserva(): void
    {
        $this->debeFallar(
            fn () => $this->asistencia($this->usuario()->id, $this->charla()->id),
            'fk_utq_reservation'
        );
    }

    public function test_la_asistencia_es_unica_por_persona_y_charla(): void
    {
        $usuario = $this->usuario();
        $charla = $this->charla();
        $this->reserva($usuario, $charla);
        $this->asistencia($usuario->id, $charla->id);

        $this->debeFallar(fn () => $this->asistencia($usuario->id, $charla->id), 'uq_user_talk_qr');
    }

    public function test_la_valoracion_va_de_1_a_5(): void
    {
        $usuario = $this->usuario();
        $charla = $this->charla();
        $this->reserva($usuario, $charla);

        $this->debeFallar(
            fn () => $this->asistencia($usuario->id, $charla->id, ['rating' => 6]),
            'chk_utq_rating'
        );
    }

    public function test_una_asistencia_por_qr_necesita_ventana_de_tiempo_y_el_metodo_debe_ser_valido(): void
    {
        $usuario = $this->usuario();
        $charla = $this->charla();
        $this->reserva($usuario, $charla);

        $this->debeFallar(
            fn () => $this->asistencia($usuario->id, $charla->id, ['method' => 'qr']),
            'chk_utq_window'
        );
        $this->debeFallar(
            fn () => $this->asistencia($usuario->id, $charla->id, ['method' => 'telepatia', 'qr_window' => 1]),
            'chk_utq_method'
        );

        // Por QR con ventana de 30 s: se guarda
        $id = $this->asistencia($usuario->id, $charla->id, ['method' => 'qr', 'qr_window' => intdiv(time(), 30)]);
        $this->assertDatabaseHas('user_talk_qr', ['id' => $id, 'method' => 'qr']);
    }

    public function test_solo_el_personal_de_acceso_puede_validar_una_asistencia(): void
    {
        $usuario = $this->usuario();
        $charla = $this->charla();
        $this->reserva($usuario, $charla);

        // Un asistente no puede validar
        $this->debeFallar(
            fn () => $this->asistencia($usuario->id, $charla->id, ['validated_by' => $this->usuario('asistente')->id]),
            'validated_by debe tener el rol personal_acceso'
        );

        // El personal de acceso sí
        $personal = $this->usuario('personal_acceso');
        $id = $this->asistencia($usuario->id, $charla->id, ['validated_by' => $personal->id]);
        $this->assertDatabaseHas('user_talk_qr', ['id' => $id, 'validated_by' => $personal->id]);
    }

    // ---------------------------------------------------------------- registro de correos

    public function test_el_registro_de_correos_valida_estado_e_intentos(): void
    {
        $correo = ['type' => 'confirmacion', 'recipient' => 'a@sabitech.test', 'subject' => 'Reserva confirmada'];

        $this->debeFallar(
            fn () => DB::table('email_logs')->insert($correo + ['status' => 'rarisimo']),
            'chk_email_logs_status'
        );
        $this->debeFallar(
            fn () => DB::table('email_logs')->insert($correo + ['attempts' => 0]),
            'chk_email_logs_attempts'
        );

        DB::table('email_logs')->insert($correo + ['status' => 'fallido', 'attempts' => 2]);
        $this->assertDatabaseHas('email_logs', ['status' => 'fallido', 'attempts' => 2]);
    }
}
