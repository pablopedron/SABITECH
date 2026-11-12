<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Feature\Concerns\DatosDePrueba;
use Tests\TestCase;

/**
 * Permisos por perfil comprobados en el servidor (middleware role).
 * Ruta de ejemplo: GET /api/talks/{id}/reservations, solo para organizacion.
 */
class PermisosTest extends TestCase
{
    use DatosDePrueba, RefreshDatabase;

    public function test_un_asistente_no_puede_ver_las_inscripciones(): void
    {
        $charla = $this->nuevaCharla();
        Sanctum::actingAs($this->usuarioConRol('asistente'));

        $this->getJson("/api/talks/{$charla->id}/reservations")
            ->assertForbidden()
            ->assertJsonPath('message', 'No tienes permiso para esta acción.');
    }

    public function test_el_personal_de_acceso_tampoco_puede_verlas(): void
    {
        $charla = $this->nuevaCharla();
        Sanctum::actingAs($this->usuarioConRol('personal_acceso'));

        $this->getJson("/api/talks/{$charla->id}/reservations")->assertForbidden();
    }

    public function test_sin_sesion_responde_401(): void
    {
        $charla = $this->nuevaCharla();

        $this->getJson("/api/talks/{$charla->id}/reservations")->assertUnauthorized();
    }

    public function test_la_organizacion_ve_las_inscripciones_de_la_charla(): void
    {
        $charla = $this->nuevaCharla();
        $ana = $this->usuarioConRol('asistente');
        $reserva = $this->reservarComo($ana, $charla);

        Sanctum::actingAs($this->usuarioConRol('organizacion'));

        $this->getJson("/api/talks/{$charla->id}/reservations")
            ->assertOk()
            ->assertJsonPath('talk.seats_taken', 1)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.reference', $reserva->reference)
            ->assertJsonPath('data.0.user.email', $ana->email)
            ->assertJsonPath('data.0.attended', false);
    }
}
