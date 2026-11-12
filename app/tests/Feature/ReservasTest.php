<?php

namespace Tests\Feature;

use App\Models\Talk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreaDatos;
use Tests\TestCase;

/**
 * Pruebas de la API de reservas: inscribirse, ver mis reservas y cancelar.
 * Cubren los casos que pide el enunciado: reserva válida, repetida, charla sin plazas,
 * última plaza y cancelación sin dejar datos incoherentes (seats_taken siempre cuadra).
 */
class ReservasTest extends TestCase
{
    use CreaDatos, RefreshDatabase;

    private function reservar(User $usuario, Talk|int $charla)
    {
        Sanctum::actingAs($usuario);
        $id = $charla instanceof Talk ? $charla->id : $charla;

        return $this->postJson("/api/talks/{$id}/inscribe");
    }

    private function cancelar(User $usuario, int $reserva, array $cuerpo = [])
    {
        Sanctum::actingAs($usuario);

        return $this->postJson("/api/reservations/{$reserva}/cancel", $cuerpo);
    }

    // ---------------------------------------------------------------- reservar

    public function test_un_usuario_puede_reservar_una_charla_con_plazas(): void
    {
        $usuario = $this->usuario();
        $charla = $this->charla(['capacity' => 10]);

        $respuesta = $this->reservar($usuario, $charla);

        $respuesta->assertCreated()
            ->assertJsonPath('data.status', 'confirmada')
            ->assertJsonPath('data.talk.id', $charla->id);
        $this->assertMatchesRegularExpression('/^SBT-[A-Z0-9]{6}$/', $respuesta->json('data.reference'));

        $this->assertDatabaseHas('talk_user', [
            'user_id' => $usuario->id,
            'talk_id' => $charla->id,
            'status' => 'confirmada',
        ]);
        $this->assertSame(1, $this->plazasOcupadas($charla));
    }

    public function test_el_secreto_del_qr_se_guarda_pero_nunca_se_expone(): void
    {
        $usuario = $this->usuario();
        $charla = $this->charla();

        $respuesta = $this->reservar($usuario, $charla)->assertCreated();

        $secreto = DB::table('talk_user')->where('user_id', $usuario->id)->value('qr_secret');
        $this->assertMatchesRegularExpression('/^[0-9a-f]{64}$/', $secreto);
        $this->assertStringNotContainsString('qr_secret', $respuesta->getContent());
        $this->assertStringNotContainsString($secreto, $respuesta->getContent());
    }

    public function test_sin_sesion_no_se_puede_reservar(): void
    {
        $charla = $this->charla();

        $this->postJson("/api/talks/{$charla->id}/inscribe")->assertUnauthorized();

        $this->assertSame(0, $this->plazasOcupadas($charla));
        $this->assertDatabaseCount('talk_user', 0);
    }

    public function test_no_se_puede_reservar_dos_veces_la_misma_charla(): void
    {
        $usuario = $this->usuario();
        $charla = $this->charla();

        $this->reservar($usuario, $charla)->assertCreated();
        $this->reservar($usuario, $charla)
            ->assertStatus(409)
            ->assertJsonPath('message', 'Ya tienes una reserva para esta charla.');

        $this->assertSame(1, $this->plazasOcupadas($charla));
        $this->assertSame(1, $this->reservasConfirmadas($charla));
    }

    public function test_una_charla_completa_rechaza_la_reserva_y_no_cambia_nada(): void
    {
        $charla = $this->charla(['capacity' => 2, 'seats_taken' => 2]);

        $this->reservar($this->usuario(), $charla)
            ->assertStatus(409)
            ->assertJsonPath('message', 'No quedan plazas disponibles.');

        $this->assertSame(2, $this->plazasOcupadas($charla));
        $this->assertDatabaseCount('talk_user', 0);
    }

    public function test_la_ultima_plaza_solo_la_consigue_una_de_las_dos_personas(): void
    {
        // Aquí se comprueba el resultado. Que dos peticiones simultáneas no la vendan dos veces
        // lo garantiza el bloqueo lockForUpdate de la transacción (ver ReservationController).
        $charla = $this->charla(['capacity' => 1]);
        $primera = $this->usuario();
        $segunda = $this->usuario();

        $this->reservar($primera, $charla)->assertCreated();
        $this->reservar($segunda, $charla)->assertStatus(409);

        $this->assertSame(1, $this->plazasOcupadas($charla));
        $this->assertSame(1, $this->reservasConfirmadas($charla));
        $this->assertDatabaseMissing('talk_user', ['user_id' => $segunda->id]);
    }

    public function test_una_charla_en_borrador_o_inexistente_responde_404(): void
    {
        $borrador = $this->charla(['is_published' => 0]);
        $usuario = $this->usuario();

        $this->reservar($usuario, $borrador)->assertNotFound();
        $this->reservar($usuario, 999999)->assertNotFound();

        $this->assertSame(0, $this->plazasOcupadas($borrador));
    }

    public function test_no_se_puede_reservar_una_charla_que_ya_ha_empezado(): void
    {
        $charla = $this->charlaEmpezada();

        $this->reservar($this->usuario(), $charla)
            ->assertStatus(409)
            ->assertJsonPath('message', 'La charla ya ha empezado: no se admiten reservas.');

        $this->assertSame(0, $this->plazasOcupadas($charla));
    }

