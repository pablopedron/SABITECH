<?php

namespace Tests\Feature;

use App\Mail\ReservaConfirmada;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Tests\Feature\Concerns\DatosDePrueba;
use Tests\TestCase;

/**
 * Primeras pruebas del correo de confirmación (checkpoint).
 * En Docker los correos de verdad llegan a Mailpit: http://localhost:8025
 */
class CorreoTest extends TestCase
{
    use DatosDePrueba, RefreshDatabase;

    public function test_al_reservar_se_envia_el_correo_y_queda_registrado(): void
    {
        Mail::fake();
        $usuario = $this->usuarioConRol('asistente');

        $reserva = $this->reservarComo($usuario, $this->nuevaCharla());

        Mail::assertSent(ReservaConfirmada::class, fn ($correo) => $correo->hasTo($usuario->email)
            && $correo->reserva->is($reserva));

        $this->assertDatabaseHas('email_logs', [
            'talk_user_id' => $reserva->id,
            'type' => 'confirmacion',
            'recipient' => $usuario->email,
            'status' => 'enviado',
        ]);
    }

    public function test_el_correo_lleva_los_datos_de_la_reserva(): void
    {
        $reserva = $this->reservarComo($this->usuarioConRol('asistente'), $this->nuevaCharla());
        $reserva->load(['user', 'talk.location']);

        $correo = new ReservaConfirmada($reserva);

        $correo->assertHasSubject("Reserva confirmada {$reserva->reference} - Charla de prueba");
        $correo->assertSeeInHtml($reserva->reference);
        $correo->assertSeeInHtml('Charla de prueba');
        $correo->assertSeeInHtml('Sala de prueba');
        $correo->assertSeeInHtml($reserva->talk->starts_at->format('d/m/Y'));
    }

    public function test_si_falla_el_correo_la_reserva_se_guarda_igual(): void
    {
        // Simulamos que el servidor de correo no responde
        Mail::shouldReceive('to')->andThrow(new \RuntimeException('Servidor SMTP caído'));

        $usuario = $this->usuarioConRol('asistente');
        $reserva = $this->reservarComo($usuario, $this->nuevaCharla());

        $this->assertDatabaseHas('talk_user', ['id' => $reserva->id, 'status' => 'confirmada']);
        $this->assertDatabaseHas('email_logs', [
            'talk_user_id' => $reserva->id,
            'status' => 'fallido',
            'error_message' => 'Servidor SMTP caído',
        ]);
        $this->assertSame(1, DB::table('talk_user')->where('user_id', $usuario->id)->count());
    }
}
