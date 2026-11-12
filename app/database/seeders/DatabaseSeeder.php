<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Datos ficticios para pruebas y demostración (apartado 4.13 del enunciado).
 * Todos los datos son inventados. Contraseña de TODOS los usuarios: Sabitech2026!
 *
 * Se ejecuta con:  php artisan migrate:fresh --seed
 *
 * Escenarios que cubre:
 *   Charla 1: PASADA, con asistencias (2 por QR, 1 manual), valoraciones y 1 cancelación
 *   Charla 2: con plazas libres (2 de 30), una reserva cancelada que puede volver a reservar
 *   Charla 3: COMPLETA (4/4)  -> probar "reserva sin plazas"
 *   Charla 4: BORRADOR (no publicada, no visible al público)
 *   Charla 5: publicada, sin reservas
 *   Correos: enviado, fallido (2 intentos) y pendiente -> probar reintento
 *
 * Los roles NO se insertan aquí: ya los crea la migración de roles.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('Sabitech2026!');

        // Usuarios: 1 organización, 2 personal de acceso, 3-7 asistentes, 8 asistente inactivo
        DB::table('users')->insert([
            ['id' => 1, 'name' => 'Lucía Organizadora', 'email' => 'organizacion@sabitech.test', 'password' => $password, 'is_active' => 1, 'zip_code' => '28001', 'accessibility_needs' => null, 'accessibility_consent_at' => null],
            ['id' => 2, 'name' => 'Mario Acceso',       'email' => 'acceso@sabitech.test',       'password' => $password, 'is_active' => 1, 'zip_code' => '28002', 'accessibility_needs' => null, 'accessibility_consent_at' => null],
            ['id' => 3, 'name' => 'Ana Asistente',      'email' => 'ana@sabitech.test',          'password' => $password, 'is_active' => 1, 'zip_code' => '28010', 'accessibility_needs' => null, 'accessibility_consent_at' => null],
            ['id' => 4, 'name' => 'Bruno Asistente',    'email' => 'bruno@sabitech.test',        'password' => $password, 'is_active' => 1, 'zip_code' => '28020', 'accessibility_needs' => null, 'accessibility_consent_at' => null],
            ['id' => 5, 'name' => 'Carla Asistente',    'email' => 'carla@sabitech.test',        'password' => $password, 'is_active' => 1, 'zip_code' => '28030', 'accessibility_needs' => 'Movilidad reducida (ficticio)', 'accessibility_consent_at' => '2026-10-01 09:00:00'],
            ['id' => 6, 'name' => 'Diego Asistente',    'email' => 'diego@sabitech.test',        'password' => $password, 'is_active' => 1, 'zip_code' => '45001', 'accessibility_needs' => null, 'accessibility_consent_at' => null],
            ['id' => 7, 'name' => 'Elena Asistente',    'email' => 'elena@sabitech.test',        'password' => $password, 'is_active' => 1, 'zip_code' => '28040', 'accessibility_needs' => null, 'accessibility_consent_at' => null],
            ['id' => 8, 'name' => 'Fabio Inactivo',     'email' => 'fabio@sabitech.test',        'password' => $password, 'is_active' => 0, 'zip_code' => '28050', 'accessibility_needs' => null, 'accessibility_consent_at' => null],
        ]);

        // Rol de cada usuario (se busca el id del rol por su nombre)
        $roles = DB::table('roles')->pluck('id', 'name');
        $rolDeUsuario = [
            1 => 'organizacion', 2 => 'personal_acceso',
            3 => 'asistente', 4 => 'asistente', 5 => 'asistente',
            6 => 'asistente', 7 => 'asistente', 8 => 'asistente',
        ];
        foreach ($rolDeUsuario as $userId => $rol) {
            DB::table('role_user')->insert(['user_id' => $userId, 'role_id' => $roles[$rol]]);
        }

        // Las tres áreas de las jornadas: SAlud, BusIness y TECH (de ahí el nombre SABITECH)
        DB::table('categories')->insert([
            ['id' => 1, 'name' => 'Salud'],
            ['id' => 2, 'name' => 'Business'],
            ['id' => 3, 'name' => 'Tech'],
        ]);

        DB::table('locations')->insert([
            ['id' => 1, 'name' => 'Salón de actos', 'address' => 'Calle Ficticia 1, Madrid', 'room_capacity' => 100],
            ['id' => 2, 'name' => 'Aula 2.1',       'address' => 'Calle Ficticia 1, planta 2, Madrid', 'room_capacity' => 30],
            ['id' => 3, 'name' => 'Sala taller',    'address' => 'Calle Ficticia 1, planta baja, Madrid', 'room_capacity' => 4],
        ]);

        // seats_taken coincide con las reservas 'confirmada' de talk_user
        // Casos de prueba: 1 = ya celebrada, 3 = completa, 4 = borrador, 5 = con plazas libres
        DB::table('talks')->insert([
            [
                'id' => 1, 'location_id' => 1, 'created_by' => 1, 'category_id' => 1,
                'title' => 'Bienestar digital: desconectar para rendir más',
                'description' => 'Hábitos sencillos para cuidar la salud mental cuando trabajamos y estudiamos rodeados de pantallas y notificaciones.',
                'speaker_name' => 'Sara Ficticia', 'speaker_company' => 'Clínica Demo',
                'speaker_bio' => 'Psicóloga especializada en salud laboral (perfil ficticio).',
                'speaker_photo' => 'ponentes/sara.webp', 'speaker_photo_alt' => 'Retrato de Sara Ficticia sonriendo',
                'starts_at' => '2026-10-20 10:00:00', 'ends_at' => '2026-10-20 11:00:00',
                'capacity' => 100, 'seats_taken' => 3, 'is_published' => 1,
            ],
            [
                'id' => 2, 'location_id' => 2, 'created_by' => 1, 'category_id' => 2,
                'title' => 'Cómo validar una idea de negocio en una semana',
                'description' => 'Método práctico para comprobar si una idea tiene clientes antes de invertir tiempo y dinero: entrevistas, prototipo y primeras métricas.',
                'speaker_name' => 'Pablo Muestra', 'speaker_company' => 'Startup Demo',
                'speaker_bio' => 'Emprendedor y mentor de proyectos (perfil ficticio).',
                'speaker_photo' => null, 'speaker_photo_alt' => null,
                'starts_at' => '2026-12-10 10:00:00', 'ends_at' => '2026-12-10 11:00:00',
                'capacity' => 30, 'seats_taken' => 2, 'is_published' => 1,
            ],
            [
                'id' => 3, 'location_id' => 3, 'created_by' => 1, 'category_id' => 3,
                'title' => 'Taller de seguridad web',
                'description' => 'Taller práctico con aforo reducido: los errores de seguridad más comunes en aplicaciones web y cómo evitarlos.',
                'speaker_name' => 'Irene Test', 'speaker_company' => 'SecLab',
                'speaker_bio' => 'Auditora de seguridad (perfil ficticio).',
                'speaker_photo' => null, 'speaker_photo_alt' => null,
                'starts_at' => '2026-12-10 12:00:00', 'ends_at' => '2026-12-10 13:30:00',
                'capacity' => 4, 'seats_taken' => 4, 'is_published' => 1,
            ],
            [
                'id' => 4, 'location_id' => 2, 'created_by' => 1, 'category_id' => 1,
                'title' => 'Telemedicina: retos y oportunidades (borrador)',
                'description' => 'Pendiente de confirmar ponente.',
                'speaker_name' => 'Por confirmar', 'speaker_company' => null,
                'speaker_bio' => null,
                'speaker_photo' => null, 'speaker_photo_alt' => null,
                'starts_at' => '2026-12-11 09:00:00', 'ends_at' => '2026-12-11 10:00:00',
                'capacity' => 30, 'seats_taken' => 0, 'is_published' => 0,
            ],
            [
                'id' => 5, 'location_id' => 1, 'created_by' => 1, 'category_id' => 3,
                'title' => 'IA generativa: de la idea al producto',
                'description' => 'Casos reales de uso de la inteligencia artificial generativa en empresas y cómo pasar de una prueba a un producto que funcione.',
                'speaker_name' => 'Tomás Ejemplo', 'speaker_company' => 'Datos Demo',
                'speaker_bio' => 'Ingeniero de datos e IA (perfil ficticio).',
                'speaker_photo' => null, 'speaker_photo_alt' => null,
                'starts_at' => '2026-12-11 11:00:00', 'ends_at' => '2026-12-11 12:00:00',
                'capacity' => 80, 'seats_taken' => 0, 'is_published' => 1,
            ],
            [
                'id' => 6, 'location_id' => 2, 'created_by' => 1, 'category_id' => 1,
                'title' => 'Ergonomía y salud para quien trabaja con pantallas',
                'description' => 'Postura, pausas activas y ejercicios para prevenir dolores de espalda, cuello y vista en el trabajo de oficina.',
                'speaker_name' => 'Lucas Prueba', 'speaker_company' => 'Fisioterapia Demo',
                'speaker_bio' => 'Fisioterapeuta (perfil ficticio).',
                'speaker_photo' => null, 'speaker_photo_alt' => null,
                'starts_at' => '2026-12-10 16:00:00', 'ends_at' => '2026-12-10 17:00:00',
                'capacity' => 30, 'seats_taken' => 0, 'is_published' => 1,
            ],
            [
                'id' => 7, 'location_id' => 1, 'created_by' => 1, 'category_id' => 2,
                'title' => 'Finanzas para emprendedores: del Excel al cuadro de mando',
                'description' => 'Cómo controlar ingresos, gastos y tesorería de un proyecto pequeño y convertir una hoja de cálculo en un cuadro de mando.',
                'speaker_name' => 'Marta Ejemplo', 'speaker_company' => 'Asesoría Demo',
                'speaker_bio' => 'Asesora financiera de pymes (perfil ficticio).',
                'speaker_photo' => null, 'speaker_photo_alt' => null,
                'starts_at' => '2026-12-11 16:00:00', 'ends_at' => '2026-12-11 17:00:00',
                'capacity' => 60, 'seats_taken' => 0, 'is_published' => 1,
            ],
            [
                'id' => 8, 'location_id' => 1, 'created_by' => 1, 'category_id' => 1,
                'title' => 'Inteligencia artificial en el diagnóstico médico',
                'description' => 'Dónde ayuda ya la IA a los profesionales sanitarios, qué límites tiene y por qué la decisión final sigue siendo humana.',
                'speaker_name' => 'Nuria Demo', 'speaker_company' => 'Hospital Demo',
                'speaker_bio' => 'Médica e investigadora en salud digital (perfil ficticio).',
                'speaker_photo' => null, 'speaker_photo_alt' => null,
                'starts_at' => '2026-12-12 10:00:00', 'ends_at' => '2026-12-12 11:00:00',
                'capacity' => 100, 'seats_taken' => 0, 'is_published' => 1,
            ],
            [
                'id' => 9, 'location_id' => 2, 'created_by' => 1, 'category_id' => 2,
                'title' => 'Marketing digital para pymes',
                'description' => 'Redes sociales, web y correo: qué funciona de verdad cuando tienes poco presupuesto y cómo medir los resultados.',
                'speaker_name' => 'Jorge Muestra', 'speaker_company' => 'Agencia Demo',
                'speaker_bio' => 'Consultor de marketing digital (perfil ficticio).',
                'speaker_photo' => null, 'speaker_photo_alt' => null,
                'starts_at' => '2026-12-12 12:00:00', 'ends_at' => '2026-12-12 13:00:00',
                'capacity' => 25, 'seats_taken' => 0, 'is_published' => 1,
            ],
            [
                'id' => 10, 'location_id' => 2, 'created_by' => 1, 'category_id' => 3,
                'title' => 'Tu primera aplicación web con React y Laravel',
                'description' => 'Recorrido completo por una aplicación real: frontend en React, API en Laravel y base de datos MySQL con Docker.',
                'speaker_name' => 'Ana Código', 'speaker_company' => 'PGD Technologies',
                'speaker_bio' => 'Desarrolladora full stack (perfil ficticio).',
                'speaker_photo' => null, 'speaker_photo_alt' => null,
                'starts_at' => '2026-12-12 16:00:00', 'ends_at' => '2026-12-12 17:30:00',
                'capacity' => 30, 'seats_taken' => 0, 'is_published' => 1,
            ],
        ]);

        // Reservas: [id, usuario, charla, estado, motivo de cancelación, cancelada el, reservada el]
        // reference y qr_secret son deterministas para poder repetir pruebas;
        // en producción los genera el backend de forma aleatoria.
        $reservas = [
            [1,  3, 1, 'confirmada', null, null, '2026-10-05 09:00:00'],
            [2,  4, 1, 'confirmada', null, null, '2026-10-05 09:10:00'],
            [3,  5, 1, 'confirmada', null, null, '2026-10-05 09:20:00'],
            [4,  6, 1, 'cancelada', 'Coincide con otra actividad', '2026-10-18 18:00:00', '2026-10-05 09:30:00'],
            [5,  3, 2, 'confirmada', null, null, '2026-11-02 10:00:00'],
            [6,  4, 2, 'confirmada', null, null, '2026-11-02 10:05:00'],
            [7,  5, 2, 'cancelada', 'Problemas de agenda', '2026-11-03 08:00:00', '2026-11-02 10:10:00'],
            [8,  3, 3, 'confirmada', null, null, '2026-11-02 11:00:00'],
            [9,  4, 3, 'confirmada', null, null, '2026-11-02 11:05:00'],
            [10, 5, 3, 'confirmada', null, null, '2026-11-02 11:10:00'],
            [11, 6, 3, 'confirmada', null, null, '2026-11-02 11:15:00'],
        ];
        foreach ($reservas as [$id, $userId, $talkId, $estado, $motivo, $canceladaEl, $reservadaEl]) {
            DB::table('talk_user')->insert([
                'id' => $id,
                'reference' => sprintf('SBT-DEMO%04d', $id),
                'user_id' => $userId,
                'talk_id' => $talkId,
                'status' => $estado,
                'qr_secret' => hash('sha256', 'seed-'.$id),
                'cancellation_reason' => $motivo,
                'cancelled_at' => $canceladaEl,
                'registered_at' => $reservadaEl,
            ]);
        }

        // Asistencias de la charla 1 (validadas por el usuario 2, personal_acceso)
        // qr_window = segundos desde 1970 / 30 (ventana de 30 s en la que se aceptó el QR)
        $ventana = fn (string $fecha) => intdiv(Carbon::parse($fecha, config('app.timezone'))->timestamp, 30);
        DB::table('user_talk_qr')->insert([
            ['user_id' => 3, 'talk_id' => 1, 'checked_in_at' => '2026-10-20 09:52:10', 'validated_by' => 2, 'method' => 'qr',
                'qr_window' => $ventana('2026-10-20 09:52:10'), 'rating' => 5, 'feedback_comment' => 'Muy útil, ejemplos claros.'],
            ['user_id' => 4, 'talk_id' => 1, 'checked_in_at' => '2026-10-20 09:55:40', 'validated_by' => 2, 'method' => 'qr',
                'qr_window' => $ventana('2026-10-20 09:55:40'), 'rating' => 4, 'feedback_comment' => null],
            ['user_id' => 5, 'talk_id' => 1, 'checked_in_at' => '2026-10-20 09:58:00', 'validated_by' => 2, 'method' => 'manual',
                'qr_window' => null, 'rating' => null, 'feedback_comment' => null],
        ]);

        // Correos: enviado, fallido (2 intentos) y pendiente
        DB::table('email_logs')->insert([
            ['user_id' => 3, 'talk_id' => 2, 'talk_user_id' => 5,  'type' => 'confirmacion', 'recipient' => 'ana@sabitech.test',
                'subject' => 'Reserva confirmada SBT-DEMO0005', 'status' => 'enviado', 'error_message' => null, 'attempts' => 1, 'sent_at' => '2026-11-02 10:00:02'],
            ['user_id' => 4, 'talk_id' => 2, 'talk_user_id' => 6,  'type' => 'confirmacion', 'recipient' => 'bruno@sabitech.test',
                'subject' => 'Reserva confirmada SBT-DEMO0006', 'status' => 'fallido', 'error_message' => 'SMTP timeout', 'attempts' => 2, 'sent_at' => '2026-11-02 10:05:30'],
            ['user_id' => 6, 'talk_id' => 3, 'talk_user_id' => 11, 'type' => 'confirmacion', 'recipient' => 'diego@sabitech.test',
                'subject' => 'Reserva confirmada SBT-DEMO0011', 'status' => 'pendiente', 'error_message' => null, 'attempts' => 1, 'sent_at' => '2026-11-02 11:15:01'],
        ]);
    }
}
