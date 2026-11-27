<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\Feature\Concerns\DatosDePrueba;
use Tests\TestCase;

/**
 * Prototipo del QR temporal: el código cambia cada 30 s y la caducidad la comprueba el servidor.
 *
 * Para que las pruebas no dependan del reloj real se fija la hora con travelTo().
 * 1800000000 es múltiplo de 30, así que INICIO es justo el comienzo de una ventana.
 */
class QrTest extends TestCase
{
    use DatosDePrueba, RefreshDatabase;

    private const INICIO = 1800000000;

    protected function setUp(): void
    {
        parent::setUp();
        $this->irA(self::INICIO + 10);
    }

    private function irA(int $segundos): void
    {
        $this->travelTo(Carbon::createFromTimestamp($segundos));
    }

    private function pedirToken($usuario, int $reservaId): string
    {
        Sanctum::actingAs($usuario);

        return $this->getJson("/api/reservations/{$reservaId}/qr")->assertOk()->json('token');
    }

    private function escanear(string $token)
    {
        Sanctum::actingAs($this->usuarioConRol('personal_acceso'));

        return $this->postJson('/api/attendances/scan', ['token' => $token]);
    }

    public function test_el_asistente_obtiene_el_codigo_de_su_reserva(): void
    {
        $ana = $this->usuarioConRol('asistente');
        $reserva = $this->reservarComo($ana, $this->nuevaCharla());

        $this->getJson("/api/reservations/{$reserva->id}/qr")
            ->assertOk()
            ->assertJsonPath('seconds_left', 20)
            ->assertJsonPath('window', intdiv(self::INICIO, 30));
    }

    public function test_el_codigo_cambia_en_la_siguiente_ventana(): void
    {
        $ana = $this->usuarioConRol('asistente');
        $reserva = $this->reservarComo($ana, $this->nuevaCharla());

        $primero = $this->pedirToken($ana, $reserva->id);
        $this->irA(self::INICIO + 31);
        $segundo = $this->pedirToken($ana, $reserva->id);

        $this->assertNotSame($primero, $segundo);
    }

    public function test_nadie_ve_el_qr_de_otra_persona(): void
    {
        $reserva = $this->reservarComo($this->usuarioConRol('asistente'), $this->nuevaCharla());

        Sanctum::actingAs($this->usuarioConRol('asistente'));
        $this->getJson("/api/reservations/{$reserva->id}/qr")->assertNotFound();
    }

    public function test_un_codigo_vigente_registra_la_asistencia(): void
    {
        $ana = $this->usuarioConRol('asistente');
        $reserva = $this->reservarComo($ana, $this->nuevaCharla());
        $token = $this->pedirToken($ana, $reserva->id);

        $this->escanear($token)->assertCreated()->assertJsonPath('reference', $reserva->reference);

        $this->assertDatabaseHas('user_talk_qr', [
            'user_id' => $ana->id, 'talk_id' => $reserva->talk_id, 'method' => 'qr',
        ]);
    }

    public function test_repetir_el_escaneo_no_duplica_la_asistencia(): void
    {
        $ana = $this->usuarioConRol('asistente');
        $reserva = $this->reservarComo($ana, $this->nuevaCharla());
        $token = $this->pedirToken($ana, $reserva->id);

        $this->escanear($token)->assertCreated();
        $this->escanear($token)->assertConflict();

        $this->assertSame(1, DB::table('user_talk_qr')->where('user_id', $ana->id)->count());
    }

    public function test_un_codigo_caducado_se_rechaza(): void
    {
        $ana = $this->usuarioConRol('asistente');
        $reserva = $this->reservarComo($ana, $this->nuevaCharla());
        $token = $this->pedirToken($ana, $reserva->id);

        $this->irA(self::INICIO + 70);   // dos ventanas después

        $this->escanear($token)
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Código QR caducado. Pide a la persona que muestre el código actual.');

        $this->assertSame(0, DB::table('user_talk_qr')->count());
    }

    public function test_en_el_cambio_de_ventana_solo_se_aceptan_5_segundos_de_margen(): void
    {
        $ana = $this->usuarioConRol('asistente');
        $charla = $this->nuevaCharla();
        $reserva = $this->reservarComo($ana, $charla);

        $this->irA(self::INICIO + 28);
        $token = $this->pedirToken($ana, $reserva->id);

        $this->irA(self::INICIO + 36);   // 6 s dentro de la ventana nueva: fuera del margen
        $this->escanear($token)->assertUnprocessable();

        $this->irA(self::INICIO + 33);   // 3 s dentro de la ventana nueva: dentro del margen
        $this->escanear($token)->assertCreated();
    }

    public function test_un_codigo_manipulado_se_rechaza(): void
    {
        $ana = $this->usuarioConRol('asistente');
        $reserva = $this->reservarComo($ana, $this->nuevaCharla());
        $token = $this->pedirToken($ana, $reserva->id);

        // Cambiamos el último carácter de la firma
        $manipulado = substr($token, 0, -1).(str_ends_with($token, 'a') ? 'b' : 'a');

        $this->escanear($manipulado)
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Código QR no válido.');
        $this->escanear('texto-cualquiera')->assertUnprocessable();
    }

    public function test_una_reserva_cancelada_no_tiene_qr(): void
    {
        $ana = $this->usuarioConRol('asistente');
        $reserva = $this->reservarComo($ana, $this->nuevaCharla());
        $this->postJson("/api/reservations/{$reserva->id}/cancel")->assertOk();

        $this->getJson("/api/reservations/{$reserva->id}/qr")->assertConflict();
    }

    public function test_un_asistente_no_puede_escanear(): void
    {
        $ana = $this->usuarioConRol('asistente');
        $reserva = $this->reservarComo($ana, $this->nuevaCharla());
        $token = $this->pedirToken($ana, $reserva->id);

        Sanctum::actingAs($this->usuarioConRol('asistente'));
        $this->postJson('/api/attendances/scan', ['token' => $token])->assertForbidden();
    }
}