    // ---------------------------------------------------------------- mis reservas

    public function test_mis_reservas_solo_devuelve_las_del_usuario_con_la_sesion_iniciada(): void
    {
        $ana = $this->usuario();
        $bruno = $this->usuario();
        $this->reservar($ana, $this->charla())->assertCreated();
        $this->reservar($ana, $this->charla())->assertCreated();
        $this->reservar($bruno, $this->charla())->assertCreated();

        Sanctum::actingAs($ana);
        $respuesta = $this->getJson('/api/me/reservations')->assertOk();

        $respuesta->assertJsonCount(2, 'data');
        $this->assertStringNotContainsString('qr_secret', $respuesta->getContent());
    }

    public function test_mis_reservas_exige_sesion(): void
    {
        $this->getJson('/api/me/reservations')->assertUnauthorized();
    }

    // ---------------------------------------------------------------- cancelar

    public function test_cancelar_libera_la_plaza_y_guarda_el_motivo(): void
    {
        $usuario = $this->usuario();
        $charla = $this->charla();
        $reserva = $this->reservar($usuario, $charla)->assertCreated()->json('data.id');

        $this->cancelar($usuario, $reserva, ['reason' => 'No puedo asistir'])
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelada')
            ->assertJsonPath('data.cancellation_reason', 'No puedo asistir');

        $this->assertDatabaseHas('talk_user', ['id' => $reserva, 'status' => 'cancelada']);
        $this->assertNotNull(DB::table('talk_user')->where('id', $reserva)->value('cancelled_at'));
        $this->assertSame(0, $this->plazasOcupadas($charla));
    }

    public function test_no_se_puede_cancelar_dos_veces_y_las_plazas_no_quedan_negativas(): void
    {
        $usuario = $this->usuario();
        $charla = $this->charla();
        $reserva = $this->reservar($usuario, $charla)->assertCreated()->json('data.id');

        $this->cancelar($usuario, $reserva)->assertOk();
        $this->cancelar($usuario, $reserva)
            ->assertStatus(409)
            ->assertJsonPath('message', 'La reserva ya estaba cancelada.');

        $this->assertSame(0, $this->plazasOcupadas($charla));
    }

    public function test_no_se_puede_cancelar_la_reserva_de_otra_persona(): void
    {
        $duena = $this->usuario();
        $intrusa = $this->usuario();
        $charla = $this->charla();
        $reserva = $this->reservar($duena, $charla)->assertCreated()->json('data.id');

        // 404 y no 403: así no se revela que esa reserva existe
        $this->cancelar($intrusa, $reserva)->assertNotFound();

        $this->assertDatabaseHas('talk_user', ['id' => $reserva, 'status' => 'confirmada']);
        $this->assertSame(1, $this->plazasOcupadas($charla));
    }

    public function test_no_se_puede_cancelar_una_charla_que_ya_ha_empezado(): void
    {
        $usuario = $this->usuario();
        $charla = $this->charlaEmpezada(['seats_taken' => 1]);
        $reserva = $this->reserva($usuario, $charla);

        $this->cancelar($usuario, $reserva)
            ->assertStatus(409)
            ->assertJsonPath('message', 'No se puede cancelar una charla que ya ha empezado.');

        $this->assertDatabaseHas('talk_user', ['id' => $reserva, 'status' => 'confirmada']);
        $this->assertSame(1, $this->plazasOcupadas($charla));
    }

    public function test_tras_cancelar_se_puede_volver_a_reservar_y_se_reutiliza_la_misma_reserva(): void
    {
        $usuario = $this->usuario();
        $charla = $this->charla();

        $reserva = $this->reservar($usuario, $charla)->assertCreated()->json('data.id');
        $secretoAntes = DB::table('talk_user')->where('id', $reserva)->value('qr_secret');
        $this->cancelar($usuario, $reserva, ['reason' => 'Cambio de planes'])->assertOk();

        $this->reservar($usuario, $charla)
            ->assertCreated()
            ->assertJsonPath('data.id', $reserva)
            ->assertJsonPath('data.status', 'confirmada')
            ->assertJsonPath('data.cancelled_at', null);

        // Sigue habiendo una sola fila (restricción única), con secreto de QR nuevo
        $this->assertSame(1, DB::table('talk_user')->where('user_id', $usuario->id)->count());
        $this->assertNotSame($secretoAntes, DB::table('talk_user')->where('id', $reserva)->value('qr_secret'));
        $this->assertSame(1, $this->plazasOcupadas($charla));
    }

    public function test_las_plazas_ocupadas_siempre_coinciden_con_las_reservas_confirmadas(): void
    {
        $charla = $this->charla(['capacity' => 3]);
        $a = $this->usuario();
        $b = $this->usuario();
        $c = $this->usuario();
        $d = $this->usuario();

        $ra = $this->reservar($a, $charla)->assertCreated()->json('data.id');
        $this->reservar($b, $charla)->assertCreated();
        $this->reservar($c, $charla)->assertCreated();
        $this->reservar($d, $charla)->assertStatus(409);   // completa
        $this->cancelar($a, $ra)->assertOk();
        $this->reservar($d, $charla)->assertCreated();     // ahora sí hay una plaza

        $this->assertSame(3, $this->plazasOcupadas($charla));
        $this->assertSame(3, $this->reservasConfirmadas($charla));
    }
}
